<template>
  <div class="mx-auto">
    <nuxt-link to="/doc/artifact">文档</nuxt-link>
    <v-list>
      <v-list-item v-for="item in list" :key="item.id">
        <v-list-item-title>{{ item.localeName }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";
import { IArtifact, IArtifactType } from "~/modules/core";

@Component<Page>({
  // server
  async asyncData({ $content, app }) {
    const rst: Partial<Page> = { list: null };
    const res = (await $content(app.i18n.locale, "relic")
      .only(["id", "name", "localeName", "region", "element", "gender", "rarity", "weapon"])
      .sortBy("region", "asc")
      .fetch()
      .catch()) as any;
    rst.list = res;
    return rst;
  },
  // set html header
  head() {
    // Set Meta Tags for this Page
    const title = this.$t("title.sub", [this.$t("title.artifact")]) as string;
    return { title };
  },
})
export default class Page extends Vue {
  @Getter("app/artifactHash") artifactHash!: IArtifact[];
  @Getter("app/artifacts") artifacts!: IArtifact[];
  @Action("app/loadArtifacts") loadArtifacts!: () => void;

  list: IArtifactType[] | null = null;

  mounted() {
    this.loadArtifacts();
  }
}
</script>
