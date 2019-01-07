import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, Icon, Row, Col, Table } from 'antd';
import { getUUID, getBrowserStyle } from '../../utils/utils';
import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const columns = [
  {
    title: '姓名',
    dataIndex: 'userName',
    key: 'userName',
  }, {
    title: '手机号码',
    dataIndex: 'mobile',
    key: 'mobile',
  }, {
    title: '所属部门',
    dataIndex: 'orgnizationName',
    key: 'orgnizationName',
  }, {
    title: '专业系统',
    dataIndex: 'specialityName',
    key: 'specialityName',
  },
];


const SendForm = Form.create()((props) => {
  const { form, addReceptor, remove, templateList, loading, doAdd, state } = props;
  const { getFieldDecorator } = form;
  const handleChange = (value) => {
    // const msgContent = form.getFieldValue('msgContent');
    form.setFieldsValue({
      msgContent: value,
    });
  };
  const receptorCols = [
    {
      title: '姓名',
      dataIndex: 'userName',
      key: 'userName',
    }, {
      title: '手机号码',
      dataIndex: 'mobile',
      key: 'mobile',
    }, {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => {
        return <a href="javascript: void(0)" onClick={() => remove(record)}>移除</a>;
      },
    },
  ];
  return (
    <div>
      <Row className={styles.bottom}>
        <Col span={12}>
          <FormItem
            label="接收人员"
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 12 }}
          >
            {getFieldDecorator('userName', {
              rules: [
                { required: true, message: '姓名必填' },
              ],
            })(
              <Input placeholder="姓名" />
            )
            }
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem
            labelCol={{ span: 0 }}
            wrapperCol={{ span: 24 }}
          >
            {getFieldDecorator('mobile', {
              rules: [
                { required: true, message: '手机号码必填' },
                { pattern: /^(17[0-9]|13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/, message: '请输入正确的手机号码' },
              ],
            })(
              <Input placeholder="手机号码" />
            )
            }
          </FormItem>
        </Col>
        <Col span={4}>
          <FormItem
            labelCol={{ span: 0 }}
            wrapperCol={{ span: 23 }}
          >
            <Button
              style={{ marginLeft: 4 }}
              size="small"
              type="primary"
              icon="plus-circle"
              onClick={() => addReceptor(form)}
            >添加
            </Button>
          </FormItem>
        </Col>
      </Row>
      <Row  className={styles.bottom}>
        <FormItem
          label="接收列表"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 12 }}
        >
          {getFieldDecorator('list')(
            <Table
              size="small"
              dataSource={state.mobileList.concat(state.userList)}
              columns={receptorCols}
              // style={{ marginBottom: 8 }}
              pagination={{
                pageSize: 5,
              }}
            />
          )
          }
        </FormItem>
      </Row>
      <Row>
        <FormItem
          label="短信模板"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 12 }}
        >
          <Select
            showSearch
            style={{ width: '100%' }}
            placeholder="请选择短信模板"
            optionFilterProp="title"
            onChange={handleChange}
          >
            {templateList.map(item => (
              <Option
                key={item.shortMsgTemplateID}
                title={item.templateTitle}
                value={item.content}
              >{item.templateTitle}
              </Option>
            ))}
          </Select>
        </FormItem>
      </Row>
      <FormItem
        label="短信内容"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 12 }}
      >
        {getFieldDecorator('msgContent', {
          rules: [{ required: true, message: '短信内容不能为空' }],
        })(
          <TextArea rows={4} className={styles.bottom} />
        )}
      </FormItem>
      <FormItem
        wrapperCol={{ span: 12, offset: 5 }}
      >
        <Button type="primary" loading={loading} onClick={() => doAdd(form)}>
          发送
        </Button>
      </FormItem>
    </div>
  );
});

