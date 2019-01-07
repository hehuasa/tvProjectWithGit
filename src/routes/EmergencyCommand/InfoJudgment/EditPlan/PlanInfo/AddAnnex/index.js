import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Icon, Modal, Form, Input, Upload, message } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;
const { TextArea } = Input;
@connect(({ emergency }) => ({
  eventID: emergency.eventId,
  annexPage: emergency.annexPage,
}))
@Form.create()
export default class AddFeature extends PureComponent {
  onChange = (file) => {
    if (file.file.status === 'done') {
      this.props.handleCancel();
      // 通过eventID 获取附件列表
      const { pageNum, pageSize } = this.props.annexPage;
      const { eventID } = this.props;
      this.props.dispatch({
        type: 'emergency/getAnnexPage',
        payload: { eventID, pageNum, pageSize, uploadType: 2, isQuery: true, fuzzy: false },
      });
    }
  };
  beforeUpload = (file) => {
    const isJPG = file.type === 'image/jpeg';
    const isPNG = file.type === 'image/png';
    const isLt5M = file.size / 1024 / 1024 < 5;
    switch (this.props.uploadType) {
      case 2: break;
      default:
        if (!((isJPG || isPNG) && isLt5M)) {
          message.error('只能上传小于5M的JPEG或者PNG格式的文件!');
        }
        break;
    }
    return this.props.uploadType === 2 ? true : (isJPG || isPNG) && isLt5M;
  };
  render() {
    const { add, handleCancel, visible, form, uploadType } = this.props;
    const props = {
      action: `/emgc/emgc/emgcEventExecPlanArchive/uploadsFiles?eventID=${this.props.eventID}`,
      listType: 'picture',
      onChange: this.onChange,
      beforeUpload: this.beforeUpload,
    };
    return (
      <Modal
        title="新增附件"
        cancelText="取消"
        okText="保存"
        visible={visible}
        width="60%"
        bodyStyle={{ minHeight: 400 }}
        footer={false}
        mask={false}
        destroyOnClose
        maskClosable={false}
        onOk={() => add(this.props.form)}
        onCancel={handleCancel}
      >
        <div>
          <Upload {...props}>
            <Button>
              <Icon type="upload" /> 上传
            </Button>
            <p className="ant-upload-hint">
              {uploadType === 2 ? '' : <span style={{ color: 'red' }}>* 请上传小于5M的JPEG或者PNG格式的图片</span>}
            </p>
          </Upload>
        </div>
      </Modal>
    );
  }
}
