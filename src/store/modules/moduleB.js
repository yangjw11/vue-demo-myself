export default {
  state: {
    name: 'aaa'
  },
  getters: {},
  mutations: {
    changeName(state, msg) {
      console.log(msg);
      state.name = 'aaa+++' + msg;
    }
  },
  actions: {
    actChangeName(context, msg) {
      console.log(msg);
      context.commit('changeName', msg);
    }
  }
}