export default {
	state: {
		sharedInput: ""
	},
	mutations: {
		updateSharedInput(state, value) {
			state.sharedInput = value;
		}
	},
	actions: {
		updateSharedInput({ commit }, value) {
			commit("updateSharedInput", value);
		}
	},
	getters: {
		sharedInput: state => state.sharedInput
	}
};
