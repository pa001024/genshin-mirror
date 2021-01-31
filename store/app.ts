import { GetterTree, ActionTree, MutationTree } from "vuex";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import { vuexPersistenceInstance } from "~/plugins/vuex-persist";
import type { IArtifact, IUserAvatar, IUserWeapon } from "~/modules/core";

const initialState = {
  uid: "",
  user: "",
  auth: "",
  travelerGender: 0,
  artifacts: [] as IArtifact[],
  artifactsTime: 0,
  userAvatars: [] as IUserAvatar[],
  userWeapons: [] as IUserWeapon[],
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
  UPDATE_ARTIFACTS(state, { v, time }) {
    state.artifacts = v;
    state.artifactsTime = time;
  },
  UPDATE_USER_AVATARS(state, v) {
    state.userAvatars = v;
  },
  ADD_USER_AVATAR(state, v) {
    state.userAvatars.push(v);
  },
  UPDATE_USER_WEAPONS(state, v) {
    state.userWeapons = v;
  },
  ADD_USER_WEAPON(state, v) {
    state.userWeapons.push(v);
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
  /** 从云端加载圣遗物 */
  async loadArtifacts({ commit, state }) {
    const { data } = await this.$axios.get(`/api/artifacts?h=${state.artifactsTime}`, { headers: { Authorization: state.auth } });
    if (data.code === 200) {
      commit("UPDATE_ARTIFACTS", { v: data, time: state.artifactsTime });
    } else if (data.code !== 304) {
      console.error("load artifacts failed", data.message);
    }
  },
  /** 获取用户角色 */
  async fetchAvatars({ commit, state }) {
    if (state.auth) {
      const res = await this.$axios.get(`/api/user/char`, { headers: { Authorization: state.auth } });
      commit("UPDATE_USER_AVATARS", res.data);
    }
  },
  /** 删除用户角色 */
  async removeAvatar({ commit, state }, id) {
    const avatars = state.userAvatars.filter(v => v.avatarId !== id);
    commit("UPDATE_USER_AVATARS", avatars);
    if (state.auth) {
      await this.$axios.delete(`/api/user/char/` + id, { headers: { Authorization: state.auth } }).catch(console.error);
    }
  },
  /** 添加用户角色 */
  async addAvatar({ commit, state }, ua: IUserAvatar) {
    if (state.userAvatars.some(v => v.avatarId === ua.avatarId)) {
      commit(
        "UPDATE_USER_AVATARS",
        state.userAvatars.map(v => {
          if (v.avatarId !== ua.avatarId) return v;
          return { ...v, ...ua };
        })
      );
    } else {
      commit("ADD_USER_AVATAR", ua);
    }
    if (state.auth) {
      await this.$axios.put(`/api/user/char`, ua, { headers: { Authorization: state.auth } }).catch(console.error);
    }
  },
  /** 获取用户角色 */
  async fetchWeapons({ commit, state }) {
    if (state.auth) {
      const res = await this.$axios.get(`/api/user/weapon`, { headers: { Authorization: state.auth } });
      commit("UPDATE_USER_WEAPONS", res.data);
    }
  },
  /** 删除用户武器 */
  async removeWeapon({ commit, state }, id) {
    const weapons = state.userWeapons.filter(v => v.weaponId !== id);
    commit("UPDATE_USER_WEAPONS", weapons);
    if (state.auth) {
      await this.$axios.delete(`/api/user/weapon/` + id, { headers: { Authorization: state.auth } }).catch(console.error);
    }
  },
  /** 添加用户武器 */
  async addWeapon({ commit, state }, uw: IUserWeapon) {
    if (state.userWeapons.some(v => v.weaponId === uw.weaponId)) {
      commit(
        "UPDATE_USER_WEAPONS",
        state.userWeapons.map(v => {
          if (v.weaponId !== uw.weaponId) return v;
          return { ...v, ...uw };
        })
      );
    } else {
      commit("ADD_USER_WEAPON", uw);
    }
    if (state.auth) {
      await this.$axios.put(`/api/user/weapon`, uw, { headers: { Authorization: state.auth } }).catch(console.error);
    }
  },
  async setArtifacts({ commit, state }, artifacts) {
    const old = { v: state.artifacts, time: state.artifactsTime };
    commit("UPDATE_ARTIFACTS", { v: artifacts, hash: nanoid() });
    // 登录状态上传到云端
    if (state.auth) {
      const rst = await this.$axios.put("/api/artifacts", { artifacts }, { headers: { Authorization: state.auth } }).catch(console.error);
      // 请求失败回滚
      if (!rst) commit("UPDATE_ARTIFACTS", old);
    }
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
  userAvatars: s => s.userAvatars,
  userWeapons: s => s.userWeapons,
};
