import Vue from "vue";
import { Plugin } from "@nuxt/types";
import { DefaultApolloClient } from "@vue/apollo-composable";
import VueCompositionApi, { provide } from "@vue/composition-api";

Vue.use(VueCompositionApi);

const vueApolloComposable: Plugin = ({ app }) => {
  const apolloClient = app.apolloProvider.defaultClient;
  provide(DefaultApolloClient, apolloClient);
};

export default vueApolloComposable;

// 暂时没用
