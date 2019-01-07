import React, { PureComponent } from 'react';
import $ from 'jquery';
import { Menu } from 'antd';
import { connect } from 'dva';
import styles from './index.less';

const { SubMenu } = Menu;

@connect(({ resourceTree, user, commonResourceTree }) => ({
  resourceTree,
  commonResourceTree,
  ztreeObj: commonResourceTree.ztreeObj,
  currentUser: user.currentUser,
}))
export default class TreeContextMenu extends PureComponent {
   handleClick = () => {
     const { dispatch, contextMenu, refresh } = this.props;
     const { isOften } = this.props.resourceTree;
     const { resourceID, treeID, treeNode } = contextMenu;
     // 获取当前登陆账户ID
     const { accountID } = this.props.currentUser;
     if (resourceID && accountID && treeID) {
       // 判断是取消常用 还是设为常用
       if (isOften) {
         dispatch({
           type: 'resourceTree/deleteCommonResource',
           payload: { resourceID, accountID, treeID },
         }).then(() => {
           this.props.dispatch({
             type: 'commonResourceTree/saveAjaxParam',
             payload: {
               param: ['treeID=parentTreeID'],
               asyncUrl: 'emgc/resource/resourceTree/getResourceInfo',
             },
           });
         });
       } else {
         dispatch({
           type: 'resourceTree/addCommonResource',
           payload: { resourceID, accountID, treeID },
         }).then(() => {
           this.props.dispatch({
             type: 'commonResourceTree/saveAjaxParam',
             payload: {
               param: ['treeID=parentTreeID'],
               asyncUrl: 'emgc/resource/resourceTree/getResourceInfo',
             },
           });
         });
       }
     }
     dispatch({
       type: 'resourceTree/getContext',
       payload: { show: false },
     });
   };


   render() {
     const { show, position } = this.props.contextMenu;
     const { isOften } = this.props.resourceTree;
     return (
       show ? (
         <Menu style={{ top: position.top, left: position.left, minWidth: 120 }} className={styles['context-menu']} onClick={this.handleClick}>
           <Menu.Item className={styles.item}>
             {isOften ? '取消常用' : '设为常用'}
           </Menu.Item>
         </Menu>
       ) : null
     );
   }
}

