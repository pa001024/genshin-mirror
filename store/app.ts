import { GetterTree, ActionTree, MutationTree } from "vuex";
import { nanoid } from "nanoid";
import cookie from "js-cookie";
import jwt from "jsonwebtoken";
import { vuexPersistenceInstance } from "~/plugins/vuex-persist";
import type { IArtifact, IUserBuild } from "~/modules/core";

const initialState = {
  uid: "",
  user: "",
  auth: "",
  travelerGender: 0,
  artifacts: [] as IArtifact[],
  artifactsTime: 0,
  builds: [] as IUserBuild[],
  version: "",
};
type AppState = typeof initialState;

export const plugins = [vuexPersistenceInstance.plugin];
export const state = (): AppState => initialState;

// 本地读写
export const mutations: MutationTree<AppState> = {
  UPDATE_TRAVELER_GENDER(state, v) {
    state.travelerGender = v;
  },
  UPDATE_AUTH(state, { user, auth, uid }) {
    state.auth = auth;
    state.user = user;
    state.uid = uid;
  },
  RESET(state) {
    Object.assign(state, initialState);
  },
};
interface JWTPayload {
  uid: string;
  user: string;
  type: number;
  exp: number;
  ver: number;
}

// 远端读写
export const actions: ActionTree<AppState, {}> = {
  /** 登录后设置验证 */
  setAuth({ commit }, auth: string) {
    if (auth.startsWith("Bearer ")) {
      const { user, uid, exp } = jwt.decode(auth.substr(7)) as JWTPayload;
      if (exp > Date.now() / 1e3) commit("UPDATE_AUTH", { uid, user, auth });
    }
  },
  /** 校验令牌有效期 */
  checkAuth({ commit, state }) {
    if (state.auth.startsWith("Bearer ")) {
      const { exp } = jwt.decode(state.auth.substr(7)) as JWTPayload;
      if (exp < Date.now() / 1e3) commit("UPDATE_AUTH", { uid: "", user: "", auth: "" });
    }
  },
  /** 登出 */
  logout({ commit }) {
    commit("RESET");
  },
  setTravelerGender({ commit }, v) {
    commit("UPDATE_TRAVELER_GENDER", v);
  },
  // load content
  // async nuxtServerInit({ commit }, { app }) {
  //   const res = (await app.$content(this.$i18n.locale, "relic").fetch().catch(console.error)) as IArtifactType[];
  //   const idmap = res.reduce<{ [id: number]: IArtifactType }>((r, v) => (r[v.id] = v) && r, {});
  //   commit("UPDATE_ARTIFACTS_TYPES", idmap);
  // },
};
export const getters: GetterTree<AppState, {}> = {
  travelerGender: s => s.travelerGender,
  username: s => s.user,
  uid: s => s.uid,
  artifacts: s => s.artifacts,
  artifactsTime: s => s.artifactsTime,
};
