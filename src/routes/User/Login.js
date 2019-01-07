import React, { Component } from 'react';
import { connect } from 'dva';
// import $ from 'jquery';
import { Alert, Modal } from 'antd';
import MD5 from 'crypto-js/md5';
import Login from '../../components/Login';
import styles from './Login.less';
import { switchCode } from '../../services/statusCode';
import VideoSocket from '../Websocket/VideoSocket';

const { UserName, Password, Submit } = Login;
const jsEncrypt = new window.JSEncrypt();
@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
export default class LoginPage extends Component {
  state = {
    type: 'account',
    visible: false,
  };
  componentDidMount() {
    // 请求公钥
    // $.ajax('/local/getPubKey').then((pubKey) => {
    //   jsEncrypt.setPublicKey(pubKey);
    // const obj = {
    //   login: 'admin',
    //   password: jsEncrypt.encrypt('admin123321'),
    // };
    // console.log('obj', obj);
    // $.post('/local/login', obj).then((res1) => {
    //   console.log('res1', res1);
    // });
    // });
  }
  // 处理视频插件的通讯
  onmessage1 = ({ data }) => {
    const { dispatch } = this.props;
    if (data === 'Avengers') {
      dispatch({
        type: 'video/getLoaded',
        payload: true,
      });
    }
  };
  handleSubmit = (err, values) => {
    this.props.dispatch({
      type: 'login/getPublicKey',
    }).then(() => {
      jsEncrypt.setPublicKey(this.props.login.pubKey);
      values.password = jsEncrypt.encrypt(values.password);
    //   values.password = MD5(values.password).toString();
      if (!err) {
        this.props.dispatch({
          type: 'login/login',
          payload: {
            ...values,
          },
        }).then(() => {
          if (this.props.login.code !== '1001') {
            this.setState({
              visible: true,
            });
          }
          if (Number(this.props.login.code) === 1005) {
            const { setFieldsValue } = this.login.props.form;
            setFieldsValue({ password: "" });
          }
        });
      }
    });
  };
close = () => {
  this.setState({
    visible: false,
  });
};
  renderMessage = (content) => {
    return (
      <Alert style={{ marginBottom: 24 }} message={content} closable onClose={this.close} type="error" showIcon />
    );
  };

  render() {
    const { login, submitting } = this.props;
    const msg = switchCode(login.code);
    const { type } = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          wrappedComponentRef={(ref) => {this.login = ref}}
        >

          <VideoSocket onmessage={this.onmessage1} />
          <div key="account">
            <div className={styles.loginTitle}>用户登录</div>
            <UserName name="login" placeholder="请输入用户名" onChange={this.close} />
            <Password name="password" placeholder="请输入密码" onChange={this.close} />
          </div>
          <div />
          <Submit loading={submitting}>登录</Submit>
          {
            login.code !== undefined &&
            login.code !== '' &&
            login.code !== 1001 &&
            !login.submitting &&
            this.state.visible &&
            this.renderMessage(msg)
          }
        </Login>
      </div>
    );
  }
}
