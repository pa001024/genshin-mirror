<template>
  <div class="mx-auto">
    <v-row class="ma-2">
      <nuxt-link to="/inv">inventory</nuxt-link>
    </v-row>
    <v-row class="ma-2">
      <nuxt-link to="/artifact/0KwsDKB0J43NA1gC2l">test</nuxt-link>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";
import { IArtifact, IArtifactType } from "~/modules/core";

@Component<Page>({
  // server
  // async asyncData({ $content, app }) {
  //   const rst: Partial<Page> = { types: null, sets: null };
  //   const types = (await $content(app.i18n.locale, "relic").fetch().catch(console.error)) as any;
  //   const sets = (await $content(app.i18n.locale, "relicset").fetch().catch(console.error)) as any;
  //   rst.types = types;
  //   rst.sets = sets;
  //   return rst;
  // },
  // set html header
  head() {
    // Set Meta Tags for this Page
    const title = this.$t("title.sub", [this.$t("title.artifact")]) as string;
    return { title };
  },
})
export default class Page extends Vue {
  @Getter("app/artifacts") artifacts!: IArtifact[];
  @Getter("app/artifactTypes") types!: IArtifactType[];
  @Action("app/loadArtifacts") loadArtifacts!: () => void;
  overlay = false;

  filteredTypes(r: number) {
    return this.types?.filter(v => v.rarity === r);
  }

  mounted() {}
}
</script>
