import React, {PureComponent} from 'react';
import { Select } from 'antd';
import styles from './index.less'
const Option = Select.Option;

function handleChange(value) {

}

export default class ResourceSelect extends PureComponent {
  render (){
    return (
      <div>
        <Select defaultValue="机构" style={{ width: 190 ,marginLeft:7.5}} onChange={handleChange} className={styles.select}>
          <Option value="机构">机构</Option>
          <Option value="专业">专业</Option>
        </Select>
      </div>
    )
  }
}
