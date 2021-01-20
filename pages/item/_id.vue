<template>
  <div v-if="data" class="gsm-enemy">
    <v-card>
      <v-card-title v-text="data.localeName" />
      <v-card-subtitle v-if="$i18n.locale !== 'en'" class="text-right" v-text="data.name" />
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
                <v-card-title class="info-title">{{ $t("buff.1") }}</v-card-title>
                <v-card-text class="info-content">{{ data.baseHP }}</v-card-text>
              </v-card>
            </v-col>
            <v-col cols="6" sm="4" md="2">
              <v-card class="info-block">
                <v-card-title class="info-title">{{ $t("buff.2") }}</v-card-title>
                <v-card-text class="info-content">{{ data.baseATK }}</v-card-text>
              </v-card>
            </v-col>
            <v-col cols="6" sm="4" md="2">
              <v-card class="info-block">
                <v-card-title class="info-title">{{ $t("buff.3") }}</v-card-title>
                <v-card-text class="info-content">{{ data.baseDEF }}</v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <v-divider />
          <v-list v-if="data.resist" class="transparent">
            <v-list-item-title v-for="(item, index) in data.resist" :key="index">
              <v-list-item-title>{{ $t("buff." + (20 + index * 2)) }}</v-list-item-title>

              <v-list-item-icon>
                <element-icon :element="indexToIcon(index)" />
              </v-list-item-icon>

              <v-list-item-subtitle class="text-right">
                {{ percent(item) }}
              </v-list-item-subtitle>
            </v-list-item-title>
          </v-list>
          <v-row v-if="data.resist">
            <v-col cols="6" sm="4" md="2">
              <v-card class="info-block">
                <v-card-title class="info-title">{{ $t("buff.20") }}</v-card-title>
                <v-card-text class="info-content">{{ percent(data.resist[0]) }}</v-card-text>
              </v-card>
            </v-col>
            <v-col cols="6" sm="4" md="2">
              <v-card class="info-block">
                <v-card-title class="info-title">{{ $t("buff.22") }}</v-card-title>
                <v-card-text class="info-content">{{ percent(data.resist[1]) }}</v-card-text>
              </v-card>
            </v-col>
            <v-col cols="6" sm="4" md="2">
              <v-card class="info-block">
                <v-card-title class="info-title">{{ $t("buff.24") }}</v-card-title>
                <v-card-text class="info-content">{{ percent(data.resist[2]) }}</v-card-text>
              </v-card>
            </v-col>
            <v-col cols="6" sm="4" md="2">
              <v-card class="info-block">
                <v-card-title class="info-title">{{ $t("buff.26") }}</v-card-title>
                <v-card-text class="info-content">{{ percent(data.resist[3]) }}</v-card-text>
              </v-card>
            </v-col>
            <v-col cols="6" sm="4" md="2">
              <v-card class="info-block">
                <v-card-title class="info-title">{{ $t("buff.28") }}</v-card-title>
                <v-card-text class="info-content">{{ percent(data.resist[4]) }}</v-card-text>
              </v-card>
            </v-col>
            <v-col cols="6" sm="4" md="2">
              <v-card class="info-block">
                <v-card-title class="info-title">{{ $t("buff.30") }}</v-card-title>
                <v-card-text class="info-content">{{ percent(data.resist[5]) }}</v-card-text>
              </v-card>
            </v-col>
            <v-col cols="6" sm="4" md="2">
              <v-card class="info-block">
                <v-card-title class="info-title">{{ $t("buff.32") }}</v-card-title>
                <v-card-text class="info-content">{{ percent(data.resist[6]) }}</v-card-text>
              </v-card>
            </v-col>
            <v-col cols="6" sm="4" md="2">
              <v-card class="info-block">
                <v-card-title class="info-title">{{ $t("buff.34") }}</v-card-title>
                <v-card-text class="info-content">{{ percent(data.resist[7]) }}</v-card-text>
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
  <div v-else class="error">{{ $t("ui.item404") }}</div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { IEnemy } from "~/modules/core";

@Component<Page>({
  // server
  async asyncData({ params: { id }, $content, app }) {
    const rst: Partial<Page> = { id, data: null };
    if (id.includes("../")) return { id };
    const res = (await $content(app.i18n.locale, "item").fetch().catch(console.error)) as any;
    rst.data = res.find((v: any) => v.id === id);

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
  data: IEnemy | null = null;

  l10n(str: string) {
    const id = str.replace(/\W+/g, "");
    return this.$te(`${id}`) ? this.$t(`${id}`) : str;
  }

  percent(num: number) {
    return num * 100 + "%";
  }
}
</script>
