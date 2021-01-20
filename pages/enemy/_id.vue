<template>
  <div v-if="data" class="gsm-enemy d-flex justify-center">
    <v-card max-width="560">
      <v-list-item two-line class="mt-2">
        <v-list-item-action>
          <v-avatar color="grey" size="48" />
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title class="headline"> {{ data.localeName }}</v-list-item-title>
          <v-list-item-subtitle v-text="data.name" />
        </v-list-item-content>
      </v-list-item>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="6">
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-subtitle v-text="$t('ui.enemyType')" />
                  <v-list-item-title class="headline" v-text="$t(`enemy.${data.type}`)" />
                </v-list-item-content>
              </v-list-item>
            </v-col>
            <v-col cols="6">
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-subtitle v-text="$t('buff.1')" />
                  <v-list-item-title class="headline" v-text="data.baseHP" />
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
            <v-col cols="6">
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-subtitle v-text="$t('buff.3')" />
                  <v-list-item-title class="headline" v-text="data.baseDEF" />
                </v-list-item-content>
              </v-list-item>
            </v-col>
          </v-row>
          <v-divider class="mb-3 mt-4" />
          <v-list v-if="data.resist" class="transparent">
            <v-list-item v-for="(item, index) in data.resist" :key="index">
              <v-list-item-title>{{ $t("buff." + (20 + index * 2)) }}</v-list-item-title>

              <v-list-item-icon>
                <ElementIcon :element="indexToIcon(index)" :size="32" />
              </v-list-item-icon>

              <v-list-item-subtitle class="text-right">
                {{ percent(item) }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-container>
      </v-card-text>
    </v-card>
  </div>
  <div v-else class="error">找不到此敌人</div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { ElementType, IEnemy } from "~/modules/core";

@Component<Page>({
  // server
  async asyncData({ params: { id }, $content, app }) {
    const rst: Partial<Page> = { id, data: null };
    if (id.includes("../")) return { id };
    const res = (await $content(app.i18n.locale, "enemy").fetch().catch(console.error)) as any;
    rst.data = res.find((v: any) => v.id === id);

    return rst;
  },
  // set html header
  head() {
    // Set Meta Tags for this Page
    const title = this.$t("title.sub", [this.$t(`${this.data?.localeName}`)]) as string;
    return { title };
  },
})
export default class Page extends Vue {
  id: string = "";
  data: IEnemy | null = null;

  l10n(str: string) {
    const id = str.replace(/\W+/g, "");
    return this.$te(`${id}`) ? this.$t(`${id}`) : str;
  }

  percent(num: number) {
    return num * 100 + "%";
  }

  indexToIcon(v: number) {
    return [
      ElementType.Pyro,
      ElementType.Hydro,
      ElementType.Dendro,
      ElementType.Electro,
      ElementType.Anemo,
      ElementType.Cryo,
      ElementType.Geo,
      ElementType.Any,
    ][v];
  }
}
</script>
