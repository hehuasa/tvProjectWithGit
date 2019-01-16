import React, { PureComponent } from 'react';
import { Form, Button, Card, Table, Select, Input, Modal } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import styles from './index.less';
import InsertCommand from './InsertCommand/index';
import { emgcIntervalInfo } from '../../../../services/constantlyData';
import { win3, win10, win11, win12, win13, win14, win15, win16, win17, win18, win19, win20, win21, win22, win23, win24, win25, win26, win27, win28, win29, win30, } from '../../../../utils/configIndex';

const Option = Select.Option;
const FormItem = Form.Item;

@connect(({ emergency, user }) => ({
  commandList: emergency.commandList,
  eventID: emergency.eventId,
  commandModel: emergency.commandModel,
  isInsert: emergency.isInsert,
  viewNodeType: emergency.viewNodeType,
  viewNode: emergency.viewNode,
  current: emergency.current,
  currentUser: user.currentUser,
  commandStatus: emergency.commandStatus,
  processFuncMenus: emergency.processFuncMenus,
}))
@Form.create()
export default class CommandList extends PureComponent {
  state = {
    editingKey: '',
    executeContent: '',
    visible: false,
    commandModel: null,
    processFuncMenus: [],
  };
  componentDidMount() {
    const { dispatch, eventID, viewNode } = this.props;
    this.initFuncMenus();
    // 根据事件ID获取指令列表
    dispatch({
      type: 'emergency/selectNodeType',
      payload: { eventID, eventStatu: viewNode },
    }).then(() => {
      dispatch({
        type: 'emergency/getCommandList',
        payload: { eventID, nodeType: this.props.viewNodeType },
      });
      //  获取指令分类列表
      dispatch({
        type: 'emergency/getCommandModelList',
        payload: { eventID, nodeType: this.props.viewNodeType },
      });
    });
    //  获取指令操作状态列表
    dispatch({
      type: 'emergency/getCommandStatus',
    });
    // 刷新指令列表
    const id = setInterval(this.getCommandList,
      emgcIntervalInfo.timeSpace);
    emgcIntervalInfo.commondList.push(id);
  }
  componentWillUnmount() {
    emgcIntervalInfo.commondList.forEach((item) => {
      clearInterval(item);
    });
  }
  // 根据指令分类获取指令列表
  getCommandListByModel = (commandModel) => {
    const { dispatch, eventID, viewNodeType } = this.props;
    // 根据事件ID获取指令列表
    dispatch({
      type: 'emergency/getCommandList',
      payload: { eventID, commandModel, nodeType: viewNodeType },
    });
  };
  getCommandList = () => {
    const { dispatch, eventID, viewNodeType } = this.props;
    const { commandModel } = this.state;
    dispatch({
      type: 'emergency/getCommandList',
      payload: { eventID, commandModel, nodeType: viewNodeType },
    });
  };
  // 指令类型下拉框改变 根据不同分类获取指令列表
  commandTypeChange = (value) => {
    this.setState({
      commandModel: value,
    });
    this.getCommandListByModel(value);
  };
  // 打开指令插入界面
  openInsert = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'emergency/saveIsInsert',
      payload: true,
    });
    // 清空上次选择的指令接收人
    dispatch({
      type: 'emergency/saveAcceptUser',
      payload: [],
    });
  };
  // 修改指令执行状态
  handleChange = (commandStat, cmdExecID) => {
    const { dispatch, eventID } = this.props;
    // 根据事件ID获取指令列表
    dispatch({
      type: 'emergency/updateCommandStatus',
      payload: { commandStat, cmdExecID },
    }).then(() => {
      //  获取指令类型列表
      dispatch({
        type: 'emergency/getCommandList',
        payload: { eventID, nodeType: this.props.viewNodeType },
      });
    });
  };
  // 点击行编辑
  editRow = (record) => {
    this.setState({
      editingKey: record.cmdExecID,
      executeContent: record.executeContent,
      visible: true,
    });
  };
  // 保存行编辑
  saveRow = () => {
    const { executeContent, editingKey } = this.state;
    const { dispatch, eventID } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    }).then(() => {
      const { userID } = this.props.currentUser.baseUserInfo;
      dispatch({
        type: 'emergency/updateExecuteContent',
        payload: { executeContent, cmdExecID: editingKey, userID },
      }).then(() => {
        dispatch({
          type: 'emergency/getCommandList',
          payload: { eventID, nodeType: this.props.viewNodeType },
        });
        this.setState({
          editingKey: '',
          visible: false,
        });
      });
    });
  };
  // 关闭弹窗
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };
  // 指令执行情况描述
  onChange = (e) => {
    this.setState({
      executeContent: e.target.value,
    });
  };
  // 判断是否有该功能权限
  judgeFunction = () => {
    const { processFuncMenus } = this.state;
    const { current } = this.props;
    const functionInfo = { 3: '预警权限', 4: '应急启动权限', 5: '应急处理权限' };
    const arr = processFuncMenus.filter(item => item.functionName === functionInfo[current]);
    return arr.length > 0;
  };
  // 将数据存在state
  initFuncMenus = () => {
    const { processFuncMenus } = this.props;
    this.setState({
      processFuncMenus,
    });
  };
  render() {
    const { commandList, commandModel, isInsert, commandStatus, current, viewNode } = this.props;
    // 指令表头
    const commandCols = [
      {
        title: '状态',
        dataIndex: 'commandStat',
        width: win14,
        key: 'commandStat',
        filters: Object.keys(commandStatus).map((item) => {
          return { text: commandStatus[item], value: item };
        }),
        // onFilter: (value, record) => record.commandStat === parseInt(value, 0),
        onFilter: (value, record) => {
          console.log(1212)
          console.log(value, record)
          return record.commandStat === parseInt(value, 0)
        },
        render: (value, record) => {
          return (
            <Select
              // defaultValue={value ? value.toString() : ''}
              disabled={current === -1 || current === -2}
              size="small"
              value={value ? value.toString() : ''}
              style={{ width: '100%' }}
              placeholder="请选择"
              onChange={select => this.handleChange(select, record.cmdExecID)}
            >
              {Object.keys(commandStatus).map(key =>
                <Option disabled={key < value} key={key} value={key}>{commandStatus[key]}</Option>
              )}
            </Select>
          );
        },
      }, {
        title: '指令分类',
        dataIndex: 'commandModelName',
        width: win10,
        key: 'commandModelName',
      }, {
        title: '指令内容',
        dataIndex: 'commandContent',
        width: win20,
        key: 'commandContent',
      }, {
        title: '执行情况',
        dataIndex: 'executeContent',
        width: win16,
        key: 'executeContent',
      }, {
        title: '执行岗位',
        dataIndex: 'executeUser',
        width: win12,
        key: 'executeUser',
        render: (text) => {
          let str = '';
          if (text && text.length > 0) {
            text.forEach((item, index) => {
              if (item) {
                if (index !== text.length - 1) {
                  str = `${str + item.postionName}, `;
                } else {
                  str += item.postionName;
                }
              }
            });
          }
          return str;
        },
      }, {
        title: '下发时间',
        dataIndex: 'sendTime',
        width: win16,
        key: 'sendTime',
        render: (text) => {
          return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '';
        },
      }, {
        title: '执行时长/分钟',
        dataIndex: 'executeTime',
        width: win20,
        key: 'executeTime',
      }, {
        title: '结束时间',
        dataIndex: 'executeEndTime',
        width: win16,
        key: 'executeEndTime',
        render: (text) => {
          return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '';
        },
      }, {
        title: '注意事项',
        dataIndex: 'attention',
        width: win10,
        key: 'attention',
      }, {
        title: '操作',
        dataIndex: 'action',
        width: win10,
        fixed: 'right',
        key: 'action',
        render: (text, record) => {
          return current === -1 || current === -2 ? null : (
            !record.executeContent ? <a href="javascript:;" onClick={() => this.editRow(record)}>编辑</a> : null
          );
        },
      }];

    return (
      <div className={styles.commandList}>
        {!isInsert ? (
          <div>
            <div className={styles.insertBtnBox}>
              {
                this.judgeFunction() ?
                  <div className={styles.insertBtn}>
                    <Button disabled={viewNode < current} type="primary" onClick={this.openInsert}>插入新指令</Button>
                  </div> : null
              }
              <div className={styles.extra}>
                <span style={{ marginRight: 16 }}>指令分类</span>
                <Select defaultValue="" style={{ width: 200 }} onChange={this.commandTypeChange}>
                  <Option value="">全部</Option>
                  {commandModel.map(type =>
                    <Option key={type.commandModelID} value={type.modelCode}>{type.modelName}</Option>
                  )}
                </Select>
              </div>
            </div>
            <Table
              // rowKey={record => record.cmdExecID}
              rowKey="cmdExecID"
              columns={commandCols}
              dataSource={commandList}
              pagination={{ pageSize: 5 }}
              rowClassName={record => (record.executeEndTime && record.executeEndTime < moment().valueOf() ? `${styles.endColor}` : '')}
              scroll={{ x: 1420 + win3 * commandCols.length }}
              className={styles.tableStyle}
            />
          </div>
        ) : (
            <InsertCommand />
          )}
        <Modal
          title="编辑指令执行情况"
          visible={this.state.visible}
          onOk={this.saveRow}
          onCancel={this.handleCancel}
        >
          <FormItem
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            label="指令执行情况"
          >
            <Input.TextArea rows={4} type="text" value={this.state.executeContent} onChange={this.onChange} />
          </FormItem>
        </Modal>
      </div>
    );
  }
}


{/*
   const extra = (
      <div className={styles.extra}>
        <span style={{ marginRight: 16 }}>指令分类</span>
        <Select defaultValue="" style={{ width: 200 }} onChange={this.commandTypeChange}>
          <Option value="">全部</Option>
          {commandModel.map(type =>
            <Option key={type.commandModelID} value={type.modelCode}>{type.modelName}</Option>
          )}
        </Select>
      </div>
    );
    const title = (
      <div className={styles.insertBtn}>
        <Button disabled={viewNode < current} type="primary" onClick={this.openInsert}>插入新指令</Button>
      </div>
    );
  <Card title={this.judgeFunction() ? title : ''} extra={extra}>
  <Table
    // rowKey={record => record.cmdExecID}
    rowKey="cmdExecID"
    columns={commandCols}
    dataSource={commandList}
    pagination={{ pageSize: 5 }}
    rowClassName={record => (record.executeEndTime && record.executeEndTime < moment().valueOf() ? `${styles.endColor}` : '')}
    scroll={{ x: 1420 + win3 * commandCols.length }}
    className={styles.tableStyle}
  />
</Card> */}
