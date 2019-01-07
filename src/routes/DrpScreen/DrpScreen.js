import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Scrollbars from 'react-custom-scrollbars';
import moment from 'moment';
import { Table, Card, Row, Col } from 'antd';
import Progress from '../../components/Progress/Progress';
import { getBrowserStyle } from '../../utils/utils';
import logo from '../../assets/logo.png';
import styles from './index.less';

let timerId;
const { Grid } = Card;
const scrolling = (dom, progress, scrollTop) => {
  progress += 50;
  dom.scrollTop(progress);
  if (dom.getScrollTop() === scrollTop) {
    progress = 0;
    scrollTop = 0;
  } else {
    scrollTop = dom.getScrollTop();
  }
  return { progress, scrollTop };
};

@connect(({ userList, typeCode, organization, productionDaily }) => ({
  userList,
  typeCode,
  organization,
  deviceProduction: productionDaily.deviceProduction,
  thermoelectricFurnace: productionDaily.thermoelectricFurnace,
  dynamotor: productionDaily.dynamotor,
  crackingFurnace: productionDaily.crackingFurnace,
  timeUsePre: productionDaily.timeUsePre,
}))
export default class EquipmentProductInfo extends PureComponent {
    state = {
      data: [],
    };
    componentDidMount() {
      const { dispatch } = this.props;
      // 时间进度
      dispatch({
        type: 'productionDaily/getTimeUsePre',
      });
      //  请求热电炉运行情况
      dispatch({
        type: 'productionDaily/getThermoelectricFurnace',
      });
      //  请求发电机运行情况
      dispatch({
        type: 'productionDaily/getDynamotor',
      });
      //  热电炉运行情况
      dispatch({
        type: 'productionDaily/getCrackingFurnace',
      });
      // 请求装置生产情况
      dispatch({
        type: 'productionDaily/getDeviceProduction',
      }).then(() => {
        this.getEquipmentList(this.props.deviceProduction);
        this.dealData(this.props.deviceProduction);
        // 自动滚动
        let progress = 0;
        let scrollTop = 0;
        const progress1 = 0;
        const scrollTop1 = 0;
        timerId = setInterval(() => {
          // const obj = scrolling(this.scrollLeft, progress, scrollTop);
          // progress = obj.progress; scrollTop = obj.scrollTop;
          // const obj1 = scrolling(this.scrollRight, progress1, scrollTop1);
          // progress1 = obj1.progress; scrollTop1 = obj1.scrollTop;
        }, 50000);
      });
    }
    // 获取所有装置
    getEquipmentList = (data) => {
      const arr = [];
      data.forEach((obj) => {
        if (!arr.filter(item => item.equipmentName === obj.equipmentName).length > 0) {
          arr.push(obj);
        }
      });
    };
    // 处理行合并

