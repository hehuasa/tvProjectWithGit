import React, { PureComponent } from 'react';
import { Select, Table, Modal, Button, Row, Col, Form, Input } from 'antd';
import { connect } from 'dva';
import Scrollbars from 'react-custom-scrollbars';
import PlanInfo from './PlanInfo/index';
import styles from './index.less';

const Option = Select.Option;
const FormItem = Form.Item;

const SearchForm = Form.create()((props) => {
  const { form, planLevelList, planTypeList, handleSearch, handleFormReset, setPlan, current } = props;
  const { getFieldDecorator } = form;
  return (
    <div className={styles.search}>
      <Form>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="预案名称"
            >
              {getFieldDecorator('planName')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="预案类别"
            >
              {getFieldDecorator('planType')(
                <Select 
                dropdownMatchSelectWidth={false}
                placeholder="请选择"
                >
                  <Option value="">请选择</Option>
                  {planTypeList.map(type =>
                    <Option key={type.codeID} value={type.code}>{type.codeName}</Option>
                  )}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="预案级别"
            >
              {getFieldDecorator('planLevelID')(
                <Select placeholder="请选择">
                  <Option value="">请选择</Option>
                  {planLevelList.map(type =>
                    <Option key={type.emgcLevelID} value={type.emgcLevelID}>{type.levelName}</Option>
                  )}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" onClick={() => handleSearch(form)}>查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={() => handleFormReset(form)}>重置</Button>
              {current === -1 || current === -2 ? null : <Button type="primary" style={{ marginLeft: 8 }} onClick={setPlan}>设为实施方案</Button>}
            </span>
          </Col>
        </Row>
      </Form>
    </div>
  );
});

@connect(({ emergency, user }) => ({
  emergency,
  eventID: emergency.eventId,
  currentUser: user.currentUser,
  current: emergency.current,
  viewNode: emergency.viewNode,
  planLevelList: emergency.planLevelList,
  planTypeList: emergency.planTypeList,
  planInfoPage: emergency.planInfoPage,
  annexPage: emergency.annexPage,
  eventInfo: emergency.eventInfo,
  eventPlanList: emergency.eventPlanList,
  templatePlanID: emergency.templatePlanID,
  selectedRowKeys: emergency.selectedRowKeys,
}))
export default class SelectPlan extends PureComponent {
  state = {
    visible: false,
    planInfo: {}, // 预案详情
    planTemple: {}, // 计划作为模板
    // 当前页
    pageNum: 1,
    // 每页显示条数
    pageSize: 8,
    total: '',
    isQuery: true,
    fuzzy: false,
    selectedPlanID: '',
    selectedRows: [], // 已选的预案信息
    selectedRowKeys: [], // 选中的预案
  };
  componentDidMount() {
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    // 获取预案列表
    this.page(pageNum, pageSize);
    // 获取应急等级列表
    // dispatch({
    //   type: 'emergency/getPlanLevelList',
    // });
    //  获取预案类别
    dispatch({
      type: 'emergency/getPlanTypeList',
      payload: 558,
    });
    //  通过事件ID获取事件关联的所有预案信息
    dispatch({
      type: 'emergency/getPlansByEventID',
      payload: { eventID: this.props.eventID },
    }).then(() => {
      const { templatePlanID } = this.props;
      dispatch({
        type: 'emergency/saveSelectedRowKeys',
        payload: templatePlanID,
      });
    });
  }
  page = (pageNum, pageSize) => {
    const { dispatch, eventID } = this.props;
    const { isQuery, fuzzy } = this.state;
    // 获取预案列表
    dispatch({
      type: 'emergency/getPlanInfoPage',
      payload: { pageNum, pageSize, eventID, isExpand: 0 },
    }).then(() => {
      const { planInfoPage } = this.props;
      this.setState({
        pageNum: planInfoPage.pageNum,
        pageSize: planInfoPage.pageSize,
        total: planInfoPage.sumCount,
      });
    });
  };
  // 重置查询条件
  handleFormReset = (form) => {
    form.resetFields();
    this.page(1, 8);
  };
  // 预案列表所搜函数
  handleSearch = (form) => {
    const { dispatch, eventID } = this.props;
    const { isQuery } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'emergency/getPlanInfoPage',
        payload: {
          pageNum: 1,
          pageSize: 8,
          isExpand: 0,
          eventID,
          ...fieldsValue },
      }).then(() => {
        const { planInfoPage } = this.props;
        this.setState({
          pageNum: planInfoPage.pageNum,
          pageSize: planInfoPage.pageSize,
          total: planInfoPage.sumCount,
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
  openModel = (record) => {
    const { planInfoID } = record;
    this.props.dispatch({
      type: 'emergency/savePlanID',
      payload: planInfoID,
    });
    this.setState({
      visible: true,
      planTemple: record,
      planInfo: record,
    });
  };
  // 设置为实时方案
  setPlan = () => {
    const { selectedRows } = this.state;
    const { eventID, currentUser, templatePlanID } = this.props;
    const { userID } = currentUser.baseUserInfo;
    const arr = selectedRows.filter(item => templatePlanID.findIndex(obj => obj === item.planInfoID) === -1);
    const emgcEventExecutePlanVO = { eventID, planPlanInfo: arr, userID };
    const jsonData = JSON.stringify(emgcEventExecutePlanVO);
    this.props.dispatch({
      type: 'emergency/copyPlan',
      payload: { jsonData },
    }).then(() => {
      //  获取事件关联的预案（禁选）
      this.props.dispatch({
        type: 'emergency/getPlansByEventID',
        payload: { eventID: this.props.eventID },
      }).then(() => {
        // 勾选关联预案
        this.props.dispatch({
          type: 'emergency/saveSelectedRowKeys',
          payload: this.props.templatePlanID,
        });
      });
    });
  };
  // 预案多选
  planRowChange = (selectedRowKeys, selectedRows) => {
    this.props.dispatch({
      type: 'emergency/saveSelectedRowKeys',
      payload: selectedRowKeys,
    });
    this.setState({
      selectedRows,
    });
  };
  render() {
    const { current, viewNode, planLevelList, planTypeList, planInfoPage } = this.props;
    const columns = [
      {
        title: '预案名称',
        dataIndex: 'planName',
        width: '35%',
        key: 'planName',
        render: (text, record) => <a onClick={() => this.openModel(record)} href="javascript:;">{text}</a>,
      }, {
        title: '预案类别',
        dataIndex: 'planTypeName',
        width: '15%',
        key: 'planTypeName',
      }, {
        title: '预案级别',
        width: '15%',
        render: (text, record) => {
          return record.planPlanLevel ? record.planPlanLevel.levelName : '';
        },
      }, {
        title: '特征匹配',
        width: '20%',
        dataIndex: 'featureNames',
        render: (text) => {
          let str = '';
          if (text && text.length > 0) {
            text.forEach((name, index) => {
              str += `${name}, `;
            });
          }
          return str;
        },
      }, {
        title: '匹配度',
        width: '10%',
        dataIndex: 'weight',
        render: (text, record) => {
          return !record.drectFeature ? <span style={{ color: 'red' }} >{`${(text * 100).toFixed(2)} %`}</span> : '直接匹配';
        },
      }];

    return (
      <div className={styles.selectPlan}>
        <div className={styles.planList}>
          <SearchForm
            planTypeList={planTypeList}
            planLevelList={planLevelList}
            handleFormReset={this.handleFormReset}
            handleSearch={this.handleSearch}
            setPlan={this.setPlan}
            current={current}
          />
          <Table
            dataSource={planInfoPage.result}
            columns={columns}
            rowKey={record => record.planInfoID}
            rowSelection={{
              onChange: this.planRowChange,
              selectedRowKeys: this.props.selectedRowKeys,
              getCheckboxProps: record => ({
                disabled: viewNode === current ?
                this.props.templatePlanID.findIndex(value => value === record.planInfoID) !== -1 : true,
                name: record.name,
              }),
            }}
            pagination={{
              current: this.state.pageNum,
              pageSize: this.state.pageSize,
              total: this.state.total,
              onChange: this.page,
            }}
            className={styles.tableStyle}
          />
        </div>
        <Modal
          title="预案详情"
          cancelText="关闭"
          footer={false}
          width="80%"
          visible={this.state.visible}
          mask={false}
          maskClosable={false}
          destroyOnClose
          onCancel={this.handleCancel}
        >
          <PlanInfo planInfo={this.state.planInfo} />
        </Modal>
      </div>
    );
  }
}
