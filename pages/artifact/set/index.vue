<template>
  <v-container class="artifact-set-index">
    <!-- 数据 -->
    <v-card class="mx-auto">
      <v-list>
        <template v-for="item in items">
          <!-- 内容 -->
          <v-list-item v-if="item.id" :key="item.id">
            <nuxt-link :to="'/artifact/set/' + item.id" class="nolink">
              <div class="artifact-image mr-4">
                <v-list-item-title>
                  <v-img :src="`/img/relic/${item.name}.png`" height="70" width="70" />
                </v-list-item-title>
              </div>
            </nuxt-link>

            <nuxt-link :to="'/artifact/set/' + item.id" class="nolink">
              <v-list-item-content>
                <v-list-item-title v-text="item.localeName" />
                <v-list-item-subtitle>
                  <div v-for="(lvl, i) in item.levels" :key="i" cols="12" class="py-1">{{ $t("ui.setDesc", [lvl.need]) }}: {{ lvl.desc }}</div>
                </v-list-item-subtitle>
              </v-list-item-content>
            </nuxt-link>
          </v-list-item>
        </template>
      </v-list>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { IArtifactSet } from "~/modules/core";

@Component<Page>({
  // server
  async asyncData({ $content, app }) {
    const rst: Partial<Page> = { sets: [] };
    const sets = (await $content(app.i18n.locale, "relicset").fetch().catch(console.error)) as any;
    if (Array.isArray(sets)) rst.sets = sets;
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
  sets: IArtifactSet[] = [];

  get items() {
    return this.sets;
  }
}
</script>
