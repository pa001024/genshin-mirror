<template>
  <div v-if="data" class="gsm-Character">
    <v-card>
      <v-parallax src="/img/Diluc_Card.jpg" height="360" />
      <v-card-title>{{ localeName }}</v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="3">
              <v-card class="info-block">
                <v-card-title class="info-title">{{ $t("region.title") }}</v-card-title>
                <v-card-text class="info-content">{{ $t(`region.${data.region}`) }}</v-card-text>
              </v-card>
            </v-col>
            <v-col cols="3">
              <v-card class="info-block">
                <v-card-title class="info-title">{{ $t("gender.title") }}</v-card-title>
                <v-card-text class="info-content">{{ $t(`gender.${data.gender}`) }}</v-card-text>
              </v-card>
            </v-col>
            <!-- <v-col cols="3">
              <v-card class="info-block">
                <v-card-title class="info-title">{{ $t("rarity.title") }}</v-card-title>
                <v-card-text class="info-content">{{ data.rarity }}</v-card-text>
              </v-card>
            </v-col> -->
            <v-col cols="3">
              <v-card class="info-block">
                <v-card-title class="info-title">{{ $t("element.title") }}</v-card-title>
                <v-card-text class="info-content">{{ $t(`element.${data.element}`) }}</v-card-text>
              </v-card>
            </v-col>
            <v-col cols="3">
              <v-card class="info-block">
                <v-card-title class="info-title">{{ $t("weapon.title") }}</v-card-title>
                <v-card-text class="info-content">{{ $t(`weapon.${data.weapon}`) }}</v-card-text>
              </v-card>
            </v-col>
            <v-col cols="3">
              <v-card class="info-block">
                <v-card-title class="info-title">{{ $t("ascension.title") }}</v-card-title>
                <v-card-text class="info-content">{{ $t(`buff.${data.ascensionType}`) }}</v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card>
        <v-card-text>
          <nuxt-content :document="page" />
        </v-card-text>
      </v-card>
    </v-card>
  </div>
  <div v-else class="error">找不到此角色</div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { ICharacter } from "~/modules/core";

@Component<Char>({
  components: {},
  // server
  async asyncData({ params: { id }, $content, app }) {
    const rst: Partial<Char> = { id, data: null, page: null };
    if (id.includes("../")) return { id };
    try {
      const res = (await $content("data/char/" + id).fetch()) as any;
      rst.data = res;
    } catch (e) {
      // console.error("[SSR] render Char error", e);
    }
    if (rst.data) {
      rst.page = await $content(app.i18n.locale + "/" + id).fetch();
    }
    return rst;
  },
  // set html header
  head() {
    // Set Meta Tags for this Page
    const title = this.$t("title.sub", [this.$t(`char.${this.id}`)]) as string;
    return { title };
  },
})
export default class Char extends Vue {
  id: string = "";
  data: ICharacter | null = null;
  page: any = null;

  get localeName() {
    return this.$te(`char.${this.id}`) ? this.$t(`char.${this.id}`) : this.id;
  }
}
</script>
