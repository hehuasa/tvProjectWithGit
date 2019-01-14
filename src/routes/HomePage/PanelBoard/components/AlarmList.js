import React, { PureComponent } from 'react';
import { Table } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { searchByAttr, hoveringAlarm, alarmOrEventClick } from '../../../../utils/mapService';
import styles from './panel.less';
import { mapConstants } from '../../../../services/mapConstant';
import { win8, win10, win3 } from '../../../../utils/configIndex';

const columns = [
  {
    title: '事发位置',
    dataIndex: 'alarmExtendAlarmInfoVO',
    className: styles.cursorStyle,
    key: 'alarmExtendAlarmInfoVO',
    width: win8,
    render: (val, record) => {
      return val ? val.place : record.areaName;
    },
  },
  {
    title: '报警类型',
    dataIndex: 'alarmType.alarmTypeName',
    className: styles.cursorStyle,
    key: 'alarmType',
    width: win8,
  },
  {
    title: '首报时间',
    dataIndex: 'receiveTime',
    className: styles.cursorStyle,
    key: 'receiveTime',
    width: win10,
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
    width: win10,
  }];

@connect(({ alarm, map, alarmDeal, mapRelation }) => {
  return {
    list: JSON.parse(JSON.stringify(alarm.list)),
    popupScale: map.popupScale,
    iconArray: alarm.iconArray,
    alarmDeal,
    infoPops: mapRelation.infoPops,
    alarmIconData: mapRelation.alarmIconData,
  };
})
class AlarmCounting extends PureComponent {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick = (record) => {
    const { popupScale, dispatch, infoPops, alarmIconData } = this.props;
    dispatch({
      type: 'resourceTree/saveClickedAlarmId',
      payload: record.alarmId,
    });
    const { alarmExtendAlarmInfoVO, alarmType } = record;
    if (record.resourceGisCode) {
      alarmOrEventClick({ alarmIconData, record, popupScale, dispatch, infoPops, iconDataType: 'alarm' });
    } else if (alarmExtendAlarmInfoVO) {
      const { alarmOrg } = alarmExtendAlarmInfoVO;
      if (alarmOrg) {
        if (alarmOrg.gisCode) {
          record.resourceCode = alarmOrg.gisCode;
          record.resourceName = alarmOrg.orgnizationName;
          alarmOrEventClick({ alarmIconData, record, popupScale, dispatch, infoPops, iconDataType: 'alarm' });
        }
      }
      this.props.dispatch({
        type: 'alarmDeal/saveAlarmInfo',
        payload: record,
      });
      this.props.dispatch({
        type: 'alarmDeal/saveDealModel',
        payload: { isDeal: true },
      });
    } else if (alarmType.profession === '107.999') {
      this.props.dispatch({
        type: 'alarmDeal/saveAlarmInfo',
        payload: record,
      });
      this.props.dispatch({
        type: 'alarmDeal/saveDealModel',
        payload: { isDeal: true },
      });
    }
  }
  ;
  render() {
    const { list } = this.props;
    return (
      <Table
        columns={columns}
        rowClassName={styles.cursorStyle}
        bordered
        dataSource={list}
        size="small"
        scroll={{ x: 500 + win3 * columns.length }}
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

export default AlarmCounting;

