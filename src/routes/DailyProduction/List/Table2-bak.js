import React, { PureComponent } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import WEditor from '../../../components/WEditor';
import { tableII } from './lib/grid';
import Rubylong from './lib/grid++Report';
import { fakeData } from './lib/data';
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
const testData = {
  yuanliao: {
    data: [
      { Field1: '加氢尾油', Field2: 4091, Field3: '61%' },
      { Field1: '加氢尾油', Field2: 4091, Field3: '61%' },
      { Field1: '加氢尾油', Field2: 4091, Field3: '61%' },
      { Field1: '加氢尾油', Field2: 4091, Field3: '61%' },
      { Field1: '加氢尾油', Field2: 4091, Field3: '61%' },
      { Field1: '加氢尾油', Field2: 4091, Field3: '61%' },
      { Field1: '加氢尾油', Field2: 4091, Field3: '61%' },
      { Field1: '加氢尾油', Field2: 4091, Field3: '61%' },
      { Field1: '加氢尾油', Field2: 4091, Field3: '61%' },
      { Field1: '加氢尾油', Field2: 4091, Field3: '61%' },
      { Field1: '加氢尾油', Field2: 4091, Field3: '61%' },
      { Field1: '加氢尾油', Field2: 4091, Field3: '61%' },
      { Field1: '加氢尾油', Field2: 4091, Field3: '61%' },
      { Field1: '加氢尾油', Field2: 4091, Field3: '61%' },
      { Field1: '加氢尾油', Field2: 4091, Field3: '61%' },
      { Field1: '加氢尾油', Field2: 4091, Field3: '61%' },
      { Field1: '加氢尾油', Field2: 4091, Field3: '61%' },
      { Field1: '加氢尾油', Field2: 4091, Field3: '61%' },
      { Field1: '加氢尾油', Field2: 4091, Field3: '61%' },
      { Field1: '加氢尾油', Field2: 4091, Field3: '61%' },
      { Field1: '加氢尾油', Field2: 4091, Field3: '61%' },
      { Field1: '加氢尾油', Field2: 4091, Field3: '61%' },
      { Field1: '加氢尾油', Field2: 4091, Field3: '61%' },
    ],
  },
  six: { Table: [
    { Field1: '环氧乙烷', Field2: 7766, Field3: '45.2%', Field4: 18000, Field5: 84, Field6: 15735, Field7: '87.0%' },
    { Field1: '环氧乙烷', Field2: 7766, Field3: '45.2%', Field4: 18000, Field5: 84, Field6: 15735, Field7: '87.0%' },
    { Field1: '环氧乙烷', Field2: 7766, Field3: '45.2%', Field4: 18000, Field5: 84, Field6: 15735, Field7: '87.0%' },
    { Field1: '环氧乙烷', Field2: 7766, Field3: '45.2%', Field4: 18000, Field5: 84, Field6: 15735, Field7: '87.0%' },
    { Field1: '环氧乙烷', Field2: 7766, Field3: '45.2%', Field4: 18000, Field5: 84, Field6: 15735, Field7: '87.0%' },
    { Field1: '环氧乙烷', Field2: 7766, Field3: '45.2%', Field4: 18000, Field5: 84, Field6: 15735, Field7: '87.0%' },
    { Field1: '环氧乙烷', Field2: 7766, Field3: '45.2%', Field4: 18000, Field5: 84, Field6: 15735, Field7: '87.0%' },
    { Field1: '环氧乙烷', Field2: 7766, Field3: '45.2%', Field4: 18000, Field5: 84, Field6: 15735, Field7: '87.0%' },
    { Field1: '环氧乙烷', Field2: 7766, Field3: '45.2%', Field4: 18000, Field5: 84, Field6: 15735, Field7: '87.0%' },
    { Field1: '环氧乙烷', Field2: 7766, Field3: '45.2%', Field4: 18000, Field5: 84, Field6: 15735, Field7: '87.0%' },
    { Field1: '环氧乙烷', Field2: 7766, Field3: '45.2%', Field4: 18000, Field5: 84, Field6: 15735, Field7: '87.0%' },
    { Field1: '环氧乙烷', Field2: 7766, Field3: '45.2%', Field4: 18000, Field5: 84, Field6: 15735, Field7: '87.0%' },
    { Field1: '环氧乙烷', Field2: 7766, Field3: '45.2%', Field4: 18000, Field5: 84, Field6: 15735, Field7: '87.0%' },
    { Field1: '环氧乙烷', Field2: 7766, Field3: '45.2%', Field4: 18000, Field5: 84, Field6: 15735, Field7: '87.0%' },
    { Field1: '环氧乙烷', Field2: 7766, Field3: '45.2%', Field4: 18000, Field5: 84, Field6: 15735, Field7: '87.0%' },
    { Field1: '环氧乙烷', Field2: 7766, Field3: '45.2%', Field4: 18000, Field5: 84, Field6: 15735, Field7: '87.0%' },
    { Field1: '环氧乙烷', Field2: 7766, Field3: '45.2%', Field4: 18000, Field5: 84, Field6: 15735, Field7: '87.0%' },
    { Field1: '环氧乙烷', Field2: 7766, Field3: '45.2%', Field4: 18000, Field5: 84, Field6: 15735, Field7: '87.0%' },
    { Field1: '环氧乙烷', Field2: 7766, Field3: '45.2%', Field4: 18000, Field5: 84, Field6: 15735, Field7: '87.0%' },
    { Field1: '环氧乙烷', Field2: 7766, Field3: '45.2%', Field4: 18000, Field5: 84, Field6: 15735, Field7: '87.0%' },
    { Field1: '环氧乙烷', Field2: 7766, Field3: '45.2%', Field4: 18000, Field5: 84, Field6: 15735, Field7: '87.0%' },
    { Field1: '环氧乙烷', Field2: 7766, Field3: '45.2%', Field4: 18000, Field5: 84, Field6: 15735, Field7: '87.0%' },
    { Field1: '环氧乙烷', Field2: 7766, Field3: '45.2%', Field4: 18000, Field5: 84, Field6: 15735, Field7: '87.0%' },
    { Field1: '环氧乙烷', Field2: 7766, Field3: '45.2%', Field4: 18000, Field5: 84, Field6: 15735, Field7: '87.0%' },
  ] },
  seven: { Table: [
    { Field1: 'HDPE（化销）', Field2: 7766, Field3: '45.2%', Field4: 18000, Field5: 84, Field6: 15735, Field7: 556, Field8: '87.0%' },
    { Field1: 'HDPE（化销）', Field2: 7766, Field3: '45.2%', Field4: 18000, Field5: 84, Field6: 15735, Field7: 556, Field8: '87.0%' },
    { Field1: 'HDPE（化销）', Field2: 7766, Field3: '45.2%', Field4: 18000, Field5: 84, Field6: 15735, Field7: 556, Field8: '87.0%' },
    { Field1: 'HDPE（SK）', Field2: 7766, Field3: '45.2%', Field4: 18000, Field5: 84, Field6: 15735, Field7: 556, Field8: '87.0%' },
    { Field1: 'HDPE（SK）', Field2: 7766, Field3: '45.2%', Field4: 18000, Field5: 84, Field6: 15735, Field7: 556, Field8: '87.0%' },
    { Field1: 'HDPE（SK）', Field2: 7766, Field3: '45.2%', Field4: 18000, Field5: 84, Field6: 15735, Field7: 556, Field8: '87.0%' },
  ] },
  eight: {
    first: [
      { Field1: '用电量', Field2: 7766, Field3: '万千瓦时/天', Field4: 18000, Field5: '万千瓦时/天' },
      { Field1: '发电量', Field2: 7766, Field3: '万千瓦时/天', Field4: 18000, Field5: '万千瓦时/天' },
      { Field1: '外购电量', Field2: 7766, Field3: '万千瓦时/天', Field4: 18000, Field5: '万千瓦时/天' },
      { Field1: '天然气', Field2: 7766, Field3: '万标方/天', Field4: 18000, Field5: '万标方/天' },
      { Field1: '煤', Field2: 7766, Field3: '万标方/天', Field4: 18000, Field5: '万标方/天' },
      { Field1: '卸煤', Field2: 7766, Field3: '吨/天%', Field4: 18000, Field5: '吨/天' },
      { Field1: '煤库存', Field2: 7766, Field3: '吨/天', Field4: 18000, Field5: '吨/天%' },
    ],
    second: [
      { Field1: '一循', Field2: 47905, Field3: 47905, Field4: 18000, Field5: 47905, Field6: 47905, Field7: 18000, Field8: 47905 },
      { Field1: '二循', Field2: 47905, Field3: 47905, Field4: 18000, Field5: 47905, Field6: 47905, Field7: 18000, Field8: 47905 },
      { Field1: '三循', Field2: 47905, Field3: 47905, Field4: 18000, Field5: 47905, Field6: 47905, Field7: 18000, Field8: 47905 },
    ],
  },
  nine: { Table: [
    { Field1: 'H-001', Field2: '乙烷', Field3: '75', Field4: '786', Field5: '29', Field6: 'H-005', Field7: '石脑油', Field8: '45', Field9: '45', Field10: '45', Field11: '45', Field12: '45', Field13: '45', Field14: '45', Field15: '45', Field16: '45', Field17: '45', Field18: '45' },
    { Field1: 'H-001', Field2: '乙烷', Field3: '75', Field4: '786', Field5: '29', Field6: 'H-005', Field7: '石脑油', Field8: '45', Field9: '45', Field10: '45', Field11: '45', Field12: '45', Field13: '45', Field14: '45', Field15: '45', Field16: '45', Field17: '45', Field18: '45' },
    { Field1: 'H-001', Field2: '乙烷', Field3: '75', Field4: '786', Field5: '29', Field6: 'H-005', Field7: '石脑油', Field8: '45', Field9: '45', Field10: '45', Field11: '45', Field12: '45', Field13: '45', Field14: '45', Field15: '45', Field16: '45', Field17: '45', Field18: '45' },
    { Field1: 'H-001', Field2: '乙烷', Field3: '75', Field4: '786', Field5: '29', Field6: 'H-005', Field7: '石脑油', Field8: '45', Field9: '45', Field10: '45', Field11: '45', Field12: '45', Field13: '45', Field14: '45', Field15: '45', Field16: '45', Field17: '45', Field18: '45' },
  ],
  },
  ten: { Tanle: [
    { Field1: 'H-生产污水', Field2: '乙烷', Field3: '75', Field4: '786', Field5: '29', Field6: 'H-005', Field7: '石脑油', Field8: '45', Field9: '45', Field10: '45', Field11: '45', Field12: '45', Field13: '45', Field14: '45', Field15: '45', Field16: '45', Field17: '45', Field18: '45' },
    { Field1: '低压氮气', Field2: '乙烷', Field3: '75', Field4: '786', Field5: '29', Field6: 'H-005', Field7: '石脑油', Field8: '45', Field9: '45', Field10: '45', Field11: '45', Field12: '45', Field13: '45', Field14: '45', Field15: '45', Field16: '45', Field17: '45', Field18: '45' },
  ] },
};
const getYC = (data) => {
  for (const device of data) {
    device['罐存'] = Number(device['罐存']);
    device.storageRate = `${((device['罐存'] / device.capacity) * 100).toFixed(2)}%`;
  }
  return data;
};
const getYJ = (data) => {
  let monthOutPutTotal = 0;
  let monthOutPlanTotal = 0;
  for (const device of data) {
    device.monthOutPut = 9000;
    device['月出厂计划'] = Number(device['月出厂计划']);
    monthOutPutTotal += device.monthOutPut;
    monthOutPlanTotal += device['月出厂计划'];
    device.storageRate = `${((device['罐存'] / device.capacity) * 100).toFixed(2)}%`;
    device.progess = `${(100 * device.monthOutPut / device['月出厂计划']).toFixed(2)}%`;
  }
  const totalProgess = `${(100 * monthOutPutTotal / monthOutPlanTotal).toFixed(2)}%`;
  for (const device of data) {
    device.totalProgess = totalProgess;
  }
  return data;
};
const getSZ = (data) => {
  const para = 17000;
  let monthOutPutTotal = 0;
  let monthOutPlanTotal = 0;
  for (const device of data) {
    device.monthOutPut = 9000;
    device['月出厂计划'] = Number(device['月出厂计划']);
    device['厂内库存'] = Number(device['日出厂量']);
    device['罐存'] = Number(device['厂内库存']);
    monthOutPutTotal += device.monthOutPut;
    device.monthOutPutTotal = device['日出厂量'] * 30;
    monthOutPlanTotal += device['月出厂计划'];
    device.storageRate = `${((device['厂内库存'] / para) * 100).toFixed(2)}%`;
    device.progess = `${(100 * device.monthOutPut / device['月出厂计划']).toFixed(2)}%`;
  }
  const totalProgess = `${(100 * monthOutPutTotal / monthOutPlanTotal).toFixed(2)}%`;
  for (const device of data) {
    device.totalProgess = totalProgess;
  }
  return data;
};
const getDL = (data) => {
  if (data) {
    for (const device of data) {
      device.totalValue = parseFloat(device.totalValue).toFixed(2);
      device.collectValue = parseFloat(device.collectValue).toFixed(2);
      device.itemName = device.proPowerConsumeItem.itemName;
      device.unit = device.proPowerConsumeItem.unit;
      device.unit1 = device.proPowerConsumeItem.unit;
      if (device.proPowerConsumeItem.itemName === '煤库存') {
        device.totalValue = '煤库存率';
        device.unit1 = `${(100 * device.collectValue / 80000).toFixed(2)}%`;
      }
    }
  }
  return data;
};
const getS = (data) => {
  for (const device of data) {
    for (const [key, value] in Object.entries(device)) {
      if (Number(value)) {
        device[key] = parseFloat(device[key]).toFixed(2);
      }
    }
  }
  return data;
};
const getZQ = (data) => {
  const array = [
    { levelName: '超高压蒸汽', 热电联产外送量: '/', dev1: '/', dev2: '/', '减温减压器（转换输入）': '/', '减温减压器（转换输出）': '/', 乙烯及裂解汽油加氢: '/', C5: '/', 'EO/EG': '/', 丁二烯: '/', 芳烃抽提: '/', 'MTBE/丁烯-1': '/', HDPE: '/', LLDPE: '/', 'STPP/JPP': '/', '一循/三循': '/', 空分: '/', 鲁华: '/', 其他: '/', 平衡差量: '/' },
    { levelName: '高压蒸汽', 热电联产外送量: '/', dev1: '/', dev2: '/', '减温减压器（转换输入）': '/', '减温减压器（转换输出）': '/', 乙烯及裂解汽油加氢: '/', C5: '/', 'EO/EG': '/', 丁二烯: '/', 芳烃抽提: '/', 'MTBE/丁烯-1': '/', HDPE: '/', LLDPE: '/', 'STPP/JPP': '/', '一循/三循': '/', 空分: '/', 鲁华: '/', 其他: '/', 平衡差量: '/' },
    { levelName: '中压蒸汽', 热电联产外送量: '/', dev1: '/', dev2: '/', '减温减压器（转换输入）': '/', '减温减压器（转换输出）': '/', 乙烯及裂解汽油加氢: '/', C5: '/', 'EO/EG': '/', 丁二烯: '/', 芳烃抽提: '/', 'MTBE/丁烯-1': '/', HDPE: '/', LLDPE: '/', 'STPP/JPP': '/', '一循/三循': '/', 空分: '/', 鲁华: '/', 其他: '/', 平衡差量: '/' },
    { levelName: '低压蒸汽', 热电联产外送量: '/', dev1: '/', dev2: '/', '减温减压器（转换输入）': '/', '减温减压器（转换输出）': '/', 乙烯及裂解汽油加氢: '/', C5: '/', 'EO/EG': '/', 丁二烯: '/', 芳烃抽提: '/', 'MTBE/丁烯-1': '/', HDPE: '/', LLDPE: '/', 'STPP/JPP': '/', '一循/三循': '/', 空分: '/', 鲁华: '/', 其他: '/', 平衡差量: '/' },
  ];
  for (const device of data) {
    for (const item of array) {
      item[device.resourceName] = device[item.levelName];
      if (device.resourceName === '减温减压器（转换输入）') {
        item.dev1 = device[item.levelName];
      } else if (device.resourceName === '减温减压器（转换输出）') {
        item.dev2 = device[item.levelName];
      }
    }
  }
  return array;
};
const getWS = (data) => {
  const array = [
    { levelName: '生产污水', 空分: '/', dev1: '/', dev2: '/', 污水处理: '/', 乙烯装置: '/', 裂解汽油加氢: '/', C5: '/', 'EO/EG': '/', 丁二烯: '/', 芳烃抽提: '/', 'MTBE/丁烯-1': '/', HDPE: '/', LLDPE: '/', STPP: '/', JPP: '/', 产品罐区: '/', 鲁华: '/', 平衡差量: '/' },
    { levelName: '低压氮气', 空分: '/', dev1: '/', dev2: '/', 污水处理: '/', 乙烯装置: '/', 裂解汽油加氢: '/', C5: '/', 'EO/EG': '/', 丁二烯: '/', 芳烃抽提: '/', 'MTBE/丁烯-1': '/', HDPE: '/', LLDPE: '/', STPP: '/', JPP: '/', 产品罐区: '/', 鲁华: '/', 平衡差量: '/' },
  ];
  for (const device of data) {
    for (const item of array) {
      item[device.resourceName] = device[item.levelName];
    }
  }
  return array;
};
export default class Table2 extends PureComponent {
  componentDidMount() {
    const list = this.props.data;
    if (list.length > 0) {
      testData.yuanliao = { table: getYC(list[0].yuanliao.splice(0, 25)) };
      testData.youji = { table: getYJ(list[0].youji.splice(0, 25)) };
      testData.shuzhi = { table: getSZ(list[0].shuzhi) };
      testData.dongli = { table: getDL(list[0].dongli || []), table1: getS(list[0].shui) };
      testData.zhengqi = { table: getZQ(list[0].zhengqi) };
      testData.wushui = { table: getWS(list[0].wushui) };
      // 创建报表显示器，参数指定其在网页中的占位标签的ID，表模板URL与报表数据URL不指定，而是在后面的AJAX操作中提供相关数据
      const rending = () => {
        const tables = ['yuanliao', 'youji', 'shuzhi', 'dongli', 'zhengqi', 'wushui'];
        const Rubylongs = [];
        for (const table of tables) {
          const ruby = Rubylong.rubylong.grhtml5.insertReportViewer(table);
          ruby.reportPrepared = false; // 指定报表生成需要加载报表模板
          ruby.dataPrepared = false; // 指定报表生成需要加载报表模板
          ruby.loadReport(tableII[table]);
          ruby.loadData(testData[table]);
          Rubylongs.push(ruby);
        }
      };
      rending();
    }
  }
  render() {
    return (
      <Scrollbars>
        <div className={styles.list2}>
          <div id="yuanliao" className={styles.part1} ref={ref => this.warp = ref} />
          <div id="youji" className={styles.part2} ref={ref => this.warp = ref} />
          <div id="shuzhi" className={styles.part3} ref={ref => this.warp = ref} />
          <div id="dongli" className={styles.part4} ref={ref => this.warp = ref} />
          <div id="zhengqi" className={styles.part9} ref={ref => this.warp = ref} />
          <div id="wushui" className={styles.part10} ref={ref => this.warp = ref} />
        </div>
        {/* <WEditor onChange={this.test} content={a}/> */}
      </Scrollbars>
    );
  }
}
