<template>
  <v-responsive max-width="420" class="mx-auto">
    <v-card class="pa-4">
      <v-card-title class="headline">
        {{ $t("ui.userLogin") }}
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <!-- email -->
          <v-text-field v-model="email" :rules="emailRules" :label="$t('ui.eMail')" required></v-text-field>
          <!-- password -->
          <v-text-field v-model="password" type="password" :rules="passwordRules" :label="$t('ui.password')" required></v-text-field>
          <div class="d-flex mb-3">
            <v-spacer />
            <v-btn text>{{ $t("forgotPassword") }}</v-btn>
          </div>
          <v-btn :disabled="!valid" color="primary" block @click="postLogin">{{ $t("ui.login") }}</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-responsive>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Mutation } from "vuex-class";
import sha256 from "crypto-js/sha256";

const Cookie = process.client ? require("js-cookie") : undefined;

@Component({})
export default class Login extends Vue {
  @Mutation("user/setAuth") setAuth!: (s: string) => void;

  email!: string;
  password!: string;
  valid = null;

  get emailRules() {
    return [(v: string) => !!v || this.$t("ui.eMailIsRequired"), (v: string) => /.+@.+\..+/.test(v) || this.$t("ui.eMailMustBeValid")];
  }

  get passwordRules() {
    return [(v: string) => !!v || this.$t("passwordIsRequired")];
  }

  async postLogin() {
    if (!this.email || !this.password) return;
    const res = await this.$axios.post("/user/login", {
      email: this.email,
      hash: sha256(this.password),
    });
    const token = res.data.token;
    this.setAuth(token);
    Cookie.set("Authorization", token); // saving token in cookie for server rendering
    this.$router.push("/");
  }
}
</script>
