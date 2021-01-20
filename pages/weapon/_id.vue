<template>
  <div v-if="data" class="gsm-weapon">
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
                <v-list-item-subtitle v-text="$t('ui.weaponType')" />
                <v-list-item-title class="headline" v-text="$t(`weapon.${data.type}`)" />
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="6">
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-subtitle v-text="$t('rarity.title')" />
                <v-list-item-title class="headline"><Rarity :star="data.rarity" /></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="6">
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-subtitle v-text="$t('buff.2')" />
                <v-list-item-title class="headline" v-text="data.baseATK" />
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col v-if="data.subAttr" cols="6">
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-subtitle v-text="$t(`buff.${data.subAttr.type}`)" />
                <v-list-item-title class="headline" v-text="percent(data.subAttr.value)" />
              </v-list-item-content>
            </v-list-item>
          </v-col>
        </v-row>
        <v-list-item v-if="data.affix" two-line>
          <v-list-item-content>
            <v-list-item-subtitle v-text="$t('affix.title')" />
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
  <div v-else class="error">找不到此武器</div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { IWeapon } from "~/modules/core";

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
    const title = this.$t("title.sub", [this.$t(`${this.id}`)]) as string;
    return { title };
  },
})
export default class Page extends Vue {
  id: string = "";
  data: IWeapon | null = null;
  page: any = null;

  parseDesc(str: string) {
    return str.replace(/<color=(.+?)>(.+?)<\/color>/g, `<span style="color:$1">$2</span>`);
  }

  percent(num: number) {
    return num * 100 + "%";
  }
}
</script>
