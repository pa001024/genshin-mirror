<template>
  <v-container v-if="data" class="gsm-item">
    <v-card max-width="560" class="mx-auto">
      <v-card-title>
        <v-list-item two-line>
          <v-list-item-action>
            <ItemImage :id="id" :size="48" />
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="headline"> {{ data.localeName }}</v-list-item-title>
            <v-list-item-subtitle v-text="data.name" />
          </v-list-item-content>
        </v-list-item>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="6">
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-subtitle v-text="$t('ui.itemType')" />
                <v-list-item-title class="headline" v-text="data.typeText" />
              </v-list-item-content>
            </v-list-item>
          </v-col>
        </v-row>
        <v-divider class="mb-2 mt-2" />
        <v-card-text v-text="data.desc" />
        <v-card-text v-if="data.drop" class="mb-4">
          <div class="desc mb-4"><v-icon size="16">mdi-map-marker</v-icon> {{ $t("ui.source") }}</div>
          <div v-for="drop in data.drop" :key="drop" class="drop-info">
            {{ drop }}
          </div>
        </v-card-text>
      </v-card-text>
    </v-card>
  </v-container>
  <div v-else class="error">{{ $t("ui.item404") }}</div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { IItem } from "~/modules/core";

@Component<Page>({
  // server
  async asyncData({ params: { id }, $content, app }) {
    const rst: Partial<Page> = { id, data: null };
    if (id.includes("../")) return { id };
    const res = (await $content(app.i18n.locale, "item").where({ id }).fetch().catch(console.error)) as any;
    rst.data = res && res[0];

    return rst;
  },
  // set html header
  head() {
    // Set Meta Tags for this Page
    const title = this.$t("title.sub", [this.data?.localeName]) as string;
    return { title };
  },
})
export default class Page extends Vue {
  id: string = "";
  data: IItem | null = null;
}
</script>
<style lang="less">
.gsm-item {
  .drop-info {
    border: 1px solid;
    padding: 12px 8px;
  }
}
</style>
