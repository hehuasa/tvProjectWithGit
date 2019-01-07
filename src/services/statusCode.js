export const switchCode = (code) => {
  let resCode = Number(code);
  switch (resCode) {
    case 0:
      resCode = '该账户未经认证';
      break;
    case 1:
      resCode = '该账户未经授权';
      break;
    case 1001:
      resCode = '操作成功';
      break;
    case 1002:
      resCode = '操作失败';
      break;
    case 1003:
      resCode = '异常';
      break;
    case 1004:
      resCode = '错误';
      break;
    case 1005:
      resCode = '用户名或密码错误';
      break;
    case 1006:
      resCode = '参数为空';
      break;
    case 1007:
      resCode = '参数错误';
      break;
    case 1008:
      resCode = '文件创建失败';
      break;
    case 1009:
      resCode = '会话超时';
      break;
    case 1010:
      resCode = '唯一字段已经存在';
      break;
    case 1011:
      resCode = '导出失败';
      break;
    case 1012:
      resCode = '域账户不允许修改或删除';
      break;
    case 1013:
      resCode = '短信不允许修改';
      break;
    case 1014:
      resCode = '请求数据为空';
      break;
    case 1015:
      resCode = '此阶段只允许有一个实施方案';
      break;
    case 1016:
      resCode = '该特征值已经在当前预案中';
      break;
    case 1017:
      resCode = '该预案不允许删除';
      break;
    default: return;
  }
  return resCode;
};
