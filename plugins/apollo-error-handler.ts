export default ({ graphQLErrors, networkError, operation, forward }: any, _nuxtContext: any) => {
  console.log("Global error handler");
  console.log(graphQLErrors, networkError, operation, forward);
};
