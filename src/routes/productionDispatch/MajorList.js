import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Row, Col, Card, Input, Select, Button, DatePicker, Modal, Divider, Popconfirm } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { DndTable } from './DndTable';
import { commonData } from '../../../mock/commonData';
import styles from './majorList.less';
import { win16, win20, win8, win10, win3 } from '../../utils/configIndex';

const FormItem = Form.Item;
const { TextArea } = Input;

const CreateForm = Form.create()((props) => {
  const { modalVisible, handleModalVisible, isAdd, form, handleAdd, clickRow, statuData, loading } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (fieldsValue.startTimes) {
        fieldsValue.startTimes = fieldsValue.startTimes._d.getTime();
      } else {
        fieldsValue.startTimes = '';
      }
      if (fieldsValue.endTimes) {
        fieldsValue.endTimes = fieldsValue.endTimes._d.getTime();
      } else {
        fieldsValue.endTimes = '';
      }
      handleAdd(fieldsValue);
    });
  };
  // 时间不可用
  function disabledStartDate(current) {
    const { endTimes } = form.getFieldsValue(['endTimes']);
    const now = current ? current.valueOf() : moment().valueOf();
    if (endTimes) {
      const end = endTimes.valueOf();
      return now > end;
    } else {
      return false;
    }
  }
  // 时间不可用
  function disabledEndDate(current) {
    const { startTimes } = form.getFieldsValue(['startTimes']);
    const now = current ? current.valueOf() : 0;
    if (startTimes) {
      const start = startTimes ? startTimes.valueOf() : moment().valueOf();
      return now < start;
    } else {
      return false;
    }
  }
  // 关闭后销毁子元素
  const destroyOnClose = true;
  return (
    <Modal
      destroyOnClose={destroyOnClose}
      title={isAdd ? '新增' : '修改'}
      visible={modalVisible}
      onOk={okHandle}
      // confirmLoading={loading.effects['']}
      width="80%"
      onCancel={() => handleModalVisible()}
    >
      <Row gutter={{ md: 12, lg: 24 }}>
        {
          isAdd ? null : (
            <FormItem
              labelCol={{ span: 0 }}
              wrapperCol={{ span: 0 }}
            >
              {form.getFieldDecorator('concernID', {
                initialValue: isAdd ? '' : clickRow.concernID,
              })(
                <Input placeholder="" />
              )}
            </FormItem>)
        }
        <Col md={12} sm={24}>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="标题"
          >
            {form.getFieldDecorator('title', {
              initialValue: isAdd ? '' : clickRow.title,
              rules: [{ required: true, message: '标题不能为空' }],
            })(
              <Input placeholder="请输入标题" />
            )}
          </FormItem>
        </Col>
        <Col md={12} sm={24}>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="状态"
          >
            {form.getFieldDecorator('statu', {
              initialValue: isAdd ? '' : clickRow.statu,
              rules: [{ required: true, message: '状态不能为空' }],
            })(
              <Select placeholder="请选择" style={{ width: '100%' }}>
                <Select.Option value="" disabled>请选择</Select.Option>
                {statuData.map(item => (
                  <Select.Option
                    key={item.id}
                    value={item.value}
                  >{item.text}
                  </Select.Option>
                ))}
              </Select>
            )}
          </FormItem>
        </Col>

        <Col md={12} sm={24}>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="开始时间"
          >
            {form.getFieldDecorator('startTimes', {
              initialValue: isAdd ? null : clickRow.startTime,
              rules: [{ required: true, message: '开始时间不能为空' }],
            })(
              <DatePicker
                showTime
                disabledDate={disabledStartDate}
                format="YYYY/MM/DD HH:mm:ss"
                placeholder="执行时间"
                style={{ width: '100%' }}
              />
            )}
          </FormItem>
        </Col>

        <Col md={12} sm={24}>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="结束时间"
          >
            {form.getFieldDecorator('endTimes', {
              initialValue: isAdd ? null : clickRow.endTime,
              rules: [{ required: true, message: '结束时间不能为空' }],
            })(
              <DatePicker
                showTime
                disabledDate={disabledEndDate}
                format="YYYY/MM/DD HH:mm:ss"
                placeholder="结束时间"
                style={{ width: '100%' }}
              />
            )}
          </FormItem>
        </Col>

        <Col md={12} sm={24} >
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="内容"
          >
            {form.getFieldDecorator('content', {
              initialValue: isAdd ? '' : clickRow.content,
              rules: [{ required: true, message: '内容不能为空' }],
            })(
              <TextArea rows={4} />
            )}
          </FormItem>
        </Col>
      </Row>
    </Modal>
  );
});

