<template>
  <v-container class="weapon">
    <v-row>
      <v-col cols="12">
        <nuxt-content :document="page" />
      </v-col>
    </v-row>
    <!-- <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <nuxt-link to="/login" class="nolink">
          <v-btn block>{{ $t("ui.login") }}</v-btn>
        </nuxt-link>
      </v-col>
    </v-row> -->
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({
  // server
  async asyncData({ $content }) {
    const rst: Partial<Page> = { page: null };
    rst.page = await $content("todo").fetch().catch(console.error);
    return rst;
  },
})
export default class Page extends Vue {
  page: any = null;
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

<style lang="less" scoped>
.nolink {
  color: unset;
  text-decoration: none;
}
</style>
