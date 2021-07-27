<template>
  <v-container class="item">
    <!-- 筛选 -->
    <v-card class="item-filter mb-3">
      <v-card-text>
        <v-combobox v-model="filterOptions" :items="filters" :label="$t('ui.filter')" multiple chips clearable :item-value="d => d.prop + '=' + d.value">
          <template #selection="{ attrs, item, parent, selected }">
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
        <v-virtual-scroll :bench="2" :items="items" :height="height" item-height="88">
          <template #default="{ item, index }">
            <!-- 分割线 -->
            <div v-if="item.subtitle" :key="index" class="mt-4">
              <v-divider v-if="index > 0"></v-divider>
              <!-- 分类标题 -->
              <v-subheader>
                {{ item.subtitle }}
              </v-subheader>
            </div>
            <!-- 内容 -->
            <v-list-item v-else :key="item.id">
              <div class="item-linehead mr-2">
                <v-list-item-title align="center">
                  <ItemImage :id="item.id" :size="48" />
                </v-list-item-title>
                <v-list-item-subtitle align="center">
                  <Rarity :value="item.rarity" fixed />
                </v-list-item-subtitle>
              </div>

              <nuxt-link :to="'item/' + item.id" class="nolink">
                <v-list-item-content>
                  <v-list-item-title v-text="item.localeName" />
                  <v-list-item-subtitle v-if="$i18n.locale !== 'en'" v-text="item.name" />
                </v-list-item-content>
              </nuxt-link>
            </v-list-item>
          </template>
        </v-virtual-scroll>
      </v-list>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Dictionary, groupBy, map } from "lodash";
import ResizeObserver from "resize-observer-polyfill";
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
      g.unshift({ subtitle: (this.$t(`item.${item.type}`) as string) + ` (${g.length})` } as any);
      return g;
    });
    const rst = ([] as Subtitle<IItem>[]).concat(...groups);
    return rst;
  }

  height = process.client ? document.body.clientHeight - 270 : 800;
  ob?: ResizeObserver;
  mounted() {
    this.ob = new ResizeObserver((els: ResizeObserverEntry[]) => {
      for (const el of els) {
        this.height = el.contentRect.height - 270;
      }
    });
    this.ob.observe(document.body);
  }

  destroyed() {
    this.ob?.disconnect();
  }
}
</script>

<style lang="less">
.item-linehead {
  text-align: center;
  width: 80px;
  flex: none;
}
</style>
