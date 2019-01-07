import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Checkbox } from 'antd';
import styles from './index.less';

@connect(({ alarmDeal }) => ({
  isDrill: alarmDeal.isDrill,
}))
export default class Footer extends PureComponent {
  render() {
    const { save, cancel, onChange } = this.props;
    return (
      <div className={styles.footer}>
        <Button onClick={save} type="primary">保存</Button>
        <Button onClick={cancel}>取消</Button>
        <Checkbox value={this.props.isDrill} onChange={onChange}>应急演练</Checkbox>
      </div>
    );
  }
}
