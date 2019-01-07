import React, {PureComponent} from 'react';
import { Button } from 'antd';
import esriLoader from "esri-loader";
import { connect } from 'dva'
import mapService from '../../utils/mapService'


const mapStateToProps=({map}) => {
  return {
    startBreath:map.startBreath,
    searchDeviceArray:map.searchDeviceArray
  };
};
@connect(({map})=>({map}))
class SearchDemo extends PureComponent{

  constructor(props){
    super(props);
    this.state={
      start:false,
      searchText:1,
    };
  }
  searchPara=()=>{
    const {searchDeviceArray,startBreath,dispatch}=this.props;
    const that=this;
    //搜索设备
    dispatch({
      type:'map/searchDeviceByAttr',
      payload:{baseLayer:'http://192.168.0.5:6080/arcgis/rest/services/YX03/MapServer',searchText:this.state.searchText}
    }).then(()=>{//遍历设备数组，切换为屏幕坐标，若遍历完成重新执行搜索函数
      breathAnimation()
    });
    //动画函数
    let entries = searchDeviceArray.entries();
    const breathAnimation=()=>{
     let device= entries.next();
      if(device.done){
        this.searchPara()
      }else {//执行动画
        let animatePosition = this.props.mainMap.toScreen(device.value[1].feature.geometry);//转换为屏幕坐标
        dispatch({
          type: 'map/breath',
          payload: {x: animatePosition.x, y: animatePosition.y, show: true}
        }).then(() => {//停止动画
          setTimeout(() => {
            that.props.dispatch({
              type: 'map/breath',
              payload: {show: false}
            }).then(() => {//循环
              this.setState({searchText:this.state.searchText++});
              breathAnimation()
            })
          }, 2000)
        })
      }
    }

  };
   animation=(array,index)=>{
     const that=this;
     if(index===array.length){
       let searchText=this.state.searchText+1;
       this.setState({searchText,deviceArrayIndex:0});
       this.searchPara();
     }else {
       let animatePosition=this.props.mainMap.toScreen(array[index].feature.geometry);//转换为屏幕坐标
       console.log(animatePosition);
       this.props.dispatch({
         type:'map/breath',
         payload:{x:animatePosition.x,y:animatePosition.y,show:true}
       }).then(()=>{
         setTimeout(()=> {
           that.props.dispatch({
             type:'map/breath',
             payload:{show:false}
           }).then(()=> {
             this.setState({deviceArrayIndex:this.state.deviceArrayIndex+1});
             this.animation(this.state.deviceArray,this.state.deviceArrayIndex)
           })
         },2000)
       });
     }
  };

  componentWillReceiveProps  (){
     // const {startBreath}=this.props;
     // if(startBreath){
     //   this.searchPara()
     // }

   }
  render(){
    const {startBreath}=this.props;
    return(
      (!startBreath)?
      <Button onClick={this.searchPara} style={{position:'absolute',top:100,right:20,zIndex:100}} type="primary">呼吸灯demo</Button>
  :null
    )
  }
}
export default connect(mapStateToProps)(SearchDemo);
