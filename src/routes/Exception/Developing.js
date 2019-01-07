import React, { PureComponent } from 'react';
import { Skeleton } from 'antd';

export default class Developing extends PureComponent {
  render() {
    return (
      <div style={{ marginLeft: '2%', width: '96%' }}>
        {/* <Row> */}
        {/* <Col gutter={1} span={20}> */}
        <h2 style={{ textAlign: 'center', margin: 40 }}>功能开发中。。。。。。</h2>
        <Skeleton avatar paragraph={{ rows: 4 }} active />
          <Skeleton avatar paragraph={{ rows: 4 }} active />
        {/* </Col> */}
        {/* </Row> */}
      </div>
    );
  }
}
