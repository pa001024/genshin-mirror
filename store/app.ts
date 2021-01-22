import { GetterTree, ActionTree, MutationTree } from "vuex";
import { vuexPersistenceInstance } from "~/plugins/vuex-persist";

const initialState = {
  user: "",
  auth: "",
  travelerGender: 0,
};
type AppState = typeof initialState;

export const plugins = [vuexPersistenceInstance.plugin];
export const state = (): AppState => initialState;
export const mutations: MutationTree<AppState> = {
  setTravelerGender(state, v) {
    state.travelerGender = v;
  },
  setAuth(state, v) {
    state.auth = v;
  },
  setUser(state, v) {
    state.user = v;
  },
};
export const actions: ActionTree<AppState, {}> = {
  login: ({ commit }, { user, auth }) => {
    commit("setUser", user);
    commit("setAuth", auth);
  },
  nuxtServerInit({ commit, state } /*, { req } */) {
    if (!state.auth) return;
    // logout when state
    const res = this.$axios.get("/api/user/check", { headers: { Authorization: state.auth } }).catch(() => {});
    if (!res) {
      commit("setUser", "");
      commit("setAuth", "");
    }
  },
};
export const getters: GetterTree<AppState, {}> = {
  travelerGender: ({ travelerGender }) => travelerGender,
  username: ({ user }) => user,
};
