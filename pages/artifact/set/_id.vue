<template>
  <div v-if="setInfo">
    <v-card max-width="560" class="mx-auto gsm-artifact-card">
      <v-card-title class="headline">
        {{ setInfo.localeName }}
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col v-for="(lvl, i) in setInfo.levels" :key="i" cols="12" class="py-1">{{ $t("ui.setDesc", [lvl.need]) }}: {{ lvl.desc }}</v-col>
        </v-row>
      </v-card-text>
      <v-divider class="my-2" />
      <div class="relic-set-parts">
        <!-- 分割线 -->
        <div v-for="(groupItems, group) in items" :key="group" class="my-2">
          <v-divider v-if="group > 0" />
          <!-- 分类标题 -->
          <v-subheader>
            {{ $t(`artifactPart.${group}`) }}
          </v-subheader>
          <!-- 内容 -->
          <div class="relic-group-items mx-2">
            <ArtifactCard v-for="item in groupItems" :key="item.id" :type="item" class="ma-1" />
          </div>
        </div>
      </div>
    </v-card>
  </div>
  <div v-else class="error">{{ $t("ui.item404") }}</div>
</template>

<script lang="ts">
import { groupBy } from "lodash";
import { Vue, Component } from "vue-property-decorator";
import { IArtifactSet, IArtifactType } from "~/modules/core";

type Subtitle<T> = T & { subtitle?: string };

@Component<Page>({
  // server
  async asyncData({ params: { id }, $content, app }) {
    const rst: Partial<Page> = { id, artifacts: null, setInfo: null };

    const sets = await $content(app.i18n.locale, "relicset")
      .where({ id: +id })
      .fetch<IArtifactSet>()
      .catch(console.error);
    if (Array.isArray(sets)) {
      rst.setInfo = sets[0];
      const res = await $content(app.i18n.locale, "relic").where({ setId: rst.setInfo.id }).sortBy("type", "asc").fetch<IArtifactType>().catch(console.error);
      if (Array.isArray(res)) {
        rst.artifacts = res;
      }
    }

    return rst;
  },
  // set html header
  head() {
    // Set Meta Tags for this Page
    const title = this.$t("title.sub", [this.setInfo?.localeName]) as string;
    return { title };
  },
})
export default class Page extends Vue {
  id!: string;
  artifacts!: IArtifactType[] | null;
  setInfo!: IArtifactSet | null;

  get items() {
    if (!this.artifacts) return [];
    const items = this.artifacts;
    const groups = groupBy(items, "type");
    return groups;
  }
}
</script>

<style lang="less">
.gsm-artifact-card {
  .set-info-title {
    color: #5db257;
  }
  .relic-sub-props {
    color: var(--black);
    line-height: 2;
    li {
      position: relative;
      .powerup-info {
        position: absolute;
        color: var(--text-grey);
        right: 1rem;
      }
    }
    .tier-label {
      width: 36px;
      padding: 0;
      justify-content: center;
    }
  }
}
</style>
