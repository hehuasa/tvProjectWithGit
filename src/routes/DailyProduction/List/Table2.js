import React, { PureComponent } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { wuliao1, wuliao2, liejielu, fadianji } from './lib/grid';
import Rubylong from './lib/grid++Report';
import data from './lib/data';

import styles from './index.less';

const a = '<div><span style="font-size: 18px;">Quill Rich Text FlowEditor</span>' +
  '</div><div><br></div><div>Quill is a free, <a href="https://githu' +
  'b.com/quilljs/quill/">open source</a> WYSIWYG editor built for th' +
  'e modern web. With its <a href="http://quilljs.com/docs/modules/"' +
  '>extensible architecture</a> and a <a href="http://quilljs.com/do' +
  'cs/api/">expressive API</a> you can completely customize it to fu' +
  'lfill your needs. Some built in features include:</div><div><br><' +
  '/div><ul><li>Fast and lightweight</li><li>Semantic markup</li><li' +
  '>Standardized HTML between browsers</li><li>Cross browser support' +
  ' including Chrome, Firefox, Safari, and IE 9+</li></ul><div><br><' +
  '/div><div><span style="font-size: 18px;">Downloads</span></div><d' +
  'iv><br></div><ul><li><a href="https://quilljs.com">Quill.js</a>, ' +
  'the free, open source WYSIWYG editor</li><li><a href="https://zen' +
  'oamaro.github.io/react-quill">React-quill</a>, a React component ' +
  'that wraps Quill.js</li></ul>';
