import React, { PureComponent } from 'react';
import { Chart, Axis, Geom, Coord, Guide, Shape } from 'bizcharts';
import { constantlyConditionCalc } from '../../../../services/constantlyModal';


export default class DashBordColor extends PureComponent {
  constructor() {
    super();
    this.state = {
      lineWidth: 10,
    };
  }
    getArc = (data, dataType, colorObj) => {
      const obj = { data: [] };
      const nums = [];
      if (constantlyConditionCalc[dataType]) {
        obj.minValue = constantlyConditionCalc[dataType].minValue;
        obj.maxValue = constantlyConditionCalc[dataType].maxValue;
        obj.data = constantlyConditionCalc[dataType].conditionCalc;
      }
      for (const calc of obj.data) {
        for (const item of calc.range) {
          nums.push(Number(item.start), Number(item.end));
        }
        calc.color = colorObj[Number(calc.type.level)];
      }
      nums.sort((a, b) => {
        return a - b;
      });
      obj.start = nums[0];
      obj.end = nums[nums.length - 1];
      return obj;
    };
  // 图表模板
    render() {
      const { bordValue, meterUnit, datas, dataType, colorObj, dataTypeName, Arcs } = this.props;
      // const Arcs = this.getArc(datas, dataType, colorObj);

      const { Arc, Html } = Guide;
      // 自定义Shape 部分
      Shape.registerShape('point', 'pointer', {
        getPoints(cfg) {
          const { x, y } = cfg;
          return [
            { x, y: y + 0.35 },
          ];
        },
        drawShape(cfg, group) {
          let point = cfg.points[0]; // 获取第一个标记点
          point = this.parsePoint(point);
          const center = this.parsePoint({ // 获取极坐标系下画布中心点
            x: 0,
            y: 0,
          });
          // 绘制指针
          group.addShape('line', {
            attrs: {
              x1: center.x,
              y1: center.y,
              x2: point.x,
              y2: point.y,
              stroke: cfg.color,
              lineWidth: 3,
              lineCap: 'round',
            },
          });
          return group.addShape('circle', {
            attrs: {
              x: center.x,
              y: center.y,
              r: 6,
              stroke: cfg.color,
              lineWidth: 3,
              fill: '#fff',
            },
          });
        },
      });
      const data = bordValue;
      const { lineWidth } = this.state;
      const val = data[0].value;
      // const val = Number(data[0].value);
      // console.log('arc', Arcs.data);
      //   console.log('data', data);
      return (
        <div style={{ marginBottom: 40, marginTop: -20, marginLeft: -20, marginRight: -20 }}>
          <Chart
            height={220}
            data={data}
            scale={{
                value: {
                    min: val < Arcs.minValue ? val : Arcs.minValue,
                    max: val > Arcs.maxValue ? val : Arcs.maxValue,
                },
            nice: false,
        }}
            padding={[0, 0, 0, 0]}
            forceFit
            animate={false}
          >
            <Coord type="polar" startAngle={-9 / 8 * Math.PI} endAngle={1 / 8 * Math.PI} radius={0.78} />
            <Axis
              name="value"
              zIndex={2}
              line={null}
              label={{
                  offset: -10,
                  textStyle: {
                    fontSize: 12,
                    fill: '#fff',
                    textAlign: 'center',
                    textBaseline: 'middle',
                  } }}
              tickLine={{
                  length: -24,
                  stroke: '#fff',
                  strokeOpacity: 1,
                }}
            />
            <Axis name="1" visible={false} />
            <Guide>
              <Arc // 底色
                zIndex={0}
                start={[val < Arcs.minValue ? val : Arcs.minValue, 0.965]}
                end={[val > Arcs.maxValue ? val : Arcs.maxValue, 0.965]}
                style={{ // 底灰色
              stroke: 'rgba(0, 0, 0, 0.09)',
              lineWidth,
                 }}
              />
              <Arc // 正常值的颜色
                key={(Math.random() * 100).toString() + Date.now().toString()}
                zIndex={1}
                start={[Arcs.minValue, 0.965]}
                end={[Arcs.maxValue, 0.965]}
                style={{
                stroke: '#04eb82',
                lineWidth,
              }}
              />
              {/*<Arc // 正常值的颜色*/}
                {/*key={(Math.random() * 100).toString() + Date.now().toString()}*/}
                {/*zIndex={1}*/}
                {/*start={[Arcs.end, 0.965]}*/}
                {/*end={[Arcs.maxValue, 0.965]}*/}
                {/*style={{*/}
               {/*stroke: '#04eb82',*/}
               {/*lineWidth,*/}
               {/*}}*/}
              {/*/>*/}
              {
              Arcs.data.map((item) => {
              return item.range.map((item1) => {
                  return (
                    <Arc
                      key={(Math.random() * 100).toString() + Date.now().toString()}
                      zIndex={1}
                      start={[item1.start, 0.965]}
                      end={[item1.end, 0.965]}
                      style={{
                              stroke: item.color,
                              lineWidth,
                          }}
                    />
                  );
                  // if (val > item1.end) {
                  //   return (
                  //     <Arc
                  //       key={(Math.random() * 100).toString() + Date.now().toString()}
                  //       zIndex={1}
                  //       start={[item1.start, 0.965]}
                  //       end={[item1.end, 0.965]}
                  //       style={{
                  //         stroke: item.color,
                  //         lineWidth,
                  //       }}
                  //     />
                  //   );
                  // } else if (val > item1.start && val <= item1.end) {
                  //   return (
                  //     <Arc
                  //       key={(Math.random() * 100).toString() + Date.now().toString()}
                  //       zIndex={1}
                  //       start={[item1.start, 0.965]}
                  //       end={[val, 0.965]}
                  //       style={{
                  //         stroke: '#000',
                  //         lineWidth,
                  //       }}
                  //     />
                  //   );
                  // } else {
                  //   return null;
                  // }
                });
                // if (val > item.range[1]) {
                //   return (
                //     <Arc
                //       key={(Math.random() * 100).toString() + Date.now().toString()}
                //       zIndex={1}
                //       start={[item.range[0], 0.965]}
                //       end={[item.range[1], 0.965]}
                //       style={{
                //       stroke: item.color,
                //       lineWidth,
                //     }}
                //     />
                //   );
                // } else if (val > item.range[0] && val <= item.range[1]) {
                //   return (
                //     <Arc
                //       key={(Math.random() * 100).toString() + Date.now().toString()}
                //       zIndex={1}
                //       start={[item.range[0], 0.965]}
                //       end={[val, 0.965]}
                //       style={{
                //         stroke: item.color,
                //         lineWidth,
                //       }}
                //     />
                //   );
                // } else {
                //   return null;
                // }
              })
            }
              <Html
                position={['50%', '100%']}
                html={() => {
 return (`<div style="width: 300px;text-align: center;font-size: 12px!important;">
                <p style="font-size: 18px;color: #fff;margin: 0;">${val}(${meterUnit})
                </p></div>`);
}}
              />
              <Html
                position={['50%', '50%']}
                html={() => {
                return (`
<div style="width: 300px;text-align: center;font-size: 12px!important;">
                <p style="font-size: 14px; color: rgba(0,0,0,0.43);margin: 0;">${dataTypeName}</p>
`
                );
              }}
              />
            </Guide>
            <Geom
              type="point"
              position="value*1"
              shape="pointer"
              size={200}
              color="#1890FF"
              active={false}
              style={{ stroke: '#fff', lineWidth: 1 }}
            />
          </Chart>
        </div>
      );
    }
}
