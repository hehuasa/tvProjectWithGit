import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Scrollbars } from 'react-custom-scrollbars';
import { fakeData } from './lib/data';
import { tableI } from './lib/grid';
import Rubylong from './lib/grid++Report';
import styles from './index.less';

const a = '<div><span style="font-size: 18px;">Quill Rich Text FlowEditor</span>' +
  '</div><div><br></div><div>Quill is a free, <a href="https://githu' +
  'b.com/quilljs/quill/">open source</a> WYSIWYG editor built for th' +
  'e modern web. With its <a href="http://quilljs.com/docs/modules/"' +
  '>extensible architecture</a> and a <a href="http://quilljs.com/do' +
  'cs/api/">expressive API</a> you can completely customize it to fu' +
  'lfill your needs. Some built in features include:</div><div><br><' +
  '/div><ul><li>Fast and lightweight</li><li>Semantic markup</li><li' +
  '>Standardized HTML between browsers</li><li>Cross browser support' +
  ' including Chrome, Firefox, Safari, and IE 9+</li></ul><div><br><' +
  '/div><div><span style="font-size: 18px;">Downloads</span></div><d' +
  'iv><br></div><ul><li><a href="https://quilljs.com">Quill.js</a>, ' +
  'the free, open source WYSIWYG editor</li><li><a href="https://zen' +
  'oamaro.github.io/react-quill">React-quill</a>, a React component ' +
  'that wraps Quill.js</li></ul>';
const testData = {};
// 处理数据
// 各装置生产情况
const proStatus = (data) => {
  // 装置分组
  const object = {};
  for (const device of data) {
    if (object[device.baseOrganization.orgID]) {
      if (Number(device.productType) === 1) {
        object[device.baseOrganization.orgID].in.push(device);
        object[device.baseOrganization.orgID].dailyInCount += device.dailyOutput;
      } else {
        object[device.baseOrganization.orgID].out.push(device);
        if (device.resRawMaterialInfo.rawMaterialName !== '损失') {
          object[device.baseOrganization.orgID].dailyOutCount += device.dailyOutput;
        }
      }
    } else {
      object[device.baseOrganization.orgID] = { in: [], out: [], dailyInCount: 0, dailyOutCount: 0 };
      if (Number(device.productType) === 1) {
        object[device.baseOrganization.orgID].in.push(device);
        object[device.baseOrganization.orgID].dailyInCount += device.dailyOutput;
      } else {
        object[device.baseOrganization.orgID].out.push(device);
        if (device.resRawMaterialInfo.rawMaterialName !== '损失') {
          object[device.baseOrganization.orgID].dailyOutCount += device.dailyOutput;
        }
      }
    }
  }
  // 计算 收率&月进度, 生成最终数据
  const proStatusData = [];
  for (const device of data) {
    proStatusData.push({
      rawMaterialName: device.resRawMaterialInfo.rawMaterialName,
      orgnizationName: device.baseOrganization.orgnizationName,
      type: Number(device.productType) === 1 ? '投入' : '产出',
      monthPlan: device.monthPlan.toFixed(2),
      dailyOutput: device.dailyOutput.toFixed(2),
      monthOutput: device.monthOutput.toFixed(2),
      yield: Number(device.productType) === 1 ? '/' : device.resRawMaterialInfo.rawMaterialName === '损失' ? `${(100 - (object[device.baseOrganization.orgID].dailyOutCount / object[device.baseOrganization.orgID].dailyInCount) * 100).toFixed(2)}%` : `${(device.dailyOutput / object[device.baseOrganization.orgID].dailyInCount * 100).toFixed(2)}%`,
      progress: device.resRawMaterialInfo.rawMaterialName === '损失' ? '/' : Number(device.monthPlan) === 0 ? '/' : `${(device.monthOutput / device.monthPlan * 100).toFixed(2)}%`,
    });
  }
  return proStatusData;
};
const getLieJ = (data) => {
  const array = [];
  for (const [index, value] of data.entries()) {
    if (index % 2 === 0) {
      array.push(value);
    } else {
      const obj = { yuan1: value.yuan, collectTime1: value.collectTime, stateID1: value.stateID, lu1: value.lu, COT1: value.COT, 负荷1: value['负荷'], id1: value.id, 天数1: value['天数'] };
      Object.assign(array[array.length - 1], obj);
    }
  }
  return array;
};
const getRF = (redian, fadian) => {
  const array = [];
  const getArray = (A, B) => {
    for (const [index, value] of A.entries()) {
      array.push(value);
      if (B[index]) {
        Object.assign(value, B[index]);
      }
    }
  };
  redian.length >= fadian.length ? getArray(redian, fadian) : getArray(fadian, redian);
  return array;
};
// 按异步方式请求一个URL的文本数据，在成功后调用回调函数
export default class Table1 extends PureComponent {
  render() {
    const list = this.props.data;
    let text = '';
    if (list.length > 0) {
      text = list[0].shengchan[0] ? list[0].shengchan[0].reportInfo : '';
      testData.wuliao1 = { table: proStatus(list[0].proStatus.slice(0, 53)) };
      testData.wuliao2 = { table: proStatus(list[0].proStatus.splice(53, 28)) };
      testData.liejielu = { table: getLieJ(list[0].liejie) };
      for (const device of list[0].fadian) {
        device['运行天数1'] = device['运行天数'];
        device.lu1 = device.lu;
        delete device['运行天数'];
        delete device.lu;
      }
      testData.fadianji = { table: getRF(list[0].redian, list[0].fadian) };
      const rending = () => {
        const tables = ['wuliao1', 'wuliao2', 'liejielu', 'fadianji'];
        const Rubylongs = [];
        for (const table of tables) {
          const ruby = Rubylong.rubylong.grhtml5.insertReportViewer(table);
          ruby.reportPrepared = false; // 指定报表生成需要加载报表模板
          ruby.dataPrepared = false; // 指定报表生成需要加载报表数据
          ruby.loadReport(tableI[table]);
          ruby.loadData(testData[table]);
          Rubylongs.push(ruby);
        }
      };
      rending();
    }
    return (
      <Scrollbars>
        <div className={styles.list}>
          <div id="wuliao1" className={styles.part1} ref={ref => this.warp = ref} />
          <div id="wuliao2" className={styles.part2} ref={ref => this.warp = ref} />
          <div id="liejielu" className={styles.part3} ref={ref => this.warp = ref} />
          <div id="fadianji" className={styles.part4} ref={ref => this.warp = ref} />
          <div className={styles.part5} >
            <Scrollbars>
              <div dangerouslySetInnerHTML={{ __html: text }} />
            </Scrollbars>
          </div>
        </div>
      </Scrollbars>
    );
  }
}
