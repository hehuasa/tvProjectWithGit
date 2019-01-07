import React, { PureComponent } from 'react';
import { Chart, Axis, Geom, Tooltip } from 'bizcharts';
import LeftTitle from '../../LeftTitle/LeftTitle';

const getCols = (length) => {
  const obj = {};
  if (length < 5 && length > 0) {
    obj.tickInterval = 1;
  }
  return { count: obj };
};
const grid = {
  lineStyle: {
    lineWidth: 2, // 网格线的宽度复制代码
  },
}
export default class TypeByJobType extends PureComponent {
  render() {
    const { data } = this.props;
    const scales = getCols(data[0].count);
    return (
      <Chart height={400} data={data} forceFit scale={scales} padding={[20, 30, 'auto', 60]} animate={false}>
        <LeftTitle title="作业数量" />
        <Axis
          name="jobType"
          label={{
            autoRotate: false,
            offset: 15,
            // 设置文本的显示样式，还可以是个回调函数，回调函数的参数为该坐标轴对应字段的数值
            textStyle: {
              textAlign: data.length > 5 ? 'end' : 'center', // 文本对齐方向，可取值为： start center end
              fill: '#fff', // 文本的颜色
              fontSize: '18', // 文本大小
              // fontWeight: 'bold', // 文本粗细
              rotate: data.length > 3 ? -45 : 0,
            },
            textBaseline: 'bottom', // 文本基准线，可取 top middle bottom，默认为middle
          }}
          line={{ lineWidth: 2, stroke: '#ccc' }} 
        />
        <Axis
          name="count"
          line={{ lineWidth: 2, stroke: '#ccc' }}
          label={{
            autoRotate: false,
            offset: 15,
            // 设置文本的显示样式，还可以是个回调函数，回调函数的参数为该坐标轴对应字段的数值
            textStyle: {
              textAlign: data.length > 5 ? 'end' : 'center', // 文本对齐方向，可取值为： start center end
              fill: '#fff', // 文本的颜色
              fontSize: '18', // 文本大小
              // fontWeight: 'bold', // 文本粗细
              rotate: data.length > 3 ? -45 : 0,
            },
            textBaseline: 'bottom', // 文本基准线，可取 top middle bottom，默认为middle
          }}
          grid={grid}
        />
        <Tooltip
          crosshairs={{ type: 'y' }}
          itemTpl='<tr class="g2-tooltip-list-item"><td style="color:{color}">作业数量： </td><td>{value}</td></tr>'
          g2-tooltip={{ backgroundColor: '#090f25' }}
          g2-tooltip-title={{
            color: '#fff',
            fontSize: '18px',
          }}
          g2-tooltip-list-item={{
            color: '#fff',
            fontSize: '18px',
          }}
          g2-tooltip-marker={{
            width: '10px',
            height: '10px',
          }}
        />
        <Geom type="interval" position="jobType*count" />
      </Chart>
    );
  }
}
