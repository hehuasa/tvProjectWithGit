import React, { PureComponent } from 'react';
import { Form, Button, Row, Col, Input, Modal, Table, Select, message } from 'antd';
import { commonData } from '../../../../../mock/commonData';
import styles from './InfoContent.less';

const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option;

@Form.create()
export default class AddEventFeature extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'emergency/queryClassification',
      payload: 557,
    });
    // this.props.dispatch({
    //   type: 'emergency/searchEventFeatures',
    //   payload: {
    //     ...commonData.pageInitial,
    //     featureValue: '',
    //   },
    // });
  }

  // 添加
  onAddFeature = () => {
    if (this.props.showFeature) {
      const { form } = this.props;
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        fieldsValue.eventID = this.props.eventID;
        this.props.dispatch({
          type: 'emergency/addFeature',
          payload: fieldsValue,
        }).then(() => {
          message.success('添加成功');
          form.resetFields();
          this.props.onEnterCancel();
        });
      });
    } else {
      const { selectedRows, eventID, form } = this.props;
      if (selectedRows.length === 0) {
        return message.warning('请选择特征');
      }
      const featureValue = {
        eventID,
        featureID: selectedRows[0].featureID,
        eventFeature: selectedRows[0].featureName,
        featureValue: selectedRows[0].featureValue,
        featureType: selectedRows[0].featureType,
        // panRedirectFeatureID: selectedRows[0].panRedirectFeatureID,
      };
      this.props.dispatch({
        type: 'emergency/addFeature',
        payload: featureValue,
      }).then(() => {
        form.resetFields();
        this.props.onEnterCancel();
      });
    }
  }

  render() {
    const { form, visible, onHandleCancel, mask, showFeature, onShowFeature, classificationList, existEventFeaturesList, pagination,
      onSearchFeature, onhandleTableChange, rowSelection,
    } = this.props;
    const columns = [{
      title: '特征分类',
      dataIndex: 'featureTypeName',
      width: '200px',
    }, {
      title: '事件特征名称',
      dataIndex: 'featureName',
      width: '200px',
    }, {
      title: '事件特征值',
      dataIndex: 'featureValue',
      width: '200px',
    }, {
      title: '单位',
      dataIndex: 'featureUnit',
      width: '120px',
    }, {
      title: '权重',
      dataIndex: 'weight',
      width: '100px',
    }];
    return (
      <div>
        <Modal
          title={showFeature ? '新增事件特征' : '事件特征'}
          visible={visible}
          onOk={this.onAddFeature}
          onCancel={onHandleCancel}
          mask={mask}
          cancelText={showFeature ? '取消' : '返回'}
          // style={{ position: 'absolute', left: 260 }}
          width="60%"
          bodyStyle={{ maxHeight: 600, overflow: 'auto' }}
        >
          {
            showFeature ?
              (
                <div>
                  <Row gutter={24} >
                    <Col >
                      <FormItem
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 13 }}
                        label="特征分类"
                      >
                        {form.getFieldDecorator('featureType', {
                          initialValue: '',
                          rules: [
                            { required: true, message: '特征分类不能为空' },
                          ],
                        })(
                          <Select
                            placeholder="请选择"
                            style={{ width: '100%' }}
                          >
                            {classificationList.map(item => (
                              <Option
                                key={item.codeID}
                                value={item.code}
                              >{item.codeName}
                              </Option>
                            ))}
                          </Select>

                        )}
                      </FormItem>
                    </Col>
                  </Row >

                  <Row gutter={24} >
                    <Col >
                      <FormItem
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 13 }}
                        label="事件特征名称"
                      >
                        {form.getFieldDecorator('eventFeature', {
                          initialValue: '',
                          rules: [
                            { required: true, message: '事件特征名称不能为空' },
                          ],
                        })(
                          <Input placeholder="请输入事件特征名称" />
                        )}
                      </FormItem>
                    </Col>
                  </Row >

                  <Row gutter={24} >
                    <Col >
                      <FormItem
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 13 }}
                        label="事件特征值"
                      >
                        {form.getFieldDecorator('featureValue', {
                          initialValue: '',
                          rules: [
                            { required: true, message: '事件特征值不能为空' },
                          ],
                        })(
                          <Input placeholder="请输入事件特征值" />
                        )}
                      </FormItem>
                    </Col>
                  </Row >
                  <Row >
                    <Col gutter={24} span={12} push={8}>
                      <Button onClick={onShowFeature} >查看特征库</Button>
                    </Col>
                  </Row>

                </div>
              ) :
              (
                <div >
                  <Row gutter={24} >
                    <Col className={styles.search}>
                      <Search
                        style={{ width: 350 }}
                        placeholder="特征名称"
                        enterButton="搜索"
                        onSearch={onSearchFeature}
                      />
                    </Col>
                  </Row >
                  <Table
                    pagination={pagination}
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={this.props.existEventFeaturesList}
                    onChange={onhandleTableChange}
                    rowKey={record => record.featureID}
                  />
                </div>
              )
          }
        </Modal>
      </div>
    );
  }
}
// rowKey={record => record[featureID]}
// pagination={paginationProps}
// onChange={this.handleTableChange}
