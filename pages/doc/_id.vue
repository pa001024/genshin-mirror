<template>
  <div v-if="page" class="gsm-doc">
    <nuxt-content :document="page" />
  </div>
  <div v-else class="error">找不到此文档</div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component<Page>({
  // server
  async asyncData({ params: { id }, $content, app }) {
    const rst: Partial<Page> = { id, page: null };
    if (id.includes("../")) return { id };
    rst.page = await $content(app.i18n.locale + "/" + id).fetch();

    return rst;
  },
  // set html header
  head() {
    // Set Meta Tags for this Page
    const title = this.$t("title.sub", [this.$t(`char.${this.id}`)]) as string;
    return { title };
  },
})
export default class Page extends Vue {
  id: string = "";
  page: any = null;

  get localeName() {
    return this.$te(`char.${this.id}`) ? this.$t(`char.${this.id}`) : this.id;
  }
}
</script>
