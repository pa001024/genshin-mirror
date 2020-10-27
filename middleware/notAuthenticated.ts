import { Context } from "@nuxt/types";

export default function ({ store, redirect }: Context) {
  // If the user is authenticated redirect to home page
  if (store.state.auth) {
    return redirect("/");
  }
}
