import Vue from 'vue'
import Vuex from 'vuex'
import moduleB from '@/store/modules/moduleB'
import contentSync from '@/store/modules/contentSync'




Vue.use(Vuex)



// 自定义一个模块module 也可以从外部引入
const moduleA = {
	state:{
    name: "Rick",
	},
	mutations:{
    moduleAupdname(state){
      state.name = "张木锐（模块A的）"
    }
	},
	getters:{
    fullname(state, getter, rootState) {
      
      return rootState.helloName
    }
	},
	actions:{
	
	}
}



export default new Vuex.Store({
  state: {
    count: 1,
    name: "张三",
    age: 12,
    sum: 0,
    helloName: '张木锐（全局的）',
    showBackButton: true  // 新增：用于控制返回按钮显示状态
  },
  mutations: {
    add(state, n) {
      state.count += n;
    },
    reduce(state) {
      state.count -= 1;
    },
    addSum(state,num) {
      state.sum += num
    },
    reduceSum(state) {
      state.sum -= 1
    },
    // moduleAupdname(state) {
    //   state.name = "张木锐,张木锐"
    // },
    // 新增：更新showBackButton状态的mutation
    setShowBackButton(state, value) {
      state.showBackButton = value;
    }
  },
  actions: {
    // 异步操作mutation
    asyncAdd(context) {
      // 异步
      setTimeout(() => {
        context.commit('addSum',100)
      },1000)
    }
  },
  // 当遇见大型项目时，数据量大，store就会显得很臃肿为了解决以上问题，Vuex 允许我们将 store 分割成模块（module）。每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块——从上至下进行同样方式的分割：
  modules: {
    a: moduleA,
    moduleB,
    contentSync
  },
  getters: {
    count: function (state) {
      return state.count += 100
    },
    fullname1(state, getter, rootState) {
      console.log('state === ', state)
      console.log('rootState', rootState)
      console.log("state === rootState的结果为：", state === rootState) // true
      return state.helloName
    }
  }
})
