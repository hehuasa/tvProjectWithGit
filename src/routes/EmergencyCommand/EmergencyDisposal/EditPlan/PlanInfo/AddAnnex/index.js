import React, { PureComponent } from 'react';
import { Button, Icon, Modal, Form, Upload } from 'antd';

@Form.create()
export default class AddFeature extends PureComponent {
  render() {
    const { add, handleCancel, visible } = this.props;
    const props = {
      action: '//jsonplaceholder.typicode.com/posts/',
      listType: 'picture',
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
        maskClosable={false}
        onOk={() => add(this.props.form)}
        onCancel={handleCancel}
      >
        <Upload {...props}>
          <Button>
            <Icon type="upload" /> 上传
          </Button>
        </Upload>
      </Modal>
    );
  }
}
