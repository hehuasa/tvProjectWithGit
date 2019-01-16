import React, { PureComponent } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { Col, Spin, Icon } from 'antd';
import styles from './index.less';
import { constantlyModal } from '../../../services/constantlyModal';

let timer; // 定时器id
export default class DeviceMonitor extends PureComponent {
  state = {
    data: [],
  };
  componentDidMount() {
    const { deviceMonitor, dispatch, currentFlows } = this.props;
    const { Monitors } = deviceMonitor;
    const options = [];
    for (const flow of currentFlows.data) {
      options.push(flow);
    }
    let index = 0;
    const datas = [];
    for (const Monitor of Monitors) {
      const { ctrlResourceType, resourceID } = Monitor;
      const cache = options.find(value => Number(value.resourceID) === Number(resourceID));
      if (!cache) {
        return false;
      }
      const option = JSON.parse(cache.graphicsContent);
      dispatch({
        type: 'constantlyData/getDeviceMonitorData',
        payload: { ctrlResourceType, selectRunDay: option.selectRunDay },
      }).then(() => {
        index += 1;
        datas.push(...this.getData(ctrlResourceType, option));
      });
    }
    const a = setInterval(() => {
      if (index === Monitors.length) {
        clearInterval(a);
        this.setState({ data: datas });
      }
    }, 500);
    timer = setInterval(() => {
      let index1 = 0;
      const datas1 = [];
      for (const Monitor of Monitors) {
        const { ctrlResourceType, resourceID } = Monitor;
        const cache = options.find(value => Number(value.resourceID) === Number(resourceID));
        if (!cache) {
          return false;
        }
        const option = JSON.parse(cache.graphicsContent);
        dispatch({
          type: 'constantlyData/getDeviceMonitorData',
          payload: { ctrlResourceType, selectRunDay: option.selectRunDay },
        }).then(() => {
          index1 += 1;
          datas1.push(...this.getData(ctrlResourceType, option));
        });
      }
      const b = setInterval(() => {
        if (index1 === Monitors.length) {
          clearInterval(b);
          this.setState({ data: datas1 });
        }
      }, 500);
    }, 30000);
  }
  componentWillUnmount() {
    clearInterval(timer);
  }
  getData = (ctrlResourceType, option) => {
    if (constantlyModal[ctrlResourceType]) {
      const { data, runDayData } = constantlyModal[ctrlResourceType];
      // 按照炉号（datacode）分组
      const array = [];
      for (const item of data) {
        // 判断新增还是push
        const index = array.findIndex(value => value.processNumber === item.resResourceInfo.processNumber);
        // item.dataTypeName 为undefined是没取到实时数据，但是需要把炉子展示出来
        if (!item.dataTypeName) {
          if (index === -1) {
            const obj = {};
            obj.processNumber = item.resResourceInfo.processNumber;
            obj.sort = Number(item.resResourceInfo.resourceCode);
            array.push(obj);
          }
        }
        for (const [key, value] of Object.entries(option.quotas)) {
          if (value === item.dataTypeName) {
            if (index === -1) {
              const obj = {};
              obj[key] = { value: item.value || '', meterUnit: item.meterUnit || '', dataTypeName: item.dataTypeName || '' };
              obj.processNumber = item.resResourceInfo.processNumber;
              obj.sort = Number(item.resResourceInfo.resourceCode);
              array.push(obj);
            } else {
              array[index][key] = { value: item.value || '', meterUnit: item.meterUnit || '', dataTypeName: item.dataTypeName || '' };
              array[index][key].processNumber = item.resResourceInfo.processNumber;
              array[index][key].sort = Number(item.resResourceInfo.resourceCode);
            }
          }
        }
      }
      for (const item of array) {
        const runDay = runDayData.find(value => value.dissociationName === item.processNumber);
        if (runDay) {
          item.dayCount = runDay.dayCount;
          item.rawName = runDay.rawName;
        }
      }
      array.sort((a, b) => {
        return a.sort - b.sort;
      });
      this.setState({ data: array });
      return array;
    }
  };
  handleClose = () => {
    const { ztreeObj, currentFlow } = this.props;
    const node = ztreeObj.getNodeByTId(currentFlow.treeNode.tId);
    ztreeObj.selectNode(node);
  }
  render() {
    const { mapHeight, deviceMonitor } = this.props;
    const { data } = this.state;
    return (
      <div className={styles.warp}>
        <Scrollbars style={{ height: mapHeight }} className={styles.scrollbarsStyle}>
          <div className={styles.deviceType}>{deviceMonitor.devicesName}</div>
          <div className={styles.close} onClick={this.handleClose}>
            <Icon type="close" style={{ fontSize: 20, fontWeight: 800 }} />
          </div>
          <div className={styles.cardWarp}>
            {data && data.length > 0 ? data.map(item => (
              // <Col xs={12} sm={21} md={12} lg={12} xl={12} xxl={8} style={{ textAlign: 'center' }} key={Math.random() * new Date().getTime()}>
              <div className={styles.rows} key={Math.random() * new Date().getTime()}>
                <div className={styles.card} key={item.processNumber}>
                  <div className={styles.title}>
                    <span className={styles.left}>{item.processNumber}</span> {item.dayCount ? <span className={styles.right}>运行天数：{item.dayCount ? item.dayCount : ''}</span> : null}
                  </div>
                  <div className={styles.text}>
                    {item[0] ? (
                      <div className={item[1] ? styles.quota2 : styles.quota1}>
                        <div className={styles.value}>{item[0].dataTypeName.indexOf('产气量') !== -1 ? parseFloat(Number(item[0].value / 10000).toFixed(2)) : parseFloat(Number(item[0].value).toFixed(2))} </div>
                        <div className={styles.units}> {`${item[0].dataTypeName}(${item[0].meterUnit})`}</div>
                      </div>) : null }
                    { item[1] ? (
                      <div className={styles.quota2}>
                        <div className={styles.value}>{parseFloat(Number(item[1].value).toFixed(2))} </div>
                        <div className={styles.units}> {`${item[1].dataTypeName}(${item[1].meterUnit})`}</div>
                      </div>
) : null
                  }
                  </div>
                  {item.processNumber.indexOf('锅炉') === -1 ? (
                    <div className={styles.name}>
                      物料名称：  {item.rawName ? item.rawName : ''}
                    </div>
                  ) : null}
                  <div className={styles.circle}>
                    <div className={styles.content}>
                      {
                        item[2] ? <div className={styles.quota3}>{item[2].dataTypeName.indexOf('运行负荷') !== -1 ? parseFloat(Number(item[2].value / 1000).toFixed(2)) : item[2].dataTypeName.indexOf('进气量') !== -1 ? parseFloat(Number(item[2].value / 10000).toFixed(2)) : parseFloat(Number(item[2].value).toFixed(2))}</div> : ''
                      }
                      {
                        item[2] ? <span className={styles.units}>{`${item[2].dataTypeName}(${item[2].meterUnit})`}</span> : ''
                      }

                    </div>
                  </div>
                </div>
              </div>
            )) : <Spin size="large" />}
          </div>
        </Scrollbars>
      </div>
    );
  }
}
               // 178 </Col>
