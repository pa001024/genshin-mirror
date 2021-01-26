<template>
  <v-container class="weapon">
    <!-- 筛选 -->
    <v-card class="weapon-filter mb-3">
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
        <template v-for="(item, index) in items">
          <!-- 分割线 -->
          <v-divider v-if="index > 0 && item.subtitle" :key="index"></v-divider>
          <!-- 分类标题 -->
          <v-subheader v-if="item.subtitle" :key="item.subtitle">
            {{ item.subtitle }}
          </v-subheader>
          <!-- 内容 -->
          <v-list-item v-if="item.id" :key="item.id">
            <nuxt-link :to="'weapon/' + item.id" class="nolink">
              <v-list-item-action>
                <v-list-item-title>
                  <WeaponImage :id="item.id" :fallback="item.type" />
                </v-list-item-title>
                <v-list-item-subtitle align="center">
                  <Rarity :star="item.rarity" fixed />
                </v-list-item-subtitle>
              </v-list-item-action>
            </nuxt-link>

            <v-list-item-content>
              <v-list-item-title v-text="item.localeName" />
              <v-list-item-subtitle v-if="$i18n.locale !== 'en'" v-text="item.name" />
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { IWeapon } from "~/modules/core";

interface FilterOption {
  text: string;
  prop: keyof IWeapon;
  value: any;
}

@Component<Page>({
  // server
  async asyncData({ $content, app }) {
    const rst: Partial<Page> = { data: null, page: null };
    const res = (await $content(app.i18n.locale, "weapon")
      .only(["id", "name", "localeName", "type", "rarity", "baseATK", "subAttr"])
      .sortBy("type", "asc")
      .sortBy("rarity", "desc")
      .fetch()
      .catch(console.error)) as any;
    rst.data = res;
    // if (rst.data) {
    //   rst.page = await $content(app.i18n.locale, "weapon")
    //     .fetch()
    //     .catch(() => {});
    // }
    return rst;
  },
  // set html header
  head() {
    // Set Meta Tags for this Page
    const title = this.$t("title.sub", [this.$t("title.weapon")]) as string;
    return { title };
  },
})
export default class Page extends Vue {
  data: IWeapon[] | null = null;
  page: any = null;

  filterOptions: FilterOption[] = [];

  get types(): FilterOption[] {
    return [...new Set(this.data?.map(v => v.type) || [])].map(v => ({ text: this.$t("weapon." + v) as string, prop: "type", value: v }));
  }

  get rarities(): FilterOption[] {
    return [...new Set(this.data?.map(v => v.rarity) || [])].map(v => ({ text: "★".repeat(v), prop: "rarity", value: v }));
  }

  get filters() {
    return [{ header: this.$t("ui.weaponType") }, ...this.types, { divider: true }, { header: this.$t("ui.rarity") }, ...this.rarities];
  }

  get items() {
    return this.data
      ?.filter(v => !this.filterOptions.some(filter => v[filter.prop] !== filter.value))
      .reduce((r, item: any, index) => {
        if (index === 0 || r[index - 1].type !== item.type) {
          item = { ...item, subtitle: this.$t(`weapon.${item.type}`) as string };
        }
        r.push(item);
        return r;
      }, [] as Partial<IWeapon & { subtitle: string }>[]);
  }
}
</script>
