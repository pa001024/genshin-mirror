<template>
  <div class="container">
    <h1>Sign in to access the secret page</h1>
    <div>
      <label for="email">
        <v-text-field id="email" type="email" value="test" />
      </label>
      <label for="password">
        <v-text-field id="password" type="password" value="test" />
      </label>
      <v-btn @click="postLogin">login</v-btn>
      <p>The credentials are not verified for the example purpose.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

const Cookie = process.client ? require("js-cookie") : undefined;

@Component({})
export default class Login extends Vue {
  postLogin() {
    setTimeout(() => {
      // we simulate the async request with timeout.
      const auth = {
        accessToken: "someStringGotFromApiServiceWithAjax",
      };
      this.$store.commit("setAuth", auth); // mutating to store for client rendering
      Cookie.set("auth", auth); // saving token in cookie for server rendering
      this.$router.push("/");
    }, 1000);
  }
}
</script>

<style lang="less" scoped>
.my {
  color: red;
}
</style>