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
  resinProduct: productionDaily.resinProduct,
  startTimes: productionDaily.startTimes,
}))
class ResinProduct extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { editingKey: '' };
    this.columns = [
      {
        title: '产品',
        dataIndex: 'rawMaterialNam',
        width: '12%',
        editable: false,
        render: (text, record) => {
          if (record.rawMaterialNam === '化销合计' || record.rawMaterialNam === 'SK合计' || record.rawMaterialNam === '合计') {
            return <strong>{text}</strong>;
          } else {
            return text;
          }
        },
      },
      {
        title: '厂内库存',
        dataIndex: '厂内库存',
        width: '12%',
        editable: true,
      },
      {
        title: '厂内库存率(%)',
        dataIndex: 'rate',
        width: '10%',
        editable: false,
        render: (text, record) => {
          return text ? (parseFloat(text) * 100).toFixed(2) : '';
        },
      },
      {
        title: '日入库',
        dataIndex: '日入库',
        width: '12%',
        editable: true,
      },
      {
        title: '日出厂',
        dataIndex: '日出厂量',
        width: '12%',
        editable: true,
      },
      {
        title: '月出厂计划',
        dataIndex: '月出厂计划',
        width: '12%',
        editable: true,
      },
      {
        title: '月累计出厂',
        dataIndex: 'monthOutput',
        width: '12%',
        editable: false,
      },
      {
        title: '月出厂进度(%)',
        dataIndex: 'process',
        width: '10%',
        editable: false,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          const editable = this.isEditing(record);
          if (record.rawMaterialNam !== '化销合计' && record.rawMaterialNam !== 'SK合计' && record.rawMaterialNam !== '合计') {
            return (
              <div className="editable-row-operations">
                {editable ? (
                  <span>
                    <EditableContext.Consumer>
                      {form => (
                        <a
                          href="javascript:;"
                          onClick={() => this.save(form, record.key)}
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
                  <a onClick={() => this.edit(record.key)}>修改</a>
                )}
              </div>
            );
          }
        },
      },
    ];
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'productionDaily/getResinProduct',
      payload: { rawInfoType: '112.103' },
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
      const newData = this.props.resinProduct;
      const { dispatch } = this.props;
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ editingKey: '' });
        dispatch({
          type: 'productionDaily/saveResinProduct',
          payload: newData,
        });
        // 保存修改内容
        const { startTimes } = this.props;
        const jsonString = { startTimes, ...newData[index] };
        dispatch({
          type: 'productionDaily/updateResinProduct',
          payload: { jsonString: JSON.stringify(jsonString) },
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
      type: 'productionDaily/getResinProduct',
      payload: { rawInfoType: '112.103', startTimes },
    });
    this.props.dispatch({
      type: 'productionDaily/saveStartTimes',
      payload: { startTimes },
    });
  };
  isEditing = (record) => {
    return record.key === this.state.editingKey;
  };
  render() {
    const { resinProduct } = this.props;
    resinProduct.map((item, index) => {
      item.key = index;
      item.process = ((item.monthOutput / item.月出厂计划) * 100).toFixed(2);
      return item;
    });
    const hx = resinProduct.filter(item => item.rawMaterialNam.indexOf('化销') > 0);
    const sk = resinProduct.filter(item => item.rawMaterialNam.indexOf('SK') > 0);
    const hxTotal = { rawMaterialNam: '化销合计', 厂内库存: 0, capacity: 0, 日入库: 0, 日出厂量: 0, 月出厂计划: 0, monthOutput: 0, process: 0 };
    const skTotal = { rawMaterialNam: 'SK合计', 厂内库存: 0, capacity: 0, 日入库: 0, 日出厂量: 0, 月出厂计划: 0, monthOutput: 0, process: 0 };
    const total = { rawMaterialNam: '合计', 厂内库存: 0, capacity: 0, 日入库: 0, 日出厂量: 0, 月出厂计划: 0, monthOutput: 0, process: 0 };
    hx.forEach((item) => {
      hxTotal.厂内库存 += parseFloat(item.厂内库存);
      hxTotal.capacity += parseFloat(item.capacity);
      hxTotal.日入库 += parseFloat(item.日入库);
      hxTotal.日出厂量 += parseFloat(item.日出厂量);
      hxTotal.月出厂计划 += parseFloat(item.月出厂计划);
      hxTotal.monthOutput += parseFloat(item.monthOutput);
      total.厂内库存 += parseFloat(item.厂内库存);
      total.日入库 += parseFloat(item.日入库);
      total.日出厂量 += parseFloat(item.日出厂量);
      total.月出厂计划 += parseFloat(item.月出厂计划);
      total.monthOutput += parseFloat(item.monthOutput);
    });
    sk.forEach((item) => {
      skTotal.厂内库存 += parseFloat(item.厂内库存);
      skTotal.capacity += parseFloat(item.capacity);
      skTotal.日入库 += parseFloat(item.日入库);
      skTotal.日出厂量 += parseFloat(item.日出厂量);
      skTotal.月出厂计划 += parseFloat(item.月出厂计划);
      skTotal.monthOutput += parseFloat(item.monthOutput);
      total.厂内库存 += parseFloat(item.厂内库存);
      total.日入库 += parseFloat(item.日入库);
      total.日出厂量 += parseFloat(item.日出厂量);
      total.月出厂计划 += parseFloat(item.月出厂计划);
      total.monthOutput += parseFloat(item.monthOutput);
    });
    if (hx.length > 0) {
      hxTotal.process = ((hxTotal.monthOutput / hxTotal.月出厂计划) * 100).toFixed(2);
      hxTotal.rate = hxTotal.厂内库存 / hxTotal.capacity;
      hx.push(hxTotal);
    }
    if (sk.length > 0) {
      skTotal.process = ((skTotal.monthOutput / skTotal.月出厂计划) * 100).toFixed(2);
      skTotal.rate = skTotal.厂内库存 / skTotal.capacity;
      total.process = ((total.monthOutput / total.月出厂计划) * 100).toFixed(2);
      total.rate = (hxTotal.厂内库存 + skTotal.厂内库存) / (hxTotal.capacity + skTotal.capacity);
      sk.push(skTotal);
      sk.push(total);
    }
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
    return (
      <div className={styles.content}>
        <div className={styles.searchTime}>
          <span>查询日期:</span><DatePicker defaultValue={moment().add(-1, 'day')} onChange={this.onTimeChange} />
        </div>
        <Table
          components={components}
          bordered
          dataSource={[...hx, ...sk]}
          columns={columns}
        />
      </div>
    );
  }
}
export default connect()(ResinProduct);
