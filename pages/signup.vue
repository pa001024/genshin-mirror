<template>
  <v-responsive max-width="420" class="mx-auto">
    <v-card class="pa-4">
      <v-card-title class="headline">
        {{ $t("ui.userRegister") }}
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <!-- email -->
          <v-text-field v-model="email" name="email" :rules="emailRules" :label="$t('ui.eMail')" required autocomplete="username" />
          <!-- username -->
          <v-text-field v-model="username" name="username" :rules="usernameRules" :label="$t('ui.username')" required autocomplete="nick" />
          <!-- password -->
          <v-text-field v-model="password" name="password" type="password" :rules="passwordRules" :label="$t('ui.password')" required autocomplete="password" />
          <!-- confirmPassword -->
          <v-text-field
            v-model="confirmPassword"
            name="confirmPassword"
            type="password"
            :rules="confirmPasswordRules"
            :label="$t('ui.confirmPassword')"
            required
            autocomplete="password"
          />
          <v-checkbox v-model="agreeTOS" :label="$t('ui.agreeTOS')" />
          <v-btn :disabled="!valid || !agreeTOS" color="primary" block :loading="loading" @click="postSignUp">{{ $t("ui.signup") }}</v-btn>
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
import { SignupDocument, SignupMutation, SignupMutationVariables } from "~/api/generated/graphql";

@Component({
  head() {
    const title = this.$t("title.sub", [this.$t("ui.userRegister")]) as string;
    return { title };
  },
})
export default class Signup extends Vue {
  @Action("app/setAuth") setAuth!: (auth: string) => void;

  signupMutation(variables: SignupMutationVariables) {
    return this.$apollo.mutate<SignupMutation>({ mutation: SignupDocument, variables });
  }

  email: string = "";
  username: string = "";
  password: string = "";
  confirmPassword: string = "";
  valid = null;
  loading = false;
  showMsg = false;
  msg = "";
  agreeTOS = false;

  get emailRules() {
    return [(v: string) => !!v || this.$t("ui.eMailIsRequired"), (v: string) => /.+@.+\..+/.test(v) || this.$t("ui.eMailMustBeValid")];
  }

  get usernameRules() {
    return [(v: string) => !!v || this.$t("ui.usernameIsRequired"), (v: string) => v.length >= 3 || this.$t("ui.usernameShort")];
  }

  get passwordRules() {
    return [
      //
      (v: string) => !!v || this.$t("ui.passwordIsRequired"),
      (v: string) => v.length >= 6 || this.$t("ui.passwordShort"),
      (v: string) => /(?=.*[A-Za-z])(?=.*[0-9])/.test(v) || this.$t("ui.passwordEasy"),
    ];
  }

  get confirmPasswordRules() {
    return [(v: string) => v === this.password || this.$t("ui.passwordNotMatch")];
  }

  async postSignUp() {
    this.email = this.email.trim();
    this.username = this.username.trim();
    if (!this.email || !this.password) return;
    this.loading = true;
    try {
      const res = await this.signupMutation({
        data: {
          email: this.email,
          username: this.username,
          password: sha256(this.password).toString(),
        },
      });
      const auth = res.data!.signup.token!;
      this.setAuth(auth);
      this.showMsg = true;
      this.msg = this.$t("ui.signupSuccess", [4]) as string;
      let i = 4;
      const cls = setInterval(() => {
        if (--i) {
          this.msg = this.$t("ui.signupSuccess", [i]) as string;
        } else {
          clearInterval(cls);
          this.showMsg = false;
          this.$router.push("/");
        }
      }, 1e3);
    } catch (e) {
      this.showMsg = false;
      this.showMsg = true;
      this.msg = this.$t("ui.signupFailed", [e.message.replace("GraphQL error: ", "")]) as string;
      return;
    } finally {
      this.loading = false;
    }
  }
}
</script>
