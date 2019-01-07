import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Table, InputNumber, Input, Popconfirm, Form, DatePicker } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber size="small" />;
    }
    return <Input size="small" />;
  };
  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      ...restProps
    } = this.props;
    return (
      <EditableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem>
                  {getFieldDecorator(dataIndex, {
                    rules: [
                      {
                        required: true,
                        message: `Please Input ${title}!`,
                      },
                    ],
                    initialValue: record[dataIndex],
                  })(this.getInput())}
                </FormItem>
              ) : (
                restProps.children
              )}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}

@connect(({ productionDaily }) => ({
  deviceProduction: productionDaily.deviceProduction,
  startTimes: productionDaily.startTimes,
}))
class DeviceProduction extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { editingKey: '' };
    this.columns = [
      {
        title: '装置名称',
        dataIndex: 'baseOrganization',
        width: '10%',
        editable: false,
        render: (text, record) => {
          const obj = {
            children: record.baseOrganization.orgnizationName,
            props: {},
          };
          if (record.deviceRowSpan) {
            obj.props.rowSpan = record.deviceRowSpan;
          } else {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: '类别',
        dataIndex: 'productType',
        width: '10%',
        editable: false,
        render: (text, record) => {
          const obj = {
            children: text === 1 ? '投入' : text === 2 ? '产出' : '',
            props: {},
          };
          if (record.typeRowSpan) {
            obj.props.rowSpan = record.typeRowSpan;
          } else {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: '物料名称',
        dataIndex: 'resRawMaterialInfo',
        width: '12%',
        editable: false,
        render: (text, record) => record.resRawMaterialInfo.rawMaterialName,
      },
      {
        title: '月计划',
        dataIndex: 'monthPlan',
        width: '12%',
        editable: false,
      },
      {
        title: '日完成',
        dataIndex: 'dailyOutput',
        width: '12%',
        editable: true,
      },
      {
        title: '月完成',
        dataIndex: 'monthOutput',
        width: '12%',
        editable: false,
      },
      {
        title: '收率 %',
        dataIndex: 'percent',
        width: '10%',
        editable: false,
      },
      {
        title: '月进度 %',
        dataIndex: 'monthProcess',
        width: '10%',
        editable: false,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          const editable = this.isEditing(record);
          return (
            <div className="editable-row-operations">
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => (
                      <a
                        href="javascript:;"
                        onClick={() => this.save(form, record.equipmentProductInfoID)}
                      >
                        保存
                      </a>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm
                    title="确定取消修改?"
                    onConfirm={() => this.cancel(record.key)}
                  >
                    <a style={{ marginLeft: 15 }}>取消</a>
                  </Popconfirm>
                </span>
              ) : (
                <a onClick={() => this.edit(record.equipmentProductInfoID)}>修改</a>
              )}
            </div>
          );
        },
      },
    ];
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'productionDaily/getDeviceProduction',
      payload: {},
    });
  }
  edit(key) {
    this.setState({ editingKey: key });
  }
  save(from, key) {
    from.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = this.props.deviceProduction;
      const { dispatch } = this.props;
      const index = newData.findIndex(item => key === item.equipmentProductInfoID);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ editingKey: '' });
        dispatch({
          type: 'productionDaily/saveDeviceProduction',
          payload: newData,
        });
        // 保存修改内容
        const { startTimes } = this.props;
        const { equipmentProductInfoID, dailyOutput } = newData[index];
        dispatch({
          type: 'productionDaily/updateDeviceProduction',
          payload: { startTimes, equipmentProductInfoID, dailyOutput },
        });
      }
    });
  }
  cancel = () => {
    this.setState({ editingKey: '' });
  };
  // 时间搜索
  onTimeChange = (date, dateString) => {
    const startTimes = date ? (date.format('X') * 1000) : (moment().format('X') * 1000);
    this.props.dispatch({
      type: 'productionDaily/getDeviceProduction',
      payload: { startTimes },
    });
    this.props.dispatch({
      type: 'productionDaily/saveStartTimes',
      payload: { startTimes },
    });
  };
  isEditing = (record) => {
    return record.equipmentProductInfoID === this.state.editingKey;
  };
  render() {
    const { deviceProduction } = this.props;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });
    // 计算收率和月进度
    deviceProduction.map((item) => {
      if (item.productType === 1) {
        item.percent = '/';
      } else {
        let putIn = 0;
        const devices = deviceProduction.filter(temp => temp.baseOrganization.orgID === item.baseOrganization.orgID);
        const days = devices.filter(temp => temp.productType === 1);
        days.forEach((temp) => {
          putIn += temp.dailyOutput;
        });
        item.percent = ((item.dailyOutput / putIn) * 100).toFixed(2);
      }
      item.monthProcess = (100 * (item.monthOutput || 0) / item.monthPlan).toFixed(2);
      return item;
    });
    // 计算行合并
    // 按装置界区分
    const devices = [];
    // 处理后的数据
    const resultData = [];
    deviceProduction.forEach((item) => {
      devices.find(n => n === item.baseOrganization.orgnizationName) ?
        '' : devices.push(item.baseOrganization.orgnizationName);
    });
    devices.forEach((item, index) => {
      // 分类后的数据
      const typeData = [];
      // 按装置分类
      const arr = deviceProduction.filter(temp => item === temp.baseOrganization.orgnizationName);
      // 按投入、产出分类
      const typeArr1 = arr.filter(temp => temp.productType === 1);
      const typeArr2 = arr.filter(temp => temp.productType === 2);
      if (typeArr1.length > 0) {
        typeArr1[0].typeRowSpan = typeArr1.length;
      }
      if (typeArr2.length > 0) {
        typeArr2[0].typeRowSpan = typeArr2.length;
      }
      // 计算损失
      let outTotal = 0;
      typeArr2.forEach((each) => {
        if (each.resRawMaterialInfo.rawMaterialName !== '损失') {
          outTotal += parseFloat(each.percent);
        }
      });
      typeArr2.map((each) => {
        if (each.resRawMaterialInfo.rawMaterialName === '损失') {
          each.percent = 100 - outTotal;
        }
        return each;
      });
      typeData.push(...typeArr1);
      typeData.push(...typeArr2);
      if (typeData.length > 0) {
        typeData[0].deviceRowSpan = typeData.length;
      }
      resultData.push(...typeData);
    });
    return (
      <div className={styles.content}>
        <div className={styles.searchTime}>
          <span>查询日期:</span><DatePicker defaultValue={moment().add(-1, 'day')} onChange={this.onTimeChange} />
        </div>
        <Table
          components={components}
          bordered
          dataSource={resultData}
          columns={columns}
          rowKey={() => Math.random()}
          pagination={{ pageSize: 1000 }}
        />
      </div>
    );
  }
}
export default connect()(DeviceProduction);
