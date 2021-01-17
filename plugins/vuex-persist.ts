import { AsyncStorage, VuexPersistence } from "vuex-persist";
import localforage from "localforage";

const lf = localforage.createInstance({
  name: "gsMirror",
  storeName: "gsMirrorLocal",
});
export const vuexPersistenceInstance = new VuexPersistence({
  storage: lf as AsyncStorage,
  asyncStorage: true,
});

export default ({ store }: any) => {
  vuexPersistenceInstance.plugin(store);
};
