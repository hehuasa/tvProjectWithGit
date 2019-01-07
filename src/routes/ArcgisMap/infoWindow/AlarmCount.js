import { connect } from 'dva';
import styles from './index.less';

const mapStateToProps = ({ map }) => {
  const { alarmCountsPopup, mainMap } = map;
  return {
    alarmCountsPopup,
    mainMap,
  };
};

const AlarmCount = ({ alarmCountsPopup, mainMap }) => {
  const { show, data } = alarmCountsPopup;
  const handleClick = (item) => {
    mainMap.setExtent(item.attributes.extent.expand(1.5));
  };
  return (
    show ? (
      <div>{data.map((item) => {
        return (
          <div className={styles.counts} style={item.style} key={item.id} onClick={() => { handleClick(item); }}>
            <div className={styles.total}>{`${item.attributes.deviceName}`}</div>
            <div className={styles.detail}>{`总数： ${item.attributes.total}`}</div>
            <div className={styles.detail}><div>{`火灾： ${item.attributes.fire}`}</div><div>{`气体： ${item.attributes.gas}`}</div><div>{`其他： ${item.attributes.other}`}</div></div>
          </div>
);
      })}
      </div>
    ) : null
  );
};
export default connect(mapStateToProps)(AlarmCount);
