import React from 'react';
import { connect } from 'dva';
import styles from './index.less';

const mapStateToProps = ({ map }) => {
  const data = [];
  for (const item of map.constantlyValue.data) {
    data.push(item);
  }
  return {
    constantlyValue: {show : map.constantlyValue.show, data}
  };
};
const ConstantlyTemplate = ({ constantlyValue }) => {
  return (
    constantlyValue.show ?
    <div>
      <div>
        {constantlyValue.data.map((item) => {
              return (
                <div key={Math.random() * new Date().getTime()} style={{ top: item.style.top - 30 - 20 -15, left: item.style.left }} className={styles.constantly}>
                  <span>{item.domText}</span>
                  <div
                    className={styles.bottom}
                  />
                  </div>
              );
            }
          )}
      </div>
    </div> : null
  );
};
export default connect(mapStateToProps)(ConstantlyTemplate);
