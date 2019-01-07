import React, { PureComponent } from 'react';
import { Menu, Icon } from 'antd';
import styles from './index.less';

const { SubMenu } = Menu;

export default class TreeContextMenu extends PureComponent {
   handleClick = ({ item }) => {
     const { dispatch, addOrg, deleteOrg } = this.props;
     switch (item.props.index) {
       case 0:
         addOrg();
         break;
       case 1:
         deleteOrg();
         break;
       default: break;
     }
     dispatch({
       type: 'resourceTree/getContext',
       payload: { show: false },
     });
   };


   render() {
     const { show, position } = this.props.contextMenu;
     return (
       show ? (
         <Menu style={{ top: position.top, left: position.left, minWidth: 120 }} className={styles['context-menu']} onClick={this.handleClick}>
           <Menu.Item key="1"><span>新增</span><Icon type="plus-circle-o" style={{ marginLeft: 20 }} /></Menu.Item>
           {/* <Menu.Item key="2"><span>删除</span><Icon type="delete" style={{ marginLeft: 20 }} /></Menu.Item> */}
         </Menu>
       ) : null
     );
   }
}

