import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import { infoPopsModal } from '../../../../services/constantlyModal';
import { getStrLength } from '../../../../utils/utils';
import styles from './index.less';

// 计算地图弹窗的箭头方向，宽高等
const getInfoWindowStyle = ({ mapStyle, screenPoint }) => {
  const arrowLength = 7;
  return {
    bottom: mapStyle.height - screenPoint.y + arrowLength + 5,
    left: screenPoint.x - 2,
  };
};
const mapStateToProps = ({ mapRelation }) => {
  return {
    infoPops: mapRelation.infoPops,
  };
};
class InfoPops extends PureComponent {
  handleClick = () => {
    const { infoPops, dispatch, popKey } = this.props;
    const index = infoPops.findIndex(value => value.key === popKey);
    infoPops.splice(index, 1);
    delete infoPopsModal[popKey];
    dispatch({
      type: 'mapRelation/queryInfoPops',
      payload: infoPops,
    });
  };
  render() {
    const { popValue } = this.props;
    const style = getInfoWindowStyle(popValue);
    if (style) {
      // 动态宽度
      const { cnLength, enLength } = getStrLength(popValue.name);
      style.width = cnLength * 22 + enLength * 16 + 24 + 24 + 8;
    }
    return (
      <div className={styles.simpleInfo} style={style}>
        <span>{popValue.name}</span>
        <div className={styles.close} onClick={this.handleClick}>x</div>
        <div
          className={styles.bottom}
          style={{ left: '50%',
                    bottom: -5 }}
        />
      </div>
    );
  }
}
export default connect(mapStateToProps)(InfoPops);
