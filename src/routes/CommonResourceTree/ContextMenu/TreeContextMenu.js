import React, { PureComponent } from 'react';
import { Menu } from 'antd';
import { connect } from 'dva';
import $ from 'jquery';
import styles from './index.less';

const { SubMenu } = Menu;

@connect(({ commonResourceTree, user }) => ({
  commonResourceTree,
  currentUser: user.currentUser,
}))
export default class TreeContextMenu extends PureComponent {
   handleClick = () => {
     const { dispatch, contextMenu } = this.props;
     const { resourceID, treeNode } = contextMenu;
     dispatch({
       type: 'commonResourceTree/deleteCommonResource',
       payload: { resourceID },
     }).then(() => {
       // 刷新树
       const treeObj = $.fn.zTree.getZTreeObj('ztree');
       if (treeNode.getParentNode() && treeNode.getParentNode().children.length === 1) {
         this.props.dispatch({
           type: 'commonResourceTree/saveAjaxParam',
           payload: {
             param: ['treeID=parentTreeID'],
             asyncUrl: 'emgc/resource/resourceTree/getResourceInfo',
           },
         });
         this.props.dispatch({
           type: 'commonResourceTree/queryList',
           payload: null,
         });
         treeObj.reAsyncChildNodes(null, 'refresh');
       } else {
         treeObj.reAsyncChildNodes(treeNode.getParentNode(), 'refresh');
       }
       dispatch({
         type: 'commonResourceTree/getContext',
         payload: { show: false },
       });
     });
   };


   render() {
     const { show, position } = this.props.contextMenu;
     return (
       show ? (
         <Menu style={{ top: position.top, left: position.left, minWidth: 120 }} className={styles['context-menu']} onClick={this.handleClick}>
           <Menu.Item className={styles.item}>取消常用</Menu.Item>
         </Menu>
       ) : null
     );
   }
}

