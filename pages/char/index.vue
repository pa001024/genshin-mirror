<template>
  <v-container>
    <!-- 筛选 -->
    <v-card class="char-filter mb-3">
      <v-card-text>
        <v-combobox v-model="filterOptions" :items="filters" :label="$t('ui.filter')" multiple chips clearable :item-value="d => d.prop + '=' + d.value">
          <template v-slot:selection="{ attrs, item, parent, selected }">
            <v-chip v-bind="attrs" :color="`${item.color} lighten-3`" :input-value="selected" label small>
              <span class="pr-2">
                {{ item.text }}
              </span>
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
          <nuxt-link :key="item.name" :to="'char/' + item.name" class="nolink">
            <v-list-item v-if="item.name">
              <v-list-item-action>
                <v-avatar><CharImage :name="item.name" /></v-avatar>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title>
                  {{ $t(`${item.name}`) }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </nuxt-link>
        </template>
      </v-list>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { ICharacter } from "~/modules/core";

interface FilterOption {
  text: string;
  prop: keyof ICharacter;
  value: any;
}

@Component<Page>({
  // server
  async asyncData({ $content, app }) {
    const rst: Partial<Page> = { data: null, page: null };
    const res = (await $content("common/char")
      .only(["name", "region", "element", "gender", "rarity", "weapon"])
      .sortBy("region", "asc")
      .fetch()
      .catch()) as any;
    rst.data = res;
    if (rst.data) {
      rst.page = await $content(app.i18n.locale, "char").fetch().catch(console.error);
    }
    return rst;
  },
  // set html header
  head() {
    // Set Meta Tags for this Page
    const title = this.$t("title.char") as string;
    return { title };
  },
})
export default class Page extends Vue {
  data: ICharacter[] | null = null;
  page: any = null;

  filterOptions: FilterOption[] = [];

  get regions(): FilterOption[] {
    return [...new Set(this.data?.map(v => v.region) || [])].map(v => ({ text: this.$t("region." + v) as string, prop: "region", value: v }));
  }

  get genders(): FilterOption[] {
    return [0, 1].map(v => ({ text: this.$t("gender." + v) as string, prop: "gender", value: v }));
  }

  get elements(): FilterOption[] {
    return [...new Set(this.data?.map(v => v.element) || [])].map(v => ({ text: this.$t("element." + v) as string, prop: "element", value: v }));
  }

  get rarities(): FilterOption[] {
    return [...new Set(this.data?.map(v => v.rarity) || [])].map(v => ({ text: this.$t("rarity." + v) as string, prop: "rarity", value: v }));
  }

  get weapons(): FilterOption[] {
    return [...new Set(this.data?.map(v => v.weapon) || [])].map(v => ({ text: this.$t("weapon." + v) as string, prop: "weapon", value: v }));
  }

  get filters() {
    return [
      { header: this.$t("region.title") },
      ...this.regions,
      { divider: true },
      { header: this.$t("gender.title") },
      ...this.genders,
      { divider: true },
      { header: this.$t("element.title") },
      ...this.elements,
      { divider: true },
      { header: this.$t("rarity.title") },
      ...this.rarities,
      { divider: true },
      { header: this.$t("weapon.title") },
      ...this.weapons,
    ];
  }

  get items() {
    return this.data
      ?.filter(v => !this.filterOptions.some(filter => v[filter.prop] !== filter.value))
      .reduce((r, item: any, index) => {
        if (index === 0 || r[index - 1].region !== item.region) {
          item = { ...item, subtitle: this.$t(`region.${item.region}`) as string };
        }
        r.push(item);
        return r;
      }, [] as Partial<ICharacter & { subtitle: string }>[]);
  }

  json(a: any) {
    return JSON.stringify(a);
  }
}
</script>

<style lang="less" scoped>
.nolink {
  color: unset;
  text-decoration: none;
}
</style>