import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Radio,
  TreeSelect,
  DatePicker,
  Modal,
  InputNumber,
  Divider,
  Popconfirm,
} from 'antd';
import StandardTable from '../../../components/StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './index.less';
import { commonData } from '../../../../mock/commonData';
import { switchCode } from '../../../services/statusCode';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const { TreeNode } = TreeSelect;
const ButtonGroup = Button.Group;
const RadioGroup = Radio.Group;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
// 新增 修改页
const CreateForm = Form.create()((props) => {
  const { modalVisible, form, handleModalVisible, materialCodeExist } = props;
  const { materialInfo, isAdd, extendsVisible, handleAdd, dispatch } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // 修改时编码未改变 不进行校验
      if (!isAdd && fieldsValue.rawCode === materialInfo.rawCode) {
        form.setFields({
          rawCode: {
            value: fieldsValue.rawCode,
          },
        });
        handleAdd(fieldsValue);
      } else if (materialCodeExist) {
        form.setFields({
          rawCode: {
            value: fieldsValue.rawCode,
            errors: [new Error('唯一字段已经存在')],
          },
        });
      } else {
        form.setFields({
          rawCode: {
            value: fieldsValue.rawCode,
          },
        });
        handleAdd(fieldsValue);
      }
    });
  };
  const onChange = (e) => {
    dispatch({
      type: 'planManagement/materialCodeExist',
      payload: { rawCode: e.target.value },
    });
    form.setFields({
      rawCode: {
        value: e.target.value,
      },
    });
  };
  const renderDeptTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode
            title={item.orgnizationName}
            key={item.orgID}
            value={item.orgID}
          >
            {renderDeptTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.orgnizationName} key={item.orgID} value={item.orgID} />;
    });
  };
  // 关闭后销毁子元素
  const destroyOnClose = true;
  const switchDataType = (dataType) => {
    switch (dataType) {
      case '102.101': return (
        <Input placeholder="请输入" />
      );
      case '102.102': return (
        <InputNumber placeholder="请输入" />
      );
      case '102.103': return (
        <DatePicker
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择时间"
        />
      );
      case '102.104': return (
        <RadioGroup>
          <Radio value>是</Radio>
          <Radio value={false}>否</Radio>
        </RadioGroup>
      );
      default: break;
    }
  };
  return (
    <Modal
      destroyOnClose={destroyOnClose}
      title={isAdd ? '新增物料' : '修改物料'}
      visible={modalVisible}
      onOk={okHandle}
      width="80%"
      onCancel={() => handleModalVisible()}
    >
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <FormItem>
          {form.getFieldDecorator('rawMaterialID', {
            initialValue: isAdd ? '' : materialInfo.rawMaterialID,
            rules: [],
          })(
            <Input type="hidden" />
          )}
        </FormItem>
        <Col md={8} sm={24}>
          <FormItem
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 15 }}
            label="物料编码"
          >
            {form.getFieldDecorator('rawCode', {
              initialValue: isAdd ? '' : materialInfo.rawCode,
              rules: [
                { max: 25, message: '长度不超过25' },
              ],
            })(
              <Input onChange={onChange} placeholder="请输入物料编码" />
            )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 15 }}
            label="物料名称"
          >
            {form.getFieldDecorator('rawMaterialName', {
              initialValue: isAdd ? '' : materialInfo.rawMaterialName,
              rules: [
                { max: 25, message: '长度不超过25' },
                { required: true, message: '物料名称必填' },
                ],
            })(
              <Input placeholder="请输入物料名称" />
            )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 15 }}
            label="物料类型"
          >
            {form.getFieldDecorator('rawType', {
              initialValue: isAdd ? '' : materialInfo.rawType,
              rules: [
                { max: 25, message: '长度不超过25' },
                ],
            })(
              <Input placeholder="请输入物料类型" />
            )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 15 }}
            label="分子结构"
          >
            {form.getFieldDecorator('molecularStructure', {
              initialValue: isAdd ? '' : materialInfo.molecularStructure,
              rules: [
                { max: 25, message: '长度不超过25' },
              ],
            })(
              <Input placeholder="请输入分子结构" />
            )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 15 }}
            label="分子量"
          >
            {form.getFieldDecorator('formulaWeight', {
              initialValue: isAdd ? '' : materialInfo.formulaWeight,
              rules: [
                { type: 'integer', message: '请输入正确的数字', transform(value) { if (value) { return Number(value); } } },
              ],
            })(
              <Input placeholder="请输入分子量" />
            )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 15 }}
            label="相对密度"
          >
            {form.getFieldDecorator('relativeDensity', {
              initialValue: isAdd ? '' : materialInfo.relativeDensity,
              rules: [
                { max: 15, message: '长度不超过15' },
              ],
            })(
              <Input placeholder="请输入相对密度" />
            )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 15 }}
            label="相对蒸汽密度"
          >
            {form.getFieldDecorator('relativeSteamDensity', {
              initialValue: isAdd ? '' : materialInfo.relativeSteamDensity,
              rules: [
                { max: 15, message: '长度不超过15' },
              ],
            })(
              <Input placeholder="请输入相对蒸汽密度" />
            )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 15 }}
            label="燃烧温度"
          >
            {form.getFieldDecorator('burningTemperature', {
              initialValue: isAdd ? '' : materialInfo.burningTemperature,
              rules: [
                { type: 'integer', message: '请输入正确的数字', transform(value) { if (value) { return Number(value); } } },
              ],
            })(
              <Input placeholder="请输入燃烧温度" />
            )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 15 }}
            label="沸点℃"
          >
            {form.getFieldDecorator('boilingPoint', {
              initialValue: isAdd ? '' : materialInfo.boilingPoint,
              rules: [
                { type: 'integer', message: '请输入正确的数字', transform(value) { if (value) { return Number(value); } } },
              ],
            })(
              <Input placeholder="请输入沸点℃" />
            )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 15 }}
            label="闪点℃"
          >
            {form.getFieldDecorator('flashPoint', {
              initialValue: isAdd ? '' : materialInfo.flashPoint,
              rules: [
                { type: 'integer', message: '请输入正确的数字', transform(value) { if (value) { return Number(value); } } },
              ],
            })(
              <Input placeholder="请输入闪点℃" />
            )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 15 }}
            label="爆炸范围"
          >
            {form.getFieldDecorator('explosionRange', {
              initialValue: isAdd ? '' : materialInfo.explosionRange,
              rules: [
                { max: 25, message: '长度不超过25' },
              ],
            })(
              <Input placeholder="请输入爆炸范围" />
            )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 15 }}
            label="爆炸临界点"
          >
            {form.getFieldDecorator('explosionPoint', {
              initialValue: isAdd ? '' : materialInfo.explosionPoint,
              rules: [
                { max: 25, message: '长度不超过25' },
              ],
            })(
              <Input placeholder="请输入爆炸临界点" />
            )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 15 }}
            label="溶解性"
          >
            {form.getFieldDecorator('solubility', {
              initialValue: isAdd ? '' : materialInfo.solubility,
              rules: [
                { max: 25, message: '长度不超过25' },
              ],
            })(
              <Input placeholder="请输入溶解性" />
            )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 15 }}
            label="外观"
          >
            {form.getFieldDecorator('shape', {
              initialValue: isAdd ? '' : materialInfo.shape,
              rules: [
                { max: 50, message: '长度不超过50' },
              ],
            })(
              <Input placeholder="请输入外观" />
            )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 15 }}
            label="形状"
          >
            {form.getFieldDecorator('shapeProperty', {
              initialValue: isAdd ? '' : materialInfo.shapeProperty,
              rules: [
                { max: 50, message: '长度不超过50' },
              ],
            })(
              <Input placeholder="请输入形状" />
            )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 15 }}
            label="健康危害"
          >
            {form.getFieldDecorator('healthHazards', {
              initialValue: isAdd ? '' : materialInfo.healthHazards,
              rules: [
                { max: 100, message: '长度不超过100' },
              ],
            })(
              <TextArea placeholder="请输入说明" />
            )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 15 }}
            label="说明"
          >
            {form.getFieldDecorator('remark', {
              initialValue: isAdd ? '' : materialInfo.remark,
              rules: [
                { max: 100, message: '长度不超过100' },
              ],
            })(
              <TextArea placeholder="请输入说明" />
            )}
          </FormItem>
        </Col>
        {isAdd ? null :
          ((materialInfo.resExtendTableValueVOList || []).map((obj, index) => {
            return (
              <Col md={8} sm={24} key={obj}>
                <FormItem
                  labelCol={{ span: 7 }}
                  wrapperCol={{ span: 15 }}
                  label={`${obj.resExtendFieldInfo.caption}`}
                >
                  {form.getFieldDecorator(`${obj.resExtendFieldInfo.fieldKey}`, {
                    initialValue: isAdd ? '' : `${obj.dataValueChar}`,
                    rules: [
                      { pattern: eval(obj.resExtendFieldInfo.validateRegular), message: obj.resExtendFieldInfo.validateMsg },
                      { max: obj.resExtendFieldInfo.dataLen, message: `最大长度为${obj.resExtendFieldInfo.dataLen}` },
                    ],
                  })(
                    switchDataType(obj.resExtendFieldInfo.dataType)
                  )}
                </FormItem>
              </Col>
            );
          }))
        }
      </Row>
    </Modal>
  );
});

