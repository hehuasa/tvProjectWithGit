import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { notification } from 'antd';
import { getBrowserStyle, getBrowserScroll } from '../../../utils/utils';
import styles from './video.less';
import toggleUp from '../../../assets/homePage/carousel-bottom-out.png';
import toggleDown from '../../../assets/homePage/carousel-bottom-in.png';
import a1 from '../../../assets/homePage/video/2.png';
import a2 from '../../../assets/homePage/video/3.png';
import a3 from '../../../assets/homePage/video/4.png';
import a4 from '../../../assets/homePage/video/5.png';
import { mapConstants } from '../../../services/mapConstant';
import { getBordStyle } from '../../../utils/mapService';

let winScrollHandle = null; let winResizeHandle = null;
@connect(({ homepage, video, accessControl }) => {
  return {
    videoFooterHeight: homepage.videoFooterHeight,
    video,
    accessControl,
  };
})
export default class HomePageVideo extends PureComponent {
  componentDidMount() {
    // 获取当前的scrollTop，scrollLeft
    const { dispatch } = this.props;
    let currentScrollTop = getBrowserScroll().scrollTop;
    let currentScrollLeft = getBrowserScroll().scrollLeft;
    const that = this;
    const videoLoaded = setInterval(() => {
      if (this.props.video.isLoaded && this.warp !== null) {
        if (this.warp.clientWidth >= 952) {
          clearInterval(videoLoaded);
          that.reset();
          // notification.open({
          //   message: 'video.videoWarp.clientWidth',
          //   description: this.warp.clientWidth,
          // });
          dispatch({
            type: 'video/queryVideoWarp',
            payload: this.warp,
          });
        }
      }
    }, 100);
    // 监听滚动事件（window）
    setTimeout(() => {
      winScrollHandle = window.addEventListener('scroll', () => {
        const { scrollTop, scrollLeft } = getBrowserScroll();
        const para = scrollTop - currentScrollTop;
        const leftPara = scrollLeft - currentScrollLeft;
        currentScrollLeft = scrollLeft;
        currentScrollTop = scrollTop;
        const newPosition = {
          x: this.props.video.position.x - Number(leftPara),
          y: this.props.video.position.y - Number(para),
        };
        dispatch({
          type: 'video/reposition',
          payload: {
            CmdCode: '10002',
            Point: newPosition,
          },
        });
      });
      winResizeHandle = window.addEventListener('resize', () => {
        setTimeout(() => {
          const { video } = that.props;
          that[video.layout]();
        }, 500);
      });
      // 键盘事件（开发用）
      // const keyPress = document.addEventListener('keydown', (e) => {
      //   switch (e.code) {
      //     case 'NumpadDivide':
      //       if (e.ctrlKey) {
      //         this.props.dispatch({
      //           type: 'video/devTools',
      //           payload: { CmdCode: 'F12' },
      //         });
      //       }
      //       break;
      //     case 'NumpadMultiply':
      //       if (e.ctrlKey) {
      //         this.props.dispatch({
      //           type: 'video/devTools',
      //           payload: { CmdCode: 'MIN' },
      //         });
      //       }
      //       break;
      //     case 'NumpadSubtract':
      //       if (e.ctrlKey) {
      //         this.props.dispatch({
      //           type: 'video/devTools',
      //           payload: { CmdCode: 'EXIT' },
      //         });
      //       }
      //       break;
      //     default: break;
      //   }
      // });
    }, 1000);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', winScrollHandle);
    window.removeEventListener('resize', winResizeHandle);
  }
  reset = () => {
    const { videoFooterHeight, dispatch, video } = this.props;
    const { winHeight } = getBrowserStyle();

    dispatch({
      type: 'video/switch',
      payload: {
        CmdCode: 'Show',
      },
    });
    if (this.warp !== null) {
      const client = this.warp.getBoundingClientRect();
      if (videoFooterHeight.current === 0 || videoFooterHeight.current > 300) {
        dispatch({
          type: 'homepage/getVideoFooterHeight',
          payload: { current: 190, cache: videoFooterHeight.current },
        });
        dispatch({
          type: 'global/getContentHeight',
        });
      }
      const x = video.position.x || client.left + 10;
      const width = video.size.width || this.warp.clientWidth - 16;
      dispatch({
        type: 'video/reposition',
        payload: {
          CmdCode: '10002',
          Point:
            {
              x: x + video.padding.left + video.padding.right,
              y: winHeight - 151 - getBrowserScroll().scrollTop, // 误差为43
            },
        },
      }).then(() => {
        dispatch({
          type: 'video/resize',
          payload: {
            CmdCode: '10001',
            Size:
              {
                Width: width - video.padding.left - video.padding.right,
                Height: 155,
              },
          },
        }).then(() => {
          dispatch({
            type: 'video/relayout',
            payload: {
              CmdCode: '10003',
              Layout: 'Transverse',
              WindowCount: '4',
            },
          });
        });
      });
    }
  };
  arrange4 = () => {
    const { dispatch, video, videoFooterHeight } = this.props;
    const { winHeight } = getBrowserStyle();
    const client = this.warp.getBoundingClientRect();
    dispatch({
      type: 'video/switch',
      payload: {
        CmdCode: 'Show',
      },
    });
    this.props.dispatch({
      type: 'global/contentHeight',
      payload: 0,
    });
    this.props.dispatch({
      type: 'homepage/VideoFooterHeight',
      payload: { current: winHeight - 50 - 35 - 30 - 16 - 4, cache: videoFooterHeight.current }, // l两个外边距
    });
    const x = video.position.x || client.left + 10;
    const width = video.size.width || this.warp.clientWidth - 16;
    dispatch({
      type: 'video/reposition',
      payload: {
        CmdCode: '10002',
        Point:
                  {
                    x: x + video.padding.left + video.padding.right,
                    y: 50 + 35 + 30 + 16 + 35 + 37 - 30 - getBrowserScroll().scrollTop, // 误差为437
                  },
      },
    }).then(() => {
      dispatch({
        type: 'video/resize',
        payload: {
          CmdCode: '10001',
          Size:
            {
              Width: width - video.padding.left - video.padding.right,
              Height: winHeight - 50 - 35 - 30 - 35 - 16 - 4,
            },
        },
      }).then(() => {
        dispatch({
          type: 'video/relayout',
          payload: {
            CmdCode: '10003',
            Layout: 'Standard',
            WindowCount: '4',
          },
        });
      });
    });
  };
  arrange6 = () => {
    const { dispatch, video, videoFooterHeight } = this.props;
    const { winHeight } = getBrowserStyle();
    const client = this.warp.getBoundingClientRect();
    dispatch({
      type: 'video/switch',
      payload: {
        CmdCode: 'Show',
      },
    });
    this.props.dispatch({
      type: 'global/contentHeight',
      payload: 0,
    });
    this.props.dispatch({
      type: 'homepage/VideoFooterHeight',
      payload: { current: winHeight - 50 - 35 - 30 - 16 - 4, cache: videoFooterHeight.current }, // l两个外边距
    });
    const x = video.position.x || client.left + 10;
    const width = video.size.width || this.warp.clientWidth - 16;
    dispatch({
      type: 'video/reposition',
      payload: {
        CmdCode: '10002',
        Point:
                  {
                    x: x + video.padding.left + video.padding.right,
                    y: 50 + 35 + 30 + 16 + 35 + 37 - 30 - getBrowserScroll().scrollTop, // 误差为37
                  },
      },
    }).then(() => {
      dispatch({
        type: 'video/resize',
        payload: {
          CmdCode: '10001',
          Size:
            {
              Width: width - video.padding.left - video.padding.right,
              Height: winHeight - 50 - 35 - 30 - 35 - 16 - 4,
            },
        },
      }).then(() => {
        dispatch({
          type: 'video/relayout',
          payload: {
            CmdCode: '10003',
            Layout: 'UnStandard',
            WindowCount: '6',
          },
        });
      });
    });
  };
  arrange9 = () => {
    const { dispatch, video, videoFooterHeight } = this.props;
    const { winHeight } = getBrowserStyle();
    const client = this.warp.getBoundingClientRect();
    dispatch({
      type: 'video/switch',
      payload: {
        CmdCode: 'Show',
      },
    });
    this.props.dispatch({
      type: 'global/contentHeight',
      payload: 0,
    });
    this.props.dispatch({
      type: 'homepage/VideoFooterHeight',
      payload: { current: winHeight - 50 - 35 - 30 - 16 - 4, cache: videoFooterHeight.current }, // l两个外边距
    });
    const x = video.position.x || client.left + 10;
    const width = video.size.width || this.warp.clientWidth - 16;
    dispatch({
      type: 'video/reposition',
      payload: {
        CmdCode: '10002',
        Point:
                    {
                      x: x + video.padding.left + video.padding.right,
                      y: 50 + 35 + 30 + 16 + 35 + 37 - 30 - getBrowserScroll().scrollTop, // 误差为37
                    },
      },
    }).then(() => {
      dispatch({
        type: 'video/resize',
        payload: {
          CmdCode: '10001',
          Size:
            {
              Width: width - video.padding.left - video.padding.right,
              Height: winHeight - 50 - 35 - 30 - 35 - 16 - 4,
            },
        },
      }).then(() => {
        dispatch({
          type: 'video/relayout',
          payload: {
            CmdCode: '10003',
            Layout: 'Standard',
            WindowCount: '9',
          },
        });
      });
    });
  };
  toggle= () => {
    const { videoFooterHeight, dispatch, accessControl } = this.props;
    if (videoFooterHeight.current === 0) {
      // this.reset();
      dispatch({
        type: 'homepage/getVideoFooterHeight',
        payload: { current: videoFooterHeight.cache, cache: videoFooterHeight.current },
      });
      // dispatch({
      //   type: 'video/resize',
      //   payload: {
      //     CmdCode: '10001',
      //     Size:
      //           {
      //             Width: this.warp.clientWidth - 16, // 误差与边距20
      //             Height: video.size.height,
      //           },
      //   },
      // }).then(() => {
      //   dispatch({
      //     type: 'video/relayout',
      //     payload: video.layoutCommand,
      //   });
      // });
      dispatch({
        type: 'homepage/getMapHeight',
        payload: { domType: 'map' },
      });
      dispatch({
        type: 'video/switch',
        payload: {
          CmdCode: 'Show',
        },
      });
    } else {
      // dispatch({
      //   type: 'video/resize',
      //   payload: {
      //     CmdCode: '10001',
      //     Size:
      //         {
      //           Width: video.size.width || this.warp.clientWidth - 16, // 误差与边距20
      //           Height: 0,
      //         },
      //   },
      // });
      // 隐藏视频
      dispatch({
        type: 'video/switch',
        payload: {
          CmdCode: 'Hide',
        },
      });
      dispatch({
        type: 'homepage/getVideoFooterHeight',
        payload: { current: 0, cache: videoFooterHeight.current },
      });
      dispatch({
        type: 'homepage/getMapHeight',
        payload: { domType: 'map', changingType: 'evrVideo' },
      });
    }
    if (accessControl.show) {
      const { view, extent } = mapConstants;
      if (view.height) {
        view.goTo({ extent }).then(() => {
          getBordStyle(view).then((style) => {
            dispatch({
              type: 'accessControl/queryStyle',
              payload: style,
            });
          });
        });
      }
    }
  };
  render() {
    const { videoFooterHeight, video } = this.props;
    const { current } = videoFooterHeight;
    return (
      <div
        className={styles.video}
        style={{ height: current }}
        ref={(ref) => { this.warp = ref; }}
      >
        {/* <div style={{ background: 'blue', position: 'fixed', whiteSpace: 'pre', top: video.position.y, left: video.position.x, width: video.size.width, height: video.size.height, lineHeight: `${video.size.height}px`, textAlign: 'center', fontSize: 32, color: '#fff', fontWeight: 900 }}>视    频    示    意    窗    口</div> */}
        <img src={current === 0 ? toggleDown : toggleUp} alt="toggle" style={{ top: current === 0 ? -11 : -8 }} onClick={this.toggle} className={styles.toggle} />
        {current === 0 ? null : (
          <div className={styles['video-header']} >
            <span onClick={() => this.reset(this)}><img src={a4} alt="reset" /></span>
            <span onClick={() => this.arrange4(this)}><img src={a3} alt="arrange4" /></span>
            <span onClick={() => this.arrange6(this)}><img src={a1} alt="arrange6" /></span>
            <span onClick={() => this.arrange9(this)}><img src={a2} alt="arrange9" /></span>
          </div>
)
          }
      </div>
    );
  }
}
