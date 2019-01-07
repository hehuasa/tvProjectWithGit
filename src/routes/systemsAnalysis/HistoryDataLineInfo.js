
import React, { PureComponent } from 'react';
import { Modal, Button } from 'antd';


export default class HistoryLineInfo extends PureComponent {



  // 关闭后销毁子元素
  render() {
    const { visible, onHandleOk, onhandleCancel, dotValue } = this.props;
 
    return (
      <Modal
        title="已选点位"
        visible={visible}
        onOk={onHandleOk}
        onCancel={onhandleCancel}
      >
        {dotValue.map(item => (
          <div>
            <div>{item.title}</div>
            <p key={item.id}>{item.name}</p>
          </div>
        ))}
      </Modal>
    )
  }


}


