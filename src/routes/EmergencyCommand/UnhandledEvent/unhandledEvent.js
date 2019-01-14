import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Row, Col, Card, Input, Select, Icon, Button, TreeSelect, Table } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import StandardTable from '../../../components/StandardTable';
import { commonData } from '../../../../mock/commonData';
import styles from './unhandledEvent.less';
import { emgcIntervalInfo } from '../../../services/constantlyData';
import { mapConstants } from '../../../services/mapConstant';
import { changeVideoPosition, changeVideoSize, resetAccessStyle } from '../../../utils/utils';
import { win3, win10, win11, win12, win13, win14, win15, win16, win17, win18, win19, win20, win21, win22, win23, win24, win25, win26, win27, win28, win29, win30, } from '../../../utils/configIndex';

const FormItem = Form.Item;
const { TextArea } = Input;
const { TreeNode } = TreeSelect;


@connect(({ panelBoard, emergency, user, homepage, video, global, accessControl }) => ({
  panelBoard,
  undoneEventList: emergency.undoneEventList,
  functionMenus: emergency.functionMenus,
  currentUser: user.currentUser,
  videoFooterHeight: homepage.videoFooterHeight,
  rightCollapsed: global.rightCollapsed,
  videoPosition: video.position,
  videoShow: video.show,
  accessControlShow: accessControl.show,
}))

