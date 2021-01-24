<template>
  <v-container>
    <!-- 筛选 -->
    <v-card class="avatar-filter mb-3">
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
      <v-container fluid>
        <template v-for="(item, index) in items">
          <!-- 分割线 -->
          <v-divider v-if="index > 0 && item.subtitle" :key="index" />
          <!-- 分类标题 -->
          <v-subheader v-if="item.subtitle" :key="item.subtitle" v-text="item.subtitle" />
          <!-- 内容 -->
          <CharCard v-if="item.id" :key="item.id" :value="item" class="ma-1" />
        </template>
      </v-container>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { IAvatar } from "~/modules/core";

interface FilterOption {
  text: string;
  prop: keyof IAvatar;
  value: any;
}

@Component<Page>({
  // server
  async asyncData({ $content, app }) {
    const rst: Partial<Page> = { data: null };
    const res = (await $content(app.i18n.locale, "char")
      .only(["id", "name", "localeName", "region", "element", "gender", "rarity", "weapon"])
      .sortBy("region", "asc")
      .fetch()
      .catch()) as any;
    rst.data = res;
    return rst;
  },
  // set html header
  head() {
    // Set Meta Tags for this Page
    const title = this.$t("title.sub", [this.$t("title.avatar")]) as string;
    return { title };
  },
})
export default class Page extends Vue {
  data: IAvatar[] | null = null;

  filterOptions: FilterOption[] = [];

  get regions(): FilterOption[] {
    return [...new Set(this.data?.map(v => v.region) || [])].map(v => ({ text: this.$t("region." + v) as string, prop: "region", value: v }));
  }

  // get genders(): FilterOption[] {
  //   return [0, 1].map(v => ({ text: this.$t("gender." + v) as string, prop: "gender", value: v }));
  // }

  get elements(): FilterOption[] {
    return [...new Set(this.data?.map(v => v.element) || [])].map(v => ({ text: this.$t("element." + v) as string, prop: "element", value: v }));
  }

  get rarities(): FilterOption[] {
    return [...new Set(this.data?.map(v => v.rarity) || [])].map(v => ({ text: "★".repeat(v), prop: "rarity", value: v }));
  }

  get weapons(): FilterOption[] {
    return [...new Set(this.data?.map(v => v.weapon) || [])].map(v => ({ text: this.$t("weapon." + v) as string, prop: "weapon", value: v }));
  }

  get filters() {
    return [
      { header: this.$t("region.title") },
      ...this.regions,
      { divider: true },
      // { header: this.$t("gender.title") },
      // ...this.genders,
      // { divider: true },
      { header: this.$t("element.title") },
      ...this.elements,
      { divider: true },
      { header: this.$t("ui.rarity") },
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
      }, [] as Partial<IAvatar & { subtitle: string }>[]);
  }
}
</script>

<style lang="less">
.nolink {
  color: unset;
  text-decoration: none;
}
.char-card {
  && {
    display: inline-block;
    width: 106px;
    position: relative;
    border-radius: 5px;
    overflow: hidden;
  }
  .char-avatar {
    justify-items: center;
    height: 106px;
    background: var(--white);
    border-bottom-right-radius: 25px;
    overflow: hidden;

    .ele-icon {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 1;
    }
    &.rarity-4 {
      background: #9181bd;
    }
    &.rarity-5 {
      background: #a57c3f;
    }
  }
  .char-name {
    color: var(--black);
    text-align: center;
    padding: 4px 0;
    font-weight: 600;
  }
}
</style>
