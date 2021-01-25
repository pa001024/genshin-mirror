<template>
  <div v-if="data" class="gsm-enemy">
    <v-card max-width="560" class="mx-auto">
      <v-card-title>
        <v-list-item two-line class="mt-2">
          <v-list-item-action>
            <v-avatar color="grey" size="48" />
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="headline"> {{ data.localeName }}</v-list-item-title>
            <v-list-item-subtitle v-text="data.name" />
          </v-list-item-content>
        </v-list-item>
      </v-card-title>
      <v-card-text>
        <div class="desc" v-html="parseDesc(data.desc)" />
        <v-divider class="mb-2 mt-4" />
        <v-row>
          <!-- <v-col cols="6">
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-subtitle v-text="$t('ui.enemyType')" />
                <v-list-item-title class="headline" v-text="$t(`enemy.${data.type}`)" />
              </v-list-item-content>
            </v-list-item>
          </v-col> -->
          <v-col cols="12">
            <!-- 基础数值 -->
            <div class="level-slider ml-4 mr-4 mt-2">
              <v-slider v-model="enemy.level" label="等级" persistent-hint :hint="$t('ui.level', [enemy.level])" :max="enemy.maxLevel" :min="enemy.minLevel" />
            </div>
          </v-col>
          <v-col cols="6">
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-subtitle v-text="$t('buff.1')" />
                <v-list-item-title class="headline" v-text="F(enemy.baseHP)" />
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="6">
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-subtitle v-text="$t('buff.2')" />
                <v-list-item-title class="headline" v-text="F(enemy.baseATK)" />
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="6">
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-subtitle v-text="$t('buff.3')" />
                <v-list-item-title class="headline" v-text="F(enemy.baseDEF)" />
              </v-list-item-content>
            </v-list-item>
          </v-col>
        </v-row>
        <v-divider class="mb-3 mt-4" />
        <v-list v-if="data.resist" class="transparent resist-table">
          <v-list-item v-for="(item, index) in data.resist" :key="index">
            <v-list-item-icon class="align-self-center mr-4">
              <ElementIcon :element="indexToIcon(index)" :size="32" />
            </v-list-item-icon>
            <v-list-item-title>
              {{ $t("buff." + (20 + index * 2)) }}
            </v-list-item-title>

            <v-list-item-subtitle class="text-right">
              {{ P(item) }}
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </div>
  <div v-else class="error">找不到此敌人</div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { ElementType, Enemy, IEnemy } from "~/modules/core";

@Component<Page>({
  // server
  async asyncData({ params: { id }, $content, app }) {
    const rst: Partial<Page> = { id, data: null };
    if (id.includes("../")) return { id };
    const res = (await $content(app.i18n.locale, "enemy").where({ id }).fetch().catch(console.error)) as any;
    rst.data = res && res[0];

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
  data: IEnemy | null = null;
  enemy: Enemy | null = null;

  @Watch("data")
  created() {
    if (!this.data) return;
    this.enemy = new Enemy(this.data);
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

  parseDesc(str: string) {
    return str.replace(/<color=(.+?)>(.+?)<\/color>/g, `<span style="color:$1">$2</span>`).replace(/\n/g, "<br>");
  }
}
</script>
<style lang="less">
.resist-table {
  .v-list-item__icon {
    margin: 0;
  }
}
</style>
