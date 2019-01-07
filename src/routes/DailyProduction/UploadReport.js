import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Table, Select, Card, Upload, message, Icon, Button } from 'antd';
import { fakeData } from './List/lib/data.js';
import styles from './index.less';

const { Option } = Select;
const { Dragger } = Upload;
const cols = [
  { title: '文件名', dataIndex: 'fileName', width: '20%' },
  { title: '上传人', dataIndex: 'uploadUserName', width: '15%' },
  { title: '上传时间',
    dataIndex: 'uploadTime',
    width: '65%',
    render: (text) => {
      return moment(text).format('YYYY-MM-DD HH:mm:ss');
    },
  },
];
@connect(({ productionDaily }) => ({
  uploadHistoryPage: productionDaily.uploadHistoryPage,
  uploadFunctions: productionDaily.uploadFunctions,
}))
export default class UploadReport extends PureComponent {
  componentDidMount() {
    this.page(1, 5);
    this.getFunctionMenus();
  }
  page = (pageNum, pageSize) => {
    this.props.dispatch({
      type: 'productionDaily/uploadHistoryPage',
      payload: { pageSize, pageNum },
    });
  };
  beforeUpload = (file) => {
    const isXlsx = file.name.indexOf('.xlsx') > 0;
    const isXls = file.name.indexOf('.xls') > 0;
    if (!(isXlsx || isXls)) {
      message.error('只能上传Excel文件!');
    }
    // const isLt2M = file.size / 1024 / 1024 < 2;
    // if (!isLt2M) {
    //   message.error('Image must smaller than 2MB!');
    // }
    return isXlsx || isXls;
  };
  // 获取页面功能权限
  getFunctionMenus = () => {
    const { dispatch, functionInfo } = this.props;
    dispatch({
      type: 'productionDaily/getFunctionMenus',
      payload: { parentCode: functionInfo.functionCode },
    });
  };
  // 判断是否有该功能权限
  judgeFunction = (functionName) => {
    const { uploadFunctions } = this.props;
    const arr = uploadFunctions.filter(item => item.functionName === functionName);
    return arr.length > 0;
  };
  render() {
    const props = {
      name: 'fileName',
      multiple: false,
      action: 'emgc/report/proRptReportInfo/dealExcle',
      showUploadList: false,
      onChange: (info) => {
        const { status } = info.file;
        if (status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          message.success(`${info.file.name} 文件上传成功.`);
          const { current, pageSize } = this.props.uploadHistoryPage.pagination;
          this.page(current, pageSize);
        } else if (status === 'error') {
          message.error(`${info.file.name} 文件上传失败.`);
        }
      },
      beforeUpload: this.beforeUpload,
    };
    return (
      <Card title="上传生产日报">
        { this.judgeFunction('上传权限') ? (
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-text">单击或拖动文件到该区域上传</p>
            <p className="ant-upload-hint">支持单个Excel文件上传。</p>
          </Dragger>
        ) : null}
        <Table
          className={styles.fileTable}
          pagination={{
            ...this.props.uploadHistoryPage.pagination,
            onChange: this.page,
          }}
          dataSource={this.props.uploadHistoryPage.data}
          columns={cols}
        />
      </Card>
    );
  }
}
