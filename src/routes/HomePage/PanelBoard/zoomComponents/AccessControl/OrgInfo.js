import React, { PureComponent } from 'react';
import { Table, Form, Input, Button } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;

const columns = [{
  title: '部门名称',
  dataIndex: 'orgName',
  key: 'orgName',
},
{
  title: '在厂人数',
  dataIndex: 'sumNum',
  key: 'sumNum',
}, {
  title: '生产区人数',
  dataIndex: 'officeCount',
  key: 'officeCount',
}, {
  title: '办公区人数',
  dataIndex: 'productCount',
  key: 'productCount',
},
];


class FromComponent extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'accessControl/getDoorOrgCount',
    });
  }
  handleSubmit= (e) => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    const value = form.getFieldsValue();
    dispatch({
      type: 'accessControl/getDoorOrgCount',
      payload: value,
    });
  };
  render() {
    const { doorOrgCount, form, hasErrors, name } = this.props;
    const { getFieldDecorator, getFieldsError } = form;
    return (
      <div className={styles.warp}>
        <h2>{name}</h2>
          <Form layout="inline" onSubmit={this.handleSubmit} className={styles.form}>
            <FormItem>
              {getFieldDecorator('orgName', {
              rules: [{ required: true, message: '输入部门名称' }],
            })(
              <Input placeholder="输入部门名称" />
            )}
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                htmlType="submit"
                disabled={hasErrors(getFieldsError())}
              >
              搜索
              </Button>
            </FormItem>
          </Form>
        <Table className={styles.table} dataSource={doorOrgCount} size="small" columns={columns} bordered scroll={{ x: 450 }} />
      </div>

    );
  }
}
const OrgInfo = Form.create()(FromComponent);
export default OrgInfo;

