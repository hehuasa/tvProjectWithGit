import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Row, Col, Button } from 'antd';
import styles from './index.less';

const mapStateToProps = ({ resourceTree }) => {
  return {
    resourceTree,
  };
};
@connect(({ resourceTree }) => ({
  resourceTree,
}))
class LargeUnit extends PureComponent {
  handleClick = () => {
    this.props.dispatch({
      type: 'resourceTree/saveCtrlResourceType',
      payload: '',
    });
  }
  render() {
    const { resourceInfo } = this.props.resourceTree;
    return (
      <div>
        <div className={styles.header}>
          <div className={styles.name}>{resourceInfo.resourceCode}</div>
          <div className={styles.btn}>
            <Button type="primary" size="small" onClick={this.handleClick}> X </Button>
          </div>
        </div>
        <div className={styles.machine}>
          <Row>
            <Col span={12}>
              <div><span className={styles.state}>报警</span> | 乙烷</div>
              <div><span className={styles.days}><strong>75 </strong>天</span></div>
              <div><span className={styles.days}><strong>786 </strong>CTO/℃</span></div>
            </Col>
            <Col span={12}>
              <div className={styles.ring}>
                <div className={styles.value}>29.0</div>
                <div>负荷/t</div>
              </div>
            </Col>
          </Row>
        </div>
      </div>);
  }
}
export default connect(mapStateToProps)(LargeUnit);
