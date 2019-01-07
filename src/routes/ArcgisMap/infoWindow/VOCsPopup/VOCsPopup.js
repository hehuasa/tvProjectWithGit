import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import ClusterPopup from '../../../../components/ClusterPopup/ClusterPopup';
import styles from './index.less';
import { addPopupHover } from '../../../../utils/mapService';

const circleBackground = '#f0811a';
export default class VOCsPopup extends PureComponent {
  handleClick = () => {
    const { popValue, dispatch } = this.props;
    const { areaName, keys, gisCode } = popValue;
    dispatch({
      type: 'resourceTree/saveCtrlResourceType',
      payload: '',
    });
    dispatch({
      type: 'vocsMonitor/fetchVocsTasks',
      payload: { areaName, keys, gisCode },
    }).then(() => {
      dispatch({
        type: 'resourceTree/saveCtrlResourceType',
        payload: 'vocsMonitor',
      });
    });
  };
  handleMouseOver = () => {
    const { popValue } = this.props;
    const { attributes } = popValue;
    addPopupHover(attributes.area, circleBackground);
  };
  handleMouseOut = () => {
    addPopupHover();
  };
  render() {
    const { popValue } = this.props;
    const { attributes, data } = popValue;
    const { style } = attributes;
    // 弹出式气泡窗内容
    const content = (
      <div className={styles.content}>
        <Row><Col span={18}>维修点数量</Col><Col span={2}> : </Col><Col span={4}> {data.maintNumbers}</Col></Row>
        <Row><Col span={18}>已维修点数量</Col><Col span={2}> : </Col><Col span={4}> {data.alreadyMaintNumbers}</Col></Row>
        <Row><Col span={18}>无法维修点数量</Col><Col span={2}> : </Col><Col span={4}> {data.notMaintNumbers}</Col></Row>
        <Row><Col span={18}>待维修点数量</Col><Col span={2}> : </Col><Col span={4}> {data.waitMaintNumbers}</Col></Row>
      </div>
    );
    return (
      <ClusterPopup count={popValue.count} circleBackground={circleBackground} content={content} style={style} handleClick={this.handleClick} handleMouseOver={this.handleMouseOver} handleMouseOut={this.handleMouseOut} />
    );
  }
}
