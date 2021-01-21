<template>
  <v-container class="item">
    <!-- 筛选 -->
    <v-card class="item-filter mb-3">
      <v-card-text>
        <v-combobox v-model="filterOptions" :items="filters" :label="$t('ui.filter')" multiple chips clearable :item-value="d => d.prop + '=' + d.value">
          <template v-slot:selection="{ attrs, item, parent, selected }">
            <v-chip v-bind="attrs" :color="`${item.color} lighten-3`" :input-value="selected" label small>
              <span class="pr-2" v-text="item.text" />
              <v-icon small @click="parent.selectItem(item)">mdi-close</v-icon>
            </v-chip>
          </template>
        </v-combobox>
      </v-card-text>
    </v-card>
    <!-- 数据 -->
    <v-card class="mx-auto">
      <v-list>
        <template v-for="(item, index) in items">
          <!-- 分割线 -->
          <v-divider v-if="index > 0 && item.subtitle" :key="index"></v-divider>
          <!-- 分类标题 -->
          <v-subheader v-if="item.subtitle" :key="item.subtitle">
            {{ item.subtitle }}
          </v-subheader>
          <!-- 内容 -->
          <v-list-item v-if="item.id" :key="item.id">
            <v-list-item-action>
              <v-list-item-title>
                <v-avatar color="grey" />
              </v-list-item-title>
              <v-list-item-subtitle align="center">
                <Rarity :star="item.rarity" fixed />
              </v-list-item-subtitle>
            </v-list-item-action>

            <nuxt-link :to="'item/' + item.id" class="nolink">
              <v-list-item-content>
                <v-list-item-title v-text="item.localeName" />
                <v-list-item-subtitle v-if="$i18n.locale !== 'en'" v-text="item.name" />
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
import { Dictionary, groupBy, map } from "lodash";
import { IItem } from "~/modules/core";

interface FilterOption {
  text: string;
  prop: keyof IItem;
  value: any;
}

type Subtitle<T> = T & { subtitle?: string };

@Component<Page>({
  // server
  async asyncData({ $content, app }) {
    const rst: Partial<Page> = { data: null };
    const res = (await $content(app.i18n.locale, "item")
      .only(["id", "name", "localeName", "type", "rarity"])
      .sortBy("type", "asc")
      .sortBy("rarity", "asc")
      .fetch()
      .catch(console.error)) as any;
    rst.data = res;

    return rst;
  },
  // set html header
  head() {
    // Set Meta Tags for this Page
    const title = this.$t("title.sub", [this.$t("title.item")]) as string;
    return { title };
  },
})
export default class Page extends Vue {
  data: IItem[] | null = null;

  filterOptions: FilterOption[] = [];

  get types(): FilterOption[] {
    return [...new Set(this.data?.map(v => v.type) || [])].map(v => ({ text: this.$t("item." + v) as string, prop: "type", value: v }));
  }

  get rarities(): FilterOption[] {
    return [5, 4, 3, 2, 1].map(v => ({ text: "★".repeat(v), prop: "rarity", value: v }));
  }

  get filters() {
    return [
      //
      { header: this.$t("ui.itemType") },
      ...this.types,
      { divider: true },
      { header: this.$t("ui.rarity") },
      ...this.rarities,
    ];
  }

  get items() {
    if (!this.data) return [];
    const items = this.data.filter(v => !this.filterOptions.some(filter => v[filter.prop] !== filter.value));
    const groups = map<Dictionary<IItem[]>, Subtitle<IItem>[]>(groupBy(items, "type"), (g: Subtitle<IItem>[]) => {
      const item = g[0];
      g[0] = { ...item, subtitle: (this.$t(`item.${item.type}`) as string) + ` (${g.length})` };
      return g;
    });
    const rst = ([] as Subtitle<IItem>[]).concat(...groups);
    return rst;
  }
}
</script>

<style lang="less" scoped>
.nolink {
  color: unset;
  text-decoration: none;
}
</style>
