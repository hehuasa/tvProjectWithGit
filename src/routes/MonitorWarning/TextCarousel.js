import React,{PureComponent} from 'react'
import {Icon} from 'antd'
// import Slider from 'react-slick'
// import 'slick-carousel/slick/slick.less'
// import 'slick-carousel/slick/slick-theme.less'

import styles from './textCarousel.less'


const scroll=(warpWidth,carouselWidth,copy,content,warp)=>{
  if(warpWidth-carouselWidth>0){
    let a =setInterval(function () {
      scrolling(copy,content,warp)
    },50)
  }
};
const delString=(string,unit)=>{
  const index = string.indexOf(unit);
  return Number(string.substring(0, index))
};

const scrolling=(copy,content,warp)=>{
  if(copy.offsetWidth<warp.scrollLeft)
    warp.scrollLeft-=content.offsetWidth;
  else
    warp.scrollLeft++
};

let carouselText=[
  {id:0,value1:'这是第',value2:'条测试'},
  {id:0,value1:'这是第',value2:'条测试'},
  {id:0,value1:'这是第',value2:'条测试'},
  {id:0,value1:'这是第',value2:'条测试'},
  {id:0,value1:'这是第',value2:'条测试'},
  {id:0,value1:'这是第',value2:'条测试'},
  {id:0,value1:'这是第',value2:'条测试'},
  {id:0,value1:'这是第',value2:'条测试'},
  {id:0,value1:'这是第',value2:'条测试'},
  {id:0,value1:'这是第',value2:'条测试'},
  {id:0,value1:'这是第',value2:'条测试'},
  {id:0,value1:'这是第',value2:'条测试'},
  {id:0,value1:'这是第',value2:'条测试'},
  {id:0,value1:'这是第',value2:'条测试'},
  {id:0,value1:'这是第',value2:'条测试'},
  {id:0,value1:'这是第',value2:'条测试'},
  {id:0,value1:'这是第',value2:'条测试'},
  {id:0,value1:'这是第',value2:'条测试'},
  {id:0,value1:'这是第',value2:'条测试'},
  {id:0,value1:'这是第',value2:'条测试'},
  {id:0,value1:'这是第',value2:'条测试'},
  {id:0,value1:'这是第',value2:'条测试'},
  {id:0,value1:'这是第',value2:'条测试'},
  {id:0,value1:'这是第',value2:'条测试'},
  {id:0,value1:'这是第',value2:'条测试'},
  {id:0,value1:'这是第',value2:'条测试'},
  {id:0,value1:'这是第',value2:'条测试'},
  {id:0,value1:'这是第',value2:'条测试'},
  {id:0,value1:'这是第',value2:'条测试'},
  {id:0,value1:'这是第',value2:'条测试'},
  {id:0,value1:'这是第',value2:'条测试'},
];



const changeText=(carouselText)=>{
  let k=0;
  for(let i of carouselText){
    let l =k+1;
    carouselText[k].id=k;
    carouselText[k].value=carouselText[k].value1+l+carouselText[k].value2+';';
    k++;
  }
};
changeText(carouselText);

class content extends PureComponent{
  render() {
    return (
      <span>
      {carouselText.map(item => {
        return <span key={item.id}>{item.value}</span>
      })}
    </span>
    )
  }
}

export default class TextCarousel extends PureComponent{
  render(){
    return (
      <div className={styles["text-carousel"]}>
        <span style={{float:'left'}}>重点关注：</span>
          <span ref={'carouselWarp'} className={styles["text-warp"]}>
            <span  ref={'carouselInner'}>
              <span  ref={'carouselContent'}>
                   {carouselText.map(item => {
                     return <span key={item.id}>{item.value}&nbsp;&nbsp;</span>})}
                     </span>
              <span  ref={'carouselCopy'} >
                {carouselText.map(item => {
                  return <span key={item.id}>{item.value}</span>})}
                  </span>
            </span>
        </span>

        <span style={{float:'right'}}><Icon type="close-circle-o" /></span>
      </div>
    )
  }
  componentDidMount(){
    const warp=this.refs.carouselWarp;
    const inner=this.refs.carouselInner;
    const content=this.refs.carouselContent;
    const copy=this.refs.carouselCopy;
    let warpWidth=window.getComputedStyle(warp).width;
    warpWidth=delString(warpWidth,'px');
    let carouselWidth=window.getComputedStyle(inner).width;
    carouselWidth=delString(carouselWidth,'px');

    scroll(warpWidth,carouselWidth,copy,content,warp);

  }
}
