import React, { PureComponent } from 'react';
import { Button, Popconfirm } from 'antd';
import styles from './index.less';

export default class Footer extends PureComponent {
  render() {
    const { save, cancel } = this.props;
    return (
      <div className={styles.footer}>
        <Button onClick={save} type="primary">保存</Button>
        <Popconfirm placement="topRight" title="确认清空实施方案 ?" onConfirm={cancel} okText="确认" cancelText="取消">
          <Button>清空实施方案</Button>
        </Popconfirm>
      </div>
    );
  }
}
