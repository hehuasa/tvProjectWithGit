import { routerRedux } from 'dva/router';
import { importConfigList } from '../services/api';
import { accountLogin } from '../services/api';

export default {
  namespace:'importConfig',

  state:{
    data:{
      allTable:[]
    }
  },

  effects:{
    *config({ payload }, { call, put }){
      const response = yield call(importConfigList, payload);
      yield put({
        type: 'querySuccess',
        payload: response ,
      });
    }
  },
  reducers: {
    // 使用服务器数据返回
    querySuccess(state, {payload}){
      return {...state, data:payload};
    },
  },
}