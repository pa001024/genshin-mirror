<template>
  <div v-if="data" class="gsm-enemy">
    <v-card>
      <v-card-title v-text="localeName" />
      <v-card-subtitle v-if="$i18n.locale !== 'en'" v-text="$t(data.name, 'en')" />
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="6" sm="4" md="2">
              <v-card class="info-block">
                <v-card-title class="info-title">{{ $t("ui.enemyType") }}</v-card-title>
                <v-card-text class="info-content">{{ $t(`enemy.${data.type}`) }}</v-card-text>
              </v-card>
            </v-col>
            <v-col cols="6" sm="4" md="2">
              <v-card class="info-block">
                <v-card-title class="info-title">{{ $t("rarity.title") }}</v-card-title>
                <v-card-text class="info-content"><Rarity :star="data.rarity" /></v-card-text>
              </v-card>
            </v-col>
            <v-col cols="6" sm="4" md="2">
              <v-card class="info-block">
                <v-card-title class="info-title">{{ $t("buff.48") }}</v-card-title>
                <v-card-text class="info-content">{{ data.baseATK }}</v-card-text>
              </v-card>
            </v-col>
            <v-col cols="6" sm="4" md="2">
              <v-card class="info-block">
                <v-card-title class="info-title">{{ $t("ui.subAttr") }}</v-card-title>
                <v-card-text v-if="data.subAttr" class="info-content">{{ $t(`buff.${data.subAttr.type}`) }}</v-card-text>
                <v-card-text v-else class="info-content">{{ $t(`buff.0`) }}</v-card-text>
              </v-card>
            </v-col>
            <v-col v-if="data.affix" cols="6" sm="4" md="2">
              <v-card class="info-block">
                <v-card-title class="info-title">{{ $t("ascension.title") }}</v-card-title>
                <v-card-text class="info-content">{{ l10n(data.affix.name) }}</v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card v-if="page" class="mt-3">
        <v-card-text>
          <nuxt-content :document="page" />
        </v-card-text>
      </v-card>
    </v-card>
  </div>
  <div v-else class="error">找不到此武器</div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Ienemy } from "~/modules/core";

@Component<Page>({
  // server
  async asyncData({ params: { id }, $content, app }) {
    const rst: Partial<Page> = { id, data: null, page: null };
    if (id.includes("../")) return { id };
    const res = (await $content("common/enemy", id).fetch().catch(console.error)) as any;
    rst.data = res;

    if (rst.data) {
      rst.page = await $content(app.i18n.locale, id)
        .fetch()
        .catch(() => {});
    }
    return rst;
  },
  // set html header
  head() {
    // Set Meta Tags for this Page
    const title = this.$t("title.sub", [this.$t(`${this.id}`)]) as string;
    return { title };
  },
})
export default class Page extends Vue {
  id: string = "";
  data: Ienemy | null = null;
  page: any = null;

  get localeName() {
    return this.$te(`${this.id}`) ? this.$t(`${this.id}`) : this.id;
  }

  l10n(str: string) {
    const id = str.replace(/\W+/g, "");
    return this.$te(`${id}`) ? this.$t(`${id}`) : str;
  }
}
</script>
