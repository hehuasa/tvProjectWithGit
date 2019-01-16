import React, { PureComponent } from 'react';
import { Popover, Button, Checkbox, Row, Col, Select } from 'antd';
// import moment from 'moment';
// import { connect } from 'dva';
import { objByArea, newdatabyDataName, getSelctData } from '../../../../../utils/Panel';
import CommonLineChart from './CommonLineChart';
import styles from '../panel.less';

const { DataSet } = new window.DataSet();
const Option = Select.Option;

// 多个指标，多个点位
const ContentZb = ({ queryLineData, onCheckAllChange, onChange }) => {
  // const { queryLineData } = queryLineData; // indeterminate, checkAll, plainOptions, checkedList,
  return (
    <div className={styles.contentWarp}>
      <div style={{ borderBottom: '1px solid #E9E9E9' }}>
        <Checkbox
          indeterminate={queryLineData.indeterminate}
          checked={queryLineData.checkAll}
          onChange={onCheckAllChange}
        >
          {queryLineData.checkAll ? '取消全部' : '查看全部'}
        </Checkbox>
      </div>
      <Checkbox.Group style={{ width: '100%' }} value={queryLineData.checkedList} onChange={onChange}>
        <Row>
          {
            queryLineData.plainOptions ? queryLineData.plainOptions.map((item, index) => (
              <Col span={24} key={`plainOptions${index + 1}`}>
                <Checkbox value={item}>{item.slice(item.indexOf('&') + 1)}</Checkbox>
              </Col>
            )) : null
          }
        </Row>
      </Checkbox.Group>
    </div >
  );
};
const ContentDot = ({ queryLineData, onCheckAllChange, onChange }) => {
  // const { queryLineData } = queryLineData; //targetIndeterminate, targetCheckAll, targetCheckedList, target,
  return (
    <div className={styles.contentWarp}>
      <div style={{ borderBottom: '1px solid #E9E9E9' }}>
        <Checkbox
          indeterminate={queryLineData.targetIndeterminate}
          checked={queryLineData.targetCheckAll}
          onChange={onCheckAllChange}
        >
          {queryLineData.targetCheckAll ? '取消全部' : '查看全部'}
        </Checkbox>
      </div>
      <Checkbox.Group style={{ width: '100%' }} value={queryLineData.targetCheckedList} onChange={onChange}>
        <Row>
          {
            queryLineData.target ? queryLineData.target.map((item, index) =>
                {
                  return <Col span={24} key={`target${index + 1}`}><Checkbox value={item}>{queryLineData.dataName[index]}</Checkbox></Col>
                }
              ) : null
          }
        </Row>
      </Checkbox.Group>
    </div >
  );
};
// CommonLine
class CommonLine extends PureComponent {
  componentDidMount() {
    this.props.onChangeTime(10);
  }
  handleChange = () => {
    // this.props.dispatch({
    // type: 'homepage/setRefreshTime',
    // payload: this.props.homepage.refreshTime,
    // });
  }
  render() {
    const { queryLineData, activeKeys, constantlyConditionCalc } = this.props;
    let newQueryLineData;
    if (queryLineData) {
      newQueryLineData = JSON.parse(JSON.stringify(queryLineData));
    }
    const showLineData = getSelctData({ queryLineData: newQueryLineData }); // 获取需要展示的 点位
    const data = objByArea({ dataOll: showLineData });
    const newData = [];
    // 需要展示的指标
    for (const obj of Object.keys(data.target)) {
      if (queryLineData.targetCheckedList && queryLineData.targetCheckedList.indexOf(obj) !== -1) {
        newData.push(data.target[obj]);
      }
    }
    const dataName = newdatabyDataName({ newData });
    const allDv = [];
    if (newData.length > 0) {
      const ds = new DataSet();
      if (newData[0] && newData[0][0]) {
        for (const item of newData.entries()) {
          debugger;
          const dv = ds.createView().source(item[1]);
          dv.transform({
            type: 'fold',
            fields: dataName[item[0]], // 展开字段集
            key: 'city', // key字段
            value: 'temperature', // value字段
          });
          allDv.push(dv);
        }
      }
    }
    return (
      <div>
        <div style={{ float: 'right' }}>
          <Select defaultValue="10分钟以内的数据" onSelect={this.props.onChangeTime} size="small" style={{ marginRight: 5 }} >
            <Option title="10分钟以内的数据" value={10}>10分钟以内的数据</Option>
            <Option title="30分钟以内的数据" value={30}>30分钟以内的数据</Option>
            {/*<Option title="1天以内的数据" value={60 * 24}>1天以内的数据</Option>*/}
          </Select>
          <Popover
            placement="bottomRight"
            content={
              <ContentDot
                queryLineData={queryLineData}
                onChange={this.props.onChange1}
                onCheckAllChange={this.props.onCheckAllChange1}
              />
            }
            trigger="click"
          >
            <Button size="small" style={{ marginRight: 5 }} >选择指标</Button>
          </Popover>
          <Popover
            placement="bottomRight"
            content={
              <ContentZb
                queryLineData={queryLineData}
                onChange={this.props.onChange}
                onCheckAllChange={this.props.onCheckAllChange}
              />
            }
            trigger="click"
          >
            <Button size="small">选择点位</Button>
          </Popover>
        </div>
        {
          (newData.length === 0 || dataName.length === 0) ?
            <div className={styles.noData}>暂无数据</div> : (
              <CommonLineChart
                activeKeys={activeKeys}
                allDv={allDv}
                targetCheckedList={queryLineData.targetCheckedList}
                mainMap={this.props.mainMap}
                dispatch={this.props.dispatch}
                constantlyConditionCalc={constantlyConditionCalc}
              />
            )}
      </div >
    );
  }
}
export default CommonLine;