@connect(({ template, userList, sendMsg, loading }) => ({
  templateList: template.templateList,
  userPage: userList.data,
  sendMsg,
  loading: loading.effects['sendMsg/add'],
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    userList: [], // 选择的系统短信接收人员
    mobileList: [], // 手动添加的短信接收人员
    selectedRowKeys: [], // 选中的系统用户的ID
    pageWidth: false, // 小于1999px为true
  };
  componentDidMount() {
    const { winWidth } = getBrowserStyle();
    if (winWidth < 1999) {
      this.state.pageWidth = true;
    } else {
      this.state.pageWidth = false;
    }
    const { dispatch } = this.props;
    // 请求短信模板
    dispatch({
      type: 'template/fetch',
      payload: '',
    });
    // 请求用户分页
    this.userPage(1, 10);
  }
  // 获取系统用户
  userPage = (pageNum, pageSize) => {
    const { form } = this.props;
    form.validateFields(['searchName', 'searchMobile'], (err, fieldsValue) => {
      if (err) return;
      const params = {
        pageNum,
        pageSize,
        isQuery: true,
        fuzzy: true,
        userName: fieldsValue.searchName,
        mobile: fieldsValue.searchMobile,
      };
      this.props.dispatch({
        type: 'userList/page',
        payload: params,
      });
    });
  };
  // 手动添加报警接收人员
  addReceptor = (form) => {
    const { mobileList } = this.state;
    form.validateFields(['userName', 'mobile'], (err, fieldsValue) => {
      if (err) return;
      mobileList.unshift({ ...fieldsValue, uuid: getUUID() });
      this.setState({
        mobileList,
      });
      form.setFieldsValue({
        userName: null,
        mobile: null,
      });
    });
  };
  // 移除接收人员
  remove = (record) => {
    const { userList, mobileList, selectedRowKeys } = this.state;
    // 手动添加的人员
    if (record.uuid) {
      this.setState({
        mobileList: mobileList.filter(item => item.uuid !== record.uuid),
      });
    } else {
      this.setState({
        userList: userList.filter(item => item.userID !== record.userID),
        selectedRowKeys: selectedRowKeys.filter(item => item !== record.userID),
      });
    }
  };
  doAdd = (form) => {
    const { dispatch } = this.props;
    const { userList, mobileList } = this.state;
    form.validateFields(['msgContent'], (err, fieldsValue) => {
      if (err) return;
      if (!userList.concat(mobileList).length > 0) {
        form.setFields({
          list: {
            errors: [new Error('接收人员列表不能为空')],
          },
        });
        return;
      }
      const obj = {
        userList: userList.concat(mobileList),
        msgContent: fieldsValue.msgContent,
      };
      dispatch({
        type: 'sendMsg/add',
        payload: { infoJson: JSON.stringify(obj) },
      }).then(() => {
        this.setState({
          userList: [],
          mobileList: [],
          selectedRowKeys: [],
        });
        form.setFieldsValue({
          msgContent: null,
        });
      });
    });
  };
  rowCheckedChange = (selectedRowKeys, selectedRows) => {
    this.setState({
      userList: selectedRows,
      selectedRowKeys,
    });
  };
  handleSearch = () => {
    this.props.form.validateFields((err, values) => {
      const param = {
        pageNum: 1,
        pageSize: 10,
        isQuery: true,
        fuzzy: true,
        userName: values.searchName,
        mobile: values.searchMobile,
      };
      this.props.dispatch({
        type: 'userList/page',
        payload: param,
      });
    });
  };
  handleReset = () => {
    const param = {
      pageNum: 1,
      pageSize: 10,
      isQuery: true,
      fuzzy: true,
    };
    this.props.dispatch({
      type: 'userList/page',
      payload: param,
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { pageWidth } = this.state;
    return (
      <div className={styles.sedMsg}>
        <Form onSubmit={this.handleSubmit}>
          <Row>
            <Col span={11} offset={1} >
              <Form
                className={styles.searchForm}
              >
                <Row gutter={24}>
                  <Col span={pageWidth ? 12 : 8}>
                    <FormItem
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 16 }}
                      label="姓名"
                    >
                      {getFieldDecorator('searchName', {
                        rules: [{
                        }],
                      })(
                        <Input placeholder="请输入姓名" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={pageWidth ? 12 : 10}>
                    <FormItem
                      labelCol={{ span: 10 }}
                      wrapperCol={{ span: 14 }}
                      label="手机号码"
                    >
                      {getFieldDecorator('searchMobile', {
                        rules: [
                          { pattern: /^[0-9]*$/, message: '只能输入数字' },
                        ],
                      })(
                        <Input placeholder="请输入手机号码" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={pageWidth ? 12 : 6} className={styles.searchBtn}>
                    <Button type="primary" size="small" onClick={this.handleSearch}>搜索</Button>
                    <Button size="small" onClick={this.handleReset}>重置</Button>
                  </Col>
                </Row>
              </Form>
              <Table
                // size="small"
                dataSource={this.props.userPage.data}
                columns={columns}
                rowSelection={{
                  onChange: this.rowCheckedChange,
                  selectedRowKeys: this.state.selectedRowKeys,
                }}
                pagination={{
                  ...this.props.userPage.pagination,
                  onChange: this.userPage,
                }}
                rowKey={record => record.userID}
              />
            </Col>
            <Col span={12}>
              <SendForm
                addReceptor={this.addReceptor}
                remove={this.remove}
                state={this.state}
                loading={this.props.loading}
                doAdd={this.doAdd}
                templateList={this.props.templateList}
              />
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
