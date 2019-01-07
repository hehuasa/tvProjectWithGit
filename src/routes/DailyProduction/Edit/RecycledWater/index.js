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
  recycledWater: productionDaily.recycledWater,
  startTimes: productionDaily.startTimes,
}))
class RecycledWater extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { editingKey: '' };
    this.columns = [
      {
        title: '项目',
        dataIndex: 'itemName',
        width: '10%',
        editable: false,
      },
      {
        title: '用量',
        dataIndex: '用量(吨/时)',
        width: '10%',
        editable: true,
      },
      {
        title: 'PH值',
        dataIndex: 'PH值(7.2-9.0)',
        width: '10%',
        editable: true,
      },
      {
        title: '浊度',
        dataIndex: '浊度(≤10)',
        width: '10%',
        editable: true,
      },
      {
        title: '浓缩倍数',
        dataIndex: '浓缩倍数(≥4)',
        width: '10%',
        editable: true,
      },
      {
        title: '钙硬度',
        dataIndex: '钙硬度(100-450)',
        width: '10%',
        editable: true,
      },
      {
        title: '碱浓度',
        dataIndex: '碱浓度(<700)',
        width: '10%',
        editable: true,
      },
      {
        title: '钼酸根',
        dataIndex: '钼酸根(0.8-1.5)',
        width: '10%',
        editable: true,
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
        },
      },
    ];
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'productionDaily/getRecycledWater',
      payload: { powerConsumetype: 2 },
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
      const newData = this.props.recycledWater;
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
          type: 'productionDaily/saveThermoelectricFurnace',
          payload: newData,
        });
        // 保存修改内容
        const { startTimes } = this.props;
        const jsonString = { ...newData[index], startTimes };
        dispatch({
          type: 'productionDaily/updateRecycledWater',
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
      type: 'productionDaily/getRecycledWater',
      payload: { powerConsumetype: 2, startTimes },
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
    const { recycledWater } = this.props;
    recycledWater.map((item, index) => {
      item.key = index;
      return item;
    });
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
          dataSource={recycledWater}
          columns={columns}
        />
      </div>
    );
  }
}
export default connect()(RecycledWater);
