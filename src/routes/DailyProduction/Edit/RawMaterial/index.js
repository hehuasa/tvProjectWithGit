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
  rawMaterial: productionDaily.rawMaterial,
  startTimes: productionDaily.startTimes,
}))
class RawMaterial extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { editingKey: '' };
    this.columns = [
      {
        title: '原料',
        dataIndex: 'rawMaterialNam',
        width: '18%',
        editable: false,
        render: (text, record) => {
          if (record.rawMaterialNam === '合计') {
            return <strong>{text}</strong>;
          } else {
            return text;
          }
        },
      },
      {
        title: '罐存',
        dataIndex: '罐存',
        width: '18%',
        editable: true,
      },
      {
        title: '罐存率',
        dataIndex: 'rate',
        width: '18%',
        editable: false,
        render: (text, record) => {
          if (record.rawMaterialNam === '合计') {
            return (record.罐存 / record.totalCapacity).toFixed(4) * 100;
          } else {
            return text * 100;
          }
        },
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
      type: 'productionDaily/getRawMaterial',
      payload: { rawInfoType: '112.101' },
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
      const newData = this.props.rawMaterial;
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
          type: 'productionDaily/saveRawMaterial',
          payload: newData,
        });
        // 保存修改内容
        const { startTimes } = this.props;
        const jsonString = { ...newData[index], startTimes };
        dispatch({
          type: 'productionDaily/updateRawMaterial',
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
      type: 'productionDaily/getRawMaterial',
      payload: { rawInfoType: '112.101', startTimes },
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
    const { rawMaterial } = this.props;
    const total = { rawMaterialNam: '合计', 罐存: 0, rate: 0 };
    let totalCapacity = 0;
    rawMaterial.map((item, index) => {
      item.key = index;
      totalCapacity += item.capacity;
      total.罐存 += item.罐存;
      return item;
    });
    total.totalCapacity = totalCapacity;
    if (rawMaterial.length > 0) {
      rawMaterial.push(total);
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
          dataSource={rawMaterial}
          columns={columns}
        />
      </div>
    );
  }
}
export default connect()(RawMaterial);
