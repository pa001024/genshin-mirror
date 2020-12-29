<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card> nothing </v-card>
      <nuxt-link to="/char/name">name</nuxt-link>

      <div class="test">
        {{ $t("title.char") }}
      </div>
      <div class="switch-lang">
        <v-btn v-for="locale in availableLocales" :key="locale.code" :disabled="$i18n.locale === locale.code" @click="changeLang(locale.code)">{{
          locale.name
        }}</v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({})
export default class extends Vue {
  get availableLocales() {
    return this.$i18n.locales?.filter((v: any) => v.name);
  }

  changeLang(code: string) {
    console.log("set locale to", code);
    this.$i18n.setLocale(code);
    this.$i18n.setLocaleCookie(code);
  }
}
</script>
