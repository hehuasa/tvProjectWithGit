import React, { PureComponent } from 'react';
import { Spin } from 'antd';
import { connect } from 'dva';
import ReactZtree from './Ztree-react';
import TreeContextMenu from './ContextMenu/TreeContextMenu';
import styles from './index.less';
@connect(({ sysFunction, user, loading, tabs }) => {
  return {
    oftenTreeData: sysFunction.oftenTreeData,
    contextMenu: sysFunction.contextMenu,
    isOften: sysFunction.isOften,
    currentUser: user.currentUser,
    loading,
    tabs,
  };
})
export default class Trees extends PureComponent {
  constructor(prop) {
    super(prop);
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
      payload: {},
    }).then(() => {
      const { accountID } = this.props.currentUser;
      dispatch({
        type: 'sysFunction/findOftenFunction',
        payload: { accountID },
      });
    });
  }
  // 右键点击函数
  onRightClick = (e, treeId, treeNode) => {
    e.preventDefault();
    const position = { top: e.clientY, left: e.clientX };
    if (treeNode && !treeNode.isParent) {
      // 获取accountID
      const { funID } = treeNode;
      const { accountID } = this.props.currentUser;
      this.props.dispatch({
        type: 'sysFunction/checkIsOften',
        payload: { accountID, funID },
      }).then(() => {
        const { isOften } = this.props;
        this.props.dispatch({
          type: 'sysFunction/getContext',
          payload: { position, show: true, cancel: isOften, funID },
        });
      });
    }
  };
  setting = () => {
    return {
      callback: {
        onClick: (event, treeId, treeNode) => { this.handleClick(event, treeId, treeNode); },
        onRightClick: this.onRightClick,
      },
      data: {
        simpleData: {
          enable: true,
          idKey: 'functionCode',
          pIdKey: 'parentCode',
          rootPId: '0',
        },
      },
      view: {
        showIcon: false,
      },
    };
  };
  getURL = (treeNode) => {
    let url = treeNode.visitURL;
    while (treeNode.getParentNode()) {
      treeNode = treeNode.getParentNode();
      url = `${treeNode.visitURL}/${url}`;
    }
    return url;
  }
  // 点击函数
  handleClick = (event, treeId, treeNode) => {
    if (treeNode.leafMenu) {
      const title = treeNode.name;
      const key = this.getURL(treeNode);
      console.log(566, treeNode);
      this.changeTabs(key, title, treeNode);
    }
  };
  // 处理点击事件，处理tabs
  changeTabs=(key, title, functionInfo) => {
    const { tabs, dispatch } = this.props;
    dispatch({
      type: 'sysFunction/getContext',
      payload: { show: false },
    });
    if (tabs.tabs.find(value => value.key === `/${key}`)) {
      dispatch({
        type: 'tabs/active',
        payload: { key: `/${key}` },
      });
    } else {
      dispatch({
        type: 'tabs/addTabs',
        payload: { key: `/${key}`, title, functionInfo },
      });
    }
  };
  render() {
    const { oftenTreeData, contextMenu, loading } = this.props;
    return (
      !loading.effects['sysFunction/findOftenFunction'] ? (
        <div className={styles.warp}>
          { oftenTreeData.length > 0 ? <ReactZtree nodes={oftenTreeData} ref={ref => this.ztree = ref} setting={this.setting()} /> : (
            <div className={styles.noData}>
                    无常用功能
              <div>(可尝试在功能树中,通过右键添加常用功能)</div>
            </div>
)}
          <TreeContextMenu
            dispatch={this.props.dispatch}
            contextMenu={contextMenu}
          />

        </div>
      ) : <Spin className={styles.spin} />);
  }
}

