import React, { PureComponent } from 'react';
import styles from '../index.less';

const getStrLength = (item) => {
  const cnChar = item.match(/[^\x00-\x80]/g);// 利用match方法检索出中文字符并返回一个存放中文的数组
  const entryLen = cnChar === null ? 0 : cnChar.length;// 算出实际的字符长度
  return { cnLength: entryLen, enLength: item.length - entryLen };
};

export default class ConstantlyTemplate extends PureComponent {
  render() {
    const { constantlyValue } = this.props;
    return (
      <div>
        {constantlyValue.map((item) => {
                const top =
                 item.domTitle ? item.style.top - 7 - 20 - 29 - (item.domText.length * 29) - 8 : item.style.top - 7 - 20 - (item.domText.length * 29) - 8;
                return (
                  <div
                    key={Math.random() * new Date().getTime()}
                    style={{
                      top,
                      left: item.style.left - 2 }}
                    className={styles.constantly}
                  >
                    {item.domTitle ? <span>{item.domTitle}</span> : null}
                    {item.domText.map((text) => {
                      const { cnLength, enLength } = getStrLength(text);
                      return (
                        <span
                          style={{ width: cnLength * 14 + enLength * 8 + 24 + 24 }}
                          key={Math.random() * Math.random() * new Date().getTime()}
                        >{text}
                        </span>
);
                    })}
                    <div
                      className={styles.bottom}
                    />
                  </div>
                );
              }
            )}
      </div>
    );
  }
}
