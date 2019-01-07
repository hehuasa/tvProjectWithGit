import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Row, Col, Card, Input, Select, Icon, Button, Dropdown, Menu, TreeSelect, DatePicker, Modal, message, Divider, Popconfirm } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import StandardTable from '../../components/StandardTable';
import { commonData } from '../../../mock/commonData';
import WEditor from '../../components/WEditor/index';
import styles from './productReportInfoMaintain.less';

const FormItem = Form.Item;
const { TextArea } = Input;

const CreateForm = Form.create()((props) => {
  const { modalVisible, handleModalVisible, isAdd, form, handleAdd, onValueChange, productStatusInfo } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      handleAdd(fieldsValue);
    });
  };
  // 关闭后销毁子元素
  const destroyOnClose = true;
  return (
    <Modal
      destroyOnClose={destroyOnClose}
      title={isAdd ? '新增' : '修改'}
      visible={modalVisible}
      onOk={okHandle}
      width="80%"
      onCancel={() => handleModalVisible()}
    >
      <WEditor onChange={onValueChange} content={productStatusInfo.reportInfo ? productStatusInfo.reportInfo.split('\n').join('<br>').split(' ').join('&nbsp;') : ''} />
    </Modal>
  );
});

@connect(({ majorList, productionDaily }) => ({
  majorList,
  productionStatusPage: productionDaily.productionStatusPage,
}))

@Form.create()
export default class Analysis extends PureComponent {
  state = {
    // 弹框的显示控制
    modalVisible: false,
    // 搜索栏是否展开
    expandForm: false,
    selectedRows: [],
    formValues: {},
    //  修改还是新增
    isAdd: true,
    clickRow: null,
    productStatusInfo: '',
  };
  componentDidMount() {
    this.page(commonData.pageInitial);
  }
  // 获取分页数据
  page = (page) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'productionDaily/productionStatusPage',
      payload: page,
    });
  };
  // 生产情况变化
  onValueChange = (value) => {
    const obj = this.state.productStatusInfo;
    obj.reportInfo = value;
    this.setState({
      productStatusInfo: obj,
    });
  };
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      // params.sorter = `${sorter.field}_${sorter.order}`;
      const { field, order } = sorter;
      params.sorter = { field, order };
    }
    this.page(params);
  };
  // 重置搜索条件
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'majorList/page',
      payload: commonData.pageInitial,
    });
  };

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  };
  // 搜索函数
  handleSearch = (e) => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        //   createTimes: fieldsValue.createTime ? fieldsValue.createTime.format('YYYY-MM-DD') : undefined,
      };
      // if (values.createTime) { delete values.createTime; }
      const search = {};
      const pagination = {
        ...commonData.pageInitial,
        fuzzy: true,
      };
      Object.assign(search, pagination, values);
      this.page(search);
    });
  };

  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
      isAdd: true,
    });
    this.setState({
      clickRow: null,
    });
  };

  // 新增
  handleAdd = (fields) => {
    if (this.state.isAdd) {
      this.doAdd(fields);
    } else {
      this.doUpdate(fields);
    }
  };
  doAdd = (fields) => {
    this.props.dispatch({
      type: 'majorList/add',
      payload: fields,
    }).then(() => {
      if (this.props.majorList.toggle) {
        this.setState({
          modalVisible: false,
        });
        this.props.dispatch({
          type: 'majorList/queryMajorContent',
        });
      }
    });
  };
  // 修改函数
  doUpdate = (fields) => {
    const obj = this.state.productStatusInfo;
    delete obj.reportDate;
    delete obj.sortIndex;
    delete obj.key;
    this.props.dispatch({
      type: 'productionDaily/updateProductionStatus',
      payload: obj,
    }).then(() => {
      const { pagination } = this.props.productionStatusPage;
      const param = {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
      };
      this.setState({
        modalVisible: false,
      });
      this.page(param);
    });
  };
  // 执行删除函数
  delete = (record) => {
    this.props.dispatch({
      type: 'majorList/delete',
      payload: [record.concernID],
    }).then(() => {
      if (this.props.majorList.toggle) {
        this.props.dispatch({
          type: 'majorList/queryMajorContent',
        });
      }
    });
  };
  deleteAll = () => {
    const concernID = [];
    this.state.selectedRows.forEach((user) => {
      concernID.push(user.concernID);
    });
    this.props.dispatch({
      type: 'majorList/delete',
      payload: concernID,
    }).then(() => {
      if (this.props.majorList.toggle) {
        this.props.dispatch({
          type: 'majorList/queryMajorContent',
        });
      }
    });
  };
  update = (record) => {
    this.setState({
      productStatusInfo: record,
    });
    this.setState({
      modalVisible: !this.state.modalVisible,
      isAdd: false,
      clickRow: record,
    });
  };
  render() {
    const { selectedRows, modalVisible, isAdd } = this.state;

    const columns = [
      {
        title: '生产情况',
        dataIndex: 'reportInfo',
        width: 300,
        render: (text) => {
          return <div dangerouslySetInnerHTML={{ __html: text.split('\n').join('<br>').split(' ').join('&nbsp;') }} />;
        },
      },
      {
        title: '操作',
        width: 120,
        render: (text, record) => {
          // 获取该行的id，可以获取的到，传到函数里的时候打印直接把整个表格所有行id全部打印了
          return (
            <Fragment>
              <a href="#" onClick={() => this.update(record)}>修改</a>
            </Fragment>
          );
        },
      },
    ];
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <PageHeaderLayout title="生产情况">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <StandardTable
              selectedRows={selectedRows}
              data={this.props.productionStatusPage}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              rowKey="concernID"
            />
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          modalVisible={modalVisible}
          isAdd={isAdd}
          productStatusInfo={this.state.productStatusInfo}
          onValueChange={this.onValueChange}
        />
      </PageHeaderLayout>
    );
  }
}
