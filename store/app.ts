import { GetterTree, ActionTree, MutationTree } from "vuex";
import { vuexPersistenceInstance } from "~/plugins/vuex-persist";
import { InjectedMenu } from "~/types/store";

const initialState = {
  user: "null",
  injectedMenu: [] as InjectedMenu[],
  travelerGender: 0,
};
type AppState = typeof initialState;

export const plugins = [vuexPersistenceInstance.plugin];
export const state = (): AppState => initialState;
export const mutations: MutationTree<AppState> = {
  setTravelerGender(state, v) {
    state.travelerGender = v;
  },
};
export const actions: ActionTree<AppState, {}> = {};
export const getters: GetterTree<AppState, {}> = {
  injectedMenu: ({ injectedMenu }) => injectedMenu,
  travelerGender: ({ travelerGender }) => travelerGender,
};
