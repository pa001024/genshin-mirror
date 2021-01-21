<template>
  <div v-if="char" class="gsm-avatar d-lg-flex">
    <!-- 角色主体 -->
    <v-card max-width="560" class="mx-auto">
      <v-card-title>
        <v-list-item two-line>
          <v-list-item-action>
            <CharImage :id="data.id" :element="data.element" avatar :size="48" />
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="headline">{{ data.localeName }}</v-list-item-title>
            <v-list-item-subtitle v-text="data.name" />
          </v-list-item-content>
        </v-list-item>
      </v-card-title>
      <v-card-text>
        <!-- 基础信息 -->
        <v-row>
          <v-col cols="6">
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-subtitle v-text="$t('ui.rarity')" />
                <v-list-item-title class="headline"><Rarity :star="data.rarity" /></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="6">
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-subtitle v-text="$t('region.title')" />
                <v-list-item-title class="headline" v-text="$t(`region.${data.region}`)" />
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="6">
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-subtitle v-text="$t('element.title')" />
                <v-list-item-title class="headline">{{ $t(`element.${data.element}`) }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="6">
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-subtitle v-text="$t('weapon.title')" />
                <v-list-item-title class="headline">{{ $t(`weapon.${data.weapon}`) }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-col>
        </v-row>
        <v-divider class="mb-2 mt-2" />
        <v-row>
          <v-col cols="12">
            <!-- 基础数值 -->
            <div class="level-slider ml-4 mr-4 mt-2">
              <v-slider v-model="char.level" label="等级" persistent-hint :hint="$t('ui.level', [char.level])" :max="char.maxLevel" :min="char.minLevel" />
            </div>
            <PromoteLevel v-model="char.promoteLevel" />
          </v-col>
          <v-col cols="6">
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-subtitle v-text="$t('buff.1')" />
                <v-list-item-title class="headline" v-text="num(char.baseHP)" />
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="6">
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-subtitle v-text="$t('buff.2')" />
                <v-list-item-title class="headline" v-text="num(char.baseATK)" />
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="6">
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-subtitle v-text="$t('buff.3')" />
                <v-list-item-title class="headline" v-text="num(char.baseDEF)" />
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="6">
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-subtitle v-text="$t(`buff.${data.ascensionType}`)" />
                <v-list-item-title class="headline" v-text="per(char.extra)" />
              </v-list-item-content>
            </v-list-item>
          </v-col>
        </v-row>
        <v-divider class="mb-2 mt-2" />
        <v-card-text v-text="data.desc" />
      </v-card-text>
    </v-card>
    <!-- 技能 -->
    <div class="ml-lg-4 mt-3 mt-lg-0 flex-grow-1">
      <v-card>
        <v-tabs v-model="skillTab">
          <v-tabs-slider></v-tabs-slider>
          <v-tab href="#attack">{{ $t("ui.attackSkill") }}</v-tab>
          <v-tab href="#skill">{{ $t("ui.elemSkill") }}</v-tab>
          <v-tab href="#burst">{{ $t("ui.elemBurst") }}</v-tab>
        </v-tabs>
        <v-tabs-items v-model="skillTab">
          <v-tab-item value="attack">
            <v-card flat>
              <v-card-title>{{ data.attackSkill.name }}</v-card-title>
              <v-card-text><pre class="desc" v-html="parseDesc(data.attackSkill.desc)" /></v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item value="skill">
            <v-card flat>
              <v-card-title>{{ data.elemSkill.name }}</v-card-title>
              <v-card-text><pre class="desc" v-html="parseDesc(data.elemSkill.desc)" /></v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item value="burst">
            <v-card flat>
              <v-card-title>{{ data.elemBurst.name }}</v-card-title>
              <v-card-text><pre class="desc" v-html="parseDesc(data.elemBurst.desc)" /></v-card-text>
            </v-card> </v-tab-item
        ></v-tabs-items>
      </v-card>
    </div>
  </div>
  <div v-else class="error">{{ $t("ui.char404") }}</div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { Avatar, IAvatar } from "~/modules/core";

@Component<Page>({
  // server
  async asyncData({ params: { id }, $content, app }) {
    const rst: Partial<Page> = { id, data: null };
    if (id.includes("../")) return { id };
    const res = (await $content(app.i18n.locale, "char", id).fetch().catch(console.error)) as any;
    rst.data = res;
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
  data: IAvatar | null = null;
  char: Avatar | null = null;

  skillTab = "attack";

  @Watch("data")
  created() {
    if (!this.data) return;
    this.char = new Avatar(this.data);
  }

  num(n: number) {
    if (!n) return n;
    return +n.toFixed(2);
  }

  per(n: number) {
    if (!n) return n;
    return +(n * 100).toFixed(2) + "%";
  }

  parseDesc(str: string) {
    return str.replace(/<color=(.+?)>(.+?)<\/color>/g, `<span style="color:$1">$2</span>`);
  }
}
</script>

<style lang="less" scoped>
.desc {
  font-family: inherit !important;
}
</style>