@Form.create()
export default class Analysis extends PureComponent {
  state = {
    undoneEventList: [],
    functionMenus: [],
  };
  componentDidMount() {
    this.getUndoneEventList();
    this.getFunctionMenus();
  }
  getUndoneEventList = () => {
    const { functionInfo, dispatch } = this.props;
    const { functionCode, functionName } = functionInfo;
    switch (functionName) {
      case '应急事件':
        dispatch({
          type: 'emergency/undoneEventList',
        }).then(() => {
          this.setState({
            undoneEventList: this.props.undoneEventList,
          });
        });
        break;
      case '信息接报':
        dispatch({
          type: 'emergency/undoneEventList',
          payload: {
            eventStatu: 1,
          },
        }).then(() => {
          this.setState({
            undoneEventList: this.props.undoneEventList,
          });
        });
        break;
      case '应急研判':
        dispatch({
          type: 'emergency/undoneEventList',
          payload: {
            eventStatu: 2,
          },
        }).then(() => {
          this.setState({
            undoneEventList: this.props.undoneEventList,
          });
        });
        break;
      case '应急预警':
        dispatch({
          type: 'emergency/undoneEventList',
          payload: {
            eventStatu: 3,
          },
        }).then(() => {
          this.setState({
            undoneEventList: this.props.undoneEventList,
          });
        });
        break;
      case '应急启动':
        dispatch({
          type: 'emergency/undoneEventList',
          payload: {
            eventStatu: 4,
          },
        }).then(() => {
          this.setState({
            undoneEventList: this.props.undoneEventList,
          });
        });
        break;
      case '应急处理':
        dispatch({
          type: 'emergency/undoneEventList',
          payload: {
            eventStatu: 5,
          },
        }).then(() => {
          this.setState({
            undoneEventList: this.props.undoneEventList,
          });
        });
        break;
      case '应急终止':
        dispatch({
          type: 'emergency/undoneEventList',
          payload: {
            eventStatu: 6,
          },
        }).then(() => {
          this.setState({
            undoneEventList: this.props.undoneEventList,
          });
        });
        break;
      default: break;
    }
  };
  //  处理事件
  onRowClick = (record) => {
    const { dispatch, videoFooterHeight, videoPosition, rightCollapsed, accessControlShow, functionInfo } = this.props;
    const { view, accessInfoExtent } = mapConstants;

    this.props.dispatch({
      type: 'tabs/del',
      payload: { key: '/command/emergencyEvent', title: '应急事件' },
    });
    setTimeout(() => this.confirm(record, 1, 'command/emergencyEvent', record.eventName, functionInfo), 0);
    changeVideoPosition('homePage', rightCollapsed, videoPosition, dispatch);
    // 恢复看板
    if (rightCollapsed) {
      dispatch({
        type: 'global/changeRightCollapsed',
        payload: false,
      }).then(() => {
        changeVideoSize(videoFooterHeight, dispatch, 'show');
        resetAccessStyle(accessControlShow, dispatch, accessInfoExtent);
      });
    } else {
      changeVideoSize(videoFooterHeight, dispatch, 'show');
      resetAccessStyle(accessControlShow, dispatch, accessInfoExtent);
    }
  };
  // 更改事件状态
  confirm = (row, eventStatu, key, title) => {
    const storage = window.localStorage;
    storage.eventID = row.eventID;
    const { userID } = this.props.currentUser.baseUserInfo;
    const { dispatch, functionInfo } = this.props;
    if (row.eventStatu === 0) {
      dispatch({
        type: 'emergency/updateProcessNode',
        payload: { eventID: row.eventID, eventStatu, userID },
      }).then(() => {
        dispatch({
          type: 'emergency/saveCurrent',
          payload: eventStatu,
        });
        dispatch({
          type: 'emergency/saveViewNode',
          payload: eventStatu,
        });
        dispatch({
          type: 'emergency/selectNodeType',
          payload: { eventID: row.eventID, eventStatu },
        });
        this.cancelSvaeKey(row, key, title, functionInfo);
      });
    } else {
      this.cancelSvaeKey(row, key, title, functionInfo);
    }
  };
  // 关闭model, 打开标签页
  cancelSvaeKey = (row, key, title) => {
    const { dispatch, functionInfo } = this.props;
    if (this.state.visible) {
      this.setState({
        visible: false,
      });
    }
    dispatch({
      type: 'emergency/saveEventId',
      payload: {
        eventId: row.eventID,
        tableId: `/${key}`,
      },
    });
    // 储存当前正在处理的事件
    window.localStorage.setItem('eventID', row.eventID);
    dispatch({
      type: 'tabs/addTabs',
      payload: { key: `/${key}`, title, functionInfo },
    });
    this.openBoardList();
  }
  // 打开面板
  openBoardList = () => {
    const { expandKeys, activeKeys } = this.props.panelBoard;
    const openBoard = (boardType) => {
      const newArr = [];
      for (const arr of activeKeys) {
        newArr.push(arr.keys);
      }
      if (newArr.indexOf(boardType) === -1) {
        expandKeys.push(boardType);
        this.props.dispatch({
          type: 'panelBoard/queryList',
          payload: {
            expandKeys,
            activeKeys: [
              { name: boardType, uniqueKey: 0, keys: boardType, param: { title: '事件信息' } },
              ...activeKeys,
            ],
          },
        });
      } else if (expandKeys.indexOf(boardType) === -1) {
        expandKeys.push(boardType);
        this.props.dispatch({
          type: 'panelBoard/queryList',
          payload: {
            expandKeys,
            activeKeys,
          },
        });
      }
    };
    openBoard('EventInfo');
  };
  getStatusName = (eventStatu) => {
    switch (parseInt(eventStatu, 0)) {
      case 0: return '事件未开始';
      case 1: return '信息接报';
      case 2: return '应急研判';
      case 3: return '应急预警';
      case 4: return '应急启动';
      case 5: return '应急处理';
      case 6: return '应急终止';
      default: return '';
    }
  };
  // 获取页面功能权限
  getFunctionMenus = () => {
    const { dispatch, functionInfo } = this.props;
    dispatch({
      type: 'emergency/getFunctionMenus',
      payload: { parentCode: functionInfo.functionCode },
    }).then(() => {
      const { functionMenus } = this.props;
      this.setState({
        functionMenus,
      });
    });
  };
  // 判断是否有该功能权限
  judgeFunction = (functionName) => {
    const { functionMenus } = this.state;
    const arr = functionMenus.filter(item => item.functionName === functionName);
    return arr.length > 0;
  };
  render() {
    const { loading } = this.props.undoneEventList;
    const columns = [{
      title: '事件状态',
      dataIndex: 'eventStatu',
      width: win12,
      render: (text) => {
        return this.getStatusName(text);
      },
    }, {
      title: '事件名称',
      dataIndex: 'eventName',
      width: win25,
    }, {
      title: '事发位置',
      dataIndex: 'eventPlace',
      width: win20,
    },
    {
      title: '事发部门',
      dataIndex: 'organization',
      width: win12,
      render: (val) => {
        if (val) {
          return val.orgnizationName;
        }
      },
    }, {
      title: '事发设备',
      dataIndex: 'resResourceInfo',
      width: win17,
      render: (val) => {
        if (val) {
          return val.resourceName;
        }
      },
    }, {
      title: '报警人',
      dataIndex: 'alarmPerson',
      width: win10,
    }, {
      title: '报警电话',
      dataIndex: 'telPhone',
      width: win10,
    }, {
      title: '人员编号',
      dataIndex: 'personCode',
      width: win10,
    }, {
      title: '警情摘要',
      dataIndex: 'alarmDes',
      width: win20,
    }, {
      title: '事发原因',
      dataIndex: 'incidentReason',
      width: win20,
    }, {
      title: '报警方式',
      dataIndex: 'alarmWay',
      width: win20,
    }, {
      title: '事发部位',
      dataIndex: 'accidentPostion',
      width: win10,
    }, {
      title: '事件类型',
      dataIndex: 'eventType',
      width: win10,
    }, {
      title: '是否演练',
      dataIndex: 'isDrill',
      width: win10,
      render: (value) => {
        return value === 1 ? '是' : '否';
      },
    }, {
      title: '受伤人数',
      dataIndex: 'injured',
      width: win10,
    }, {
      title: '死亡人数',
      dataIndex: 'death',
      width: win10,
    }, {
      title: '失踪人数',
      dataIndex: 'disappear',
      width: win10,
    }, {
      title: '报警现状',
      dataIndex: 'alarmStatuInfo',
      width: win20,
    }, {
      title: '监测器具',
      dataIndex: 'probeResourceID',
      width: win10,
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: win12,
      fixed: 'right',
      render: (text, record) => {
        // 获取该行的id，可以获取的到，传到函数里的时候打印直接把整个表格所有行id全部打印了
        return this.judgeFunction('处理事件权限') ? (
          <Fragment>
            <a href="#" onClick={() => this.onRowClick(record)}>处理事件</a>
          </Fragment>
        ) : null;
      },
    }];
    return (
      <PageHeaderLayout title="事件列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            {/* <div className={styles.tableListForm}> */}
            {/* {this.renderForm()} */}
            {/* </div> */}
            <div className={styles.eventTable}>
              <Table
                loading={loading}
                discheckeble
                dataSource={this.state.undoneEventList}
                columns={columns}
                rowKey={record => record.eventID}
                pagination={{
                  pageSize: 10,
                }}
                scroll={{ x: 2840 + 20 * win3 }}
              />
            </div>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
