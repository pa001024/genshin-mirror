<template>
  <div class="gsm-build"></div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import type { IArtifactSet, IArtifactType, IUserAvatar } from "~/modules/core";

@Component<Page>({
  // server
  async asyncData({ params: { id }, $content, app }) {
    const rst: Partial<Page> = { id, artifactTypes: [], artifactSets: [], title: "", avatars: [] };
    // 构筑信息
    const res = await app.$axios.get("/api/build").catch(console.error);
    if (res) {
      rst.title = res.data.title;
      rst.avatars = res.data.avatars;
    }
    const relic = await $content(app.i18n.locale, "relic").fetch<IArtifactType>().catch(console.error);
    if (Array.isArray(relic)) {
      rst.artifactTypes = relic;
    }
    const relicset = await $content(app.i18n.locale, "relicset").fetch<IArtifactSet>().catch(console.error);
    if (Array.isArray(relicset)) {
      rst.artifactSets = relicset;
    }
    return rst;
  },
  // set html header
  head() {
    // Set Meta Tags for this Page
    const title = this.$t("title.sub", [this.title || this.$t("ui.untitledBuild")]) as string;
    return { title };
  },
})
export default class Page extends Vue {
  id: string = "";
  title: string = "";
  artifactTypes: IArtifactType[] = [];
  artifactSets: IArtifactSet[] = [];
  avatars: IUserAvatar[] = [];
}
</script>
