import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import styles from './textCarousel.less';

const delString = (string, unit) => {
  const index = string.indexOf(unit);
  return Number(string.substring(0, index));
};
let intervalTime = null;
@connect(({ user, global, loading, tabs, majorList }) => ({
  user, global, loading, tabs, majorList,
}))
export default class TextCarousel extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      toggleShow: true,
      intervalTime: null,
    };
  }
  scrolling = (copy, content, warp) => {
    if (copy || content || warp) {
      if (copy.offsetWidth - warp.scrollLeft <= 0) {
        warp.scrollLeft -= content.offsetWidth;
      } else {
        warp.scrollLeft += this.props.speed;
      }
    } else {
      clearInterval(this.carouselTime);
    }
  };
  scroll = (warpWidth, carouselWidth, copy, content, warp) => {
    if (warpWidth < carouselWidth) {
      clearInterval(this.carouselTime);
      this.carouselTime = setInterval(() => { this.scrolling(copy, content, warp); }, 30);
    } else {
      clearInterval(this.carouselTime);
      this.setState({
        toggleShow: false,
      });
      warp.scrollLeft = 0;
    }
  };
  screenChange() {
    let confirmOffsetWidth1 = null;
    let confirmOffsetWidth2 = null;
    if (this.carouselWarp && this.carouselWarp !== null) {
      const time = setInterval(() => {
        if (this.carouselWarp && this.carouselWarp !== null) {
          confirmOffsetWidth1 = this.carouselWarp.offsetWidth;
          confirmOffsetWidth2 = this.carouselContent.offsetWidth;
          if (confirmOffsetWidth1 === this.carouselWarp.offsetWidth && confirmOffsetWidth2 === this.carouselContent.offsetWidth) {
            this.scroll(this.carouselWarp.offsetWidth, this.carouselContent.offsetWidth, this.carouselCopy, this.carouselContent, this.carouselWarp);
            clearInterval(time);
            confirmOffsetWidth1 = null;
            confirmOffsetWidth2 = null;
          }
        }
      }, 1000);
    }
  }
  componentDidMount() {
    const { spaceTime, dispatch } = this.props;
    dispatch({
      type: 'majorList/queryMajorContent',
    }).then(() => {
      this.screenChange();
    });
    intervalTime = setInterval(() => {
      dispatch({
        type: 'majorList/queryMajorContent',
      }).then(() => {
        this.screenChange();
      });
    }, spaceTime);
    // window.addEventListener('resize', () => { this.screenChange() });
  }

  componentWillReceiveProps(a, b) {
    if (this.props.boolean) {
      clearInterval(this.carouselTime);
      if (this.carouselWarp.offsetWidth < this.carouselContent.offsetWidth) {
        this.setState({
          toggleShow: true,
        });
        this.carouselTime = setInterval(() => { this.scrolling(this.carouselCopy, this.carouselContent, this.carouselWarp); }, 30);
      } else {
        if (this.state.toggleShow) {
          this.setState({
            toggleShow: false,
          });
        }
        this.carouselWarp.scrollLeft = 0;
      }
    }
  }

  componentWillUnmount() {
    // window.removeEventListener('resize', () => { this.screenChange() });
    clearInterval(intervalTime);
  }

  render() {
    const carouselValue = this.props.majorList.list;
    // if (carouselValue) {
    //   carouselValue.data.sort((a, b) => {
    //     return a.sortIndex - b.sortIndex < 0 ? -1 : 1;
    //   });
    // }
    const { onClickCarousel } = this.props;
    return (
      <div className={styles['text-carousel']} style={this.props.boolean ? { display: 'block' } : { display: 'none' }}>
        <span className={styles.title}>重点关注： </span>
        <span ref={(ref) => { this.carouselWarp = ref; }} className={styles['text-warp']}>
          <span ref={(ref) => { this.carouselContent = ref; }} className={styles.content}>
            {
              carouselValue ? carouselValue.data.map((item, index) => {
                return item.statu === 1 ? <span key={item.concernID}><div>{`${index + 1}、`}</div>{`${item.content}`}</span> : null;
                }) : null
            }
          </span>
          <span ref={(ref) => { this.carouselCopy = ref; }} className={styles.content} style={this.state.toggleShow ? { visibility: 'visible' } : { visibility: 'hidden' }}>
            {
              carouselValue ? carouselValue.data.map((item, index) => {
                  return item.statu === 1 ? <span key={item.concernID}><div>{`${index + 1}、`}</div>{`${item.content}`}</span> : null;
              }) : null
            }
          </span>
        </span>
        <span className={styles.close} style={{ float: 'right' }}> <Icon type="close-circle-o" onClick={onClickCarousel} /></span>
      </div>
    );
  }
}

