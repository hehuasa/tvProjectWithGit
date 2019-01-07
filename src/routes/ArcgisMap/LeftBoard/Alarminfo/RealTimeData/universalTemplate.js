import React, { PureComponent } from 'react';
import { Row, Col, Radio, Collapse, Table, Button, Spin } from 'antd';
import moment from 'moment';
import styles from '../index.less';
import DashBordColor from '../../DashBordColor/index';
import { constantlyConditionCalc } from '../../../../../services/constantlyModal';

const getArc = (data, dataType, colorObj) => {
  const obj = { data: [] };
  const nums = [];
  if (constantlyConditionCalc[dataType]) {
    obj.minValue = constantlyConditionCalc[dataType].minValue;
    obj.maxValue = constantlyConditionCalc[dataType].maxValue;
    obj.data = constantlyConditionCalc[dataType].conditionCalc;
  }
  for (const calc of obj.data) {
    for (const item of calc.range) {
      nums.push(Number(item.start), Number(item.end));
    }
    calc.color = colorObj[Number(calc.type.level)];
  }
  nums.sort((a, b) => {
    return a - b;
  });
  obj.start = nums[0];
  obj.end = nums[nums.length - 1];
  return obj;
};
const getRange = (arcs) => {
  const obj = {};
  if (arcs.minValue === undefined) {
    return obj;
  }
  if (arcs.minValue === arcs.start) {
    obj.start = arcs.data[0].range[0].end;
    obj.end = arcs.data[1] ? arcs.data[1].range[0].start : arcs.maxValue;
  } else {
    obj.start = arcs.minValue;
    obj.end = arcs.start;
  }
  return obj;
};
const columnsCalc = [
  {
    title: '阈值名称',
    dataIndex: 'type',
    key: 'type',
    render: (obj) => {
      return obj.name;
    },
  },
  {
    title: '起',
    dataIndex: 'range',
    key: 'start',
    render: (obj) => {
      return obj[0].start;
    },
  }, {
    title: '止',
    dataIndex: 'range',
    key: 'end',
    render: (obj) => {
      return obj[0].end;
    },
  }];

const { Panel } = Collapse;
const ButtonGroup = Button.Group;
const colorObj = {
  0: '#51bc65',
  1: '#2f9ef4',
  2: '#fbbf30',
  3: '#fd5658',
  4: '#fe0102',
  5: '#820000',
};
export default class Environment extends PureComponent {
  state = {
    evrMode: true,
  };
  // 调用相应的阈值，生成图标的线条线段坐标

  handleEvrModeChange = (e) => {
    const evrMode = e.target.value;
    this.setState({ evrMode });
  };
  render() {
    const { data, showDashBoard } = this.props;
    const expandKeys = [];
    for (const item of data) {
      expandKeys.push(item.meterUnit);
    }
    const bool = Object.prototype.toString.call(data) === '[object Array]';
    if (bool) {
      data.map((item, index) => {
        item.key = index;
        return item;
      });
    }
    const { evrMode } = this.state;
    // 气体点位 实时数据表头
    const columns = [
      {
        title: '点位编码',
        dataIndex: 'dataCode',
        key: 'dataCode',
        width: 100,
      }, {
        title: '监测因子',
        dataIndex: 'dataCode',
        key: 'dataTypeName',
        width: 100,
      }, {
        title: '实测值',
        dataIndex: 'dataCode',
        key: 'value',
        width: 100,
      }, {
        title: '采集时间',
        dataIndex: 'dataCode',
        key: 'collectTime',
        width: 160,
        render: (text) => {
          return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '';
        },
      }];
    // 仪表盘刻度范围与刻度值
    const cols = {
      value: {
        min: 0,
        max: 100,
        tickInterval: 10,
        nice: false,
      },
    };
    return (
      bool ? (
        <div>
          { showDashBoard ? (
            <div>
              <Radio.Group onChange={this.handleEvrModeChange} value={evrMode} size="small" style={{ marginBottom: 8 }}>
                <Radio.Button value>实时数据</Radio.Button>
                <Radio.Button value={false}>仪表盘</Radio.Button>
              </Radio.Group>
              {evrMode ? (
                <Collapse bordered={false} defaultActiveKey={expandKeys}>
                  { data.map((item) => {
                      const Arcs = getArc(data, item.dataType, colorObj);
                      const range = getRange(Arcs);
                  return (
                    <Panel key={item.meterUnit} header={<div className={styles.panelHeader}>{item.dataTypeName}</div>}>
                      <Row type="flex">
                        <Col span={8}>监测因子：</Col><Col span={16}>{item.dataTypeName}</Col>
                        <Col span={8}>实测值：</Col><Col span={16}>{ range.start !== undefined ? Number(item.value) < range.start || Number(item.value) > range.end ? <span style={{ color: 'red' }}>{`${item.value}(${item.meterUnit})`}</span> : <span>{`${item.value}(${item.meterUnit})`}</span> : <span>{`${item.value}(${item.meterUnit})`}</span>}</Col>
                        <Col span={8}>采集时间：</Col><Col span={16}>{moment(item.collectTime).format('YYYY-MM-DD HH:mm:ss')}</Col>
                        <Col span={8}>正常指标：</Col><Col span={16}>{range.start !== undefined ? `${range.start}${item.meterUnit !== '' ? '(' : ''}${item.meterUnit}${item.meterUnit !== '' ? ')' : ''} - ${range.end}${item.meterUnit !== '' ? '(' : ''}${item.meterUnit}${item.meterUnit !== '' ? ')' : ''}` : <Spin />}</Col>
                      </Row>
                      {/* <div className={styles.calc}> */}
                      {/* <h3>设备监测阈值</h3> */}
                      {/* <ul> */}
                      {/* <li><span>阈值名称</span><span>起</span><span>止</span></li> */}
                      {/* { */}
                      {/* constantlyConditionCalc[item.dataType] ? constantlyConditionCalc[item.dataType].conditionCalc ? constantlyConditionCalc[item.dataType].conditionCalc.map((calc) => { */}
                      {/* return (<li key={Math.random() * new Date().getTime()}><span>{calc.type.name}</span><span>{calc.range[0].start}</span><span>{calc.range[0].end}</span></li>); */}
                      {/* }) : null : null */}
                      {/* } */}
                      {/* </ul> */}
                      {/* </div> */}
                      {/* { constantlyConditionCalc[item.dataType] ? constantlyConditionCalc[item.dataType].conditionCalc ? */}
                      {/* <Table dataSource={constantlyConditionCalc[item.dataType].conditionCalc} columns={columnsCalc}  pagination={false} size="small"  /> : null : null } */}
                    </Panel>
                  );
                })}
                </Collapse>
              ) : (
                <div style={{ zIndex: -1 }}>
                  <Row>
                    { data.map((item) => {
                      console.log('item', item);
                    const value = [{ value: Number(Number(item.value).toFixed(2)) }];
                    //     const value = [{ value: parseFloat(item.value, 0) }];
                        const Arcs = getArc(data, item.dataType, colorObj);
                    return (
                      <Col span={24} key={(Math.random() * 100).toString() + Date.now().toString()}>
                        <DashBordColor bordValue={value} cols={cols} dataType={item.dataType} dataTypeName={item.dataTypeName} meterUnit={item.meterUnit} datas={data} colorObj={colorObj} Arcs={Arcs} />
                      </Col>
                    );
                  })
                  }
                  </Row>
                </div>
            )}
            </div>
        ) : (
          <Table
            size="small"
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 500, y: 180 }}
          />
          )
        }
        </div>
      ) : null
    );
  }
}
