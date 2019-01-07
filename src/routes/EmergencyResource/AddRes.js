import React, { PureComponent } from 'react';
import { Form, Input, Card, Row, Col, Modal, InputNumber } from 'antd';
import styles from './index.less';
import UserPage from './UserPage';

const { TextArea } = Input;
const FormItem = Form.Item;

@Form.create()
export default class AddRes extends PureComponent {
  state = {
    showUserModal: false,
  };
  // 查询用户
  getUser = () => {
    const { dispatch } = this.props;
    this.setState({
      showUserModal: true,
    });
    dispatch({
      type: 'emgcResource/fetchUsers',
      payload: { pageSize: 5, pageNum: 1, isQuery: true, fuzzy: true },
    });
  };
  // 获取选择的用户
  saveUserData = () => {
    const { form, cacheUser } = this.props;
    const { userName } = cacheUser;
    const { setFieldsValue } = form;
    setFieldsValue({ userID: userName });
    this.hideUserPage();
  };
  // 用户选择弹窗关闭
  hideUserPage = () => {
    this.setState({
      showUserModal: false,
    });
  };
  // 查重
  handleBlur = () => {
    const { form, dispatch } = this.props;
    const { getFieldsValue, setFields } = form;
    const value = getFieldsValue(['materialCode']);
    const { materialCode } = value;
    if (materialCode !== '') {
      dispatch({
        type: 'emgcResource/selectMaterialCode',
        payload: { materialCode },
      }).then(() => {
        const { repeated } = this.props;
        if (repeated) {
          setFields({
            materialCode: {
              value: materialCode,
              errors: [new Error('重复，请重新输入')],
            },
          });
        }
      });
    }
  };
  render() {
    const { form, dispatch, userData, saveCacheUserData, isAdd, emgcResourceInfo } = this.props;
    const { getFieldDecorator } = form;
    const { showUserModal } = this.state;
    return (
      <Card bordered={false} className={styles.warp}>
        <Form onSubmit={this.handleSubmit}>
          {getFieldDecorator('toolMaterialInfoID', {
            initialValue: isAdd ? null : emgcResourceInfo.toolMaterialInfoID,
          })}
          <Row gutter={{ md: 12, lg: 24 }}>
            <Col md={12} sm={24}>
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="资源名称"
              >
                {getFieldDecorator('materialName', {
                  initialValue: isAdd ? null : emgcResourceInfo.materialName,
                  rules: [{ required: true, message: '不能为空' }],
                })(
                  <Input placeholder="请输入资源名称" />
                )}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="资源编码"
              >
                {getFieldDecorator('materialCode', {
                  initialValue: isAdd ? null : emgcResourceInfo.materialCode,
                  rules: [{ required: true, message: '不能为空' }],
                })(
                  <Input placeholder="请输入资源编码" onBlur={this.handleBlur} />
                )}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="规格型号"
              >
                {form.getFieldDecorator('model', {
                  initialValue: isAdd ? null : emgcResourceInfo.model,
                  rules: [{ required: true, message: '不能为空' }],
                })(
                  <Input placeholder="请输入规格型号" />
                )}
              </FormItem>
            </Col>

            <Col md={12} sm={24}>
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="存放地点"
              >
                {form.getFieldDecorator('savePlace', {
                  initialValue: isAdd ? null : emgcResourceInfo.savePlace,
                  rules: [{ required: true, message: '不能为空' }],
                })(
                  <Input placeholder="请输入存放地点" />
                )}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="保管人"
              >
                {form.getFieldDecorator('userID', {
                  initialValue: isAdd ? null : emgcResourceInfo.baseUserInfo.userName,
                  trigger: ['forbidden'],
                })(
                  <Input.Search enterButton placeholder="请选择保管人" onSearch={this.getUser} />
                )}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="单位"
              >
                {form.getFieldDecorator('materialUnit', {
                  initialValue: isAdd ? null : emgcResourceInfo.materialUnit,
                })(
                  <Input placeholder="请输入单位" />
                )}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="数量"
              >
                {form.getFieldDecorator('lastCount', {
                  initialValue: isAdd ? null : emgcResourceInfo.lastCount,
                })(
                  <InputNumber style={{ width: '100%' }} min={1} placeholder="请输入数量" />
                )}
              </FormItem>
            </Col>
            <Col md={12} sm={24} >
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="备注"
              >
                {form.getFieldDecorator('remark', {
                  initialValue: isAdd ? null : emgcResourceInfo.remark,
                })(
                  <TextArea rows={4} />
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Modal
          destroyOnClose
          title="选择保管人"
          visible={showUserModal}
          onOk={this.saveUserData}
          width="80%"
          onCancel={this.hideUserPage}
        >
          <UserPage userData={userData} saveData={saveCacheUserData} dispatch={dispatch} />
        </Modal>
      </Card>
    );
  }
}
