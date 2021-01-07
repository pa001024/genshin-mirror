<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      语言
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
export default class IndexPage extends Vue {
  get availableLocales() {
    return this.$i18n.locales?.filter((v: any) => v.name);
  }

  changeLang(code: string) {
    // eslint-disable-next-line no-console
    console.log("set locale to", code);
    this.$i18n.setLocale(code);
  }
}
</script>
