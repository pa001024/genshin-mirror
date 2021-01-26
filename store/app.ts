import { GetterTree, ActionTree, MutationTree } from "vuex";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import type { contentFunc } from "@nuxt/content/types/content";
import { vuexPersistenceInstance } from "~/plugins/vuex-persist";
import type { IArtifact, IArtifactSet, IArtifactType, IAvatar, IUserAvatar, IUserWeapon, IWeapon } from "~/modules/core";

const initialState = {
  user: "",
  auth: "",
  travelerGender: 0,
  artifacts: [] as IArtifact[],
  artifactTypes: null as { [id: number]: IArtifactType } | null,
  artifactSets: null as { [id: number]: IArtifactSet } | null,
  artifactsHash: "",
  avatars: null as { [id: string]: IAvatar } | null,
  weapons: null as { [id: string]: IWeapon } | null,
  userAvatars: [] as IUserAvatar[],
  userWeapons: [] as IUserWeapon[],
};
type AppState = typeof initialState;

export const plugins = [vuexPersistenceInstance.plugin];
export const state = (): AppState => initialState;

// 本地读写
export const mutations: MutationTree<AppState> = {
  UPDATE_TRAVELER_GENDER(state, v) {
    state.travelerGender = v;
  },
  UPDATE_AUTH(state, { user, auth }) {
    state.auth = auth;
    state.user = user;
  },
  UPDATE_ARTIFACTS(state, { v, hash }) {
    state.artifacts = v;
    state.artifactsHash = hash;
  },
  UPDATE_ARTIFACTS_TYPES(state, v) {
    state.artifactTypes = v;
  },
  UPDATE_AVATARS(state, v) {
    state.avatars = v;
  },
  UPDATE_USER_AVATARS(state, v) {
    state.userAvatars = v;
  },
  ADD_USER_AVATAR(state, v) {
    state.userAvatars.push(v);
  },
  UPDATE_WEAPONS(state, v) {
    state.weapons = v;
  },
};

// 远端读写
export const actions: ActionTree<AppState, {}> = {
  setAuth({ commit }, auth: string) {
    if (auth.startsWith("Bearer ")) {
      const { user }: any = jwt.decode(auth.substr(7));
      commit("UPDATE_AUTH", { user, auth });
    }
  },
  /** 从云端加载圣遗物 */
  async loadArtifacts({ commit, state }) {
    const { data } = await this.$axios.get(`/api/artifacts?h=${state.artifactsHash}`);
    if (data.code === 200) {
      commit("UPDATE_ARTIFACTS", { v: data, hash: state.artifactsHash });
    } else if (data.code !== 304) {
      console.error("load artifacts failed", data.message);
    }
  },
  /** 删除用户角色 */
  async removeAvatar({ commit, state }, id) {
    const avatars = state.userAvatars.filter(v => v.avatarId !== id);
    commit("UPDATE_USER_AVATARS", avatars);
    if (state.auth) {
      const res = await this.$axios.put(`/api/user/char`, { data: avatars });
      if (!res) console.error(res);
    }
  },
  /** 添加用户角色 */
  async addAvatar({ commit, state }, avatar) {
    commit("ADD_USER_AVATAR", avatar);
    if (state.auth) {
      const res = await this.$axios.put(`/api/user/char`, { data: [...state.userAvatars, avatar] });
      if (!res) console.error(res);
    }
  },
  /** 加载圣遗物类型数据 */
  async loadArtifactTypeData({ commit }) {
    const types = await this.$content(this.$i18n.locale, "relic").fetch<IArtifactType>().catch(console.error);
    if (Array.isArray(types)) {
      const idmap = types.reduce<{ [id: number]: IArtifactType }>((r, v) => (r[v.id] = v) && r, {});
      commit("UPDATE_ARTIFACTS_TYPES", idmap);
    }
  },
  /** 加载圣遗物套装数据 */
  async loadArtifactSetData({ commit }) {
    const sets = await this.$content(this.$i18n.locale, "relicset").fetch<IArtifactSet>().catch(console.error);
    if (Array.isArray(sets)) {
      const idmap = sets.reduce<{ [id: number]: IArtifactSet }>((r, v) => (r[v.id] = v) && r, {});
      commit("UPDATE_ARTIFACT_SET", idmap);
    }
  },
  /** 加载武器数据 */
  async loadWeaponData({ commit }) {
    const weapons = await this.$content(this.$i18n.locale, "weapon").fetch<IWeapon>().catch(console.error);
    if (Array.isArray(weapons)) {
      const idmap = weapons.reduce<{ [id: string]: IWeapon }>((r, v) => (r[v.id] = v) && r, {});
      commit("UPDATE_WEAPONS", idmap);
    }
  },
  /** 加载角色数据 */
  async loadAvatarData({ commit }) {
    const avatars = await this.$content(this.$i18n.locale, "char").fetch<IAvatar>().catch(console.error);
    if (Array.isArray(avatars)) {
      const idmap = avatars.reduce<{ [id: string]: IAvatar }>((r, v) => (r[v.id] = v) && r, {});
      commit("UPDATE_AVATARS", idmap);
    }
  },
  async setArtifacts({ commit, state }, artifacts) {
    const old = { v: state.artifacts, hash: state.artifactsHash };
    commit("UPDATE_ARTIFACTS", { v: artifacts, hash: nanoid() });
    // 登录状态上传到云端
    if (state.auth) {
      const rst = await this.$axios.put("/api/artifacts", { artifacts }).catch(console.error);
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
  travelerGender: ({ travelerGender }) => travelerGender,
  username: ({ user }) => user,
  artifacts: ({ artifacts }) => artifacts,
  artifactTypes: ({ artifactTypes }) => artifactTypes,
  artifactsHash: ({ artifactsHash }) => artifactsHash,
  avatars: ({ avatars }) => avatars,
  weapons: ({ weapons }) => weapons,
};
declare module "vuex/types/index" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Store<S> {
    $content: contentFunc;
  }
}
