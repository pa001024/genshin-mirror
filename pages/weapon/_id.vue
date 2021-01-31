<template>
  <div v-if="data && weapon" class="gsm-weapon">
    <v-card max-width="560" class="mx-auto">
      <v-card-title>
        <v-list-item two-line>
          <v-list-item-action>
            <WeaponImage :id="data.id" :fallback="data.type" :size="48" />
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="headline"> {{ data.localeName }}</v-list-item-title>
            <v-list-item-subtitle v-if="$i18n.locale !== 'en'" v-text="data.name" />
          </v-list-item-content>
        </v-list-item>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="6">
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-subtitle v-text="$t('ui.rarity')" />
                <v-list-item-title class="headline"><Rarity :value="data.rarity" /></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="6">
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-subtitle v-text="$t('ui.weaponType')" />
                <v-list-item-title class="headline" v-text="$t(`weapon.${data.type}`)" />
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="12">
            <!-- 基础数值 -->
            <div class="level-slider ml-4 mr-4 mt-2">
              <v-slider
                v-model="weapon.level"
                label="等级"
                persistent-hint
                :hint="$t('ui.level', [weapon.level])"
                :max="weapon.maxLevel"
                :min="weapon.minLevel"
              />
            </div>
            <PromoteLevel v-model="weapon.promoteLevel" />
          </v-col>
          <v-col cols="6">
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-subtitle v-text="$t('buff.2')" />
                <v-list-item-title class="headline" v-text="F(weapon.baseATK)" />
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col v-if="data.subAttr" cols="6">
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-subtitle v-text="$t(`buff.${weapon.subAttr.type}`)" />
                <v-list-item-title class="headline" v-text="P(weapon.subAttr.value)" />
              </v-list-item-content>
            </v-list-item>
          </v-col>
        </v-row>
        <v-list-item v-if="data.affix" two-line>
          <v-list-item-content>
            <v-list-item-title class="headline" v-text="data.affix.name" />
            <v-list-item-content>
              <p style="line-height: 1.5" v-html="parseDesc(data.affix.desc)"></p>
            </v-list-item-content>
          </v-list-item-content>
        </v-list-item>
        <v-divider class="mb-2 mt-2" />
        <v-card-text v-text="data.desc" />
      </v-card-text>
    </v-card>
  </div>
  <div v-else class="error">{{ $t("ui.notFound") }}</div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { IWeapon, Weapon } from "~/modules/core";

@Component<Page>({
  // server
  async asyncData({ params: { id }, $content, app }) {
    const rst: Partial<Page> = { id, data: null, page: null };
    if (id.includes("../")) return { id };
    const res = (await $content(app.i18n.locale, "weapon").where({ id }).fetch().catch(console.error)) as any;
    rst.data = res && res[0];

    if (rst.data) {
      rst.page = await $content(app.i18n.locale, id)
        .fetch()
        .catch(() => {});
    }
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
  data: IWeapon | null = null;
  weapon: Weapon | null = null;
  page: any = null;

  parseDesc(str: string) {
    return str.replace(/<color=(.+?)>(.+?)<\/color>/g, `<span style="color:$1">$2</span>`).replace(/\n/g, "<br>");
  }

  F(n = 0, p = 2) {
    return n.toFixed(p);
  }

  P(n = 0, p = 2) {
    return +(n * 100).toFixed(p) + "%";
  }

  FP(n = 0, p = 1) {
    return (n * 100).toFixed(p) + "%";
  }

  @Watch("data")
  created() {
    if (this.data) this.weapon = new Weapon(this.data);
  }
}
</script>
