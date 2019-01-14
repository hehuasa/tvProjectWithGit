import React, { PureComponent } from 'react';
import { Table } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { searchByAttr, hoveringAlarm } from '../../../../../utils/mapService';
import styles from '../panel.less';
import { mapConstants } from '../../../../../services/mapConstant';

const columns = [
  {
    title: '事发位置',
    dataIndex: 'alarmExtendAlarmInfoVO',
    className: styles.cursorStyle,
    key: 'alarmExtendAlarmInfoVO',
    width: 60,
    render: (val, record) => {
      return val ? val.place : record.areaName;
    },
  },
  {
    title: '报警类型',
    dataIndex: 'alarmType.alarmTypeName',
    className: styles.cursorStyle,
    key: 'alarmType',
    width: 60,
  },
  {
    title: '首报时间',
    dataIndex: 'receiveTime',
    className: styles.cursorStyle,
    key: 'receiveTime',
    width: 80,
    defaultSortOrder: 'descend',
    sorter: (a, b) => {
      return Number(a.receiveTime) - Number(b.receiveTime);
    },
    render: (val) => {
      if (!val) {
        return '';
      }
      return <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>;
    },
  },
  {
    title: '报警点位名称',
    dataIndex: 'resourceName',
    key: 'resourceName',
    width: 60,
  }];

@connect(({ alarm, map, alarmDeal, mapRelation }) => {
  return {
    list: JSON.parse(JSON.stringify(alarm.list)),
    iconArray: alarm.iconArray,
    alarmDeal,
    infoPops: mapRelation.infoPops,
    alarmIconData: mapRelation.alarmIconData,
  };
})
export default class AlarmListByFault extends PureComponent {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick = (record) => {
    const { dispatch, infoPops, alarmIconData } = this.props;
    const { view, popupScale } = mapConstants;
    dispatch({
      type: 'resourceTree/saveClickedAlarmId',
      payload: record.alarmId,
    });
    if (record.resourceGisCode) {
      searchByAttr({ searchText: record.resourceGisCode, searchFields: ['ObjCode'] }).then(
        (res) => {
          if (res.length > 0) {
            view.goTo({ center: res[0].feature.geometry, scale: popupScale }).then(() => {
              const screenPoint = view.toScreen(res[0].feature.geometry);
              const iconIndex = alarmIconData.findIndex(value => value.alarm.alarmCode === record.alarmCode);
              hoveringAlarm({ geometry: res[0].feature.geometry, alarm: record, dispatch, screenPoint, infoPops, alarmIconData, iconIndex, iconData: alarmIconData, iconDataType: 'alarm' });dispatch({
                type: 'resourceTree/selectByGISCode',
                payload: { pageNum: 1, pageSize: 1, isQuery: true, fuzzy: false, gISCode: record.resourceGisCode },
              });
            });
          }
        }
      );
    } else {
      this.props.dispatch({
        type: 'alarmDeal/saveAlarmInfo',
        payload: record,
      });
      this.props.dispatch({
        type: 'alarmDeal/saveDealModel',
        payload: { isDeal: true },
      });
    }
  };
  render() {
    const { list } = this.props;
    return (
      <Table
        columns={columns}
        rowClassName={styles.cursorStyle}
        bordered
        dataSource={list}
        size="small"
        scroll={{ x: 500 }}
        pagination={{ pageSize: 5 }}
        rowKey={record => record.alarmCode}
        onRow={(record) => {
          return {
            onClick: () => this.handleClick(record), // 点击行
          };
        }}
      />
    );
  }
}

