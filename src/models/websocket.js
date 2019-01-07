export default {
  namespace: 'websocket',

  state: {
    alarm: [],
  },

  effects: {
    *add({ payload }, { put }) {
      yield put({
        type: 'alarmList',
        payload,
      });
    },
  },

  reducers: {
    alarmList: (state, { payload }) => {
      return {
        ...state,
        alarm: [...state.alarm, payload],
      };
    },
  },
};
