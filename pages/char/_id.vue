<template>
  <div v-if="data && char" class="gsm-avatar d-lg-flex">
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
                <v-list-item-title class="headline" v-text="P(char.extra)" />
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
        </v-tabs>
        <v-tabs-items v-model="skillTab">
          <v-tab-item v-for="(skillType, sindex) in skillTypes" :key="skillType" :value="skillType">
            <v-card flat>
              <v-card-title class="headline">{{ data[skillType].name }}</v-card-title>
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
                  </v-tab-item>
                </v-tabs-items>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </div>
  </div>
  <div v-else class="error">{{ $t("ui.char404") }}</div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { Avatar, IAvatar, ISkill } from "~/modules/core";

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
