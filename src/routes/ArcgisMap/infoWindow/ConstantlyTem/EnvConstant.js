import React from 'react';
import { connect } from 'dva';
import styles from '../index.less';

const mapStateToProps = ({ map }) => {
  const data = [];
  for (const item of map.envConstantlyValue.data) {
    data.push(item);
  }
  return {
    constantlyValue: { show: map.envConstantlyValue.show, data },
  };
};
const EnvConstant = ({ constantlyValue }) => {
  return (
    constantlyValue.show ? (
      <div>
        <div>
          {constantlyValue.data.map((item) => {
              return (
                <div
                  key={Math.random() * new Date().getTime()}
                  style={{ top: item.style.top - 30 - 20 - (item.domText.length * 29) - 8, left: item.style.left }}
                  className={styles.constantly}
                >
                  {item.domText.map(text => (
                    <span>{text}</span>
                  ))}
                  <div
                    className={styles.bottom}
                  />
                </div>
              );
            }
          )}
        </div>
      </div>
    ) : null
  );
};
export default connect(mapStateToProps)(EnvConstant);
