import VuexPersistence from "vuex-persist";

export default ({ store }: any) => {
  new VuexPersistence({
    /* your options */
  }).plugin(store);
};
