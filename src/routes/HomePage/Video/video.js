import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './video.less';
import videoPoster from '../../../assets/envi/videoPoster.png';
import toggleUp from '../../../assets/homePage/carousel-bottom-out.png';
import toggleDown from '../../../assets/homePage/carousel-bottom-in.png';

const videoData = [
  { id: 0, name: '视频一', src: '' },
  { id: 1, name: '视频二', src: '' },
  { id: 2, name: '视频三', src: '' },
  { id: 3, name: '视频四', src: '' },
];
@connect(({ homepage }) => {
  return {
    videoFooterHeight: homepage.videoFooterHeight,
  };
})
export default class HomePageVideo extends PureComponent {
  state={
    warpDisplay: 'block',
    warpHeight: 190,
  };
  toggle= () => {
    const { videoFooterHeight, dispatch } = this.props;
    if (videoFooterHeight === 0) {
      dispatch({
        type: 'homepage/getVideoFooterHeight',
        payload: { videoFooterHeight },
      });
      dispatch({
        type: 'homepage/getMapHeight',
        payload: { domType: 'map' },
      });
    } else {
      dispatch({
        type: 'homepage/getVideoFooterHeight',
        payload: { videoFooterHeight },
      });
      dispatch({
        type: 'homepage/getMapHeight',
        payload: { domType: 'map', changingType: 'evrVideo' },
      });
    }
  };
  render() {
    return (
      <div className={styles.video} style={{ height: this.props.videoFooterHeight }}>
        <img src={this.state.warpHeight === 0 ? toggleDown : toggleUp} alt="toggle" onClick={this.toggle} className={styles.toggle} />
        <div className={styles['video-header']} />
        <div className={styles['video-content']}>
          {videoData.map((item => (
            <div key={item.id}>
              <img alt="video" src={videoPoster} />
              {this.props.videoFooterHeight === 0 ? null : <span>{item.name}</span>}
            </div>
)))}
        </div>
      </div>
    );
  }
}
