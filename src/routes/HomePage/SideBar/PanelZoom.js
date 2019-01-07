import React, { PureComponent } from 'react';
import { Table, Icon, Progress } from 'antd';
import { connect } from 'dva';
import { Bar } from '../../../components/Charts/index';
import styles from './sideBar.less';
import { autoContentHeight } from '../../../utils/utils';

const renderContent = (value) => {
  const obj = {
    children: value,
    props: {},
  };
  return obj;
};
const columns = [
  {
    title: '类别',
    dataIndex: 'type',
    className: 'panel-zoom-in-columns',
    render: (value, row, index) => {
      const obj = {
        children: value,
        props: {},
      };
      switch (index) {
        case 0: obj.props.rowSpan = 4; break;
        case 4: obj.props.rowSpan = 4; break;
        default: obj.props.rowSpan = 0;
      }
      return obj;
    },
  }, {
    title: '物料',
    dataIndex: 'materiel',
    render: renderContent,
  }, {
    title: '月计划',
    dataIndex: 'monthPlan',
    render: renderContent,
  }, {
    title: '日完成',
    dataIndex: 'dayFinish',
    render: renderContent,
  }, {
    title: '月完成',
    dataIndex: 'monthFinish',
    render: renderContent,
  }, {
    title: '收率',

    dataIndex: 'yield',
    render: renderContent,
  }, {
    title: '月进度',
    dataIndex: 'monthProcess',
    render: (value, row, index) => {
      const obj = {
        children: <Progress percent={value} size="small" />,
        props: {},
      };
      return obj;
    },
  },
];
const height = autoContentHeight('sideZoom');
const width = (document.documentElement.clientWidth - 210) / 2 - 2;
const mapStateToProps = ({ sidebar }) => {
  return {
    activeKey: sidebar.activeKey,
    zoomData: sidebar.zoomData,
  };
};



class PanelZoomHeader1 extends PureComponent {
  constructor() {
    super();
    this.handleClick = () => {
      this.props.dispatch({
        type: 'sidebar/zoomIn',
        payload: {},
      });
    };
  }
  render() {
    return (
      <div className={styles['panel-zoom-in-header']} ref="header">
        <span>{this.props.title}</span>
        <Icon className={styles['panel-zoom-icon']} onClick={this.handleClick} type="close-circle-o" />
      </div>
    );
  }

  // componentDidMount() {
  //   const header = this.refs.header;
  //   return function (scope, ele, attr) {
  //     let startX = 0,
  //       startY = 0,
  //       x = 0,
  //       y = 0;
  //     // 找到需要拖动的元素
  //     let element;
  //     // element= angular.element(document.getElementsByClassName("modal-dialog"));
  //     element = ele;
  //     // 拖动时鼠标样式
  //     element.css({
  //       // position: 'relative',
  //       cursor: 'move',
  //     });
  //     const parent = ele.parent();
  //     parent.css({
  //       position: 'relative',
  //       // cursor: 'move'
  //     });
  //     // 鼠标按下，计算当前xy值，并执行开始拖动的两个方法
  //     element.on('mousedown', (event) => {
  //       startX = event.pageX - x;
  //       startY = event.pageY - y;
  //       $document.on('mousemove', mousemove);
  //       $document.on('mouseup', mouseup);
  //     });
  //
  //     // 计算xy偏移，以及元素xy值
  //     function mousemove(event) {
  //       y = event.pageY - startY;
  //       x = event.pageX - startX;
  //       parent.css({
  //         top: `${y}px`,
  //         left: `${x}px`,
  //       });
  //     }
  //
  //     // 解除拖动事件
  //     function mouseup() {
  //       $document.off('mousemove', mousemove);
  //       $document.off('mouseup', mouseup);
  //     }
  //   };
  // }
}
const PanelZoomHeader = connect()(PanelZoomHeader1);

class PanelZoom extends PureComponent {
  constructor() {
    super();
    this.state = {
      warpHeight: height,
    };
  }

  render() {
    const { activeKey, zoomData } = this.props;

    let dom;
    switch (activeKey) {
      case '1': dom = <Bar data={zoomData.data} padding={[45, 65, 80, 100]} />; break;
      case '2': dom = <Table columns={columns} dataSource={zoomData.data} style={{ height, padding: '20px 20px 20px,20px' }} pagination={false} bordered />; break;
      case '3': dom = <Bar data={zoomData.data} padding={[45, 65, 80, 100]} />; break;
      case '4': dom = <Table columns={columns} dataSource={zoomData.data} style={{ height, padding: '20px 20px 20px,20px' }} pagination={false} bordered />; break;
      default: return null;
    }
    return (
      (activeKey === '') ? <div /> :
        <div ref="warp" style={{ height: this.state.warpHeight, width, transition: 'height 2s' }}>
          <PanelZoomHeader title={zoomData.title} />
          <div className={styles['panel-zoom-in-content']}>{dom}</div>
        </div>
    );
  }
  // componentDidUpdate(){
  //   if(this.state.warpHeight!==0){
  //     setTimeout(function (){
  //       this.setState({warpHeight:height});
  //     },200)
  //   }
  //
  // }
}

export default connect(mapStateToProps)(PanelZoom);