const testGrid =
  {
    Version: '6.5.1.0',
    Title: '2f.多级分组单元格合并',
    Author: '锐浪报表软件',
    Description: '演示多级分组报表：在 Grid++Report 中，可以同时定义多个分组，多个分组之间存在层级关系，外层分组项总是包含内层分组，当一个外层分组项结束时，其包含的内层分组项也将结束。',
    Font: {
      Name: '宋体',
      Size: 90000,
      Weight: 400,
      Charset: 134,
    },
    Printer: {
      Oriention: 'Landscape',
    },
    ReportHeader: [
      {
        Name: 'ReportHeader1',
        CanGrow: true,
        Height: 16.0073,
        Control: [
          {
            Type: 'SubReport',
            Name: 'SubReport3',
            Left: 12.991,
            Top: 2.80458,
            Width: 13,
            Height: 3.78354,
            Report: {
              Version: '6.5.1.0',
              Font: {
                Name: '宋体',
                Size: 105000,
                Weight: 400,
                Charset: 134,
              },
              Printer: {
              },
              DetailGrid: {
                Recordset: {
                  Field: [
                    {
                      Name: 'Field1',
                    },
                    {
                      Name: 'Field2',
                    },
                    {
                      Name: 'Field3',
                    },
                    {
                      Name: 'Field4',
                    },
                    {
                      Name: 'Field5',
                    },
                    {
                      Name: 'Field6',
                    },
                    {
                      Name: 'Field7',
                    },
                    {
                      Name: 'Field8',
                    },
                    {
                      Name: 'Field9',
                    },
                    {
                      Name: 'Field10',
                    },
                  ],
                },
                Column: [
                  {
                    Name: 'Column1',
                    Width: 1.98438,
                  },
                  {
                    Name: 'Column3',
                    Width: 1.5875,
                  },
                  {
                    Name: 'Column4',
                    Width: 0.608542,
                  },
                  {
                    Name: 'Column5',
                    Width: 0.79375,
                  },
                  {
                    Name: 'Column6',
                    Width: 0.978958,
                  },
                  {
                    Name: 'Column7',
                    Width: 1.00542,
                  },
                  {
                    Name: 'Column8',
                    Width: 1.19063,
                  },
                  {
                    Name: 'Column9',
                    Width: 1.03188,
                  },
                  {
                    Name: 'Column11',
                    Width: 1.00542,
                  },
                  {
                    Name: 'Column10',
                    Width: 5.79438,
                  },
                ],
                ColumnContent: {
                  ColumnContentCell: [
                    {
                      Column: 'Column1',
                      DataField: 'Field1',
                    },
                    {
                      Column: 'Column3',
                      DataField: 'Field2',
                    },
                    {
                      Column: 'Column4',
                      DataField: 'Field3',
                    },
                    {
                      Column: 'Column5',
                      DataField: 'Field4',
                    },
                    {
                      Column: 'Column6',
                      DataField: 'Field5',
                    },
                    {
                      Column: 'Column7',
                      DataField: 'Field6',
                    },
                    {
                      Column: 'Column8',
                      DataField: 'Field7',
                    },
                    {
                      Column: 'Column9',
                      DataField: 'Field8',
                    },
                    {
                      Column: 'Column11',
                      DataField: 'Field8',
                    },
                    {
                      Column: 'Column10',
                      DataField: 'Field9',
                    },
                  ],
                },
                ColumnTitle: {
                  Height: 1.19063,
                  ColumnTitleCell: [
                    {
                      GroupTitle: true,
                      Name: '二、 裂解炉路运行状况',
                      ColumnTitleCell: [
                        {
                          GroupTitle: false,
                          Column: 'Column1',
                          Lock: 'None',
                          TextAlign: 'MiddleCenter',
                          Text: '炉号',
                        },
                        {
                          GroupTitle: false,
                          Column: 'Column3',
                          TextAlign: 'MiddleCenter',
                          Text: '原料',
                        },
                        {
                          GroupTitle: false,
                          Column: 'Column4',
                          TextAlign: 'MiddleCenter',
                          Text: '天数',
                        },
                        {
                          GroupTitle: false,
                          Column: 'Column5',
                          TextAlign: 'MiddleCenter',
                          Text: 'COT（℃）',
                        },
                        {
                          GroupTitle: false,
                          Column: 'Column6',
                          TextAlign: 'MiddleCenter',
                          Text: '负荷（t/h）',
                        },
                        {
                          GroupTitle: false,
                          Column: 'Column7',
                          TextAlign: 'MiddleCenter',
                          Text: '炉号',
                        },
                        {
                          GroupTitle: false,
                          Column: 'Column8',
                          TextAlign: 'MiddleCenter',
                          Text: '原料',
                        },
                        {
                          GroupTitle: false,
                          Column: 'Column9',
                          TextAlign: 'MiddleCenter',
                          Text: '天数',
                        },
                        {
                          GroupTitle: false,
                          Column: 'Column11',
                          TextAlign: 'MiddleCenter',
                          Text: 'COT（℃）',
                        },
                        {
                          GroupTitle: false,
                          Column: 'Column10',
                          TextAlign: 'MiddleCenter',
                          Text: '负荷（t/h）',
                        },
                      ],
                      Text: '二、裂解炉运行状况',
                    },
                  ],
                },
              },
            },
          },
          {
            Type: 'SubReport',
            Name: 'SubReport4',
            Left: 12.991,
            Top: 6.58813,
            Width: 13,
            Height: 3.81,
            Report: {
              Version: '6.5.1.0',
              Font: {
                Name: '宋体',
                Size: 105000,
                Weight: 400,
                Charset: 134,
              },
              Printer: {
              },
              DetailGrid: {
                Recordset: {
                  Field: [
                    {
                      Name: 'Field1',
                    },
                    {
                      Name: 'Field2',
                    },
                    {
                      Name: 'Field3',
                    },
                    {
                      Name: 'Field4',
                    },
                    {
                      Name: 'Field5',
                    },
                    {
                      Name: 'Field6',
                    },
                    {
                      Name: 'Field7',
                    },
                    {
                      Name: 'Field8',
                    },
                    {
                      Name: 'Field9',
                    },
                    {
                      Name: 'Field10',
                    },
                  ],
                },
                Column: [
                  {
                    Name: 'Column1',
                    Width: 1.37583,
                  },
                  {
                    Name: 'Column3',
                    Width: 1.00542,
                  },
                  {
                    Name: 'Column4',
                    Width: 1.00542,
                  },
                  {
                    Name: 'Column5',
                    Width: 0.978958,
                  },
                  {
                    Name: 'Column6',
                    Width: 1.00542,
                  },
                  {
                    Name: 'Column7',
                    Width: 1.00542,
                  },
                  {
                    Name: 'Column8',
                    Width: 1.00542,
                  },
                  {
                    Name: 'Column9',
                    Width: 8.59896,
                  },
                ],
                ColumnContent: {
                  ColumnContentCell: [
                    {
                      Column: 'Column1',
                      DataField: 'Field1',
                    },
                    {
                      Column: 'Column3',
                      DataField: 'Field2',
                    },
                    {
                      Column: 'Column4',
                      DataField: 'Field3',
                    },
                    {
                      Column: 'Column5',
                      DataField: 'Field4',
                    },
                    {
                      Column: 'Column6',
                      DataField: 'Field5',
                    },
                    {
                      Column: 'Column7',
                      DataField: 'Field6',
                    },
                    {
                      Column: 'Column8',
                      DataField: 'Field7',
                    },
                    {
                      Column: 'Column9',
                      DataField: 'Field8',
                    },
                  ],
                },
                ColumnTitle: {
                  Height: 1.19063,
                  ColumnTitleCell: [
                    {
                      GroupTitle: true,
                      Name: '二、 裂解炉路运行状况',
                      ColumnTitleCell: [
                        {
                          GroupTitle: false,
                          Column: 'Column1',
                          Lock: 'None',
                          TextAlign: 'MiddleCenter',
                          Text: '炉号',
                        },
                        {
                          GroupTitle: false,
                          Column: 'Column3',
                          TextAlign: 'MiddleCenter',
                          Text: '运行天数',
                        },
                        {
                          GroupTitle: false,
                          Column: 'Column4',
                          TextAlign: 'MiddleCenter',
                          Text: '产汽量（t/h）',
                        },
                        {
                          GroupTitle: false,
                          Column: 'Column5',
                          TextAlign: 'MiddleCenter',
                          Text: '主汽温度（℃）',
                        },
                        {
                          GroupTitle: false,
                          Column: 'Column6',
                          TextAlign: 'MiddleCenter',
                          Text: '发电机号',
                        },
                        {
                          GroupTitle: false,
                          Column: 'Column7',
                          TextAlign: 'MiddleCenter',
                          Text: '运行天数',
                        },
                        {
                          GroupTitle: false,
                          Column: 'Column8',
                          TextAlign: 'MiddleCenter',
                          Text: '进汽量（t/h）',
                        },
                        {
                          GroupTitle: false,
                          Column: 'Column9',
                          TextAlign: 'MiddleCenter',
                          Text: '发电量（MW）',
                        },
                      ],
                      Text: '三、热电锅炉及发电机运行状况',
                    },
                  ],
                },
              },
            },
          },
          {
            Type: 'SubReport',
            Name: 'SubReport1',
            Dock: 'Left',
            Width: 13,
            Report: {
              Version: '6.5.1.0',
              Font: {
                Name: '宋体',
                Size: 105000,
                Weight: 400,
                Charset: 134,
              },
              Printer: {
              },
              DetailGrid: {
                Recordset: {
                  Field: [
                    {
                      Name: 'device',
                    },
                    {
                      Name: 'type',
                    },
                    {
                      Name: 'met',
                    },
                    {
                      Name: 'month',
                    },
                    {
                      Name: 'monthc',
                    },
                    {
                      Name: 'mac1',
                    },
                    {
                      Name: 'mac2',
                    },
                  ],
                },
                Column: [
                  {
                    Name: 'Column1',
                    Width: 2.56646,
                  },
                  {
                    Name: 'Column2',
                    Width: 1,
                  },
                  {
                    Name: 'Column3',
                    Width: 1,
                  },
                  {
                    Name: 'Column4',
                    Width: 1,
                  },
                  {
                    Name: 'Column5',
                    Width: 0.978958,
                  },
                  {
                    Name: 'Column6',
                    Width: 0.978958,
                  },
                  {
                    Name: 'Column7',
                    Width: 8.44021,
                  },
                ],
                ColumnContent: {
                  Height: 0.608542,
                  ColumnContentCell: [
                    {
                      Column: 'Column1',
                      DataField: 'device',
                    },
                    {
                      Column: 'Column2',
                      DataField: 'type',
                    },
                    {
                      Column: 'Column3',
                      DataField: 'met',
                    },
                    {
                      Column: 'Column4',
                      DataField: 'month',
                    },
                    {
                      Column: 'Column5',
                      DataField: 'monthc',
                    },
                    {
                      Column: 'Column6',
                      DataField: 'mac1',
                    },
                    {
                      Column: 'Column7',
                      DataField: 'mac2',
                    },
                  ],
                },
                ColumnTitle: {
                  Height: 0.608542,
                  ColumnTitleCell: [
                    {
                      GroupTitle: false,
                      Column: 'Column1',
                      TextAlign: 'MiddleCenter',
                      Text: '装置名称',
                    },
                    {
                      GroupTitle: false,
                      Column: 'Column2',
                      TextAlign: 'MiddleCenter',
                    },
                    {
                      GroupTitle: false,
                      Column: 'Column3',
                      TextAlign: 'MiddleCenter',
                      Text: '物料',
                    },
                    {
                      GroupTitle: false,
                      Column: 'Column4',
                      TextAlign: 'MiddleCenter',
                      Text: '月计划',
                    },
                    {
                      GroupTitle: false,
                      Column: 'Column5',
                      TextAlign: 'MiddleCenter',
                      Text: '日完成',
                    },
                    {
                      GroupTitle: false,
                      Column: 'Column6',
                      TextAlign: 'MiddleCenter',
                      Text: '收率%',
                    },
                    {
                      GroupTitle: false,
                      Column: 'Column7',
                      TextAlign: 'MiddleCenter',
                      Text: '月进度',
                    },
                  ],
                },
                Group: [
                  {
                    Name: 'Group1',
                    ByFields: 'device',
                    GroupHeader: {
                      OccupyColumn: true,
                      OccupiedColumns: 'Column1',
                    },
                    GroupFooter: {
                      Height: 0,
                    },
                  },
                  {
                    Name: 'Group2',
                    ByFields: 'type',
                    GroupHeader: {
                      OccupyColumn: true,
                      OccupiedColumns: 'Column2',
                    },
                    GroupFooter: {
                      Height: 0,
                    },
                  },
                ],
              },
            },
          },
          {
            Type: 'SubReport',
            Name: 'SubReport2',
            Dock: 'Top',
            Left: 12.991,
            Height: 2.80458,
            Report: {
              Version: '6.5.1.0',
              Font: {
                Name: '宋体',
                Size: 105000,
                Weight: 400,
                Charset: 134,
              },
              Printer: {
              },
              DetailGrid: {
                Recordset: {
                  Field: [
                    {
                      Name: 'device',
                      DBFieldName: 'device1',
                    },
                    {
                      Name: 'type',
                      DBFieldName: 'type1',
                    },
                    {
                      Name: 'met',
                      DBFieldName: 'met1',
                    },
                    {
                      Name: 'month',
                      DBFieldName: 'month1',
                    },
                    {
                      Name: 'monthc',
                      DBFieldName: 'monthc1',
                    },
                    {
                      Name: 'mac1',
                      DBFieldName: 'mac3',
                    },
                    {
                      Name: 'mac2',
                      DBFieldName: 'mac4',
                    },
                  ],
                },
                Column: [
                  {
                    Name: 'Column1',
                    Width: 2.77813,
                  },
                  {
                    Name: 'Column2',
                    Width: 1,
                  },
                  {
                    Name: 'Column3',
                    Width: 1,
                  },
                  {
                    Name: 'Column4',
                    Width: 1,
                  },
                  {
                    Name: 'Column5',
                    Width: 0.978958,
                  },
                  {
                    Name: 'Column6',
                    Width: 0.978958,
                  },
                  {
                    Name: 'Column7',
                    Width: 8.22854,
                  },
                ],
                ColumnContent: {
                  Height: 0.608542,
                  ColumnContentCell: [
                    {
                      Column: 'Column1',
                      DataField: 'device',
                    },
                    {
                      Column: 'Column2',
                      DataField: 'type',
                    },
                    {
                      Column: 'Column3',
                      DataField: 'met',
                    },
                    {
                      Column: 'Column4',
                      DataField: 'month',
                    },
                    {
                      Column: 'Column5',
                      DataField: 'monthc',
                    },
                    {
                      Column: 'Column6',
                      DataField: 'mac1',
                    },
                    {
                      Column: 'Column7',
                      DataField: 'mac2',
                    },
                  ],
                },
                ColumnTitle: {
                  Height: 0.608542,
                  ColumnTitleCell: [
                    {
                      GroupTitle: false,
                      Column: 'Column1',
                      TextAlign: 'MiddleCenter',
                      Text: '装置名称',
                    },
                    {
                      GroupTitle: false,
                      Column: 'Column2',
                      TextAlign: 'MiddleCenter',
                    },
                    {
                      GroupTitle: false,
                      Column: 'Column3',
                      TextAlign: 'MiddleCenter',
                      Text: '物料',
                    },
                    {
                      GroupTitle: false,
                      Column: 'Column4',
                      TextAlign: 'MiddleCenter',
                      Text: '月计划',
                    },
                    {
                      GroupTitle: false,
                      Column: 'Column5',
                      TextAlign: 'MiddleCenter',
                      Text: '日完成',
                    },
                    {
                      GroupTitle: false,
                      Column: 'Column6',
                      TextAlign: 'MiddleCenter',
                      Text: '收率%',
                    },
                    {
                      GroupTitle: false,
                      Column: 'Column7',
                      TextAlign: 'MiddleCenter',
                      Text: '月进度',
                    },
                  ],
                },
                Group: [
                  {
                    Name: 'Group1',
                    ByFields: 'device',
                    GroupHeader: {
                      OccupyColumn: true,
                      OccupiedColumns: 'Column1',
                    },
                    GroupFooter: {
                      Height: 0,
                    },
                  },
                  {
                    Name: 'Group2',
                    ByFields: 'type',
                    GroupHeader: {
                      OccupyColumn: true,
                      OccupiedColumns: 'Column2',
                    },
                    GroupFooter: {
                      Height: 0,
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    ],
  };
// {
//   Version: '6.5.1.0',
//   Title: '2f.多级分组单元格合并',
//   Author: '锐浪报表软件',
//   Description: '演示多级分组报表：在 Grid++Report 中，可以同时定义多个分组，多个分组之间存在层级关系，外层分组项总是包含内层分组，当一个外层分组项结束时，其包含的内层分组项也将结束。',
//   Font: {
//     Name: '宋体',
//     Size: 90000,
//     Weight: 400,
//     Charset: 134,
//   },
//   Printer: {
//     Oriention: 'Landscape',
//   },
//   DetailGrid: {
//     CenterView: true,
//     FixCols: 2,
//     PrintAdaptMethod: 'ResizeToFit',
//     Recordset: {
//       ConnectionString: 'Provider=Microsoft.Jet.OLEDB.4.0;User ID=Admin;Data Source=D:\\rubylong\\DragonReport6.0\\Samples\\Data\\NorthWind.mdb;',
//       QuerySQL: 'select * from Customers\r\norder by Region,City',
//       Field: [
//         {
//           Name: 'device',
//         },
//         {
//           Name: 'type',
//         },
//         {
//           Name: 'met',
//         },
//         {
//           Name: 'month',
//         },
//         {
//           Name: 'day',
//         },
//         {
//           Name: 'monthc',
//         },
//         {
//           Name: 'mac1',
//         },
//         {
//           Name: 'mac2',
//         },
//         {
//           Name: 'device1',
//         },
//         {
//           Name: 'type1',
//         },
//         {
//           Name: 'met1',
//         },
//         {
//           Name: 'month1',
//         },
//         {
//           Name: 'day1',
//         },
//         {
//           Name: 'monthc1',
//         },
//         {
//           Name: 'mac3',
//         },
//         {
//           Name: 'mac4',
//         },
//       ],
//     },
//     Column: [
//       {
//         Name: 'device',
//         Width: 1.69333,
//       },
//       {
//         Name: 'type',
//         Width: 1.69333,
//       },
//       {
//         Name: 'met',
//         Width: 2.38125,
//       },
//       {
//         Name: 'month',
//         Width: 3.41313,
//       },
//       {
//         Name: 'day',
//         Width: 1.5875,
//       },
//       {
//         Name: 'monthc',
//         Width: 1.98438,
//       },
//       {
//         Name: 'mac1',
//         Width: 3.175,
//       },
//       {
//         Name: 'mac2',
//         Width: 1.5875,
//       },
//       {
//         Name: 'device1',
//         Width: 1.69333,
//       },
//       {
//         Name: 'Column2',
//         Width: 1.69333,
//       },
//       {
//         Name: 'Column3',
//         Width: 2.38125,
//       },
//       {
//         Name: 'Column4',
//         Width: 3.175,
//       },
//       {
//         Name: 'Column5',
//         Width: 1.5875,
//       },
//       {
//         Name: 'Column6',
//         Width: 1.98438,
//       },
//       {
//         Name: 'Column7',
//         Width: 3.175,
//       },
//       {
//         Name: 'Column8',
//         Width: 1.5875,
//       },
//     ],
//     ColumnContent: {
//       KeepTogether: false,
//       Height: 0.79375,
//       AdjustRowHeight: false,
//       RowsPerPage: 3,
//       ColumnContentCell: [
//         {
//           Column: 'device',
//           DataField: 'device',
//         },
//         {
//           Column: 'type',
//           DataField: 'type',
//         },
//         {
//           Column: 'met',
//           DataField: 'met',
//         },
//         {
//           Column: 'month',
//           DataField: 'month',
//         },
//         {
//           Column: 'day',
//           DataField: 'day',
//         },
//         {
//           Column: 'monthc',
//           DataField: 'monthc',
//         },
//         {
//           Column: 'mac1',
//           DataField: 'mac1',
//         },
//         {
//           Column: 'mac2',
//           DataField: 'mac2',
//         },
//         {
//           Column: 'device1',
//           DataField: 'device1',
//         },
//         {
//           Column: 'Column2',
//           GetDisplayTextScript: "//根据条件设置内容行的 Visible 属性，隐藏掉不需要显示的数据\r\n//当Amount字段的值小于1000时，将本行数据隐藏掉\r\nSender.Visible =  (Sender.DisplayText !== '');",
//           DataField: 'type1',
//         },
//         {
//           Column: 'Column3',
//           DataField: 'met1',
//         },
//         {
//           Column: 'Column4',
//           DataField: 'month1',
//         },
//         {
//           Column: 'Column5',
//           DataField: 'day1',
//         },
//         {
//           Column: 'Column6',
//           DataField: 'monthc1',
//         },
//         {
//           Column: 'Column7',
//           DataField: 'mac3',
//         },
//         {
//           Column: 'Column8',
//           DataField: 'mac4',
//         },
//       ],
//     },
//     ColumnTitle: {
//       BackColor: 'C0C0C0',
//       Height: 0.79375,
//       Font: {
//         Name: '宋体',
//         Size: 90000,
//         Bold: true,
//         Charset: 134,
//       },
//       RepeatStyle: 'OnPage',
//       ColumnTitleCell: [
//         {
//           GroupTitle: false,
//           Column: 'device',
//           BackColor: 'E1FFFF',
//           TextAlign: 'MiddleCenter',
//           Text: '装置名称',
//         },
//         {
//           GroupTitle: false,
//           Column: 'type',
//           BackColor: 'E1FFFF',
//           TextAlign: 'MiddleCenter',
//         },
//         {
//           GroupTitle: false,
//           Column: 'met',
//           BackColor: 'E1FFFF',
//           Text: '物料',
//         },
//         {
//           GroupTitle: false,
//           Column: 'month',
//           BackColor: 'E1FFFF',
//           Text: '月计划',
//         },
//         {
//           GroupTitle: false,
//           Column: 'day',
//           BackColor: 'E1FFFF',
//           Text: '日完成',
//         },
//         {
//           GroupTitle: false,
//           Column: 'monthc',
//           BackColor: 'E1FFFF',
//           Text: '月完成',
//         },
//         {
//           GroupTitle: false,
//           Column: 'mac1',
//           BackColor: 'E1FFFF',
//           Text: '收率%',
//         },
//         {
//           GroupTitle: false,
//           Column: 'mac2',
//           BackColor: 'E1FFFF',
//           Text: '月进度',
//         },
//         {
//           GroupTitle: false,
//           Column: 'device1',
//           BackColor: 'E1FFFF',
//           TextAlign: 'MiddleCenter',
//           Text: '装置名称',
//         },
//         {
//           GroupTitle: false,
//           Column: 'Column2',
//           BackColor: 'E1FFFF',
//           TextAlign: 'MiddleCenter',
//         },
//         {
//           GroupTitle: false,
//           Column: 'Column3',
//           BackColor: 'E1FFFF',
//           Text: '物料',
//         },
//         {
//           GroupTitle: false,
//           Column: 'Column4',
//           BackColor: 'E1FFFF',
//           Text: '月计划',
//         },
//         {
//           GroupTitle: false,
//           Column: 'Column5',
//           BackColor: 'E1FFFF',
//           Text: '日完成',
//         },
//         {
//           GroupTitle: false,
//           Column: 'Column6',
//           BackColor: 'E1FFFF',
//           Text: '月完成',
//         },
//         {
//           GroupTitle: false,
//           Column: 'Column7',
//           BackColor: 'E1FFFF',
//           Text: '收率%',
//         },
//         {
//           GroupTitle: false,
//           Column: 'Column8',
//           BackColor: 'E1FFFF',
//           Text: '月进度',
//         },
//       ],
//     },
//     Group: [
//       {
//         Name: 'RegionGroup',
//         ByFields: 'device;device1',
//         GroupHeader: {
//           Height: 0.608542,
//           Font: {
//             Name: '宋体',
//             Size: 90000,
//             Bold: true,
//             Charset: 134,
//           },
//           RepeatOnPage: true,
//           OccupyColumn: true,
//           SameAsColumn: false,
//           IncludeFooter: true,
//           OccupiedColumns: 'device;device1',
//           VAlign: 'Middle',
//         },
//         GroupFooter: {
//           BackColor: 'FFFF00',
//           Height: 0.79,
//           Font: {
//             Name: '宋体',
//             Size: 90000,
//             Bold: true,
//             Charset: 134,
//           },
//         },
//       },
//       {
//         Name: 'CityGroup',
//         ByFields: 'type;type1',
//         GroupHeader: {
//           KeepTogether: false,
//           Height: 0.608542,
//           Font: {
//             Name: '宋体',
//             Size: 90000,
//             Bold: true,
//             Charset: 134,
//           },
//           RepeatOnPage: true,
//           OccupyColumn: true,
//           IncludeFooter: true,
//           OccupiedColumns: 'type;Column2',
//           VAlign: 'Middle',
//         },
//         GroupFooter: {
//           BackColor: 'F1D3FA',
//           Height: 0.79,
//           Font: {
//             Name: '宋体',
//             Size: 90000,
//             Bold: true,
//             Charset: 134,
//           },
//         },
//       },
//     ],
//   },
//   ReportHeader: [
//     {
//       Height: 1.37583,
//       Control: [
//         {
//           Type: 'StaticBox',
//           Name: 'StaticBox1',
//           Center: 'Horizontal',
//           Left: 16.2454,
//           Top: 0.185208,
//           Width: 2.30188,
//           Height: 0.582083,
//           Font: {
//             Name: '宋体',
//             Size: 150000,
//             Bold: true,
//             Charset: 134,
//           },
//           TextAlign: 'MiddleCenter',
//           Text: '客户资料',
//         },
//       ],
//     },
//   ],
// };
// {
//   Version: '6.5.1.0',
//   Title: '2e.自定义分组单元格合并',
//   Author: '锐浪报表软件',
//   Description: '演示占列式分组：占列式分组其分组头不占据单独的显示行，而是在指定占据的列区域现实分组头信息。可以指定多个占据的列，列名称之间用‘;’隔开。本示例定义分组头显示部件框。',
//   Font: {
//     Name: '宋体',
//     Size: 90000,
//     Weight: 400,
//     Charset: 134,
//   },
//   Printer: {
//     Oriention: 'Landscape',
//   },
//   DetailGrid: {
//     CenterView: true,
//     FixCols: 1,
//     PrintAdaptMethod: 'ResizeToFit',
//     Recordset: {
//       Field: [
//         {
//           Name: 'device',
//         },
//         {
//           Name: 'type',
//         },
//         {
//           Name: 'out',
//         },
//         {
//           Name: 'met',
//         },
//         {
//           Name: 'month',
//         },
//         {
//           Name: 'day',
//         },
//         {
//           Name: 'monthc',
//         },
//         {
//           Name: 'PostalCode',
//         },
//         {
//           Name: 'Country',
//         },
//         {
//           Name: 'Phone',
//         },
//         {
//           Name: 'Fax',
//         },
//         {
//           Name: '裂解',
//           DBFieldName: 'liejie',
//         },
//         {
//           Name: '投入',
//           DBFieldName: 'touru',
//         },
//         {
//           Name: '产出',
//           DBFieldName: 'chanchu',
//         },
//         {
//           Name: 'mac1',
//         },
//         {
//           Name: 'mac2',
//         },
//       ],
//     },
//     Column: [
//       {
//         Name: 'device',
//         Width: 1.98438,
//       },
//       {
//         Name: 'type',
//         Width: 2.38125,
//       },
//       {
//         Name: 'ContactName',
//         Width: 1.5875,
//       },
//       {
//         Name: 'ContactTitle',
//         Width: 1.64042,
//       },
//       {
//         Name: 'Address',
//         Width: 2.24896,
//       },
//       {
//         Name: 'Column1',
//       },
//       {
//         Name: 'Column2',
//       },
//       {
//         Name: 'Column3',
//       },
//     ],
//     ColumnContent: {
//       Height: 0.79375,
//       ColumnContentCell: [
//         {
//           Column: 'device',
//           DataField: 'device',
//         },
//         {
//           Column: 'type',
//           DataField: 'type',
//         },
//         {
//           Column: 'ContactName',
//           DataField: 'met',
//         },
//         {
//           Column: 'ContactTitle',
//           DataField: 'month',
//         },
//         {
//           Column: 'Address',
//           DataField: 'day',
//         },
//         {
//           Column: 'Column1',
//           DataField: 'monthc',
//         },
//         {
//           Column: 'Column2',
//           DataField: 'mac1',
//         },
//         {
//           Column: 'Column3',
//           DataField: 'mac2',
//         },
//       ],
//     },
//     ColumnTitle: {
//       Height: 0.608542,
//       ColumnTitleCell: [
//         {
//           GroupTitle: false,
//           Column: 'device',
//           TextAlign: 'MiddleCenter',
//           Text: '装置名称',
//         },
//         {
//           GroupTitle: false,
//           Column: 'type',
//         },
//         {
//           GroupTitle: false,
//           Column: 'ContactName',
//           TextAlign: 'MiddleCenter',
//           Text: '物料',
//         },
//         {
//           GroupTitle: false,
//           Column: 'ContactTitle',
//           TextAlign: 'MiddleCenter',
//           Text: '月计划',
//         },
//         {
//           GroupTitle: false,
//           Column: 'Address',
//           TextAlign: 'MiddleCenter',
//           Text: '日完成',
//         },
//         {
//           GroupTitle: false,
//           Column: 'Column1',
//           TextAlign: 'MiddleCenter',
//           Text: '月完成',
//         },
//         {
//           GroupTitle: false,
//           Column: 'Column2',
//           TextAlign: 'MiddleCenter',
//           Text: '收率（%）',
//         },
//         {
//           GroupTitle: false,
//           Column: 'Column3',
//           TextAlign: 'MiddleCenter',
//           Text: '月进度',
//         },
//       ],
//     },
//     Group: [
//       {
//         Name: 'Group1',
//         ByFields: 'device',
//         GroupHeader: {
//           BackColor: 'FFFF00',
//           Height: 1.396875,
//           RepeatOnPage: true,
//           OccupyColumn: true,
//           IncludeFooter: true,
//           OccupiedColumns: 'device',
//           VAlign: 'Middle',
//         },
//         GroupFooter: {
//           Height: 0.608542,
//           Font: {
//             Name: '宋体',
//             Size: 90000,
//             Bold: true,
//             Charset: 134,
//           },
//         },
//       },
//       {
//         Name: 'Group2',
//         ByFields: 'type',
//         GroupHeader: {
//           BackColor: '3399FF',
//           Height: 0.608542,
//           RepeatOnPage: true,
//           OccupyColumn: true,
//           IncludeFooter: true,
//           OccupiedColumns: 'type',
//           VAlign: 'Middle',
//         },
//         GroupFooter: {
//           Height: 0.608542,
//           Font: {
//             Name: '宋体',
//             Size: 90000,
//             Bold: true,
//             Charset: 134,
//           },
//         },
//       },
//     ],
//   },
//   Parameter: [
//     {
//       Name: 'Parameter1',
//     },
//   ],
//   ReportHeader: [
//     {
//       Height: 1.37583,
//       Control: [
//         {
//           Type: 'StaticBox',
//           Name: 'StaticBox1',
//           Center: 'Horizontal',
//           Left: 10.3717,
//           Top: 0.185208,
//           Width: 3.96875,
//           Height: 0.582083,
//           Font: {
//             Name: '宋体',
//             Size: 150000,
//             Bold: true,
//             Charset: 134,
//           },
//           Text: '按城市统计客户',
//         },
//       ],
//     },
//   ],
// };
const testData1 =
  {
    Table: [
      { device: '裂解炉', type: '投入', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉', type: '投入', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉', type: '投入', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉', type: '投入', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉', type: '产出', met: '石脑油', month: '15723510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉', type: '产出', met: '石脑油', month: '157321510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉2', type: '投入', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉2', type: '投入', met: '石脑油', month: '157123510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉2', type: '产出', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉2', type: '产出', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉2', type: '产出', met: '石脑油', month: '1571231510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉2', type: '产出', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉2', type: '投入', met: '石脑油', month: '157123510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉2', type: '产出', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉2', type: '产出', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉2', type: '产出', met: '石脑油', month: '1571231510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉2', type: '产出', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉2', type: '投入', met: '石脑油', month: '157123510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉2', type: '产出', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉2', type: '产出', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉2', type: '产出', met: '石脑油', month: '1571231510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉2', type: '产出', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉', type: '投入', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉', type: '投入', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉', type: '投入', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉', type: '投入', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉', type: '产出', met: '石脑油', month: '15723510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉', type: '产出', met: '石脑油', month: '157321510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉2', type: '投入', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉2', type: '投入', met: '石脑油', month: '157123510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉2', type: '产出', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉2', type: '产出', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉2', type: '产出', met: '石脑油', month: '1571231510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉2', type: '产出', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉2', type: '投入', met: '石脑油', month: '157123510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉2', type: '产出', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉2', type: '产出', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉2', type: '产出', met: '石脑油', month: '1571231510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉2', type: '产出', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉2', type: '投入', met: '石脑油', month: '157123510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉2', type: '产出', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉2', type: '产出', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉2', type: '产出', met: '石脑油', month: '1571231510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉2', type: '产出', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉', type: '投入', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉', type: '投入', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉', type: '投入', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉', type: '投入', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉', type: '产出', met: '石脑油', month: '15723510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉', type: '产出', met: '石脑油', month: '157321510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉2', type: '投入', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
    ],
  };
const testData2 =
  {
    Table1: [
      { device: '裂解炉', type: '投入', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉', type: '投入', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉', type: '投入', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉', type: '投入', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉', type: '投入', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉', type: '投入', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉', type: '投入', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉', type: '投入', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉', type: '投入', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉', type: '投入', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉', type: '投入', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉', type: '投入', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉', type: '投入', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉', type: '投入', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉', type: '投入', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉', type: '投入', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉', type: '投入', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉', type: '投入', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉', type: '投入', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉', type: '投入', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉', type: '投入', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉', type: '投入', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉', type: '投入', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉', type: '投入', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉', type: '投入', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉', type: '投入', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉', type: '投入', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
      { device: '裂解炉', type: '投入', met: '石脑油', month: '157510', day: '5521', monthc: '126680.0631', mac1: '80.4%', mac2: '80.4%' },
    ],
  };
const testData3 =
  {
    Table: [
      { Field1: 'H-001', Field2: '乙烷', Field3: '75', Field4: '786', Field5: '29', Field6: 'H-005', Field7: '石脑油', Field8: '45', Field9: '786', Field10: '29' },
      { Field1: 'H-001', Field2: '乙烷', Field3: '75', Field4: '786', Field5: '29', Field6: 'H-005', Field7: '石脑油', Field8: '45', Field9: '786', Field10: '29' },
      { Field1: 'H-001', Field2: '乙烷', Field3: '75', Field4: '786', Field5: '29', Field6: 'H-005', Field7: '石脑油', Field8: '45', Field9: '786', Field10: '29' },
      { Field1: 'H-001', Field2: '乙烷', Field3: '75', Field4: '786', Field5: '29', Field6: 'H-005', Field7: '石脑油', Field8: '45', Field9: '786', Field10: '29' },
    ],
  };
const testData4 =
  {
    Table: [
      { Field1: 'H-001', Field2: '乙烷', Field3: '75', Field4: '786', Field5: '29', Field6: 'H-005', Field7: '石脑油', Field8: '45' },
      { Field1: 'H-001', Field2: '乙烷', Field3: '75', Field4: '786', Field5: '29', Field6: 'H-005', Field7: '石脑油', Field8: '45' },
      { Field1: 'H-001', Field2: '乙烷', Field3: '75', Field4: '786', Field5: '29', Field6: 'H-005', Field7: '石脑油', Field8: '45' },
      { Field1: 'H-001', Field2: '乙烷', Field3: '75', Field4: '786', Field5: '29', Field6: 'H-005', Field7: '石脑油', Field8: '45' },
    ],
  };
// 按异步方式请求一个URL的文本数据，在成功后调用回调函数
export default class Table2 extends PureComponent {
  componentDidMount() {
    // 创建报表显示器，参数指定其在网页中的占位标签的ID，表模板URL与报表数据URL不指定，而是在后面的AJAX操作中提供相关数据
    const wuliao1_ = Rubylong.rubylong.grhtml5.insertReportViewer('wuliao3');
    const wuliao2_ = Rubylong.rubylong.grhtml5.insertReportViewer('wuliao4');
    const liejielu_ = Rubylong.rubylong.grhtml5.insertReportViewer('liejielu1');
    const fadianji_ = Rubylong.rubylong.grhtml5.insertReportViewer('fadianji1');
    wuliao1_.reportPrepared = false; // 指定报表生成需要加载报表模板
    wuliao1_.dataPrepared = false; // 指定报表生成需要加载报表数据
    wuliao2_.reportPrepared = false; // 指定报表生成需要加载报表模板
    wuliao2_.dataPrepared = false; // 指定报表生成需要加载报表数据
    liejielu_.reportPrepared = false; // 指定报表生成需要加载报表模板
    liejielu_.dataPrepared = false; // 指定报表生成需要加载报表数据
    fadianji_.reportPrepared = false; // 指定报表生成需要加载报表模板
    fadianji_.dataPrepared = false; // 指定报表生成需要加载报表数据
    wuliao1_.loadReport(wuliao1);
    wuliao2_.loadReport(wuliao1);
    liejielu_.loadReport(liejielu);
    fadianji_.loadReport(fadianji);
    wuliao1_.loadData(testData1);
    wuliao2_.loadData(testData2);
    liejielu_.loadData(testData3);
    fadianji_.loadData(testData4);
  }
  render() {
    return (
      <Scrollbars>
        <div className={styles.list}>
          <div id="wuliao3" className={styles.part1} ref={ref => this.warp = ref} />
          <div id="wuliao4" className={styles.part2} ref={ref => this.warp = ref} />
          <div id="liejielu1" className={styles.part3} ref={ref => this.warp = ref} />
          <div id="fadianji1" className={styles.part4} ref={ref => this.warp = ref} />
          <div className={styles.part5} dangerouslySetInnerHTML={{ __html: a }} />
        </div>
      </Scrollbars>
    );
  }
}
