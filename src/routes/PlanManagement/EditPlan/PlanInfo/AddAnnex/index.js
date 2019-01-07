import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Icon, Modal, Form, Input, Upload, message } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;
const { TextArea } = Input;
@connect(({ planManagement }) => ({
  planBasicInfo: planManagement.planBasicInfo,
  annexPage: planManagement.annexPage,
}))
@Form.create()
export default class AddFeature extends PureComponent {
  state = {
    fileList: [],
  };
  onChange = (file) => {
    if (file.file.status === 'done') {
      // uploadType:1 为组织、2为附件、3为处置卡 4为应急流程
      const { uploadType } = this.props;
      const { pageNum, pageSize } = this.props.annexPage;
      const { planBasicInfo } = this.props;
      switch (uploadType) {
        case 1:
          this.props.dispatch({
            type: 'planManagement/getOrgAnnex',
            payload: { planInfoID: planBasicInfo.planInfoID, uploadType: 1 },
          });
          break;
        case 2:
          // 通过eventID 获取附件列表
          this.props.dispatch({
            type: 'planManagement/getAnnexPage',
            payload: { planInfoID: planBasicInfo.planInfoID, pageNum, pageSize, uploadType: 2, isQuery: true, fuzzy: false },
          });
          break;
        case 3:
          this.props.dispatch({
            type: 'planManagement/getDealCard',
            payload: { planInfoID: planBasicInfo.planInfoID, uploadType: 3 },
          });
          break;
        case 4:
          this.props.dispatch({
            type: 'planManagement/getEmgcProcess',
            payload: { planInfoID: planBasicInfo.planInfoID, uploadType: 4 },
          });
          break;
        default: break;
      }
      // this.props.handleCancel();
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
    const { add, handleCancel, visible, uploadType } = this.props;
    const { planInfoID } = this.props.planBasicInfo;
    // uploadType:1 为组织、2为附件、3为处置卡
    const props = {
      action: `/emgc/plan/planEmergencyPlanArchive/uploadsFiles?planInfoID=${planInfoID}&uploadType=${uploadType}`,
      listType: 'picture',
      onChange: this.onChange,
      beforeUpload: this.beforeUpload,
    };
    return (
      <Modal
        title="上传文件"
        cancelText="取消"
        okText="保存"
        visible={visible}
        width="60%"
        bodyStyle={{ minHeight: 400 }}
        footer={false}
        mask={false}
        maskClosable={false}
        destroyOnClose
        onOk={() => add(this.props.form)}
        onCancel={handleCancel}
      >
        <Upload {...props}>
          <Button>
            <Icon type="upload" /> 上传
          </Button>
          <p className="ant-upload-hint">
            {uploadType === 2 ? '' : <span style={{ color: 'red' }}>* 请上传小于5M的JPEG或者PNG格式的图片</span>}
          </p>
        </Upload>
      </Modal>
    );
  }
}
