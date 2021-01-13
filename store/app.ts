import { GetterTree, ActionTree, MutationTree } from "vuex";
import { AsyncStorage, VuexPersistence } from "vuex-persist";
import localforage from "localforage";
import { InjectedMenu } from "~/types/store";

const initialState = {
  user: "null",
  injectedMenu: [] as InjectedMenu[],
  travelerGender: 0,
};
type AppState = typeof initialState;

const vuexLocal = new VuexPersistence<AppState>({
  storage: localforage as AsyncStorage,
  asyncStorage: true,
});

export const plugins = [vuexLocal.plugin];
export const state = (): AppState => initialState;
export const mutations: MutationTree<AppState> = {
  setTravelerGender(state, v) {
    state.travelerGender = v;
  },
};
export const actions: ActionTree<AppState, {}> = {
  // nuxtServerInit({ commit }, { req }) {
  //   let auth = null;
  //   if (req.headers.cookie) {
  //     const parsed = cookieparser.parse(req.headers.cookie);
  //     try {
  //       auth = JSON.parse(parsed.auth);
  //     } catch (err) {
  //       // No valid cookie found
  //     }
  //   }
  //   commit("setAuth", auth);
  // },
};
export const getters: GetterTree<AppState, {}> = {
  injectedMenu: ({ injectedMenu }) => injectedMenu,
  travelerGender: ({ travelerGender }) => travelerGender,
};
