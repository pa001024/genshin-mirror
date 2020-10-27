import { GetterTree, ActionTree, MutationTree } from "vuex";
const cookieparser = process.server ? require("cookieparser") : undefined;

interface AuthState {
  auth: string | null;
}

export const state = (): AuthState => {
  return {
    auth: null,
  };
};
export const mutations: MutationTree<AuthState> = {
  setAuth(state, auth) {
    state.auth = auth;
  },
};
export const actions: ActionTree<AuthState, {}> = {
  nuxtServerInit({ commit }, { req }) {
    let auth = null;
    if (req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie);
      try {
        auth = JSON.parse(parsed.auth);
      } catch (err) {
        // No valid cookie found
      }
    }
    commit("setAuth", auth);
  },
};
export const getters: GetterTree<AuthState, {}> = {};
