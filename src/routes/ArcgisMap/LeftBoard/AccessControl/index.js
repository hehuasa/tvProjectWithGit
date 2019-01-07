import React, { PureComponent } from 'react';
import moment from 'moment';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'dva';
import { Icon, Row, Col, Radio, Button, Collapse, Table, Rate } from 'antd';
import styles from './index.less';
import { constantlyModal } from '../../../../services/constantlyModal';


const Panel = Collapse.Panel;
@connect(({ map, resourceTree, sidebar, accessControl, panelBoard }) => ({
  map,
  selectResourceGisCode: resourceTree.selectResourceGisCode,
  sidebar,
  panelBoard,
  allDoorCountArea: accessControl.allDoorCountArea,
  allDoorCount: accessControl.allDoorCount,
}))
//  门禁模板
export default class AccessControl extends PureComponent {
  componentDidMount() {
    // const { dispatch, resourceTree } = this.props;
    // const { selectResourceGisCode } = resourceTree;
    // dispatch({
    //   type: 'resourceTree/selectByGISCode',
    //   payload: { pageNum: 1, pageSize: 1, isQuery: true, fuzzy: false, GISCode: selectResourceGisCode },
    // });
  }
  // 关闭面板
  handleClick = () => {
    this.props.dispatch({
      type: 'resourceTree/saveCtrlResourceType',
      payload: '',
    });
  };
  addBoard = (area) => {
    const { dispatch } = this.props.panelBoard;

    dispatch({
      type: 'sidebar/zoomIn',
      payload: {
        id: 4,
        title: '人员进出门禁看板',
      },
    });
    // const openBoard = (boardType) => {
    //   const newArr = [];
    //   for (const arr of activeKeys) {
    //     newArr.push(arr.keys);
    //   }
    //   if (newArr.indexOf(boardType) === -1) {
    //     expandKeys.push(boardType);
    //     this.props.dispatch({
    //       type: 'panelBoard/queryList',
    //       payload: {
    //         expandKeys,
    //         activeKeys: [
    //           { name: boardType, uniqueKey: 0, keys: boardType, param: { title: '人员进出门禁看板' } },
    //           ...activeKeys,
    //         ],
    //       },
    //     });
    //   } else if (expandKeys.indexOf(boardType) === -1) {
    //     expandKeys.push(boardType);
    //     this.props.dispatch({
    //       type: 'panelBoard/queryList',
    //       payload: {
    //         expandKeys,
    //         activeKeys,
    //       },
    //     });
    //   }
    // };
    // openBoard('EntranceGuard');
    // if (area) {
    //   if (area.dataType === 'area') {
    //     const { beginTime, endTime } = this.props.entranceGuard;
    //     this.props.dispatch({
    //       type: 'entranceGuard/stageAreaPerson',
    //       payload: {
    //         toggleTable: 'two',
    //         areaDoorData: {
    //           name: area.areaName,
    //           id: area.areaId,
    //         },
    //         beginTime: beginTime || moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    //         endTime: endTime || moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    //         type: 0,
    //         areaOrDoor: 1,
    //       },
    //     }).then(() => {
    //       this.props.dispatch({
    //         type: 'sidebar/zoomIn',
    //         payload: {
    //           id: 4,
    //           title: '门禁列表看板',
    //         },
    //       });
    //     });
    //   } else if (area.dataType === 'door') {
    //     const { beginTime, endTime } = this.props.entranceGuard;
    //     this.props.dispatch({
    //       type: 'entranceGuard/stageDoorPerson',
    //       payload: {
    //         toggleTable: 'two',
    //         areaDoorData: {
    //           name: area.doorName,
    //           id: area.doorId,
    //         },
    //         beginTime: beginTime || moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    //         endTime: endTime || moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    //         type: 0,
    //         areaOrDoor: 2,
    //       },
    //     }).then(() => {
    //       this.props.dispatch({
    //         type: 'sidebar/zoomIn',
    //         payload: {
    //           id: 4,
    //           title: '门禁列表看板',
    //         },
    //       });
    //     });
    //   }
    // }
  };
  render() {
    const { allDoorCountArea, selectResourceGisCode, allDoorCount } = this.props;
    const { areaCode, type, gisCode, doorName } = selectResourceGisCode;
    // const areas = []; const doors = [];
    let data;
    switch (type) {
      case 'area': data = allDoorCountArea.find(value => Number(value.areaID) === areaCode); break;
      case 'door': data = allDoorCount.find(value => Number(value.gisCode) === gisCode); break;
      default: break;
    }

    // const guardDoorCounting = constantlyModal[type] ? constantlyModal[type].data : [];
    // const guardAreaCounting = constantlyModal[type] ? constantlyModal[type].data : [];

    // const areas = guardAreaCounting.filter(item => gISCodes.indexOf(Number(item.gISCode)) !== -1);
    // areas.map(item => item.dataType = 'area');
    // const doors = guardDoorCounting.filter(item => gISCodes.indexOf(Number(item.gISCode)) !== -1);
    // doors.map(item => item.dataType = 'door');
    // areas.push(...doors);
    // const area = areas[0] || {};

    return (
      <div className={styles.warp}>
        <div className={styles.header}>
          <div className={styles.name}>门禁/区域进出统计</div>
          <div className={styles.close}>
            <Button type="primary" size="small" onClick={this.handleClick}> X </Button>
          </div>
        </div>
        <Scrollbars style={{ height: 280 }}>
          <Collapse bordered={false} defaultActiveKey={['0']}>
            <Panel header={<div className={styles.panelHeader}>基本信息</div>} key="0" className={styles.type}>
              { data !== undefined ? (
                <div>
                  <Row><Col span={12}>{type === 'area' ? '区域' : '门禁'}名称：</Col><Col span={12}>{data.areaName || doorName}</Col></Row>
                  { type === 'area' ? <Row><Col span={12}>今日进场总人数：</Col><Col span={12}>{data.inNUm}</Col></Row> : <Row><Col span={12}>今日进入人次：</Col><Col span={12}>{data.inNUm}</Col></Row> }
                  { type === 'area' ? <Row><Col span={12}>当前场内总人数：</Col><Col span={12}>{data.sumNum}</Col></Row> : <Row><Col span={12}>今日出去人次：</Col><Col span={12}>{data.outNum}</Col></Row> }


                </div>
) :
                <Icon type="loading" />
              }

            </Panel>
          </Collapse>
        </Scrollbars>
        <div className={styles.btn}>
          <Button size="small" onClick={() => this.addBoard()}>打开看板</Button>
        </div>
      </div>);
  }
}
