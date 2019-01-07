import React, { PureComponent } from 'react';
import { Popover, Button, Checkbox, Row, Col, Select } from 'antd';
// import moment from 'moment';
// import { connect } from 'dva';
import { DataSet } from '@antv/data-set';
import { objByArea, newdatabyDataName, getSelctData, lineData } from '../../utils/Panel';
import styles from '../HomePage/PanelBoard/components/panel.less';

import HistoryDataLineChart from './HistoryDataLineChart';

const Option = Select.Option;

// 多个指标，多个点位
const ContentZb = ({ queryLineData, onCheckAllChange, onChange }) => {
  // const { queryLineData } = queryLineData; // indeterminate, checkAll, plainOptions, checkedList, 
  return (
    <div className={styles.contentWarp}>
      <div style={{ borderBottom: '1px solid #E9E9E9' }}>
        <Checkbox
          indeterminate={queryLineData.indeterminate}
          checked={queryLineData.checkAll}
          onChange={onCheckAllChange}
        >
          {queryLineData.checkAll ? '取消全部' : '查看全部'}
        </Checkbox>
      </div>
      <Checkbox.Group style={{ width: '100%' }} value={queryLineData.checkedList} onChange={onChange}>
        <Row>
          {
            queryLineData.plainOptions.map((item, index) => (
              <Col span={24} key={`plainOptions${index + 1}`}><Checkbox value={item}>{item.slice(item.indexOf('&') + 1)}</Checkbox></Col>
            ))
          }
        </Row>
      </Checkbox.Group>
    </div >
  );
};
const ContentDot = ({ queryLineData, onCheckAllChange, onChange }) => {
  // const { queryLineData } = queryLineData; //targetIndeterminate, targetCheckAll, targetCheckedList, target, 
  return (
    <div className={styles.contentWarp}>
      <div style={{ borderBottom: '1px solid #E9E9E9' }}>
        <Checkbox
          indeterminate={queryLineData.targetIndeterminate}
          checked={queryLineData.targetCheckAll}
          onChange={onCheckAllChange}
        >
          {queryLineData.targetCheckAll ? '取消全部' : '查看全部'}
        </Checkbox>
      </div>
      <Checkbox.Group style={{ width: '100%' }} value={queryLineData.targetCheckedList} onChange={onChange}>
        <Row>
          {
            queryLineData.target.map((item, index) => (
              <Col span={24} key={`target${index + 1}`}><Checkbox value={item}>{item}</Checkbox></Col>
            ))
          }
        </Row>
      </Checkbox.Group>
    </div >
  );
};
// CommonLine
export default class HistoryDataLineControl extends PureComponent {
  handleChange = () => {
    // this.props.dispatch({
    // type: 'homepage/setRefreshTime',
    // payload: this.props.homepage.refreshTime,
    // });
  }
  render() {
    const { list, } = this.props.historyLine;
    const queryLineData = list;

    const newQueryLineData = JSON.parse(JSON.stringify(queryLineData));

    const showLineData = getSelctData({ queryLineData: newQueryLineData }); //获取需要展示的 点位
    const data = objByArea({ dataOll: showLineData });
    const newData = [];
    // 需要展示的指标
    for (const obj of Object.keys(data.target)) {
      if (queryLineData.targetCheckedList && queryLineData.targetCheckedList.indexOf(obj) !== -1) {
        newData.push(data.target[obj]);
      }
    }
    const dataName = newdatabyDataName({ newData });
    // const allDv = [];
    // const ds = new DataSet();
    // for (const item of newData.entries()) {
    //   const dv = ds.createView().source(item[1]);
    //   dv.transform({
    //     type: 'fold',
    //     fields: dataName[item[0]], // 展开字段集
    //     key: 'city', // key字段
    //     value: 'temperature', // value字段
    //   });
    //   allDv.push(dv);
    // }





    return (
      <div>
        <div style={{ float: 'right' }}>
          <Popover
            placement="bottomRight"
            content={
              <ContentDot
                queryLineData={queryLineData}
                onChange={this.props.onChange1}
                onCheckAllChange={this.props.onCheckAllChange1}
              />
            }
            trigger="click"
          >
            <Button size="small" style={{ marginRight: 5 }} >选择指标</Button>
          </Popover>
          <Popover
            placement="bottomRight"
            content={
              <ContentZb
                queryLineData={queryLineData}
                onChange={this.props.onChange}
                onCheckAllChange={this.props.onCheckAllChange}
              />
            }
            trigger="click"
          >
            <Button size="small">选择点位</Button>
          </Popover>
        </div>
        {
          (newData.length === 0) ?
            <div className={styles.noData}>暂无数据</div> : (
              <HistoryDataLineChart
                data={newData[0]}
                targetCheckedList={queryLineData.targetCheckedList}
                mainMap={this.props.mainMap}
                dispatch={this.props.dispatch}
              />
            )
        }
      </div >
    );
  }
}


