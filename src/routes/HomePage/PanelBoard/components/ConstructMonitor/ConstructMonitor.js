import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import TypeByArea from './TypeByArea';
import TypeByJobType from './TypeByJobType';
import TableList from './TableList';
import { searchByAttr } from '../../../../../utils/mapService';
import styles from './constructMonitor.less';

const switchData = (list, type) => {
  const data = [];
  switch (type) {
    // 按照装置分类
    case 0:
      for (const item of list) {
        const { org, count } = item;
        const { orgName, gisCode } = org;
        data.push({
          orgName,
          gisCode,
          count,
        });
      }
      break;
    case 1: // 按照作业类型分类
      for (const item of list) {
        const index = data.findIndex(value => value.jobType === item.jobType);
        if (index === -1) {
          data.push({
            jobType: item.jobType,
            count: 1,
          });
        } else {
          data[index].count += 1;
        }
      }
      break;
    default: break;
  }
  return data;
};
// 当天的时间范围
const today = new Date().toLocaleDateString();
const start = new Date(today).getTime();
const param = 24 * 60 * 60 * 1000 - 1;
const end = start + param;
const range = { start, end };
@connect(({ constructMonitor, map }) => {
  return {
    groupingList: constructMonitor.groupingList,
    list: constructMonitor.list,
    view: map.mapView,
  };
})
export default class ConstructMonitor extends PureComponent {
  state = {
    list: [],
    groupingList: [],
    // range: { start, end },
  };
  componentDidMount() {
    this.props.dispatch({
      type: 'constructMonitor/fetchConstructMonitorList',
    }).then(() => {
      const { list, groupingList } = this.state;
      this.handleChange(moment(range.start), 'start', list, groupingList);
      this.handleChange(moment(range.end), 'end', list, groupingList);
    });
  }
  getComponent = (type, list, groupingList) => {
    const { dispatch } = this.props;
    const orgData = switchData(groupingList, 0);
    const jobTypeData = switchData(list, 1);
    const noData = '暂无数据';
    switch (type) {
      case 'table':
        return orgData.length > 0 ? <TableList data={groupingList} dispatch={dispatch} list={list} /> : <div style={{ marginTop: 20 }}>{noData}</div>;
      case 'bar':
        return orgData.length > 0 ? <TypeByArea data={orgData} dispatch={dispatch} list={groupingList} /> : <div style={{ marginTop: 20 }}>{noData}</div>;
      case 'bar1':
        return jobTypeData.length > 0 ? <TypeByJobType data={jobTypeData} dispatch={dispatch} /> : <div style={{ marginTop: 20 }}>{noData}</div>;
      default:
        return orgData.length > 0 ? <TypeByArea data={orgData} dispatch={dispatch} list={groupingList} /> : <div style={{ marginTop: 20 }}>{noData}</div>;
    }
  };
  handleClick = (ev) => {
    const { view, dispatch, list } = this.props;
    const items = this.chart.getTooltipItems({ x: ev.x, y: ev.y });
    if (items.length > 0) {
      const searchText = items[0].point._origin.areaId;
      searchByAttr({ searchText, searchFields: ['ObjCode'] }).then(
        (res) => {
          if (res.length > 0) {
            const item = list.find(value => value.area.areaId === searchText);
            const keys = []; // map 循环时用的key
            for (const data of item.data) {
              keys.push(String(data.jobMonitorID));
            }
            view.goTo({ extent: res[0].feature.geometry.extent.expand(1.2) }).then(() => {
              // 作业监控 单独处理
              dispatch({
                type: 'resourceTree/saveCtrlResourceType',
                payload: 'constructMonitor',
              });
              dispatch({
                type: 'constructMonitor/queryMapSelectedList',
                payload: { list: item.data, area: item.area, keys },
              });
            });
          }
        }
      );
    }
  };
  handleChange = (date, type) => {
    const { list, groupingList } = this.props;
    const newGroupingList = JSON.parse(JSON.stringify(groupingList));
    switch (type) {
      case 'start':
        range[type] = Number(date.startOf('day').format('x'));
        break;
      case 'end':
        range[type] = Number(date.startOf('day').format('x')) + param;
        break;
      default: break;
    }
    const newList = list.filter(value =>
      Number(value.startTime) < range.end && Number(value.endTime) > range.start
    );
    for (const item of newGroupingList) {
      item.data = item.data.filter(value =>
        Number(value.startTime) < range.end && Number(value.endTime) > range.start
      );
    }
    const array = newGroupingList.filter(value => value.data.length > 0);
    this.setState({
      list,
      groupingList,
    });
  };
  disabledStartDate = (startValue) => {
    return startValue.valueOf() > range.end;
  }
  disabledEndDate = (endValue) => {
    return endValue.valueOf() <= range.start;
  }
  render() {
    const { type, list, groupingList } = this.props;
    // const { list, groupingList } = this.state;
    const title = () => {
      switch (type) {
        case 'bar': return '作业监控看板（装置区域）';
        case 'bar1': return '作业监控看板（作业类型）';
        case 'table': return '作业监控看板（列表）';
        default: return '作业监控看板（装置区域）';
      }
    };
    // this.switchList(list, groupingList, range);
    return (
      <div style={{ textAlign: 'center' }}>
        <h2  className={styles.titleH2}>{title()}</h2>
        {/* 筛选：<DatePicker disabledDate={this.disabledStartDate} onChange={(date) => { this.handleChange(date, 'start', list, groupingList); }} value={moment(range.start)} /> */}
        {/* ~ */}
        {/* <DatePicker disabledDate={this.disabledEndDate} value={moment(range.end)} onChange={(date) => { this.handleChange(date, 'end', list, groupingList); }} style={{ marginBottom: 20 }} /> */}
        { this.getComponent(type, list, groupingList)}
      </div>
    );
  }
}
