<template>
  <v-responsive max-width="420" class="mx-auto">
    <v-card class="pa-4">
      <v-card-title class="headline">
        {{ $t("ui.userLogin") }}
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <!-- email -->
          <v-text-field v-model="email" name="email" type="email" :rules="emailRules" :label="$t('ui.eMail')" autocomplete="username" required></v-text-field>
          <!-- password -->
          <v-text-field
            v-model="password"
            name="password"
            type="password"
            :rules="passwordRules"
            :label="$t('ui.password')"
            autocomplete="password"
            required
          ></v-text-field>
          <div class="d-flex mb-3">
            <nuxt-link to="/signup">{{ $t("ui.signup") }}</nuxt-link>
            <v-spacer />
            <nuxt-link to="/forgotPassword">{{ $t("ui.forgotPassword") }}</nuxt-link>
          </div>
          <v-btn :disabled="!valid" color="primary" block :loading="loading" @click="postLogin">{{ $t("ui.login") }}</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
    <v-snackbar v-model="showMsg" :timeout="4000">
      <v-icon size="24">mdi-alert</v-icon>
      {{ msg }}
      <template #action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="showMsg = false">{{ $t("ui.close") }}</v-btn>
      </template>
    </v-snackbar>
  </v-responsive>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Action } from "vuex-class";
import sha256 from "crypto-js/sha256";

// const Cookie = process.client ? require("js-cookie") : undefined;

@Component({
  head() {
    const title = this.$t("title.sub", [this.$t("ui.userLogin")]) as string;
    return { title };
  },
})
export default class Login extends Vue {
  @Action("app/setAuth") setAuth!: (auth: string) => void;

  email = "";
  password = "";
  valid = null;
  loading = false;
  showMsg = false;
  msg = "";

  get emailRules() {
    return [(v: string) => !!v || this.$t("ui.eMailIsRequired"), (v: string) => /.+@.+\..+/.test(v) || this.$t("ui.eMailMustBeValid")];
  }

  get passwordRules() {
    return [(v: string) => !!v || this.$t("ui.passwordIsRequired")];
  }

  async postLogin() {
    if (!this.email || !this.password) return;
    this.loading = true;
    const res = await this.$axios
      .post("/api/user/login", {
        email: this.email,
        hash: sha256(this.password).toString(),
      })
      .catch(console.error);
    this.loading = false;
    if (!res || res.data.code !== 200) {
      this.showMsg = false;
      this.showMsg = true;
      this.msg = this.$t("ui.loginFailed") as string;
      return;
    }
    const auth = res.headers.authorization;
    this.setAuth(auth);
    this.showMsg = true;
    let i = 3;
    this.msg = this.$t("ui.loginSuccess", [i]) as string;
    const cls = setInterval(() => {
      if (--i) {
        this.msg = this.$t("ui.loginSuccess", [i]) as string;
      } else {
        clearInterval(cls);
        this.showMsg = false;
        this.$router.push("/");
      }
    }, 1e3);
  }
}
</script>
