<template>
  <v-container class="mainpage">
    <!-- 周常材料 -->
    <v-row>
      <v-col cols="12">
        <div class="title">{{ timeString }}</div>
        <v-card>
          <v-card-title>
            精通秘境
            <ItemCard v-for="g in todayItems.slice(0, 2)" :key="g.id" class="ml-2" :value="g" icon />
          </v-card-title>
          <v-card-text>
            <CharCard v-for="g in weeklyGroupChar" :key="g.id" :value="g" class="ma-1" small />
          </v-card-text>
        </v-card>
        <v-card>
          <v-card-title>
            炼武秘境
            <ItemCard v-for="g in todayItems.slice(2, 4)" :key="g.id" class="ml-2" :value="g" icon />
          </v-card-title>
          <v-card-text>
            <WeaponCard v-for="g in weeklyGroupWeapon" :key="g.id" :value="g" class="ma-1" small />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center" align="center" class="mb-12">
      <v-col cols="12">
        <nuxt-link to="/login" class="nolink">
          <v-btn block>{{ $t("ui.login") }}</v-btn>
        </nuxt-link>
      </v-col>
      <v-col cols="12">
        <nuxt-link to="/signup" class="nolink">
          <v-btn block>{{ $t("ui.signup") }}</v-btn>
        </nuxt-link>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="headline"> 施工中... </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn block plain @click="show = !show">
              展开看废话
              <v-icon>{{ show ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
            </v-btn>
          </v-card-actions>
          <v-expand-transition>
            <div v-show="show">
              <v-divider></v-divider>
              <v-card-text>
                <nuxt-content :document="page" />
              </v-card-text>
            </div>
          </v-expand-transition>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { IAvatar, IItem, IWeapon } from "~/modules/core";

@Component({
  // server
  async asyncData({ $content, app }) {
    const rst: Partial<Page> = { page: null, char: [], weapon: [], items: [] };
    rst.page = await $content("todo").fetch().catch(console.error);

    const char = await $content(app.i18n.locale, "char")
      .only(["id", "localeName", "element", "rarity", "overviewItems"])
      .sortBy("rarity", "desc")
      .fetch<IAvatar>()
      .catch(console.error);
    if (Array.isArray(char)) rst.char = char;
    const weapon = await $content(app.i18n.locale, "weapon")
      .only(["id", "localeName", "rarity", "overviewItems"])
      .sortBy("rarity", "desc")
      .fetch<IWeapon>()
      .catch(console.error);
    if (Array.isArray(weapon)) rst.weapon = weapon;
    const items = await $content(app.i18n.locale, "item")
      .where({
        id: {
          $in: [
            "PhilosophiesofFreedom",
            "PhilosophiesofProsperity",
            "ScatteredPieceofDecarabiansDream",
            "DivineBodyfromGuyun",
            "PhilosophiesofResistance",
            "PhilosophiesofDiligence",
            "BorealWolfsNostalgia",
            "MistVeiledPrimoElixir",
            "PhilosophiesofBallad",
            "PhilosophiesofGold",
            "DreamoftheDandelionGladiator",
            "ChunkofAerosiderite",
          ],
        },
      })
      .only(["id", "localeName", "rarity"])
      .sortBy("rarity", "desc")
      .fetch<IItem>()
      .catch(console.error);
    if (Array.isArray(items)) rst.items = items;
    return rst;
  },
  head() {
    const title = this.$t("title.main") as string;
    return { title };
  },
})
export default class Page extends Vue {
  page: any = null;
  char: IAvatar[] = [];
  weapon: IWeapon[] = [];
  items: IItem[] = [];
  show = false;

  weeklyData = [
    // 周一 周四 繁荣自由
    ["PhilosophiesofFreedom", "PhilosophiesofProsperity", "ScatteredPieceofDecarabiansDream", "DivineBodyfromGuyun"],
    // 周二 周五 勤劳抗争
    ["PhilosophiesofResistance", "PhilosophiesofDiligence", "BorealWolfsNostalgia", "MistVeiledPrimoElixir"],
    // 周三 周六 黄金诗文
    ["PhilosophiesofBallad", "PhilosophiesofGold", "DreamoftheDandelionGladiator", "ChunkofAerosiderite"],
  ];

  get todayItems() {
    const day = new Date().getDay();
    const filterItems = this.weeklyData[(day - 1) % 3];
    return filterItems.map(v => this.items.find(i => i.id === v));
  }

  get timeString() {
    return new Date().toLocaleDateString();
  }

  get weeklyGroupChar() {
    const day = new Date().getDay();
    if (day) {
      const filterItems = this.weeklyData[(day - 1) % 3];
      return this.char.filter(v => v.element && v.overviewItems?.some(v => filterItems.includes(v.id)));
    }
    return this.char;
  }

  get weeklyGroupWeapon() {
    const day = new Date().getDay();
    if (day) {
      const filterItems = this.weeklyData[(day - 1) % 3];
      return this.weapon.filter(v => v.overviewItems?.some(v => filterItems.includes(v.id)));
    }
    return this.weapon;
  }
}
</script>
