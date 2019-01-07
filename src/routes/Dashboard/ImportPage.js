import React, { PureComponent } from 'react'
import { Select,Table,Button,Row,Col } from 'antd';
import { connect } from 'dva'
import styles from './ImportPage.less'

@connect (({importConfig})=>({
  importConfig
}))
export default class ImportPage extends PureComponent {

  componentDidMount(){
    this.props.dispatch({
      type:'importConfig/config'
    })
  }
  render(){
    const {data}=this.props.importConfig;
    const handleChange=(value,option)=>{

    };
    //配置下拉菜单
    const Option = Select.Option;
    //表的下拉内容
    const allTables=[];
    for(let i=0;i<data.allTable.length;i++){
      allTables.push(<Option key={data.allTable[i].id} value={data.allTable[i].id} title={data.allTable[i].name}>{data.allTable[i].name}</Option>);
    }
    //选项的下拉
    const children = [];
    for (let i = 10; i < 36; i++) {
      children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
    }
    //配置表格
    const dataSource = [];
    for(let i=0;i<10;i++){
      dataSource.push({
        key: i,
        name: '胡彦斌'+i,
        age: 32+i,
        address: '西湖区湖底公园1号',
        config:<Select
          mode=""
          style={{ width: 200 }}
          placeholder="选择匹配字段"
        >
          {children}
        </Select>
      })
    }

    const columns = [{
      title: '表名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '字段名(EN)',
      dataIndex: 'age',
      key: 'age',
    }, {
      title: '字段名(CN)',
      dataIndex: 'address',
      key: 'address',
    }, {
      title: '字段匹配',
      dataIndex: 'config',
      key: 'config',
    }];
    return(
      <div className={styles.main}>
        <div className={styles.content}>
          <div>
            <Select
              ref={'selectedTable'}
              labelInValue={true}
              onChange={handleChange}
              defaultValue={{key:"角色表"}}
              style={{ width: 300 }}
              placeholder="选择需要配置的表"
              className={styles.customSelect}
            >
              {allTables}
            </Select>
          </div>
          <div className={styles.table}>
            <Table dataSource={dataSource} columns={columns} pagination={{pageSize:5}}/>
          </div>
          <div className={styles.btn}>
            <Button>返回</Button>
            <Button type="primary">确定</Button>
          </div>
        </div>
      </div>
    )
  }
}