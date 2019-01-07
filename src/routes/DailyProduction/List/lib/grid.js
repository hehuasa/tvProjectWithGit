export const tableI = {
  wuliao1: {
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
      Border: {
        Styles: '[DrawLeft|DrawTop|DrawBottom]',
      },
      Recordset: {
        Field: [
          {
            Name: 'orgnizationName',
          },
          {
            Name: 'type',
          },
          {
            Name: 'rawMaterialName',
          },
          {
            Name: 'monthPlan',
          },
          {
            Name: 'monthOutput',
          },
          {
            Name: 'yield',
          },
          {
            Name: 'dailyOutput',
          },
          {
            Name: 'progress',
          },
        ],
      },
      Column: [
        {
          Name: 'Column1',
          Width: 2.01,
          FixedWidth: true,
        },
        {
          Name: 'Column2',
          Width: 2.01,
          FixedWidth: true,
        },
        {
          Name: 'Column3',
          Width: 2.01,
          FixedWidth: true,
        },
        {
          Name: 'Column4',
          Width: 2.01,
          FixedWidth: true,
        },
        {
          Name: 'Column9',
          Width: 2.01,
          FixedWidth: true,
        },
        {
          Name: 'Column5',
          Width: 2.01,
          FixedWidth: true,
        },
        {
          Name: 'Column6',
          Width: 2.01,
          FixedWidth: true,
        },
        {
          Name: 'Column7',
          Width: 2.01,
          FixedWidth: true,
        },
      ],
      ColumnContent: {
        Height: 0.608542,
        ColumnContentCell: [
          {
            Column: 'Column1',
            TextAlign: 'MiddleCenter',
            DataField: 'orgnizationName',
          },
          {
            Column: 'Column2',
            TextAlign: 'MiddleCenter',
            DataField: 'type',
          },
          {
            Column: 'Column3',
            TextAlign: 'MiddleCenter',
            DataField: 'rawMaterialName',
          },
          {
            Column: 'Column4',
            TextAlign: 'MiddleCenter',
            DataField: 'monthPlan',
          },
          {
            Column: 'Column9',
            DataField: 'dailyOutput',
          },
          {
            Column: 'Column5',
            TextAlign: 'MiddleCenter',
            DataField: 'monthOutput',
          },
          {
            Column: 'Column6',
            TextAlign: 'MiddleCenter',
            DataField: 'yield',
          },
          {
            Column: 'Column7',
            DataField: 'progress',
          },
        ],
      },
      ColumnTitle: {
        Height: 0.608542,
        ColumnTitleCell: [
          {
            GroupTitle: true,
            Name: 'Column8',
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
                Column: 'Column9',
                TextAlign: 'MiddleCenter',
                Text: '日完成',
              },
              {
                GroupTitle: false,
                Column: 'Column5',
                TextAlign: 'MiddleCenter',
                Text: '月完成',
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
            Text: '一、各装置生产情况（吨）',
            BorderCustom: true,
          },
        ],
      },
      Group: [
        {
          Name: 'Group1',
          ByFields: 'orgnizationName',
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
  wuliao2: {
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
      Border: {
        Styles: '[DrawTop|DrawRight|DrawBottom]',
      },
      Recordset: {
        Field: [
          {
            Name: 'orgnizationName',
          },
          {
            Name: 'type',
          },
          {
            Name: 'rawMaterialName',
          },
          {
            Name: 'monthPlan',
          },
          {
            Name: 'monthOutput',
          },
          {
            Name: 'yield',
          },
          {
            Name: 'dailyOutput',
          },
          {
            Name: 'progress',
          },
        ],
      },
      Column: [
        {
          Name: 'Column1',
          Width: 2.02,
          FixedWidth: true,
        },
        {
          Name: 'Column2',
          Width: 2.01,
          FixedWidth: true,
        },
        {
          Name: 'Column3',
          Width: 2.01,
          FixedWidth: true,
        },
        {
          Name: 'Column4',
          Width: 2.01,
          FixedWidth: true,
        },
        {
          Name: 'Column9',
          Width: 2.01,
          FixedWidth: true,
        },
        {
          Name: 'Column5',
          Width: 2.01,
          FixedWidth: true,
        },
        {
          Name: 'Column6',
          Width: 2.01,
          FixedWidth: true,
        },
        {
          Name: 'Column7',
          Width: 2.01,
          FixedWidth: true,
        },
      ],
      ColumnContent: {
        Height: 0.608542,
        ColumnContentCell: [
          {
            Column: 'Column1',
            TextAlign: 'MiddleCenter',
            DataField: 'orgnizationName',
          },
          {
            Column: 'Column2',
            TextAlign: 'MiddleCenter',
            DataField: 'type',
          },
          {
            Column: 'Column3',
            TextAlign: 'MiddleCenter',
            DataField: 'rawMaterialName',
          },
          {
            Column: 'Column4',
            TextAlign: 'MiddleCenter',
            DataField: 'monthPlan',
          },
          {
            Column: 'Column9',
            DataField: 'dailyOutput',
          },
          {
            Column: 'Column5',
            TextAlign: 'MiddleCenter',
            DataField: 'monthOutput',
          },
          {
            Column: 'Column6',
            TextAlign: 'MiddleCenter',
            DataField: 'yield',
          },
          {
            Column: 'Column7',
            DataField: 'progress',
          },
        ],
      },
      ColumnTitle: {
        Height: 0.608542,
        ColumnTitleCell: [
          {
            GroupTitle: true,
            Name: 'Column8',
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
                Column: 'Column9',
                TextAlign: 'MiddleCenter',
                Text: '日完成',
              },
              {
                GroupTitle: false,
                Column: 'Column5',
                TextAlign: 'MiddleCenter',
                Text: '月完成',
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
            BorderCustom: true,
          },
        ],
      },
      Group: [
        {
          Name: 'Group1',
          ByFields: 'orgnizationName',
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
  liejielu: {
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
            Name: 'lu',
          },
          {
            Name: 'yuan',
          },
          {
            Name: '天数',
          },
          {
            Name: 'COT',
          },
          {
            Name: '负荷',
          },
          {
            Name: 'lu1',
          },
          {
            Name: 'yuan1',
          },
          {
            Name: '天数1',
          },
          {
            Name: 'COT1',
          },
          {
            Name: '负荷1',
          },
        ],
      },
      Column: [
        {
          Name: 'Column1',
          Width: 2.01,
        },
        {
          Name: 'Column3',
          Width: 2.01,
        },
        {
          Name: 'Column4',
          Width: 0.7,
        },
        {
          Name: 'Column5',
          Width: 1.31,
        },
        {
          Name: 'Column6',
          Width: 2.01,
        },
        {
          Name: 'Column7',
          Width: 2.01,
        },
        {
          Name: 'Column8',
          Width: 2.01,
        },
        {
          Name: 'Column9',
          Width: 0.7,
        },
        {
          Name: 'Column11',
          Width: 1.31,
        },
        {
          Name: 'Column10',
          Width: 2.01,
        },
      ],
      ColumnContent: {
        ColumnContentCell: [
          {
            Column: 'Column1',
            TextAlign: 'MiddleCenter',
            DataField: 'lu',
          },
          {
            Column: 'Column3',
            TextAlign: 'MiddleCenter',
            DataField: 'yuan',
          },
          {
            Column: 'Column4',
            TextAlign: 'MiddleCenter',
            DataField: '天数',
          },
          {
            Column: 'Column5',
            TextAlign: 'MiddleCenter',
            DataField: 'COT',
          },
          {
            Column: 'Column6',
            TextAlign: 'MiddleCenter',
            DataField: '负荷',
          },
          {
            Column: 'Column7',
            TextAlign: 'MiddleCenter',
            DataField: 'lu1',
          },
          {
            Column: 'Column8',
            TextAlign: 'MiddleCenter',
            DataField: 'yuan1',
          },
          {
            Column: 'Column9',
            TextAlign: 'MiddleCenter',
            DataField: '天数1',
          },
          {
            Column: 'Column11',
            TextAlign: 'MiddleCenter',
            DataField: 'COT1',
          },
          {
            Column: 'Column10',
            TextAlign: 'MiddleCenter',
            DataField: '负荷1',
          },
        ],
      },
      ColumnTitle: {
        Height: 1.16417,
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
                CanGrow: true,
                CanShrink: true,
                Text: '炉号',
              },
              {
                GroupTitle: false,
                Column: 'Column3',
                TextAlign: 'MiddleCenter',
                CanGrow: true,
                CanShrink: true,
                Text: '原料',
              },
              {
                GroupTitle: false,
                Column: 'Column4',
                CanGrow: true,
                CanShrink: true,
                Text: '天数',
              },
              {
                GroupTitle: false,
                Column: 'Column5',
                TextAlign: 'MiddleCenter',
                CanGrow: true,
                CanShrink: true,
                Text: 'COT\r\n（℃）',
              },
              {
                GroupTitle: false,
                Column: 'Column6',
                TextAlign: 'MiddleCenter',
                CanGrow: true,
                CanShrink: true,
                Text: '负荷\r\n（t/h）',
              },
              {
                GroupTitle: false,
                Column: 'Column7',
                TextAlign: 'MiddleCenter',
                CanGrow: true,
                CanShrink: true,
                Text: '炉号',
              },
              {
                GroupTitle: false,
                Column: 'Column8',
                TextAlign: 'MiddleCenter',
                CanGrow: true,
                CanShrink: true,
                Text: '原料',
              },
              {
                GroupTitle: false,
                Column: 'Column9',
                TextAlign: 'MiddleCenter',
                CanGrow: true,
                CanShrink: true,
                Text: '天数',
              },
              {
                GroupTitle: false,
                Column: 'Column11',
                TextAlign: 'MiddleCenter',
                CanGrow: true,
                CanShrink: true,
                Text: 'COT\r\n（℃）',
              },
              {
                GroupTitle: false,
                Column: 'Column10',
                TextAlign: 'MiddleCenter',
                CanGrow: true,
                CanShrink: true,
                Text: '负荷\r\n（t/h）',
              },
            ],
            Text: '二、裂解炉运行状况',
          },
        ],
      },
    },
  },
  fadianji: {
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
            Name: 'lu',
          },
          {
            Name: '运行天数',
          },
          {
            Name: '产气量',
          },
          {
            Name: '主汽温度',
          },
          {
            Name: 'lu1',
          },
          {
            Name: '运行天数1',
          },
          {
            Name: '进气量',
          },
          {
            Name: '发电量',
          },
        ],
      },
      Column: [
        {
          Name: 'Column1',
          Width: 2.01,
          FixedWidth: true,
        },
        {
          Name: 'Column3',
          Width: 2.01,
          FixedWidth: true,
        },
        {
          Name: 'Column10',
          Width: 2.01,
          FixedWidth: true,
        },
        {
          Name: 'Column4',
          Width: 0,
        },
        {
          Name: 'Column5',
          Width: 2.01,
          FixedWidth: true,
        },
        {
          Name: 'Column6',
          Width: 2.01,
          FixedWidth: true,
        },
        {
          Name: 'Column7',
          Width: 2.01,
          FixedWidth: true,
        },
        {
          Name: 'Column8',
          Width: 2.01,
          FixedWidth: true,
        },
        {
          Name: 'Column9',
          Width: 2.01,
          FixedWidth: true,
        },
      ],
      ColumnContent: {
        Height: 0.608542,
        ColumnContentCell: [
          {
            Column: 'Column1',
            TextAlign: 'MiddleCenter',
            DataField: 'lu',
          },
          {
            Column: 'Column3',
            DataField: '运行天数',
          },
          {
            Column: 'Column10',
            DataField: '产气量',
          },
          {
            Column: 'Column4',
            TextAlign: 'MiddleCenter',
            DataField: '产气量',
          },
          {
            Column: 'Column5',
            TextAlign: 'MiddleCenter',
            DataField: '主汽温度',
          },
          {
            Column: 'Column6',
            TextAlign: 'MiddleCenter',
            DataField: 'lu1',
          },
          {
            Column: 'Column7',
            TextAlign: 'MiddleCenter',
            DataField: '运行天数1',
          },
          {
            Column: 'Column8',
            TextAlign: 'MiddleCenter',
            DataField: '进气量',
          },
          {
            Column: 'Column9',
            TextAlign: 'MiddleCenter',
            DataField: '发电量',
          },
        ],
      },
      ColumnTitle: {
        Height: 1.16417,
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
                CanGrow: true,
                CanShrink: true,
                Text: '炉号',
              },
              {
                GroupTitle: false,
                Column: 'Column3',
                TextAlign: 'MiddleCenter',
                CanGrow: true,
                CanShrink: true,
                Text: '运行天数',
              },
              {
                GroupTitle: false,
                Column: 'Column10',
                TextAlign: 'MiddleCenter',
                CanGrow: true,
                CanShrink: true,
                Text: '产汽量\r\n（t/h）',
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
                CanGrow: true,
                CanShrink: true,
                Text: '主汽温度\r\n（℃）',
              },
              {
                GroupTitle: false,
                Column: 'Column6',
                TextAlign: 'MiddleCenter',
                CanGrow: true,
                CanShrink: true,
                Text: '发电机号',
              },
              {
                GroupTitle: false,
                Column: 'Column7',
                TextAlign: 'MiddleCenter',
                CanGrow: true,
                CanShrink: true,
                Text: '运行天数',
              },
              {
                GroupTitle: false,
                Column: 'Column8',
                TextAlign: 'MiddleCenter',
                CanGrow: true,
                CanShrink: true,
                Text: '进汽量\r\n（t/h）',
              },
              {
                GroupTitle: false,
                Column: 'Column9',
                TextAlign: 'MiddleCenter',
                CanGrow: true,
                CanShrink: true,
                Text: '发电量\r\n（MW）',
              },
            ],
            Text: '三、热电锅炉及发电机运行状况',
          },
        ],
      },
    },
  },
};
export const tableII = {
  yuanliao: {
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
      CenterView: true,
      Recordset: {
        Field: [
          {
            Name: 'rawMaterialNam',
          },
          {
            Name: '罐存',
            Type: 'Integer',
          },
          {
            Name: 'storageRate',
          },
        ],
      },
      Column: [
        {
          Name: 'Column1',
          Width: 2.65,
        },
        {
          Name: 'Column3',
          Width: 2.65,
        },
        {
          Name: 'Column4',
          Width: 2.65,
        },
      ],
      ColumnContent: {
        Height: 0.608542,
        ColumnContentCell: [
          {
            Column: 'Column1',
            TextAlign: 'MiddleCenter',
            DataField: 'rawMaterialNam',
          },
          {
            Column: 'Column3',
            TextAlign: 'MiddleCenter',
            DataField: '罐存',
          },
          {
            Column: 'Column4',
            TextAlign: 'MiddleCenter',
            DataField: 'storageRate',
          },
        ],
      },
      ColumnTitle: {
        Height: 2,
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
                CanGrow: true,
                CanShrink: true,
                Text: '原料及\r\n中间产品',
              },
              {
                GroupTitle: false,
                Column: 'Column3',
                TextAlign: 'MiddleCenter',
                CanGrow: true,
                CanShrink: true,
                Text: '罐存量',
              },
              {
                GroupTitle: false,
                Column: 'Column4',
                TextAlign: 'MiddleCenter',
                CanGrow: true,
                CanShrink: true,
                Text: '罐存率',
              },
            ],
            Text: '五、原材料(吨）',
          },
        ],
      },
      Group: [
        {
          Name: 'Group1',
          GroupHeader: {
            Height: 0,
          },
          GroupFooter: {
            Control: [
              {
                Type: 'SummaryBox',
                Name: 'SummaryBox1',
                AlignColumn: 'Column3',
                Left: 2.61938,
                Width: 2.69875,
                Height: 1.19063,
                Border: {
                  Styles: '[DrawLeft]',
                },
                DataField: '罐存',
              },
              {
                Type: 'MemoBox',
                Name: 'MemoBox1',
                AlignColumn: 'Column1',
                Width: 2.64583,
                Height: 1.19063,
                Border: {
                  Styles: '[DrawRight]',
                },
                TextAlign: 'MiddleCenter',
                Text: '合计',
              },
            ],
          },
        },
      ],
    },
  },
  youji: {
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
            Name: 'rawMaterialNam',
          },
          {
            Name: '罐存',
          },
          {
            Name: 'storageRate',
          },
          {
            Name: '月出厂计划',
          },
          {
            Name: '日出厂量',
          },
          {
            Name: 'monthOutPut',
          },
          {
            Name: 'progess',
          },
          {
            Name: 'totalProgess',
          },
        ],
      },
      Column: [
        {
          Name: 'Column1',
          Width: 2.01,
        },
        {
          Name: 'Column3',
          Width: 2.01,
        },
        {
          Name: 'Column4',
          Width: 2.01,
        },
        {
          Name: 'Column5',
          Width: 2.01,
        },
        {
          Name: 'Column6',
          Width: 2.01,
        },
        {
          Name: 'Column7',
          Width: 2.01,
        },
        {
          Name: 'Column8',
          Width: 2.01,
        },
      ],
      ColumnContent: {
        Height: 0.582083,
        ColumnContentCell: [
          {
            Column: 'Column1',
            TextAlign: 'MiddleCenter',
            DataField: 'rawMaterialNam',
          },
          {
            Column: 'Column3',
            TextAlign: 'MiddleCenter',
            DataField: '罐存',
          },
          {
            Column: 'Column4',
            TextAlign: 'MiddleCenter',
            DataField: 'storageRate',
          },
          {
            Column: 'Column5',
            TextAlign: 'MiddleCenter',
            DataField: '月出厂计划',
          },
          {
            Column: 'Column6',
            TextAlign: 'MiddleCenter',
            DataField: '日出厂量',
          },
          {
            Column: 'Column7',
            DataField: 'monthOutPut',
          },
          {
            Column: 'Column8',
            TextAlign: 'MiddleCenter',
            DataField: 'progess',
          },
        ],
      },
      ColumnTitle: {
        Height: 1.16417,
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
                CanGrow: true,
                CanShrink: true,
                Text: '原料及\r\n中间产品',
              },
              {
                GroupTitle: false,
                Column: 'Column3',
                TextAlign: 'MiddleCenter',
                CanGrow: true,
                CanShrink: true,
                Text: '罐存',
              },
              {
                GroupTitle: false,
                Column: 'Column4',
                TextAlign: 'MiddleCenter',
                CanGrow: true,
                CanShrink: true,
                Text: '罐存率',
              },
              {
                GroupTitle: false,
                Column: 'Column5',
                TextAlign: 'MiddleCenter',
                Text: '月出厂计划',
              },
              {
                GroupTitle: false,
                Column: 'Column6',
                TextAlign: 'MiddleCenter',
                Text: '日出厂量',
              },
              {
                GroupTitle: false,
                Column: 'Column7',
                TextAlign: 'MiddleCenter',
                Text: '月累计出厂',
              },
              {
                GroupTitle: false,
                Column: 'Column8',
                TextAlign: 'MiddleCenter',
                Text: '月出厂进度',
              },
            ],
            Text: '六、有机产品（吨）',
          },
        ],
      },
      Group: [
        {
          Name: 'Group1',
          GroupHeader: {
            Height: 0,
          },
          GroupFooter: {
            Control: [
              {
                Type: 'MemoBox',
                Name: 'MemoBox2',
                AlignColumn: 'Column1',
                Width: 2.06375,
                Height: 1.19063,
                TextAlign: 'MiddleCenter',
                Text: '合计',
              },
              {
                Type: 'SummaryBox',
                Name: 'SummaryBox3',
                AlignColumn: 'Column3',
                Left: 2.03729,
                Width: 2.06375,
                Height: 1.19063,
                DataField: '罐存',
              },
              {
                Type: 'SummaryBox',
                Name: 'SummaryBox4',
                AlignColumn: 'Column5',
                Left: 6.11188,
                Width: 2.06375,
                Height: 1.19063,
                DataField: '月出厂计划',
              },
              {
                Type: 'SummaryBox',
                Name: 'SummaryBox5',
                AlignColumn: 'Column6',
                Left: 8.14917,
                Width: 2.06375,
                Height: 1.19063,
                DataField: '日出厂量',
              },
              {
                Type: 'SummaryBox',
                Name: 'SummaryBox6',
                AlignColumn: 'Column7',
                Left: 10.1865,
                Width: 2.06375,
                Height: 1.19063,
                DataField: 'monthOutPut',
              },
              {
                Type: 'FieldBox',
                Name: 'FieldBox1',
                Left: 12.0121,
                Width: 1.98438,
                Height: 1.19063,
                DataField: 'totalProgess',
              },
            ],
          },
        },
      ],
    },
  },
  shuzhi: {
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
            Name: 'rawMaterialNam',
          },
          {
            Name: '厂内库存',
          },
          {
            Name: 'storageRate',
          },
          {
            Name: '日入库',
          },
          {
            Name: '月出厂计划',
          },
          {
            Name: '日出厂量',
          },
          {
            Name: 'rawInfoType',
          },
          {
            Name: 'progess',
          },
          {
            Name: 'monthOutPutTotal',
          },
          {
            Name: 'Field10',
          },
        ],
      },
      Column: [
        {
          Name: 'Column1',
          Width: 2.01,
        },
        {
          Name: 'Column3',
          Width: 2.01,
        },
        {
          Name: 'Column4',
          Width: 2.01083,
        },
        {
          Name: 'Column5',
          Width: 2.01083,
        },
        {
          Name: 'Column6',
          Width: 2.01,
        },
        {
          Name: 'Column7',
          Width: 2.01,
        },
        {
          Name: 'Column8',
          Width: 2.01,
        },
        {
          Name: 'Column9',
          Width: 2.01,
        },
      ],
      ColumnContent: {
        Height: 0.608542,
        ColumnContentCell: [
          {
            Column: 'Column1',
            TextAlign: 'MiddleCenter',
            DataField: 'rawMaterialNam',
          },
          {
            Column: 'Column3',
            TextAlign: 'MiddleCenter',
            DataField: '厂内库存',
          },
          {
            Column: 'Column4',
            TextAlign: 'MiddleCenter',
            DataField: 'storageRate',
          },
          {
            Column: 'Column5',
            DataField: '日入库',
          },
          {
            Column: 'Column6',
            DataField: '日出厂量',
          },
          {
            Column: 'Column7',
            DataField: '月出厂计划',
          },
          {
            Column: 'Column8',
            DataField: 'monthOutPutTotal',
          },
          {
            Column: 'Column9',
            DataField: 'progess',
          },
        ],
      },
      ColumnTitle: {
        Height: 1.16417,
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
                CanGrow: true,
                CanShrink: true,
                Text: '原料及\r\n中间产品',
              },
              {
                GroupTitle: false,
                Column: 'Column3',
                TextAlign: 'MiddleCenter',
                CanGrow: true,
                CanShrink: true,
                Text: '厂内库存',
              },
              {
                GroupTitle: false,
                Column: 'Column4',
                TextAlign: 'MiddleCenter',
                CanGrow: true,
                CanShrink: true,
                Text: '厂内\r\n库存率',
              },
              {
                GroupTitle: false,
                Column: 'Column5',
                TextAlign: 'MiddleCenter',
                Text: '日入库',
              },
              {
                GroupTitle: false,
                Column: 'Column6',
                TextAlign: 'MiddleCenter',
                Text: '日出厂',
              },
              {
                GroupTitle: false,
                Column: 'Column7',
                TextAlign: 'MiddleCenter',
                Text: '月出厂\r\n计划',
              },
              {
                GroupTitle: false,
                Column: 'Column8',
                TextAlign: 'MiddleCenter',
                Text: '月累计\r\n出厂',
              },
              {
                GroupTitle: false,
                Column: 'Column9',
                TextAlign: 'MiddleCenter',
                Text: '月出厂进度',
              },
            ],
            Text: '七、树脂产品（吨）',
          },
        ],
      },
      Group: [
        {
          Name: 'Group1',
          ByFields: 'rawInfoType',
          GroupHeader: {
            Height: 0,
          },
          GroupFooter: {
            Control: [
              {
                Type: 'MemoBox',
                Name: 'MemoBox2',
                AlignColumn: 'Column1',
                Width: 2.01083,
                Height: 1.19063,
                Border: {
                  Styles: '[DrawRight]',
                },
                TextAlign: 'MiddleCenter',
                Text: '合计',
              },
              {
                Type: 'SummaryBox',
                Name: 'SummaryBox3',
                AlignColumn: 'Column3',
                Left: 2.01083,
                Width: 2.01083,
                Height: 1.19063,
                Border: {
                  Styles: '[DrawRight]',
                },
                DataField: '厂内库存',
              },
              {
                Type: 'SummaryBox',
                Name: 'SummaryBox4',
                AlignColumn: 'Column5',
                Left: 6.0325,
                Width: 2.01083,
                Height: 1.19063,
                Border: {
                  Styles: '[DrawRight]',
                },
                DataField: '日入库',
              },
              {
                Type: 'SummaryBox',
                Name: 'SummaryBox5',
                AlignColumn: 'Column6',
                Left: 8.04333,
                Width: 2.01083,
                Height: 1.19063,
                Border: {
                  Styles: '[DrawRight]',
                },
                DataField: '月出厂计划',
              },
              {
                Type: 'SummaryBox',
                Name: 'SummaryBox6',
                AlignColumn: 'Column7',
                Left: 10.0542,
                Width: 2.01083,
                Height: 1.19063,
                Border: {
                  Styles: '[DrawRight]',
                },
                DataField: '日出厂量',
              },
            ],
          },
        },
      ],
    },
  },
  dongli: {
    Version: '6.5.1.0',
    Font: {
      Name: '宋体',
      Size: 105000,
      Weight: 400,
      Charset: 134,
    },
    Printer: {
    },
    ReportHeader: [
      {
        Name: 'ReportHeader1',
        CanGrow: true,
        Height: 2.59292,
        Control: [
          {
            Type: 'SubReport',
            Name: 'SubReport1',
            Width: 15,
            Height: 2.5,
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
                      Name: 'itemName',
                    },
                    {
                      Name: 'collectValue',
                    },
                    {
                      Name: 'unit',
                    },
                    {
                      Name: 'totalValue',
                    },
                    {
                      Name: 'unit1',
                    },
                  ],
                },
                Column: [
                  {
                    Name: 'Column2',
                    Width: 3.216,
                  },
                  {
                    Name: 'Column3',
                    Width: 3.216,
                  },
                  {
                    Name: 'Column4',
                    Width: 3.216,
                  },
                  {
                    Name: 'Column5',
                    Width: 3.216,
                  },
                  {
                    Name: 'Column6',
                    Width: 3.216,
                  },
                ],
                ColumnContent: {
                  Height: 0.608542,
                  ColumnContentCell: [
                    {
                      Column: 'Column2',
                      TextAlign: 'MiddleCenter',
                      DataField: 'itemName',
                    },
                    {
                      Column: 'Column3',
                      TextAlign: 'MiddleCenter',
                      DataField: 'collectValue',
                    },
                    {
                      Column: 'Column4',
                      TextAlign: 'MiddleCenter',
                      DataField: 'unit',
                    },
                    {
                      Column: 'Column5',
                      TextAlign: 'MiddleCenter',
                      DataField: 'totalValue',
                    },
                    {
                      Column: 'Column6',
                      TextAlign: 'MiddleCenter',
                      DataField: 'unit1',
                    },
                  ],
                },
                ColumnTitle: {
                  ColumnTitleCell: [
                    {
                      GroupTitle: true,
                      Name: 'Column1',
                      ColumnTitleCell: [
                        {
                          GroupTitle: false,
                          Column: 'Column2',
                          TextAlign: 'MiddleCenter',
                          Text: '项目',
                        },
                        {
                          GroupTitle: false,
                          Column: 'Column3',
                          TextAlign: 'MiddleCenter',
                          Text: '用量',
                        },
                        {
                          GroupTitle: false,
                          Column: 'Column4',
                          TextAlign: 'MiddleCenter',
                          Text: '单位',
                        },
                        {
                          GroupTitle: false,
                          Column: 'Column5',
                          TextAlign: 'MiddleCenter',
                          Text: '月累计',
                        },
                        {
                          GroupTitle: false,
                          Column: 'Column6',
                          TextAlign: 'MiddleCenter',
                          Text: '单位',
                        },
                      ],
                      Text: '八、动力消耗',
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    ],
    ReportFooter: [
      {
        Name: 'ReportFooter1',
        CanGrow: true,
        Control: [
          {
            Type: 'SubReport',
            Name: 'SubReport4',
            Left: 0.396875,
            Top: 0.211667,
            Width: 15,
            Height: 2.19604,
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
                      Name: 'itemName',
                    },
                    {
                      Name: '用量(吨/时)',
                    },
                    {
                      Name: 'PH值(7.2-9.0)',
                    },
                    {
                      Name: '浊度(≤10)',
                    },
                    {
                      Name: '浓缩倍数(≥4)',
                    },
                    {
                      Name: '钙硬度(100-450)',
                    },
                    {
                      Name: '碱浓度(<700)',
                    },
                    {
                      Name: '钼酸根(0.8-1.5)',
                    },
                  ],
                },
                Column: [
                  {
                    Name: 'Column2',
                    Width: 2.01,
                  },
                  {
                    Name: 'Column3',
                    Width: 2.01,
                  },
                  {
                    Name: 'Column4',
                    Width: 2.01,
                  },
                  {
                    Name: 'Column5',
                    Width: 2.01,
                  },
                  {
                    Name: 'Column6',
                    Width: 2.01083,
                  },
                  {
                    Name: 'Column7',
                    Width: 2.01,
                  },
                  {
                    Name: 'Column8',
                    Width: 2.01,
                  },
                  {
                    Name: 'Column9',
                    Width: 2.01,
                  },
                ],
                ColumnContent: {
                  Height: 0.608542,
                  ColumnContentCell: [
                    {
                      Column: 'Column2',
                      TextAlign: 'MiddleCenter',
                      DataField: 'itemName',
                    },
                    {
                      Column: 'Column3',
                      TextAlign: 'MiddleCenter',
                      DataField: '用量(吨/时)',
                    },
                    {
                      Column: 'Column4',
                      TextAlign: 'MiddleCenter',
                      DataField: 'PH值(7.2-9.0)',
                    },
                    {
                      Column: 'Column5',
                      TextAlign: 'MiddleCenter',
                      DataField: '浊度(≤10)',
                    },
                    {
                      Column: 'Column6',
                      TextAlign: 'MiddleCenter',
                      DataField: '浓缩倍数(≥4)',
                    },
                    {
                      Column: 'Column7',
                      TextAlign: 'MiddleCenter',
                      DataField: '浓缩倍数(≥4)',
                    },
                    {
                      Column: 'Column8',
                      TextAlign: 'MiddleCenter',
                      DataField: '浓缩倍数(≥4)',
                    },
                    {
                      Column: 'Column9',
                      TextAlign: 'MiddleCenter',
                      DataField: '浓缩倍数(≥4)',
                    },
                  ],
                },
                ColumnTitle: {
                  ColumnTitleCell: [
                    {
                      GroupTitle: false,
                      Column: 'Column2',
                      TextAlign: 'MiddleCenter',
                      Text: '项目',
                    },
                    {
                      GroupTitle: false,
                      Column: 'Column3',
                      TextAlign: 'MiddleCenter',
                      Text: '用量',
                    },
                    {
                      GroupTitle: false,
                      Column: 'Column4',
                      TextAlign: 'MiddleCenter',
                      Text: 'PH值',
                    },
                    {
                      GroupTitle: false,
                      Column: 'Column5',
                      TextAlign: 'MiddleCenter',
                      Text: '浊度',
                    },
                    {
                      GroupTitle: false,
                      Column: 'Column6',
                      TextAlign: 'MiddleCenter',
                      Text: '浓缩倍数',
                    },
                    {
                      GroupTitle: false,
                      Column: 'Column7',
                      TextAlign: 'MiddleCenter',
                      Text: '钙硬度',
                    },
                    {
                      GroupTitle: false,
                      Column: 'Column8',
                      TextAlign: 'MiddleCenter',
                      Text: '碱浓度',
                    },
                    {
                      GroupTitle: false,
                      Column: 'Column9',
                      TextAlign: 'MiddleCenter',
                      Text: '钼酸根',
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    ],
  },
  zhengqi: {
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
            Name: 'levelName',
          },
          {
            Name: '热电联产外送量',
          },
          {
            Name: 'dev1',
          },
          {
            Name: 'dev2',
          },
          {
            Name: '乙烯及裂解汽油加氢',
          },
          {
            Name: 'C5',
          },
          {
            Name: 'EO/EG',
          },
          {
            Name: '丁二烯',
          },
          {
            Name: '芳烃抽提',
          },
          {
            Name: 'MTBE/丁烯-1',
          },
          {
            Name: 'HDPE',
          },
          {
            Name: 'LLDPE',
          },
          {
            Name: 'STPP/JPP',
          },
          {
            Name: '一循/三循',
          },
          {
            Name: '空分',
          },
          {
            Name: '鲁华',
          },
          {
            Name: '其他',
          },
          {
            Name: '平衡差量',
          },
          {
            Name: 'Field4',
          },
        ],
      },
      Column: [
        {
          Name: 'Column1',
          Width: 3.96875,
        },
        {
          Name: 'Column3',
          Width: 2.01,
        },
        {
          Name: 'Column4',
          Width: 2.01,
        },
        {
          Name: 'Column5',
          Width: 2.01,
        },
        {
          Name: 'Column6',
          Width: 2.01,
        },
        {
          Name: 'Column7',
          Width: 2.01,
        },
        {
          Name: 'Column8',
          Width: 2.01,
        },
        {
          Name: 'Column9',
          Width: 2.01,
        },
        {
          Name: 'Column10',
          Width: 2.01,
        },
        {
          Name: 'Column11',
          Width: 2.01,
        },
        {
          Name: 'Column12',
          Width: 2.01,
        },
        {
          Name: 'Column13',
          Width: 2.01,
        },
        {
          Name: 'Column14',
          Width: 2.01,
        },
        {
          Name: 'Column15',
          Width: 2.01,
        },
        {
          Name: 'Column16',
          Width: 2.01,
        },
        {
          Name: 'Column17',
          Width: 2.01,
        },
        {
          Name: 'Column18',
          Width: 2.01,
        },
        {
          Name: 'Column19',
          Width: 2.01,
        },
      ],
      ColumnContent: {
        Height: 0.608542,
        ColumnContentCell: [
          {
            Column: 'Column1',
            TextAlign: 'MiddleCenter',
            DataField: 'levelName',
          },
          {
            Column: 'Column3',
            TextAlign: 'MiddleCenter',
            DataField: '热电联产外送量',
          },
          {
            Column: 'Column4',
            TextAlign: 'MiddleCenter',
            DataField: 'dev1',
          },
          {
            Column: 'Column5',
            TextAlign: 'MiddleCenter',
            DataField: 'dev2',
          },
          {
            Column: 'Column6',
            TextAlign: 'MiddleCenter',
            DataField: '乙烯及裂解汽油加氢',
          },
          {
            Column: 'Column7',
            TextAlign: 'MiddleCenter',
            DataField: 'C5',
          },
          {
            Column: 'Column8',
            TextAlign: 'MiddleCenter',
            DataField: 'EO/EG',
          },
          {
            Column: 'Column9',
            TextAlign: 'MiddleCenter',
            DataField: '丁二烯',
          },
          {
            Column: 'Column10',
            TextAlign: 'MiddleCenter',
            DataField: '芳烃抽提',
          },
          {
            Column: 'Column11',
            TextAlign: 'MiddleCenter',
            DataField: 'MTBE/丁烯-1',
          },
          {
            Column: 'Column12',
            TextAlign: 'MiddleCenter',
            DataField: 'HDPE',
          },
          {
            Column: 'Column13',
            TextAlign: 'MiddleCenter',
            DataField: 'LLDPE',
          },
          {
            Column: 'Column14',
            TextAlign: 'MiddleCenter',
            DataField: 'STPP/JPP',
          },
          {
            Column: 'Column15',
            TextAlign: 'MiddleCenter',
            DataField: '一循/三循',
          },
          {
            Column: 'Column16',
            TextAlign: 'MiddleCenter',
            DataField: '空分',
          },
          {
            Column: 'Column17',
            TextAlign: 'MiddleCenter',
            DataField: '鲁华',
          },
          {
            Column: 'Column18',
            TextAlign: 'MiddleCenter',
            DataField: '其他',
          },
          {
            Column: 'Column19',
            TextAlign: 'MiddleCenter',
            DataField: '平衡差量',
          },
        ],
      },
      ColumnTitle: {
        Height: 2.38125,
        ColumnTitleCell: [
          {
            GroupTitle: true,
            Name: '二、 裂解炉路运行状况',
            ColumnTitleCell: [
              {
                GroupTitle: false,
                Column: 'Column1',
                Lock: 'None',
                FreeCell: true,
                CanGrow: true,
                CanShrink: true,
                Control: [
                  {
                    Type: 'Line',
                    Name: 'Line1',
                    Width: 3.99521,
                    Height: 1.19063,
                  },
                  {
                    Type: 'StaticBox',
                    Name: 'StaticBox1',
                    Left: 2.01083,
                    Width: 1.98438,
                    Height: 0.608542,
                    Text: '装置名称',
                  },
                  {
                    Type: 'StaticBox',
                    Name: 'StaticBox2',
                    Top: 0.396875,
                    Width: 2.01083,
                    Height: 0.608542,
                    Text: '介质名称',
                  },
                ],
              },
              {
                GroupTitle: false,
                Column: 'Column3',
                TextAlign: 'MiddleCenter',
                CanGrow: true,
                CanShrink: true,
                Text: '热电联\r\n产外送量',
              },
              {
                GroupTitle: false,
                Column: 'Column4',
                CanGrow: true,
                CanShrink: true,
                Text: '减温减压器\r\n（转换输入）',
              },
              {
                GroupTitle: false,
                Column: 'Column5',
                CanGrow: true,
                CanShrink: true,
                Text: '减温减压器\r\n（转换输出）',
              },
              {
                GroupTitle: false,
                Column: 'Column6',
                CanGrow: true,
                CanShrink: true,
                Text: '乙烯及裂解\r\n汽油加氢',
              },
              {
                GroupTitle: false,
                Column: 'Column7',
                TextAlign: 'MiddleCenter',
                CanGrow: true,
                CanShrink: true,
                Text: 'C5',
              },
              {
                GroupTitle: false,
                Column: 'Column8',
                TextAlign: 'MiddleCenter',
                CanGrow: true,
                CanShrink: true,
                Text: 'EO/EG',
              },
              {
                GroupTitle: false,
                Column: 'Column9',
                TextAlign: 'MiddleCenter',
                CanGrow: true,
                CanShrink: true,
                Text: '丁二烯',
              },
              {
                GroupTitle: false,
                Column: 'Column10',
                TextAlign: 'MiddleCenter',
                CanGrow: true,
                CanShrink: true,
                Text: '芳烃抽提',
              },
              {
                GroupTitle: false,
                Column: 'Column11',
                TextAlign: 'MiddleCenter',
                CanGrow: true,
                CanShrink: true,
                Text: 'MTBE/\r\n丁烯-1',
              },
              {
                GroupTitle: false,
                Column: 'Column12',
                TextAlign: 'MiddleCenter',
                CanGrow: true,
                CanShrink: true,
                Text: 'HDPE',
              },
              {
                GroupTitle: false,
                Column: 'Column13',
                TextAlign: 'MiddleCenter',
                CanGrow: true,
                CanShrink: true,
                Text: 'LLDPE',
              },
              {
                GroupTitle: false,
                Column: 'Column14',
                TextAlign: 'MiddleCenter',
                CanGrow: true,
                CanShrink: true,
                Text: 'STPP/JPP',
              },
              {
                GroupTitle: false,
                Column: 'Column15',
                TextAlign: 'MiddleCenter',
                CanGrow: true,
                CanShrink: true,
                Text: '一循/三循',
              },
              {
                GroupTitle: false,
                Column: 'Column16',
                TextAlign: 'MiddleCenter',
                CanGrow: true,
                CanShrink: true,
                Text: '空分',
              },
              {
                GroupTitle: false,
                Column: 'Column17',
                TextAlign: 'MiddleCenter',
                CanGrow: true,
                CanShrink: true,
                Text: '鲁华',
              },
              {
                GroupTitle: false,
                Column: 'Column18',
                TextAlign: 'MiddleCenter',
                CanGrow: true,
                CanShrink: true,
                Text: '其他',
              },
              {
                GroupTitle: false,
                Column: 'Column19',
                CanGrow: true,
                CanShrink: true,
                Text: '平衡差量',
              },
            ],
            Text: '九、全厂蒸汽平衡表（吨/时）',
          },
        ],
      },
    },
  },
  wushui: {
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
            Name: 'levelName',
          },
          {
            Name: '污水处理',
          },
          {
            Name: '乙烯装置',
          },
          {
            Name: '裂解汽油加氢',
          },
          {
            Name: '原料中间罐区',
          },
          {
            Name: 'C5',
          },
          {
            Name: 'EO/EG',
          },
          {
            Name: '丁二烯',
          },
          {
            Name: '芳烃抽提',
          },
          {
            Name: 'MTBE/丁烯-1',
          },
          {
            Name: 'HDPE',
          },
          {
            Name: 'LLDPE',
          },
          {
            Name: 'STPP',
          },
          {
            Name: 'JPP',
          },
          {
            Name: '空分',
          },
          {
            Name: '鲁华',
          },
          {
            Name: '产品罐区',
          },
          {
            Name: '平衡差量',
          },
          {
            Name: 'Field4',
          },
        ],
      },
      Column: [
        {
          Name: 'Column1',
          Width: 3.96875,
        },
        {
          Name: 'Column3',
          Width: 2.01,
        },
        {
          Name: 'Column4',
          Width: 2.01083,
        },
        {
          Name: 'Column5',
          Width: 2.01,
        },
        {
          Name: 'Column6',
          Width: 2.01,
        },
        {
          Name: 'Column7',
          Width: 2.01,
        },
        {
          Name: 'Column20',
          Width: 2.01,
        },
        {
          Name: 'Column8',
          Width: 2.01,
        },
        {
          Name: 'Column9',
          Width: 2.01,
        },
        {
          Name: 'Column10',
          Width: 2.01,
        },
        {
          Name: 'Column11',
          Width: 2.01,
        },
        {
          Name: 'Column12',
          Width: 2.01,
        },
        {
          Name: 'Column13',
          Width: 2.01,
        },
        {
          Name: 'Column14',
          Width: 2.01,
        },
        {
          Name: 'Column15',
          Width: 2.01,
        },
        {
          Name: 'Column16',
          Width: 2.01,
        },
        {
          Name: 'Column17',
          Width: 2.01,
        },
        {
          Name: 'Column19',
          Width: 2.01,
        },
      ],
      ColumnContent: {
        Height: 0.608542,
        ColumnContentCell: [
          {
            Column: 'Column1',
            TextAlign: 'MiddleCenter',
            DataField: 'levelName',
          },
          {
            Column: 'Column3',
            TextAlign: 'MiddleCenter',
            DataField: '空分',
          },
          {
            Column: 'Column4',
            TextAlign: 'MiddleCenter',
            DataField: '污水处理',
          },
          {
            Column: 'Column5',
            TextAlign: 'MiddleCenter',
            DataField: '乙烯装置',
          },
          {
            Column: 'Column6',
            DataField: '裂解汽油加氢',
          },
          {
            Column: 'Column7',
            TextAlign: 'MiddleCenter',
            DataField: 'C5',
          },
          {
            Column: 'Column20',
            TextAlign: 'MiddleCenter',
            DataField: '原料中间罐区',
          },
          {
            Column: 'Column8',
            TextAlign: 'MiddleCenter',
            DataField: 'EO/EG',
          },
          {
            Column: 'Column9',
            TextAlign: 'MiddleCenter',
            DataField: '丁二烯',
          },
          {
            Column: 'Column10',
            TextAlign: 'MiddleCenter',
            DataField: '芳烃抽提',
          },
          {
            Column: 'Column11',
            TextAlign: 'MiddleCenter',
            DataField: 'MTBE/丁烯-1',
          },
          {
            Column: 'Column12',
            TextAlign: 'MiddleCenter',
            DataField: 'HDPE',
          },
          {
            Column: 'Column13',
            TextAlign: 'MiddleCenter',
            DataField: 'LLDPE',
          },
          {
            Column: 'Column14',
            TextAlign: 'MiddleCenter',
            DataField: 'STPP',
          },
          {
            Column: 'Column15',
            TextAlign: 'MiddleCenter',
            DataField: 'JPP',
          },
          {
            Column: 'Column16',
            TextAlign: 'MiddleCenter',
            DataField: '产品罐区',
          },
          {
            Column: 'Column17',
            TextAlign: 'MiddleCenter',
            DataField: '鲁华',
          },
          {
            Column: 'Column19',
            TextAlign: 'MiddleCenter',
            DataField: '平衡差量',
          },
        ],
      },
      ColumnTitle: {
        Height: 2.38125,
        ColumnTitleCell: [
          {
            GroupTitle: true,
            Name: '二、 裂解炉路运行状况',
            ColumnTitleCell: [
              {
                GroupTitle: false,
                Column: 'Column1',
                Lock: 'None',
                FreeCell: true,
                CanGrow: true,
                CanShrink: true,
                Control: [
                  {
                    Type: 'Line',
                    Name: 'Line1',
                    Width: 3.99521,
                    Height: 1.19063,
                  },
                  {
                    Type: 'StaticBox',
                    Name: 'StaticBox1',
                    Left: 2.01083,
                    Width: 1.98438,
                    Height: 0.608542,
                    Text: '装置名称',
                  },
                  {
                    Type: 'StaticBox',
                    Name: 'StaticBox2',
                    Top: 0.396875,
                    Width: 2.01083,
                    Height: 0.608542,
                    Text: '介质名称',
                  },
                ],
              },
              {
                GroupTitle: false,
                Column: 'Column3',
                TextAlign: 'MiddleCenter',
                CanGrow: true,
                CanShrink: true,
                Text: '空分',
              },
              {
                GroupTitle: false,
                Column: 'Column4',
                TextAlign: 'MiddleCenter',
                CanGrow: true,
                CanShrink: true,
                Text: '污水处理',
              },
              {
                GroupTitle: false,
                Column: 'Column5',
                TextAlign: 'MiddleCenter',
                CanGrow: true,
                CanShrink: true,
                Text: '乙烯装置',
              },
              {
                GroupTitle: false,
                Column: 'Column6',
                TextAlign: 'MiddleCenter',
                CanGrow: true,
                CanShrink: true,
                Text: '裂解\r\n汽油加氢',
              },
              {
                GroupTitle: false,
                Column: 'Column7',
                TextAlign: 'MiddleCenter',
                CanGrow: true,
                CanShrink: true,
                Text: 'C5',
              },
              {
                GroupTitle: false,
                Column: 'Column20',
                TextAlign: 'MiddleCenter',
                Text: '原料\r\n中间罐区',
              },
              {
                GroupTitle: false,
                Column: 'Column8',
                TextAlign: 'MiddleCenter',
                CanGrow: true,
                CanShrink: true,
                Text: 'EO/EG',
              },
              {
                GroupTitle: false,
                Column: 'Column9',
                TextAlign: 'MiddleCenter',
                CanGrow: true,
                CanShrink: true,
                Text: '丁二烯',
              },
              {
                GroupTitle: false,
                Column: 'Column10',
                TextAlign: 'MiddleCenter',
                CanGrow: true,
                CanShrink: true,
                Text: '芳烃抽提',
              },
              {
                GroupTitle: false,
                Column: 'Column11',
                TextAlign: 'MiddleCenter',
                CanGrow: true,
                CanShrink: true,
                Text: 'MTBE/\r\n丁烯-1',
              },
              {
                GroupTitle: false,
                Column: 'Column12',
                TextAlign: 'MiddleCenter',
                CanGrow: true,
                CanShrink: true,
                Text: 'HDPE',
              },
              {
                GroupTitle: false,
                Column: 'Column13',
                TextAlign: 'MiddleCenter',
                CanGrow: true,
                CanShrink: true,
                Text: 'LLDPE',
              },
              {
                GroupTitle: false,
                Column: 'Column14',
                TextAlign: 'MiddleCenter',
                CanGrow: true,
                CanShrink: true,
                Text: 'STPP',
              },
              {
                GroupTitle: false,
                Column: 'Column15',
                TextAlign: 'MiddleCenter',
                CanGrow: true,
                CanShrink: true,
                Text: 'JPP',
              },
              {
                GroupTitle: false,
                Column: 'Column16',
                TextAlign: 'MiddleCenter',
                CanGrow: true,
                CanShrink: true,
                Text: '产品罐区',
              },
              {
                GroupTitle: false,
                Column: 'Column17',
                TextAlign: 'MiddleCenter',
                CanGrow: true,
                CanShrink: true,
                Text: '鲁华',
              },
              {
                GroupTitle: false,
                Column: 'Column19',
                CanGrow: true,
                CanShrink: true,
                Text: '平衡差量',
              },
            ],
            Text: '十、全厂生产污水（吨/时）和氮气（立方米/时）平衡表',
          },
        ],
      },
    },
  },
};
