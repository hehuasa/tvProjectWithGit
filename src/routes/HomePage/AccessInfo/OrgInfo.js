import React, { PureComponent } from 'react';
import styles from './index.less';


let timerId;
// const scrolling = (dom, progress, scrollTop) => {
//   progress += 10;
//   dom.scrollTop(progress);
//   if (dom.getScrollTop() === scrollTop) {
//     progress = 0;
//     scrollTop = 0;
//   } else {
//     scrollTop = dom.getScrollTop();
//   }
//   return { progress, scrollTop };
// };
export default class FromComponent extends PureComponent {
  state = {
    leftIndex: 0,
    rightIndex: 0,
    leftPageNum: 0,
    rightPageNum: 0,
  };
  componentDidMount() {
    // // 自动滚动
    // let progress = 0;
    // let scrollTop = 0;
    // let progress1 = 0;
    // let scrollTop1 = 0;
    // timerId = setInterval(() => {
    //   const { onWheel } = this.props;
    //   if (!onWheel) {
    //     const obj = scrolling(this.arrayLeft, progress, scrollTop);
    //     progress = obj.progress; scrollTop = obj.scrollTop;
    //     const obj1 = scrolling(this.arrayRight, progress1, scrollTop1);
    //     progress1 = obj1.progress; scrollTop1 = obj1.scrollTop;
    //   }
    // }, 1000);
    const a = setInterval(() => {
      const { onWheel } = this.props;
      if (!onWheel) {
        const { leftPageNum, rightPageNum, leftIndex, rightIndex } = this.state;
        let newLeftIndex;
        let newRightIndex;
        if (leftIndex === leftPageNum - 1) {
          newLeftIndex = 0;
        } else {
          newLeftIndex = leftIndex + 1;
        }
        if (rightIndex === rightPageNum - 1) {
          newRightIndex = 0;
        } else {
          newRightIndex = rightIndex + 1;
        }

        this.setState({
          leftIndex: newLeftIndex,
          rightIndex: newRightIndex,
        });
      }
    }
      ,
    1500
    );
  }

  componentWillUnmount() {
    clearInterval(timerId);
  }
  splitArray = (data, num) => {
    const warpArray = [];
    let itemArray = [];
    for (const [index, item] of data.entries()) {
      if (itemArray.length < num && index !== data.length - 1) {
        itemArray.push(item);
      } else {
        // 最后一个元素
        if (index === data.length - 1) {
          if (itemArray.length < num) {
            itemArray.push(item);
            warpArray.push(itemArray);
          } else {
            warpArray.push(itemArray);
            itemArray = [];
            itemArray.push(item);
            warpArray.push(itemArray);
          }
        } else {
          warpArray.push(itemArray);
          itemArray = [];
          itemArray.push(item);
        }
      }
    }
    return warpArray;
  }
  handleData1 = (height, arrayLeft, arrayRight) => {
    // 计算需要分几页
    const titleHeight = 30; // 标题高度
    const rowNum = Math.ceil((height - titleHeight) / 24);
    const leftNum = Math.ceil(arrayLeft.length / rowNum);
    const rightNum = Math.ceil(arrayRight.length / rowNum);
    this.setState({
      leftPageNum: leftNum,
      rightPageNum: rightNum,
    });
    const newArrayLeft = this.splitArray(arrayLeft, rowNum);
    const newArrayRight = this.splitArray(arrayRight, rowNum);
    return { newArrayLeft, newArrayRight };
  };
  // 分解数组
  handleData = (array) => {
    const middle = Math.ceil(array.length / 2);
    const obj = { arrayLeft: [], arrayRight: [] };
    if (array.length > 0) {
      for (const [index, item] of array.entries()) {
        if (index < middle - 1) {
          obj.arrayLeft.push(item);
        } else {
          obj.arrayRight.push(item);
        }
      }
    }
    return obj;
  };
  render() {
    const { doorOrgCount, style } = this.props;
    const { leftIndex, rightIndex } = this.state;
    const { arrayLeft, arrayRight } = this.handleData(doorOrgCount);
    const height = style.height - 156;
    const { newArrayLeft, newArrayRight } = this.handleData1(height, arrayLeft, arrayRight);
    return (
      <div className={styles.orgInfo}>
        <ul>
          <li className={styles.title}>
            <span className={styles.orgName}>部门名称</span>
            <span className={styles.inFac}>在厂</span>
            <span className={styles.inPro}>生产区</span>
            <span className={styles.inOffice}>办公区</span>
          </li>
          {/* <Scrollbars */}
          {/* style={{ height }} */}
          {/* ref={ref => this.arrayLeft = ref} */}
          {/* > */}
          <div className={styles.rowContent} style={{ height }}>
            { newArrayLeft.length > 0 ? newArrayLeft.map((page, index) => (
              <div style={{ opacity: index === leftIndex ? 1 : 0 }} key={Math.random() * Math.random()} className={styles.rowPage}>{page.map(item => (
                <li className={styles.list} key={Math.random() * new Date().getTime()}>
                  <span className={styles.orgName}>{item.orgName}</span>
                  <span className={styles.inFac}>{item.sumNum}</span>
                  <span className={styles.inPro}>{item.productCount || 0}</span>
                  <span className={styles.inOffice}>{item.officeCount || 0}</span>
                </li>
              ))}
              </div>
            )) : null}
          </div>

          {/* </Scrollbars> */}
        </ul>
        <ul>
          <li className={styles.title}>
            <span className={styles.orgName}>部门名称</span>
            <span className={styles.inFac}>在厂</span>
            <span className={styles.inPro}>生产区</span>
            <span className={styles.inOffice}>办公区</span>
          </li>
          {/* <Scrollbars */}
          {/* autoHeight */}
          {/* autoHeightMax={height} */}
          {/* ref={ref => this.arrayRight = ref} */}
          {/* > */}
          <div className={styles.rowContent} style={{ height }}>
            { newArrayRight.length > 0 ? newArrayRight.map((page, index) => (
              <div key={Math.random() * Math.random()} style={{ opacity: index === rightIndex ? 1 : 0 }} className={styles.rowPage}>{page.map(item => (
                <li className={styles.list} key={Math.random() * new Date().getTime()}>
                  <span className={styles.orgName}>{item.orgName}</span>
                  <span className={styles.inFac}>{item.sumNum}</span>
                  <span className={styles.inPro}>{item.productCount || 0}</span>
                  <span className={styles.inOffice}>{item.officeCount || 0}</span>
                </li>
                ))}
              </div>
              )) : null}
          </div>
          {/* {arrayRight.length > 0 ? arrayRight.map(item => ( */}
          {/* <li className={styles.list} key={Math.random() * new Date().getTime()}> */}
          {/* <span className={styles.orgName}>{item.orgName}</span> */}
          {/* <span className={styles.inFac}>{item.sumNum}</span> */}
          {/* <span className={styles.inPro}>{item.productCount || 0}</span> */}
          {/* <span className={styles.inOffice}>{item.officeCount || 0}</span> */}
          {/* </li> */}
          {/* )) : null} */}
          {/* </Scrollbars> */}
        </ul>
      </div>
    );
  }
}

