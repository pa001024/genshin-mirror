<template>
  <v-container class="weapon">
    <v-row justify="center" align="center" class="mb-12">
      <v-col cols="12">
        <nuxt-link to="/login" class="nolink">
          <v-btn block>{{ $t("ui.login") }}</v-btn>
        </nuxt-link>
      </v-col>
      <v-col cols="12">
        <nuxt-link to="/signup" class="nolink">
          <v-btn block>{{ $t("ui.signup") }}</v-btn>
        </nuxt-link>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="headline"> 施工中... </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn block plain @click="show = !show">
              展开看废话
              <v-icon>{{ show ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
            </v-btn>
          </v-card-actions>
          <v-expand-transition>
            <div v-show="show">
              <v-divider></v-divider>
              <v-card-text>
                <nuxt-content :document="page" />
              </v-card-text>
            </div>
          </v-expand-transition>
        </v-card>
      </v-col>
    </v-row>
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
  head() {
    const title = this.$t("title.main") as string;
    return { title };
  },
})
export default class Page extends Vue {
  page: any = null;
  show = false;
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