@connect(({ majorList, loading }) => ({
  majorList,
  functionMenus: majorList.functionMenus,
  loading,
}))

@Form.create()
export default class MajorList extends PureComponent {
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
    dataSource: { data: [], pagination: { ...commonData.pageInitial, statu: 1, isQuery: true, fuzzy: true } },
    pagination: { ...commonData.pageInitial, statu: 1, isQuery: true, fuzzy: true },
    sorting: false,
    statuData: [
      {
        id: 0,
        value: 0,
        text: '未开始',
      }, {
        id: 1,
        value: 1,
        text: '已关注',
      }, {
        id: 2,
        value: 2,
        text: '已关闭',
      }, {
        id: 3,
        value: 3,
        text: '已过期',
      },
    ],
  };
  componentDidMount() {
    this.page(commonData.pageInitial);
    this.getFunctionMenus();
  }
  // 获取分页数据
  page = (pageInitial) => {
    const { dispatch, form } = this.props;
    const fieldsValue = form.getFieldsValue();
    dispatch({
      type: 'majorList/page',
      payload: { ...pageInitial, ...fieldsValue, isQuery: true, fuzzy: true },
    }).then(() => {
      this.setState({
        dataSource: this.props.majorList.data,
        pagination: this.props.majorList.data.pagination,
      });
    });
  };
  // 获取页面功能权限
  getFunctionMenus = () => {
    const { dispatch, functionInfo } = this.props;
    dispatch({
      type: 'majorList/getFunctionMenus',
      payload: { parentCode: functionInfo.functionCode },
    });
  };
  // 判断是否有该功能权限
  judgeFunction = (functionName) => {
    const { functionMenus } = this.props;
    const arr = functionMenus.filter(item => item.functionName === functionName);
    return arr.length > 0;
  };
  // 翻页 排序函数
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, form } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    // 搜索条件
    let search = {};
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      search = {
        ...fieldsValue,
      };
    });
    const params = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      isQuery: true,
      fuzzy: true,
      ...formValues,
      ...filters,
      ...search,
    };
    if (sorter.field) {
      // params.sorter = `${sorter.field}_${sorter.order}`;
      const { field, order } = sorter;
      params.sorter = { field, order };
    }

    dispatch({
      type: 'majorList/page',
      payload: params,
    });
  };
  // 重置搜索条件
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    form.setFieldsValue({
      statu: null,
    });
    this.setState({
      formValues: {},
    });
    this.page(commonData.pageInitial);
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
    this.page(commonData.pageInitial);
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
      this.setState({
        modalVisible: false,
      });
      this.page(commonData.pageInitial);
      this.props.dispatch({
        type: 'majorList/queryMajorContent',
      });
    });
  };
  // 修改函数
  doUpdate = (fields) => {
    const { clickRow } = this.state;
    this.props.dispatch({
      type: 'majorList/update',
      payload: { ...fields, sortIndex: clickRow.sortIndex },
    }).then(() => {
      this.setState({
        modalVisible: false,
      });
      this.page(this.state.pagination);
      this.props.dispatch({
        type: 'majorList/queryMajorContent',
      });
    });
  };
  // 执行删除函数
  delete = (record) => {
    this.props.dispatch({
      type: 'majorList/delete',
      payload: [record.concernID],
    }).then(() => {
      this.page(commonData.pageInitial);
      this.props.dispatch({
        type: 'majorList/queryMajorContent',
      });
    });
  };
  update = (record) => {
    if (record.endTime) {
      record.endTime = moment(moment(record.endTime).format('YYYY-MM-DD HH:mm:ss'), 'YYYY/MM/DD HH:mm:ss');
    } else {
      delete record.endTime;
    }
    if (record.startTime) {
      record.startTime = moment(moment(record.startTime).format('YYYY-MM-DD HH:mm:ss'), 'YYYY/MM/DD HH:mm:ss');
    } else {
      delete record.endTime;
    }
    this.setState({
      modalVisible: !this.state.modalVisible,
      isAdd: false,
      clickRow: record,
    });
  };
  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const { statuData } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="标题名称">
              {getFieldDecorator('title')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="内容">
              {getFieldDecorator('content')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('statu', {
                initialValue: 1,
              })(
                <Select placeholder="请选择">
                  <Select.Option value={null}>请选择</Select.Option>
                  {statuData.map(item => (
                    <Select.Option
                      key={item.id}
                      value={item.value}
                    >{item.text}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              {this.judgeFunction('新增权限') ? (
                <Button
                  icon="plus"
                  type="primary"
                  onClick={() => this.handleModalVisible(true)}
                >
                  新增
                </Button>
              ) : null}
              <Button type="primary" style={{ marginLeft: 8 }} htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }
  handleDragEnd = (draObj) => {
    if (
      !draObj.destination ||
      draObj.destination.index === draObj.source.index
    ) {
      return;
    }
    if (draObj.destination.index === draObj.source.index) {
      return;
    }
    const { dataSource, pagination } = this.state;
    const { current, pageSize } = pagination;
    const { dispatch } = this.props;
    const { data } = dataSource;
    // 缓存数组
    const newData = Array.from(data);
    const sourceIndex = draObj.source.index;
    const targetIndex = draObj.destination.index;
    // 找到拖动前与拖动后的位置
    const sortIndex = newData[targetIndex].sortIndex;
    const beforIndex = newData[sourceIndex].sortIndex;
    newData[targetIndex].sortIndex = beforIndex;
    newData[sourceIndex].sortIndex = sortIndex;
    // 改变缓存数组
    const [removed] = newData.splice(sourceIndex, 1);
    newData.splice(targetIndex, 0, removed);
    this.setState({
      sorting: true,
    });
    this.setState({
      dataSource: { data: newData },
    });
    dispatch({
      type: 'majorList/reSort',
      payload: {
        concernID: removed.concernID,
        sortIndex,
        beforIndex,
        pageNum: current,
        pageSize,
      },
    }).then(() => {
      // 判断服务器是否排序成功
      if (this.props.majorList.sortSuccess) {
        this.setState({
          sorting: false,
        });
        this.props.dispatch({
          type: 'majorList/queryMajorContent',
        });
      } else {
        this.setState({
          dataSource: { data },
          sorting: false,
        });
      }
    });
  };
  render() {
    const { modalVisible, isAdd, clickRow, statuData, dataSource, pagination, sorting } = this.state;
    const { data } = dataSource;
    const columns = [
      // {
      //   title: '序号',
      //   dataIndex: 'sortIndex',
      //   width: 80,
      //   render: (text, b, c) => {
      //     console.log('text', text);
      //     console.log('b', b);
      //     console.log('c', c);
      //     return text
      //   },
      // },
      {
        title: '标题名称',
        dataIndex: 'title',
        width: win16,
      },
      {
        title: '状态',
        dataIndex: 'statu',
        width: win10,
        render: (text) => {
          switch (text) {
            case 0: return '未开始';
            case 1: return '已关注';
            case 2: return '已关闭';
            case 3: return '已过期';
            default: return '未开始';
          }
        },
      },
      {
        title: '内容',
        dataIndex: 'content',
        width: win20,
      },
      {
        title: '发布时间',
        dataIndex: 'relaseTime',
        width: win16,
        render: (val) => {
          if (!val) {
            return '';
          }
          return <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>;
        },
      },
      {
        title: '开始时间',
        dataIndex: 'startTime',
        width: win16,
        render: (val) => {
          if (!val) {
            return '';
          }
          return <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>;
        },
      },
      {
        title: '结束时间',
        dataIndex: 'endTime',
        width: win16,
        render: (val) => {
          if (!val) {
            return '';
          }
          return <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>;
        },
      },
      {
        title: '操作',
        width: win16,
        dataIndex: 'operation',
        fixed: 'right',
        render: (text, record) => {
          // 获取该行的id，可以获取的到，传到函数里的时候打印直接把整个表格所有行id全部打印了
          return (
            <Fragment>
              {this.judgeFunction('修改权限') ?
                <a href="#" style={{ marginLeft: 8 }} onClick={() => this.update(record)}>修改</a> : null
              }
              <Divider type="vertical" />
              {this.judgeFunction('删除权限') ? (
                <Popconfirm title="确定删除？" onConfirm={() => this.delete(record)}>
                  <a href="#">删除</a>
                </Popconfirm>) : null
              }
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
      <PageHeaderLayout title="重点关注列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <DndTable
              rowKey="concernID"
              draggableId="concernID"
              dragIndex="sortIndex"
              dataSource={data}
              pagination={pagination}
              columns={columns}
              sorting={sorting}
              onDragEnd={this.handleDragEnd}
              handlePageChange={this.page}
              scroll={{ x: 800 + win3 * columns.length }}
            />
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          modalVisible={modalVisible}
          loading={this.props.loading}
          isAdd={isAdd}
          clickRow={clickRow}
          statuData={statuData}
        />
      </PageHeaderLayout>
    );
  }
}
