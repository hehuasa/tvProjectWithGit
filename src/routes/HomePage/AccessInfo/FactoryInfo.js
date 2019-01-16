import React, { PureComponent } from 'react';
import moment from 'moment';
import { Scrollbars } from 'react-custom-scrollbars';
import styles from './index.less';

let timerId;
export default class FactoryInfo extends PureComponent {
  componentDidMount() {
    // 自动滚动
    let progress = 0;
    let scrollTop = 0;
    timerId = setInterval(() => {
      const { onWheel } = this.props;
      if (!onWheel) {
        progress += 10;
        this.data.scrollTop(progress);
        if (this.data.getScrollTop() === scrollTop) {
          progress = 0;
          scrollTop = 0;
        } else {
          scrollTop = this.data.getScrollTop();
        }
      }

    }, 1000);
  }
  componentWillUnmount() {
    clearInterval(timerId)
  }
  render() {
    const { doorCount, style } = this.props;
    const height = style.height - 156;
    const testData = [...doorCount, ...doorCount];
    return (
      <div className={styles.doorInfo}>
        <ul>
          <li className={styles.title}>
            <span className={styles.orgName}>部门名称</span>
            <span className={styles.name}>姓名</span>
            <span className={styles.inFac}>是否在生产区</span>
            <span className={styles.inFac}>是否在办公区</span>
            <span className={styles.time}>进厂时间</span>
          </li>
          <Scrollbars
            className={styles.scrollbarsStyle}
            style={{ height: height }}
            ref={(ref) => this.data = ref }
          >
            {testData.length > 0 ? testData.map(item => (
              <li className={styles.list} key={Math.random() * new Date().getTime()}>
                <span className={styles.orgName}>{item.doorDepartmentName}</span>
                <span className={styles.name}>{item.userName}</span>
                <span className={styles.inFac}>{item.areaName === '生产区域' ? '是' : '否'}</span>
                <span className={styles.inFac}>{item.areaName === '生产区域' ? '否' : '是'}</span>
                <span className={styles.time}>{moment(Number(item.recordTime)).format('YYYY-MM-DD HH:mm:ss')}</span>
              </li>
            )) : null}
          </Scrollbars>
        </ul>
      </div>
    );
  }
}

