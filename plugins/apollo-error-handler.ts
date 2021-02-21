import { Context } from "@nuxt/types";

export default ({ graphQLErrors, networkError, operation, forward }: any, nuxtContext: Context) => {
  // Global error handler
  if (graphQLErrors && graphQLErrors[0] && graphQLErrors[0].message.startsWith("Access denied")) {
    console.log("[need auth] return to", nuxtContext.route.path);
    nuxtContext.redirect(`/login?return_url=${nuxtContext.route.path}`);
  } else {
    console.log(graphQLErrors, networkError, operation, forward);
  }
};
