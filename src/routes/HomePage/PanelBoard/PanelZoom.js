import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import { connect } from 'dva';
import { Scrollbars } from 'react-custom-scrollbars';
import { autoContentHeight, getBrowserStyle } from '../../../utils/utils';
import AlarmCounting from './zoomComponents/AlarmList';
import AlarmListByFault from './zoomComponents/AlarmListByFault';
import ConstructMonitor from './zoomComponents/ConstructMonitor/ConstructMonitor';
import VOCSGovernList from './zoomComponents/VOCSGovern/VOCSGovernList';
import LiquidPot from './zoomComponents/LiquidPot/LiquidPot';
import CalzadaFreight from './zoomComponents/calzadaFreight/CalzadaFreight';
import RailwayFreight from './zoomComponents/railwayFreight/RailwayFreight';
import AccessControl from './zoomComponents/AccessControl/AccessControl';
import styles from './index.less';

const mapStateToProps = ({ sidebar }) => {
  return {
    activeId: sidebar.activeId,
    title: sidebar.title,
  };
};

class PanelZoomHeader extends PureComponent {
  handleClick = () => {
    this.props.dispatch({
      type: 'sidebar/zoomIn',
      payload: {},
    });
  };
  render() {
    return (
      <div
        ref="header"
        className={styles['panel-zoom-in-header']}
        onMouseDown={this.props.onMouseDown}
        onMouseUp={this.props.onMouseUp}
      >
        <span>{this.props.title}</span>
        <Icon className={styles['panel-zoom-icon']} onClick={this.handleClick} type="close-circle-o" />
      </div>
    );
  }
}

class PanelZoom extends PureComponent {
  constructor() {
    super();
    this.state = {
      totalWidth: null, // 容器宽度
      leftMove: false,

      rightMove: false,

      totalHeight: null, // 底部-容器
      downMove: false,

      titleMove: false,
      titlepositionX: null, // 点 - 容器的offsetLeft
      titlepositionY: null, // 点 - 容器的offsetTop
    };
  }


  componentDidMount() {
    document.body.onmousemove = e => this.handMouseMove(e);
  }

  handMouseMove = (e) => {
    // 左拖动
    if (this.state.leftMove) {
      const updataWidth = this.state.totalWidth - e.clientX;
      if (updataWidth > 300) {
        this.extendPanel.style.left = `${e.clientX}px`;
        this.downDrag.style.width = this.extendWarp.style.width = `${updataWidth}px`;
      } else {
        this.setState({
          leftMove: false,
        });
      }
    }

    // 右拖动
    if (this.state.rightMove) {
      const updataWidth = e.clientX - this.state.totalWidth;
      if (updataWidth > 300) {
        // this.extendPanel.style.left = `${e.clientX}px`;
        this.downDrag.style.width = this.extendWarp.style.width = `${updataWidth}px`;
      } else {
        this.setState({
          rightMove: false,
        });
      }
    }

    // 下拖动
    if (this.state.downMove) {
      const updataHeight = e.clientY - this.state.totalHeight;
      if (updataHeight > 100) {
        this.rightDrag.style.height =
          this.leftDrag.style.height =
          this.extendWarp.style.height = `${updataHeight}px`;
      } else {
        this.setState({
          downMove: false,
        });
      }
    }
    // title拖动
    if (this.state.titleMove) {
      this.extendPanel.style.left = `${e.clientX - this.state.titlepositionX}px`;
      this.extendPanel.style.top = `${e.clientY - this.state.titlepositionY}px`;
    }
  }
  // 左拖动
  leftMouseDown = (e) => {
    e.preventDefault();
    e.persist();
    this.setState({
      leftMove: true,
      totalWidth: e.clientX + this.extendWarp.offsetWidth,
    });
  }
  leftMouseUp = (e) => {
    this.setState({
      leftMove: false,
    });
  }

  // 右拖动
  rightMouseDown = (e) => {
    e.preventDefault();
    e.persist();
    this.setState({
      rightMove: true,
      totalWidth: e.clientX - this.extendWarp.offsetWidth,
    });
  }
  rightMouseUp = (e) => {
    this.setState({
      rightMove: false,
    });
  }

  // 上下拖动
  downMouseDown = (e) => {
    e.preventDefault();
    e.persist();
    this.setState({
      downMove: true,
      totalHeight: e.clientY - this.extendWarp.offsetHeight,
    });
  }
  downMouseUp = (e) => {
    this.setState({
      downMove: false,
    });
  }

  titleMouseDown = (e) => {
    e.preventDefault();
    e.persist();
    this.setState({
      titleMove: true,
      titlepositionX: e.clientX - this.extendPanel.offsetLeft,
      titlepositionY: e.clientY - this.extendPanel.offsetTop,
    });
  }
  titleMouseUp = (e) => {
    this.setState({
      titleMove: false,
    });
  }

  render() {
    const height = autoContentHeight('sideZoom');
    const { activeId, title } = this.props;
    const width = getBrowserStyle().winWidth / 2 - 8;
    let dom;
    switch (activeId) {
      case 1: dom = <AlarmCounting />; break;
      case 4: dom = <AccessControl />; break;
      case 5: dom = <VOCSGovernList />; break;
      case 6: dom = <LiquidPot />; break;
      case 7: dom = <CalzadaFreight />; break;
      case 8: dom = <RailwayFreight />; break;
      case 10: dom = <ConstructMonitor />; break;
      case 11: dom = <AlarmListByFault />; break;
      default: return null;
    }
    return (
      (activeId === '') ? <div /> : (
        <div ref={nede => this.extendPanel = nede} className={styles['panel-zoom-in']}>
          <div ref={nede => this.extendWarp = nede} style={{ height, width }}>
            <PanelZoomHeader
              title={title}
              dispatch={this.props.dispatch}
              onMouseDown={this.titleMouseDown}
              onMouseUp={this.titleMouseUp}
            />

            <div
              ref={nede => this.leftDrag = nede}
              className={styles.leftDrag}
              style={{ height }}
              onMouseDown={this.leftMouseDown}
              onMouseUp={this.leftMouseUp}
            />

            {/* <Scrollbars> */}
              <div className={styles['panel-zoom-in-content']}>{dom}</div>
            {/* </Scrollbars> */}

            <div
              ref={nede => this.downDrag = nede}
              className={styles.downDrag}
              style={{ width }}
              onMouseDown={this.downMouseDown}
              onMouseUp={this.downMouseUp}
            />

            <div
              ref={nede => this.rightDrag = nede}
              className={styles.rightDrag}
              style={{ height }}
              onMouseDown={this.rightMouseDown}
              onMouseUp={this.rightMouseUp}
            />

          </div>
        </div>

      )
    );
  }
}

export default connect(mapStateToProps)(PanelZoom);
