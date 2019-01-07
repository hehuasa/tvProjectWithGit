import React, { PureComponent } from 'react';
import ClusterPopup from '../../../../components/ClusterPopup/ClusterPopup';
import { addPopupHover } from '../../../../utils/mapService';

const circleBackground = '#27afff';
export default class ConstructMonitorPopup extends PureComponent {
  handleClick = () => {
    const { popValue, dispatch } = this.props;
    const { attributes } = popValue;
    const { data } = attributes;
    const { list, area, keys } = data;
    dispatch({
      type: 'resourceTree/saveCtrlResourceType',
      payload: '',
    });
    dispatch({
      type: 'constructMonitor/queryMapSelectedList',
      payload: { list, area, keys },
    });
    dispatch({
      type: 'resourceTree/saveCtrlResourceType',
      payload: 'constructMonitor',
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
    const { attributes } = popValue;
    const { style, data } = attributes;
    return (
      <ClusterPopup count={data.list.length} circleBackground={circleBackground} style={style} handleClick={this.handleClick} handleMouseOver={this.handleMouseOver} handleMouseOut={this.handleMouseOut} />
    );
  }
}
