<template>
  <v-container class="mainpage">
    <!-- 周常材料 -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="headline">
            {{ timeString }}
            <div class="chip ml-2">{{ $t("ui.nextDay") }} {{ renderTime() }}</div>
          </v-card-title>
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
import { Getter } from "vuex-class";
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
  @Getter("app/timezone") timezone!: number;

  weeklyData = [
    // 周一 周四 繁荣自由
    ["PhilosophiesOfFreedom", "PhilosophiesOfProsperity", "ScatteredPieceOfDecarabiansDream", "DivineBodyFromGuyun"],
    // 周二 周五 勤劳抗争
    ["PhilosophiesOfResistance", "PhilosophiesOfDiligence", "BorealWolfsNostalgia", "MistVeiledPrimoElixir"],
    // 周三 周六 黄金诗文
    ["PhilosophiesOfBallad", "PhilosophiesOfGold", "DreamOfTheDandelionGladiator", "ChunkOfAerosiderite"],
  ];

  get todayItems() {
    const day = this.today.getUTCDay();
    const filterItems = !day ? [].concat(...(this.weeklyData as any)) : this.weeklyData[(day - 1) % 3];
    return filterItems.map(v => ({ id: v, rarity: 5 }));
  }

  get todayAvatarItems() {
    return this.todayItems.filter(v => v.id.startsWith("Philosop"));
  }

  get todayWeaponItems() {
    return this.todayItems.filter(v => !v.id.startsWith("Philosop"));
  }

  today = new Date(Date.now() + this.timezone * 36e5);

  get weeklyGroupChar() {
    const day = this.today.getUTCDay();
    if (day) {
      const filterItems = this.weeklyData[(day - 1) % 3];
      return this.char.filter(v => v.element && v.overviewItems?.some(v => filterItems.includes(v.id)));
    }
    return this.char.filter(v => v.overviewItems);
  }

  get weeklyGroupWeapon() {
    const day = this.today.getUTCDay();
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

  seconds = 0;

  renderTime(time?: string, offset?: number, period?: number) {
    let sec = 0;
    if (!time) {
      const day = new Date(Date.now() + 24 * 36e5);
      day.setUTCHours(24 - this.timezone, 0, 0, 0);
      sec = (~~(day.getTime() / 1e3) - this.seconds) % (24 * 3600);
    } else {
      sec = ~~(Date.parse(time) / 1e3) - this.seconds;
    }
    if (offset) sec += offset;
    if (period) while (sec < 0) sec += period;
    if (sec < 0) return "00:00:00";
    let min = ~~(sec / 60);
    let hou = ~~(min / 60);
    const day = ~~(hou / 24);
    hou = hou % 24;
    min = min % 60;
    sec = sec % 60;
    return `${day !== 0 ? day + ":" : ""}${hou < 10 ? "0" + hou : hou}:${min < 10 ? "0" + min : min}:${sec < 10 ? "0" + sec : sec}`;
  }

  timeString = "";
  timerID!: number;
  updateTime() {
    this.today = new Date(Date.now() + this.timezone * 36e5);
    const localeDate = new Intl.DateTimeFormat(this.$i18n.locale, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(Date.now());
    this.timeString = localeDate;
    this.seconds = ~~(Date.now() / 1e3);
  }

  mounted() {
    this.updateTime();
    this.timerID = setInterval(this.updateTime, 1000) as any;
  }

  beforeDestroy() {
    clearInterval(this.timerID);
  }
}
</script>

<style lang="less">
.mainpage {
  .chip {
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
