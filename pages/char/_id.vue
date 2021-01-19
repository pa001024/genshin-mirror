<template>
  <div v-if="data" class="gsm-avatar">
    <v-card>
      <v-card-title>
        <CharImage :id="data.id" :element="data.element" avatar :size="56" />
        {{ data.localeName }}
        <v-card-subtitle v-if="$i18n.locale !== 'en'" v-text="data.id" />
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="6" sm="4" md="2">
              <v-card class="info-block">
                <v-card-title class="info-title">{{ $t("region.title") }}</v-card-title>
                <v-card-text class="info-content">{{ $t(`region.${data.region}`) }}</v-card-text>
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
                <v-card-title class="info-title">{{ $t("element.title") }}</v-card-title>
                <v-card-text class="info-content">{{ $t(`element.${data.element}`) }}</v-card-text>
              </v-card>
            </v-col>
            <v-col cols="6" sm="4" md="2">
              <v-card class="info-block">
                <v-card-title class="info-title">{{ $t("weapon.title") }}</v-card-title>
                <v-card-text class="info-content">{{ $t(`weapon.${data.weapon}`) }}</v-card-text>
              </v-card>
            </v-col>
            <v-col cols="6" sm="4" md="2">
              <v-card class="info-block">
                <v-card-title class="info-title">{{ $t("ascension.title") }}</v-card-title>
                <v-card-text class="info-content">{{ $t(`buff.${data.ascensionType}`) }}</v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6" sm="4" md="2">
              <v-card class="info-block">
                <v-card-title class="info-title" v-text="$t('buff.1')" />
                <v-card-text class="info-content" v-text="data.baseHP" />
              </v-card>
            </v-col>
            <v-col cols="6" sm="4" md="2">
              <v-card class="info-block">
                <v-card-title class="info-title" v-text="$t('buff.2')" />
                <v-card-text class="info-content" v-text="data.baseATK" />
              </v-card>
            </v-col>
            <v-col cols="6" sm="4" md="2">
              <v-card class="info-block">
                <v-card-title class="info-title" v-text="$t('buff.3')" />
                <v-card-text class="info-content" v-text="data.baseDEF" />
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </div>
  <div v-else class="error">找不到此角色</div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { IAvatar } from "~/modules/core";

@Component<Page>({
  // server
  async asyncData({ params: { id }, $content, app }) {
    const rst: Partial<Page> = { id, data: null };
    if (id.includes("../")) return { id };
    const res = (await $content(app.i18n.locale, "char", id).fetch().catch(console.error)) as any;
    console.log(res);
    rst.data = res;
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
  data: IAvatar | null = null;
}
</script>
