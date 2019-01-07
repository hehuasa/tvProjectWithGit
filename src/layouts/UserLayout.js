import React from 'react';
import { Switch, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { Icon, Tooltip, Modal } from 'antd';
import styles from './UserLayout.less';
import GlobalFooter from '../components/GlobalFooter/index';
// import logo from '../assets/login/logoNew.gif';
import logo from '../assets/login/login_logo.png';
import { getRoutes } from '../utils/utils';
import Login from '../components/Login';

const { confirm } = Modal;
const links = [{
  key: 'help',
  title: '帮助',
  href: '',
}, {
  key: 'privacy',
  title: '隐私',
  href: '',
}, {
  key: 'terms',
  title: '条款',
  href: '',
}];

class UserLayout extends React.PureComponent {
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = '中韩石化应急指挥系统';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - 中韩石化应急指挥系统`;
    }
    return title;
  }

  handleClose = () => {
    const that = this;
    confirm({
      title: '请确认',
      content: '将关闭窗口',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        that.props.dispatch({
          type: 'video/devTools',
          payload: { CmdCode: 'EXIT' },
        });
      },
    });
  };
  handleMin = () => {
    this.props.dispatch({
      type: 'video/devTools',
      payload: { CmdCode: 'MIN' },
    });
  };

  render() {
    const { routerData, match } = this.props;
    return (
      <DocumentTitle title="用户登录">
        <div style={{background: '#fff'}}>
          <div className={styles.tool}>
            {/*<Tooltip placement="bottom" title="关闭">*/}
              {/*<span className={styles.closeWarp}>*/}
                {/*<Icon className={styles.close} type="close" style={{ fontWeight: 800 }} onClick={this.handleClose} />*/}
              {/*</span>*/}
            {/*</Tooltip>*/}
            {/*<Tooltip placement="bottom" title="最小化">*/}
              {/*<span className={styles.minWarp}>*/}
                {/*<Icon className={styles.close} type="minus" style={{ fontWeight: 800 }} onClick={this.handleMin} />*/}
              {/*</span>*/}
            {/*</Tooltip>*/}
          </div>
          <div className={styles.login_content}>
            <div className={styles.login_header}>
              <div className={styles.header_logo}>
                <img alt="logo" src={logo} />
              </div>
            </div>
            <div className={styles.login_body}>
              <div className={styles.content}>
                <Switch>
                  {getRoutes(match.path, routerData).map(item =>
                    (
                      <Route
                        key={item.key}
                        path={item.path}
                        component={item.component}
                        exact={item.exact}
                      />
                    )
                  )}
                </Switch>
              </div>
            </div>
            <div className={styles.login_footer}>
              <div className={styles.footer_desc}>
                <div>
                  Copyright 2018   中韩（武汉）石油化工有限公司 版权所有
                </div>
                <div>
                  技术支持 成都格理特电子技术有限公司
                </div>
              </div>
            </div>
          </div>
        </div>

      </DocumentTitle>

      // {/*<DocumentTitle title={this.getPageTitle()}>*/}
      //   {/*<div className={styles.container}>*/}
      //     {/*<div className={styles.content}>*/}
      //       {/*<div className={styles.top}>*/}
      //         {/*<div className={styles.header}>*/}
      //           {/*<Link to="/">*/}
      //             {/*<img alt="logo" className={styles.logo} src={logo} />*/}
      //             {/*/!*<span className={styles.title}>Ant Design</span>*!/*/}
      //           {/*</Link>*/}
      //         {/*</div>*/}
      //         {/*<div className={styles.desc}>安全从“心”出发，事故从“源”防范</div>*/}
      //       {/*</div>*/}
      //       {/*<Switch>*/}
      //         {/*{getRoutes(match.path, routerData).map(item =>*/}
      //           {/*(*/}
      //             {/*<Route*/}
      //               {/*key={item.key}*/}
      //               {/*path={item.path}*/}
      //               {/*component={item.component}*/}
      //               {/*exact={item.exact}*/}
      //             {/*/>*/}
      //           {/*)*/}
      //         {/*)}*/}
      //         {/*<Redirect exact from="/user" to="/user/login" />*/}
      //       {/*</Switch>*/}
      //     {/*</div>*/}
      //     {/*/!*<GlobalFooter links={links} copyright={copyright} />*!/*/}
      //   {/*</div>*/}
      // {/*</DocumentTitle>*/}
    );
  }
}

export default UserLayout;
