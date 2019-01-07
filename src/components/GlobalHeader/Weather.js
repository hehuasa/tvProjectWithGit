import React, { PureComponent } from 'react';

import { connect } from 'dva';
import { Popover, Row, Col, Icon, Divider } from 'antd';

import styles from './index.less';
import weatherIcon25 from '../../assets/header/weatherIcon_25.jpg';
import weatherIcon27 from '../../assets/header/weatherIcon_27.png';


const Content = ({ weather }) => {
  const test = () => {
    window.open('http://www.baidu.com');
  };
  return (
    <div style={{ width: 200 }}>
      <div className={styles.weatherBack}>
        <div> {weather.weather.temperature ? weather.weather.temperature.substring(0, weather.weather.temperature.length - 2) : weather.weather.temperature}<i>°C</i></div>
        <span>{weather.weather ? weather.weather.weather : null}</span>
      </div>
      <Divider className={styles.weatherLine} />
      <Row>
        <Col span={8}>
          <div className={styles.weatherTitle}>湿度：</div>
        </Col>
        <Col span={16}>
          <div className={styles.weatherContent}>{`${weather.weather.humidity} %`}</div>
        </Col>
      </Row>
      <Row>
        <Col span={8}>
          <div className={styles.weatherTitle}>风速：</div>
        </Col>
        <Col span={16}>
          <div className={styles.weatherContent}>{weather.weather.windSpeed}</div>
        </Col>
      </Row>
      <Row>
        <Col span={8}>
          <div className={styles.weatherTitle}>气压：</div>
        </Col>
        <Col span={16}>
          <div className={styles.weatherContent}>{`${Math.ceil(weather.weather.pressure)} 百帕`}</div>
        </Col>
      </Row>
      <Row>
        <Col span={8}>
          <div className={styles.weatherTitle}>水位：</div>
        </Col>
        <Col span={16}>
          <div className={styles.weatherContent}>{weather.hydropower.waterLevel}m</div>
        </Col>
      </Row>
      {/* <Row> */}
      {/* <Col span={8}> */}
      {/* <div className={styles.weatherTitle}>流量：</div> */}
      {/* </Col> */}
      {/* <Col span={16}> */}
      {/* <div className={styles.weatherContent}>{weather.hydropower.currentSpeed}m<sup>3</sup>/s</div> */}
      {/* </Col> */}
      {/* </Row> */}
      <Divider className={styles.weatherLine} />
      <div className={styles.weatherFooter} >
        {/* 数据来源于： <a href="http://www.cjh.com.cn" title="长江水文网" target="_blank"><img src={weatherIcon25} alt="长江水文网" /></a>-*/}
        {/* <a href="http://www.cma.gov.cn/2011qxfw/2011qtqyb/" title="中国气象" target="_blank"><img src={weatherIcon27} alt="中国气象" /></a> */}
        数据来源于： <span><img src={weatherIcon25} alt="长江水文网" /></span>-
        <span><img src={weatherIcon27} alt="中国气象" /></span>
      </div>
    </div>
  );
};

@connect(({ user, global, loading, tabs }) => {
  return ({
    user, global, loading, tabs,
  });
})

export default class Weather extends PureComponent {
  constructor() {
    super();
    this.state = {
      visible: false,
    };
    this.handleVisible = (visible) => {
      this.setState({ visible });
    };
  }

  componentDidMount() {
    this.timerQueryWeather();
    setInterval(() => {
      this.timerQueryWeather();
    }, 7200000);
  }

  timerQueryWeather() {
    this.props.dispatch({
      type: 'global/queryWeather',
    });
  }

  render() {
    const { weather } = this.props.global;
    return (
      <Popover placement="bottom" content={<Content weather={weather} />} onVisibleChange={this.handleVisible}>
        <span className={styles.showBack}>
          <span className={this.state.visible ? styles.open : ''} style={{ position: 'relative' }}>
            <span className={styles.weather}>
              {weather.weather.weather ? <span style={{ marginRight: 8 }}>{weather.weather.weather}</span> : null }
              {weather.weather.temperature ? weather.weather.temperature.substring(0, weather.weather.temperature.length - 2) : weather.weather.temperature}{weather.weather.temperature ? '°C' : null}
              {' '}{weather.weather && weather.weather.windDrection ? '/' : null}{' '}
              {weather.weather ? weather.weather.windDrection : null}
              {' '}{weather.hydropower.waterLevel ? '/' : null}{' '}
              {weather.hydropower.waterLevel}{weather.hydropower.waterLevel ? 'm' : null}
            </span>
            <i className={styles.arrow} />
          </span>
        </span>
      </Popover>
    );
  }
}