    dealData = (data) => {
      const arr = [];
      data.forEach((obj) => {
        // 装置合并行rowSpan
        if (arr.filter(item => item.equipmentName === obj.equipmentName).length > 0) {
          obj.equipmentRowSpan = 0;
        } else {
          const a = data.filter(equip => equip.equipmentName === obj.equipmentName);
          obj.equipmentRowSpan = a.length;
        }
        // 合并投入产出行
        if (arr.filter(item => item.equipmentName === obj.equipmentName && item.inOutType === obj.inOutType).length > 0) {
          obj.inOutTypeRowSpan = 0;
        } else {
          obj.inOutTypeRowSpan = data.filter(equip => equip.equipmentName === obj.equipmentName && equip.inOutType === obj.inOutType).length;
        }
        arr.push(obj);
      });
      this.setState({
        data: arr,
      });
    };
    render() {
      const { winHeight } = getBrowserStyle();
      const height = winHeight - 190;
      const titles = [
        '各装置生产情况',
        '裂解炉、热电锅炉及发电机运行状况',
      ];
      const title = (
        <div>
          <div className={styles.title}>
            <img src={logo} alt="logo" />
            <h2 >中  韩  石  化  生  产  日  报</h2>
          </div>
          <div>
            <span>{`制表日期：${moment().format('LL')}  `}</span>
            <span>{`  时间进度：${this.props.timeUsePre}%`}</span>
          </div>
        </div>
      );
      const gridStyle = {
        width: '50%',
        textAlign: 'center',
      };
      const cols = [
        {
          title: '装置',
          dataIndex: 'equipmentName',
          render: (value, row) => {
            const obj = {
              children: value,
              props: {},
            };
            obj.props.rowSpan = row.equipmentRowSpan;
            return obj;
          },
        },
        {
          title: '投入/产出',
          dataIndex: 'inOutType',
          render: (value, row) => {
            const obj = {
              children: value,
              props: {},
            };
            obj.props.rowSpan = row.inOutTypeRowSpan;
            return obj;
          },
        },
        { title: '物料',
          dataIndex: 'rawName',
        },
        { title: '月计划', dataIndex: 'monthPlan' },
        { title: '日完成', dataIndex: 'dayOver' },
        { title: '月完成', dataIndex: 'monthOver' },
        { title: '收率 %',
          dataIndex: 'yieldPre',
          render: (text) => {
            return text || '/';
          },
        },
        { title: '月进度',
          dataIndex: 'monthPre',
          render: (text, record) => {
            return text === null ?
              text : (
                <Row gutter={16}>
                  <Col span={Number(text) > 120 ? 24 : 12}>
                    <Progress percent={Number(text)} bgColor={record.inOutType === '投入' ? '#246CB3' : '#987F1E'} progressColor={record.inOutType === '投入' ? '#31A1FD' : '#FEC500'} />
                  </Col>
                  <Col span={Number(text) > 120 ? 24 : 12}>
                    <span style={{ color: this.props.timeUsePre < text ? '' : 'red' }}>{`${text} %`}</span>
                  </Col>
                </Row>
              );
          },
        },
      ];
      const dissociationInfoCols = [
        {
          title: '炉号',
          dataIndex: 'dissociationName',
          width: '10%',
        }, {
          title: '原料',
          dataIndex: 'rawName',
          width: '20%',
        }, {
          title: '天数',
          dataIndex: 'dayCount',
          width: '10%',
        }, {
          title: 'COT（℃）',
          dataIndex: 'cOT',
          width: '20%',
        }, {
          title: '负荷（t/h）',
          dataIndex: 'loadValue',
        },
      ];
      const hotFurnaceInfoCols = [
        {
          title: '炉号',
          dataIndex: 'hotFurnaceName',
          width: '10%',
        }, {
          title: '运行天数',
          dataIndex: 'runDay',
          width: '15%',
        }, {
          title: '产汽量（t/h）',
          dataIndex: 'gasCount',
          width: '15%',
        }, {
          title: '主汽温度（℃）',
          dataIndex: 'mainTemperature',
          width: '15%',
        },
      ];
      const alterCols = [
        {
          title: '发电机名称',
          dataIndex: 'alternatorInfoName',
          width: '15%',
        }, {
          title: '运行天数',
          dataIndex: 'runDay',
          width: '10%',
        }, {
          title: '进汽量（t/h）',
          dataIndex: 'inGasCount',
          width: '15%',
        }, {
          title: '发电量（MW）',
          dataIndex: 'electricityCount',
          width: '15%',
        },
      ];
      return (
        <div className={styles.warp} style={{ height: winHeight }}>
          <Card title={title}>
            {/*<Grid style={gridStyle}>*/}
              <div className={styles.tableTtitle}>{titles[0]}</div>
              <Scrollbars style={{ height }} ref={(ref) => { this.scrollLeft = ref; }}>
                <div className={styles.bordered}>


                <Table
                  dataSource={this.state.data}
                  rowClassName={(record, index) => {
                      return record.inOutType === '投入' ? index % 2 === 0 ? styles.blueRow : styles.blue : index % 2 === 0 ? styles.grayRow : styles.gray;
                  }}
                  columns={cols}
                  pagination={false}
                  bordered
                />
                </div>
              </Scrollbars>
            {/*</Grid>*/}
            {/*<Grid style={gridStyle}>*/}
              {/*<h3>{titles[1]}</h3>*/}
              {/*<Scrollbars style={{ height }} ref={(ref) => { this.scrollRight = ref; }}>*/}
                {/*<Table*/}
                  {/*dataSource={this.props.crackingFurnace}*/}
                  {/*columns={dissociationInfoCols}*/}
                  {/*rowKey={record => record.issociationInfoID}*/}
                  {/*pagination={false}*/}
                  {/*bordered*/}
                {/*/>*/}
                {/*<Row>*/}
                  {/*<Col span={12}>*/}
                    {/*<Table*/}
                      {/*dataSource={this.props.thermoelectricFurnace}*/}
                      {/*columns={hotFurnaceInfoCols}*/}
                      {/*rowKey={record => record.hotFurnaceInfoID}*/}
                      {/*pagination={false}*/}
                      {/*bordered*/}
                    {/*/>*/}
                  {/*</Col>*/}
                  {/*<Col span={12}>*/}
                    {/*<Table*/}
                      {/*onRow={(record) => {*/}
                                  {/*return {*/}
                                      {/*onClick: () => this.rawClick(record),*/}
                                  {/*};*/}
                              {/*}}*/}
                      {/*dataSource={this.props.dynamotor}*/}
                      {/*columns={alterCols}*/}
                      {/*rowKey={record => record.alternatorInfoID}*/}
                      {/*pagination={false}*/}
                      {/*bordered*/}
                    {/*/>*/}
                  {/*</Col>*/}
                {/*</Row>*/}
              {/*</Scrollbars>*/}

            {/*</Grid>*/}
          </Card>
        </div>
      );
    }
}
