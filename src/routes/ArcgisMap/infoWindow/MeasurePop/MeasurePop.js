import React from 'react';
import { connect } from 'dva';
import styles from './index.less';

const mapStateToProps = ({ map }) => {
  const { measurePop } = map;
  return {
    style: measurePop.style,
    show: measurePop.show,
  };
};
const MeasurePop = ({ style, show }) => {
  const measuringText = '单击确定地点，双击结束';
  return (
    show ? (
      <div className={styles.measurePop} style={style}>
        <span>{measuringText}</span>
      </div>
    ) : null
  );
};
export default connect(mapStateToProps)(MeasurePop);
