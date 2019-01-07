import React, { PureComponent } from 'react';
import { Menu } from 'antd';
import { connect } from 'dva';
import styles from './index.less';

const { SubMenu } = Menu;

@connect(({ resourceTree, user, sysFunction }) => ({
  resourceTree,
  currentUser: user.currentUser,
  sysFunction,
  contextMenu: sysFunction.contextMenu,
  isOften: sysFunction.isOften,
}))
export default class TreeContextMenu extends PureComponent {
   handleClick = ({ item }) => {
     const { dispatch, contextMenu } = this.props;
     const { funID, cancel } = contextMenu;
     // 获取当前登陆账户ID
     const { accountID } = this.props.currentUser;
     if (cancel) {
       if (funID && accountID) {
         // 执行移除常用 然后刷新常用
         dispatch({
           type: 'sysFunction/deleteOftenFunction',
           payload: { funID, accountID },
         }).then(() => {
           dispatch({
             type: 'sysFunction/findOftenFunction',
             payload: { accountID },
           });
         });
       }
     } else if (funID && accountID) {
       // 执行新增常用 然后刷新常用
       dispatch({
         type: 'sysFunction/addOftenFunction',
         payload: { funID, accountID },
       }).then(() => {
         dispatch({
           type: 'sysFunction/findOftenFunction',
           payload: { accountID },
         });
       });
     }
     dispatch({
       type: 'sysFunction/getContext',
       payload: { show: false },
     });
   };
   render() {
     const { show, position } = this.props.contextMenu;
     const { isOften } = this.props;
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

