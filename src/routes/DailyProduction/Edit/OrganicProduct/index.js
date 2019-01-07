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
  organicProduct: productionDaily.organicProduct,
  startTimes: productionDaily.startTimes,
}))
class OrganicProduct extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { editingKey: '' };
    this.columns = [
      {
        title: '有机产品名称',
        dataIndex: 'rawMaterialNam',
        width: '13%',
        editable: false,
        render: (text, record) => {
          if (record.rawMaterialNam !== '合计') {
            return text;
          } else {
            return <strong>{text}</strong>;
          }
        },
      },
      {
        title: '罐存',
        dataIndex: '罐存',
        width: '13%',
        editable: true,
      },
      {
        title: '罐存率 %',
        dataIndex: 'rate',
        width: '13%',
        editable: false,
        render: (text, record) => {
          return (parseFloat(text) * 100).toFixed(2);
        },
      },
      {
        title: '月计划',
        dataIndex: '月出厂计划',
        width: '13%',
        editable: true,
      },
      {
        title: '日出厂',
        dataIndex: '日出厂量',
        width: '13%',
        editable: true,
      },
      {
        title: '月累计出厂',
        dataIndex: 'monthOutput',
        width: '13%',
        editable: false,
      },
      {
        title: '月出厂进度 %',
        dataIndex: 'process',
        width: '13%',
        editable: false,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          const editable = this.isEditing(record);
          if (record.rawMaterialNam !== '合计') {
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
      type: 'productionDaily/getOrganicProduct',
      payload: { rawInfoType: '112.102' },
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
      const newData = this.props.organicProduct;
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
          type: 'productionDaily/saveOrganicProduct',
          payload: newData,
        });
        // 保存修改内容
        const { startTimes } = this.props;
        const jsonString = { startTimes, ...newData[index] };
        dispatch({
          type: 'productionDaily/updateOrganicProduct',
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
      type: 'productionDaily/getOrganicProduct',
      payload: { rawInfoType: '112.102', startTimes },
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
    const { organicProduct } = this.props;
    const total = { rawMaterialNam: '合计', 罐存: 0, capacity: 0, rate: 0, 月出厂计划: 0, 日出厂量: 0, monthOutput: 0, process: 0 };
    organicProduct.map((item, index) => {
      item.key = index;
      item.process = ((item.monthOutput / item.月出厂计划) * 100).toFixed(2);
      total.罐存 += parseFloat(item.罐存);
      total.月出厂计划 += parseFloat(item.月出厂计划);
      total.日出厂量 += parseFloat(item.日出厂量);
      total.monthOutput += parseFloat(item.monthOutput);
      total.capacity += parseFloat(item.capacity);
      return item;
    });
    total.rate = (total.罐存 / total.capacity).toFixed(4);
    total.process = (total.monthOutput / total.月出厂计划).toFixed(4) * 100;
    if(organicProduct.length > 0) {
      organicProduct.push(total);
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
          dataSource={organicProduct}
          columns={columns}
        />
      </div>
    );
  }
}
export default connect()(OrganicProduct);
