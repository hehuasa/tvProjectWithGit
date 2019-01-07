import React, { PureComponent } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import Trees from './Trees';
import {connect} from "dva/index";

@connect(({ commonResourceTree }) => ({
  ajaxParam: commonResourceTree.ajaxParam,
}))
export default class ResourceTree extends PureComponent {
  handleContextMenu= (e) => {
    e.preventDefault();
  };
  handClick = () => {
    this.props.dispatch({
      type: 'commonResourceTree/getContext',
      payload: { show: false },
    });
  };
  render() {
    return (
      <Scrollbars onContextMenu={this.handleContextMenu} style={{ paddingTop: 20, height: '100%' }} onClick={this.handClick}>
        <Trees ajaxParam={this.props.ajaxParam} />
      </Scrollbars>
    );
  }
}
