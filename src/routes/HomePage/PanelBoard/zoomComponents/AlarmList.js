import React, { PureComponent } from 'react';
import { Table } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { alarmOrEventClick, hoveringAlarm, searchByAttr } from '../../../../utils/mapService';
import styles from './zoomComponents.less';
import { mapConstants } from '../../../../services/mapConstant';

const columns = [
  {
    title: '序号',
    dataIndex: 'sort',
    key: 'sort',
    render: (text, record, index) => {
      return <span >{index + 1}</span>;
    },
  },
  {
    title: '事发位置',
    dataIndex: 'alarmExtendAlarmInfoVO',
    className: styles.cursorStyle,
    key: 'alarmExtendAlarmInfoVO',
    render: (val, record) => {
      return val ? val.place : record.areaName;
    },
  },
  {
    title: '报警类型',
    dataIndex: 'alarmType.alarmTypeName',
    className: styles.cursorStyle,
    key: 'alarmType',
  }, {
    title: '报警点位编号',
    dataIndex: 'resourceCode',
    className: styles.cursorStyle,
    key: 'resourceCode',
  }, {
    title: '报警点位名称',
    dataIndex: 'resourceName',
    className: styles.cursorStyle,
    key: 'resourceName',
  }, {
    title: '首报时间',
    dataIndex: 'receiveTime',
    key: 'receiveTime',
    className: styles.cursorStyle,
    defaultSortOrder: 'descend',
    sorter: (a, b) => {
      return Number(a.receiveTime) - Number(b.receiveTime);
    },
    render: (val) => {
      if (!val) {
        return '';
      }
      return <span>{moment(val).format('L HH:mm:ss')}</span>;
    },
  }];

@connect(({ alarm, map, mapRelation }) => ({
  alarm,
  list: JSON.parse(JSON.stringify(alarm.list)),
  iconArray: alarm.iconArray,
  infoPops: mapRelation.infoPops,
  alarmIconData: mapRelation.alarmIconData,
}))
class AlarmCounting extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'alarm/fetch',
    });
  }
  handleClick = (record) => {
    const { dispatch, infoPops, alarmIconData } = this.props;
    const { popupScale } = mapConstants;
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
  };
  render() {
    const { alarm } = this.props;
    return (
      <div className={styles.regionWarp}>
        <Table
          columns={columns}
          bordered
          rowClassName={styles.cursorStyle}
          dataSource={alarm.list}
          size="small"
          scroll={{ x: 450 }}
          pagination={{ pageSize: 10 }}
          rowKey={record => record.alarmCode}
          onRow={(record) => {
            return {
              onClick: () => this.handleClick(record), // 点击行
            };
          }}
        />
      </div>
    );
  }
}

export default AlarmCounting;

