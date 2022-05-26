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
            <th class="text-left" style="min-width: 72px">武器</th>
            <th class="text-left">星级</th>
            <th class="text-left">生命</th>
            <th class="text-left">攻击</th>
            <th class="text-left">防御</th>
            <th class="text-left">突破</th>
            <th class="text-left">数值</th>
            <th class="text-left">能量</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="w in chars" :key="w.name">
            <td>{{ w.data.localeName }}</td>
            <td>{{ w.data.name }}</td>
            <td>{{ $t(`weapon.${w.data.weapon}`) }}</td>
            <td>{{ w.data.rarity }}</td>
            <td>{{ F(w.baseHP, 2) }}</td>
            <td>{{ F(w.baseATK, 2) }}</td>
            <td>{{ F(w.baseDEF, 2) }}</td>
            <td>{{ w.data ? $t(`buff.short.${w.data.ascensionType}`) : "-" }}</td>
            <td>{{ w.data ? TP(w.data.ascensionType, w.extra) : "-" }}</td>
            <td>{{ w.data.elemBurst ? w.data.elemBurst.energyCost : "-" }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { ARTIFACT, Avatar, IAvatar } from "~/modules/core";

interface FilterOption {
  text: string;
  prop: keyof IAvatar;
  value: any;
}

@Component<Page>({
  // server
  async asyncData({ $content, app }) {
    const rst: Partial<Page> = { data: null };
    const res = await $content(app.i18n.locale, "char")
      .fetch<IAvatar>()
      .catch(console.error);
    if (Array.isArray(res)) rst.data = res;
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

  get elements(): FilterOption[] {
    return [...new Set(this.data?.map(v => v.element) || [])].map(v => ({ text: this.$t("element." + v) as string, prop: "element", value: v }));
  }

  get rarities(): FilterOption[] {
    return [...new Set(this.data?.map(v => v.rarity) || [])].map(v => ({ text: "★".repeat(v), prop: "rarity", value: v }));
  }

  get weapons(): FilterOption[] {
    return [...new Set(this.data?.map(v => v.weapon) || [])].map(v => ({ text: this.$t("weapon." + v) as string, prop: "weapon", value: v }));
  }

  get chars() {
    return this.items?.map(v => {
      const w = new Avatar(v);
      w.promoteLevel = 6;
      return w;
    }).sort((a,b)=>a.data.localeName.localeCompare(b.data.localeName));
  }

  F(n = 0, p = 1) {
    return n.toFixed(p);
  }

  P(n = 0, p = 1) {
    return +(n * 100).toFixed(p) + "%";
  }

  FP(n = 0, p = 1) {
    return (n * 100).toFixed(p) + "%";
  }

  TP(type: number, value: number) {
    if (type in ARTIFACT.ENCODE_RATIO) {
      return value.toFixed(0);
    } else {
      return (value * 100).toFixed(1) + "%";
    }
  }

  get filters() {
    return [
      { header: this.$t("region.title") },
      ...this.regions,
      { divider: true },
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
    return this.data?.filter(v => !this.filterOptions.some(filter => v[filter.prop] !== filter.value));
  }
}
</script>
