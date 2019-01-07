import React, { PureComponent } from 'react';
import { Menu } from 'antd';
import { connect } from 'dva';
import styles from './index.less';

const { SubMenu } = Menu;
@connect(({ user }) => {
  return {
    currentUser: user.currentUser,
  };
})
export default class TreeContextMenu extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
      payload: {},
    });
  }
   handleClick = ({ item }) => {
     const { dispatch, contextMenu, currentUser } = this.props;
     const { resourceID, treeID } = contextMenu;
     // 获取当前登陆账户ID
     const { accountID } = currentUser;
     if ((resourceID && accountID) || (accountID && treeID)) {
       dispatch({
         type: 'resourceTree/deleteCommonResource',
         payload: { resourceID, accountID, treeID },
       }).then(() => {
         // dispatch({
         //   type: 'commonTree/list',
         //   payload: { accountID },
         // });
       });
     }
     dispatch({
       type: 'resourceTree/getContext',
       payload: { show: false },
     });
   };


   render() {
     const { show, position } = this.props.contextMenu;
     const { isOften } = this.props;
     return (
       show ? (
         <Menu style={{ top: position.top, left: position.left, minWidth: 120 }} className={styles['context-menu']} onClick={this.handleClick}>
           <Menu.Item className={styles.item}>取消常用</Menu.Item>
         </Menu>
       ) : null
     );
   }
}

