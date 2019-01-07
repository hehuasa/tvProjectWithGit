import React, { PureComponent } from 'react';
import { Button } from 'antd';
import { Link, Redirect, Switch, Route } from 'dva/router';
import {getRoutes} from "../utils/utils";
import styles from './ImportLayout.less'

export default class TestLayout extends React.PureComponent {
  render(){
    const { routerData, match } = this.props;
    return <div>
      <div className={styles.header}><h1>导入配置</h1></div>
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
        <Redirect exact from="/dashboard/importLayout" to="/dashboard/importLayout/importPage" />
      </Switch>

    </div>
  }
}