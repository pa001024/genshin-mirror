<template>
  <v-container v-if="data && char" class="gsm-avatar d-lg-flex">
    <!-- 角色主体 -->
    <v-card max-width="560" min-width="360" class="mx-auto">
      <v-card-title>
        <v-list-item two-line>
          <v-list-item-action>
            <CharImage :id="data.id" avatar :size="48" />
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
                <v-list-item-title class="headline"><Rarity :value="data.rarity" /></v-list-item-title>
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
                <v-list-item-title class="headline">
                  <ElementIcon :element="data.element" :size="32" />
                  {{ $t(`element.${data.element}`) }}
                </v-list-item-title>
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
              <v-slider
                v-model="char.level"
                :label="$t('ui.levels')"
                persistent-hint
                :hint="$t('ui.level', [char.level])"
                :max="char.maxLevel"
                :min="char.minLevel"
              />
            </div>
            <PromoteLevel v-model="char.promoteLevel" />
          </v-col>
          <v-col cols="6">
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-subtitle>
                  <GsIcon type="hp" />
                  {{ $t("buff.1") }}
                </v-list-item-subtitle>
                <v-list-item-title class="headline" v-text="F(char.baseHP)" />
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="6">
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-subtitle>
                  <GsIcon type="atk" />
                  {{ $t("buff.2") }}
                </v-list-item-subtitle>
                <v-list-item-title class="headline" v-text="F(char.baseATK)" />
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="6">
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-subtitle>
                  <GsIcon type="def" />
                  {{ $t("buff.3") }}
                </v-list-item-subtitle>
                <v-list-item-title class="headline" v-text="F(char.baseDEF)" />
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="6">
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-subtitle v-text="$t(`buff.${data.ascensionType}`)" />
                <v-list-item-title class="headline" v-text="TP(data.ascensionType, char.extra)" />
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
          <v-tabs-slider />
          <v-tab v-for="type in skillTypes" :key="type" :href="'#' + type">{{ $t(`ui.${type}`) }}</v-tab>
          <v-tab href="#talent">{{ $t("ui.talent") }}</v-tab>
          <v-tab href="#c13ns">{{ $t("ui.c13ns") }}</v-tab>
          <v-tab href="#ascension">{{ $t("ui.ascension") }}</v-tab>
        </v-tabs>
        <v-tabs-items v-model="skillTab">
          <v-tab-item v-for="(skillType, sindex) in skillTypes" :key="skillType" :value="skillType">
            <v-card flat>
              <v-card-title class="headline">
                <v-avatar color="grey darken-2" class="mr-2">
                  <v-img :src="`/img/skill/${data[skillType].name}.png`" />
                </v-avatar>
                {{ data[skillType].localeName }}
              </v-card-title>
              <v-card-text>
                <div class="desc" v-html="parseDesc(data[skillType].desc)" />
                <v-divider class="my-4" />
                <SkillLevel v-model="skillLvlTab[sindex]" :max="data[skillType].paramVals.length" />
                <v-tabs-items v-model="skillLvlTab[sindex]">
                  <v-tab-item v-for="(lvData, lv) in parseSkillLevelData(data[skillType])" :key="lv" :value="lv + 1">
                    <v-list-item v-for="(item, index) in lvData" :key="index">
                      <v-list-item-subtitle>{{ item.name }}</v-list-item-subtitle>
                      <v-spacer />
                      <v-list-item-title v-text="item.value" />
                    </v-list-item>
                    <div v-if="data[skillType].costItems[lv]" class="skill-item-cost text-center">
                      <div class="unlock">
                        <v-icon>mdi-lock-open</v-icon>
                        {{ $t("ui.itemCost") }}
                      </div>
                      <div class="mx-auto mt-2">
                        <ItemCard v-for="item in data[skillType].costItems[lv]" :key="item.id" :value="item" :count="item.count" small class="mr-2" />
                      </div>
                    </div>
                  </v-tab-item>
                </v-tabs-items>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item value="talent">
            <v-card v-for="tal in data.talents" :key="tal.name" flat>
              <v-card-title class="headline pb-1">
                <v-avatar color="grey darken-2" class="mr-2 skillimg">
                  <v-img :src="`/img/skill/${tal.name}.png`" />
                </v-avatar>
                {{ tal.localeName }}
                <div v-if="tal.unlock" class="unlock ml-4">
                  <v-icon>mdi-lock-open</v-icon>
                  {{ $t("ui.promoteLevelFormat", [tal.unlock]) }}
                </div>
              </v-card-title>
              <v-card-text>
                <div class="desc" v-html="parseDesc(tal.desc)" />
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item value="c13ns">
            <v-card v-for="(c13n, unlock) in data.c13ns" :key="c13n.name" flat>
              <v-card-title class="headline pb-1">
                <v-avatar color="grey darken-2" class="mr-2">
                  <v-img :src="`/img/skill/${c13n.name}.png`" />
                </v-avatar>
                {{ c13n.localeName }}
                <div class="unlock ml-4">
                  <v-icon>mdi-lock-open</v-icon>
                  {{ $t("ui.c13nsFormat", [unlock + 1]) }}
                </div>
              </v-card-title>
              <v-card-text>
                <div class="desc" v-html="parseDesc(c13n.desc)" />
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item value="ascension">
            <v-card v-for="asc in data.ascensions" :key="asc.name" flat>
              <v-card-title class="headline pb-1">
                {{ $t("ui.promoteNFormat", [asc.level]) }}
                <div class="unlock ml-4">
                  <v-icon>mdi-lock-open</v-icon>
                  {{ $t("ui.promoteCondFormat", [toLevel(asc.level)]) }}
                </div>
              </v-card-title>
              <v-card-text>
                <ItemCard v-for="item in asc.itemCost" :key="item.id" :value="item" :count="item.count" small class="mr-2" />
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </div>
  </v-container>
  <div v-else class="error">{{ $t("ui.char404") }}</div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { ARTIFACT, Avatar, IAvatar, ISkill } from "~/modules/core";

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

  skillTab = "attackSkill";
  martialTab = "attackSkill";
  skillLvlTab = [10, 13, 13];
  get skillTypes() {
    const keys: (keyof IAvatar)[] = ["attackSkill", "elemSkill", "elemBurst"];
    return keys.filter(v => v in this.data!);
  }

  @Watch("data")
  created() {
    if (!this.data) return;
    this.char = new Avatar(this.data);
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

  toLevel(n: number) {
    return [0, 20, 40, 50, 60, 70, 80][n];
  }

  parseDesc(str: string) {
    return str.replace(/<color=(.+?)>(.+?)<\/color>/g, `<span style="color:$1">$2</span>`).replace(/\n/g, "<br>");
  }

  parseSkillLevelData(skill: ISkill) {
    if (!skill?.paramTpls) return null;
    return skill.paramVals!.map(params => {
      return skill.paramTpls?.map(tpl => {
        const [name, vTpl] = tpl.split("|");
        const value = vTpl.replace(/\{param(\d+?):(.+?)\}/g, (_, index: string, format: string) => {
          const val = params[+index - 1];
          if (format.startsWith("F")) {
            const p = parseInt(format.substr(1));
            if (format.endsWith("P")) return this.FP(val, p);
            return this.F(val, p);
          } else if (format.endsWith("P")) return this.P(val);
          return val + "";
        });
        return { name, value };
      });
    });
  }
}
</script>

<style lang="less">
.gsm-avatar {
  .unlock {
    display: inline-block;
    padding: 0.1rem 0.3rem;
    border: 1px solid;
    border-radius: 3px;
    font-size: 0.7rem;
    line-height: 1.5;
    .v-icon {
      font-size: 0.9rem;
    }
  }
}
</style>