@connect(({ userList, typeCode, organization, planManagement }) => ({
  userList,
  typeCode,
  organization,
  planManagement,
  materialPage: planManagement.materialPage,
  materialInfo: planManagement.materialInfo,
  materialCodeExist: planManagement.materialCodeExist,
  materialMenus: planManagement.materialMenus,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    // 弹框的显示控制
    modalVisible: false,
    // 搜索栏是否展开
    expandForm: false,
    selectedRows: [],
    formValues: {},
    //  修改还是新增
    isAdd: true,
    pagenation: {}, // 列表参数
  };
  componentDidMount() {
    const { dispatch } = this.props;
    this.page(commonData.pageInitial);
    this.getFunctionMenus();
  }
  // 获取页面功能权限
  getFunctionMenus = () => {
    const { dispatch, functionInfo } = this.props;
    dispatch({
      type: 'planManagement/getMaterialMenus',
      payload: { parentCode: functionInfo.functionCode },
    });
  };
  // 判断是否有该功能权限
  judgeFunction = (functionName) => {
    const { materialMenus } = this.props;
    const arr = materialMenus.filter(item => item.functionName === functionName);
    return arr.length > 0;
  };
  // 获取分页数据
  page = (page) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'planManagement/materialPage',
      payload: page,
    });
  };
  // 初始化表格数据
  initData = () => {
    const tableTitles = [];
    commonData.columns.material.attributes.forEach((item) => {
      if (item.isTableItem) {
        tableTitles.push(item);
      }
    });
    // 操作列
    tableTitles.push({
      title: '操作',
      fixed: 'right',
      width: 160,
      render: (text, record) => {
        // 获取该行的id，可以获取的到，传到函数里的时候打印直接把整个表格所有行id全部打印了
        return (
          <Fragment>
            {this.judgeFunction('修改权限') ? (
              <a href="javascript: void(0)" onClick={() => this.update(record)}>修改</a>
            ) : null}
            {this.judgeFunction('删除权限') ? (
              <span>
                <Divider type="vertical" />
                <Popconfirm title="确定删除？" onConfirm={() => this.delete(record)}>
                  <a href="#">删除</a>
                </Popconfirm>
              </span>
            ) : null}
          </Fragment>
        );
      },
    });
    return tableTitles;
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
    this.setState({
      pagenation: {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
    if (sorter.field) {
      // params.sorter = `${sorter.field}_${sorter.order}`;
      const { field, order } = sorter;
      params.sorter = { field, order };
    }

    dispatch({
      type: 'planManagement/materialPage',
      payload: params,
    });
  };
  // 重置搜索条件
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
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

  handleMenuClick = (e) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
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
        isQuery: true,
        fuzzy: true,
        createTimes: fieldsValue.createTime ? fieldsValue.createTime.format('YYYY-MM-DD') : undefined,
      };
      if (values.createTime) { delete values.createTime; }
      // 防止将空作为查询条件
      for (const obj in values) {
        if (values[obj] === '' || values[obj] === undefined) {
          delete values[obj];
        }
      }
      const search = {};
      Object.assign(search, commonData.pageInitial, values);
      this.page(search);
    });
  };

  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
      isAdd: true,
    });
  };
  // 添加物料
  handleAdd = (fields) => {
    if (this.state.isAdd) {
      this.doAdd(fields);
    } else {
      this.doUpdate(fields);
    }
  };
  // 执行新增
  doAdd = (fields) => {
    this.props.dispatch({
      type: 'planManagement/materialAdd',
      payload: fields,
    }).then(() => {
      this.setState({
        modalVisible: false,
      });
      this.page(commonData.pageInitial);
    });
  };
  // 修改函数
  doUpdate = (fields) => {
    this.props.dispatch({
      type: 'planManagement/materialUpdate',
      payload: fields,
    }).then(() => {
      this.setState({
        modalVisible: false,
      });
      const { pagination } = this.props.materialPage;
      this.page(commonData.pageInitial);
    });
  };
  // 执行删除函数
  delete = (record) => {
    this.props.dispatch({
      type: 'planManagement/materialDelete',
      payload: { id: [record.rawMaterialID] },
    }).then(() => {
      const { pagination } = this.props.materialPage;
      this.page(commonData.pageInitial);
    });
  };
  // 导出函数
  export = () => {
    const para = commonData.pageInitial;
    delete para.pageNum;
    delete para.pageSize;
    para.showJson = [];
    commonData.columns.material.attributes.forEach((item) => {
      if (item.isExport) {
        para.showJson.push({ en: item.dataIndex, cn: item.title });
      }
    }
    );
    para.showJson = JSON.stringify(para.showJson);
    this.props.dispatch({
      type: 'userList/export',
      payload: para,
    });
  };
  deleteAll = () => {
    const userIds = [];
    this.state.selectedRows.forEach((rawMaterial) => {
      userIds.push(rawMaterial.rawMaterialID);
    });
    this.props.dispatch({
      type: 'planManagement/materialDelete',
      payload: { id: userIds },
    }).then(() => {
      this.page(this.state.pagenation);
    });
  };
  update = (record) => {
    this.setState({
      modalVisible: !this.state.modalVisible,
      isAdd: false,
    });
    this.props.dispatch({
      type: 'planManagement/materialGet',
      payload: { id: record.rawMaterialID },
    });
  };
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="物料名称">
              {getFieldDecorator('rawMaterialName')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="物料编码">
              {getFieldDecorator('rawCode')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <span className={styles.submitButtons}>
              {this.judgeFunction('新增权限') ? (
                <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                  新增
                </Button>
              ) : null}
              <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="物料名称">
              {getFieldDecorator('rawMaterialName')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="物料编码">
              {getFieldDecorator('rawCode')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </span>
        </div>
      </Form>
    );
  }

  renderForm() {
    this.renderSimpleForm();
  }
  render() {
    const { loading, materialPage, materialInfo } = this.props;
    const { list } = this.props.organization;
    const { selectedRows, modalVisible } = this.state;
    const columns = this.initData();
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <PageHeaderLayout title="物料列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderSimpleForm()}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={materialPage}
              scroll={{ x: 1940 }}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              rowKey="rawMaterialID"
            />
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          modalVisible={modalVisible}
          materialInfo={this.props.materialInfo}
          dispatch={this.props.dispatch}
          materialCodeExist={this.props.materialCodeExist}
          isAdd={this.state.isAdd}
          depList={list}
        />
      </PageHeaderLayout>
    );
  }
}
