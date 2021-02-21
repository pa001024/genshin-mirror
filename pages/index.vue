<template>
  <v-container class="mainpage">
    <!-- 周常材料 -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="headline">{{ timeString }}</v-card-title>
          <v-card-title>
            {{ $t("dungeon.avatarTalent") }}
            <ItemCard v-for="g in todayAvatarItems" :key="g.id" class="ml-2" :value="g" icon />
          </v-card-title>
          <v-card-text>
            <CharCard v-for="g in weeklyGroupChar" :key="g.id" :value="g" class="ma-1" small :item="getItem(g)" />
          </v-card-text>
          <v-card-title>
            {{ $t("dungeon.weaponPromote") }}
            <ItemCard v-for="g in todayWeaponItems" :key="g.id" class="ml-2" :value="g" icon />
          </v-card-title>
          <v-card-text>
            <WeaponCard v-for="g in weeklyGroupWeapon" :key="g.id" :value="g" class="ma-1" small :item="getItem(g)" />
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
    const rst: Partial<Page> = { page: null, char: [], weapon: [] };
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
    // const items = await $content(app.i18n.locale, "item")
    //   .where({
    //     id: {
    //       $in: [
    //         "PhilosophiesOfFreedom",
    //         "PhilosophiesOfProsperity",
    //         "ScatteredPieceOfDecarabiansDream",
    //         "DivineBodyFromGuyun",
    //         "PhilosophiesOfResistance",
    //         "PhilosophiesOfDiligence",
    //         "BorealWolfsNostalgia",
    //         "MistVeiledPrimoElixir",
    //         "PhilosophiesOfBallad",
    //         "PhilosophiesOfGold",
    //         "DreamOftheDandelionGladiator",
    //         "ChunkOfAerosiderite",
    //       ],
    //     },
    //   })
    //   .only(["id", "localeName", "rarity"])
    //   .sortBy("rarity", "desc")
    //   .fetch<IItem>()
    //   .catch(console.error);
    // if (Array.isArray(items)) rst.items = items;
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
  // items: IItem[] = [];
  show = false;

  weeklyData = [
    // 周一 周四 繁荣自由
    ["PhilosophiesOfFreedom", "PhilosophiesOfProsperity", "ScatteredPieceOfDecarabiansDream", "DivineBodyFromGuyun"],
    // 周二 周五 勤劳抗争
    ["PhilosophiesOfResistance", "PhilosophiesOfDiligence", "BorealWolfsNostalgia", "MistVeiledPrimoElixir"],
    // 周三 周六 黄金诗文
    ["PhilosophiesOfBallad", "PhilosophiesOfGold", "DreamOfTheDandelionGladiator", "ChunkOfAerosiderite"],
  ];

  get todayItems() {
    const day = this.today.getDay();
    const filterItems = !day ? [].concat(...(this.weeklyData as any)) : this.weeklyData[(day - 1) % 3];
    return filterItems.map(v => ({ id: v, rarity: 5 }));
  }

  get todayAvatarItems() {
    return this.todayItems.filter(v => v.id.startsWith("Philosop"));
  }

  get todayWeaponItems() {
    return this.todayItems.filter(v => !v.id.startsWith("Philosop"));
  }

  get timeString() {
    const localeDate = new Intl.DateTimeFormat(this.$i18n.locale, { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(this.today);
    return localeDate;
  }

  get today() {
    return new Date(Date.now() - 3600 * 4 * 1e3);
  }

  get weeklyGroupChar() {
    const day = this.today.getDay();
    if (day) {
      const filterItems = this.weeklyData[(day - 1) % 3];
      return this.char.filter(v => v.element && v.overviewItems?.some(v => filterItems.includes(v.id)));
    }
    return this.char.filter(v => v.overviewItems);
  }

  get weeklyGroupWeapon() {
    const day = this.today.getDay();
    if (day) {
      const filterItems = this.weeklyData[(day - 1) % 3];
      return this.weapon.filter(v => v.overviewItems?.some(v => filterItems.includes(v.id)));
    }
    return this.weapon.filter(v => v.overviewItems);
  }

  getItem(g: Pick<IAvatar, "overviewItems">) {
    const item = this.todayItems.find(v => g.overviewItems!.some(f => f.id === v.id));
    return item?.id;
  }
}
</script>
