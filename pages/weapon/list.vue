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
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">名称</th>
            <th class="text-left">英文</th>
            <th class="text-left" style="min-width: 72px">类型</th>
            <th class="text-left">星级</th>
            <th class="text-left">基础攻击</th>
            <th class="text-left" style="min-width: 72px">副词条</th>
            <th class="text-left">数值</th>
            <th class="text-left">特效</th>
            <th class="text-left">描述</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="w in weapons" :key="w.name">
            <td>{{ w.data.localeName }}</td>
            <td>{{ w.data.name }}</td>
            <td>{{ $t(`weapon.${w.data.type}`) }}</td>
            <td>{{ w.data.rarity }}</td>
            <td>{{ F(w.baseATK) }}</td>
            <td>{{ w.subAttr ? $t(`buff.short.${w.subAttr.type}`) : "-" }}</td>
            <td>{{ w.subAttr ? TP(w.subAttr.type, w.subAttr.value) : "-" }}</td>
            <td>{{ w.data.affix ? w.data.affix.name : "-" }}</td>
            <td v-html="w.affix ? parseDesc(w.affix.desc) : '-'"></td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { ARTIFACT, IWeapon, Weapon } from "~/modules/core";

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
      //   .only(["id", "name", "localeName", "type", "rarity", "baseATK", "subAttr"])
      .sortBy("type", "asc")
      .sortBy("rarity", "desc")
      .fetch()
      .catch(console.error)) as any;
    rst.data = res;
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
    return this.data?.filter(v => v.subAttr).filter(v => !this.filterOptions.some(filter => v[filter.prop] !== filter.value));
  }

  get weapons() {
    return this.items?.map(v => {
      const w = new Weapon(v);
      w.promoteLevel = 6;
      return w;
    });
  }

  F(n = 0, p = 2) {
    return n.toFixed(p);
  }
  TP(type: number, value: number) {
    if (type in ARTIFACT.ENCODE_RATIO) {
      return value.toFixed(0);
    } else {
      return (value * 100).toFixed(1) + "%";
    }
  }

  parseDesc(str: string) {
    return str.replace(/<color=(.+?)>(.+?)<\/color>/g, `<span style="color:$1">$2</span>`).replace(/\n/g, "<br>");
  }
}
</script>
