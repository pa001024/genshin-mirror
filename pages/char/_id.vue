<template>
  <div class="container">
    <h1>{{ $t("title.char") }}: {{ id }}</h1>
    <Character :name="id" :data="charData" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import fs from "fs-extra";
import { ICharacter } from "~/core";
import Character from "~/components/Charactor.vue";

@Component({
  components: { Character },
  async asyncData({ params: { id } }) {
    if (id.includes("../")) return { id };
    let charData: any;
    try {
      const res = await fs.readFile(`./static/data/charactor/${id}.json`);
      charData = JSON.parse(res.toString("utf8"));
    } catch (e) {
      // console.error("[SSR] render Char error", e);
    }
    return { id, charData };
  },
  // set html header
  head() {
    // Set Meta Tags for this Page
    const title = this.$t("title.sub", [(this as any).id]) as string;
    return { title };
  },
})
export default class Char extends Vue {
  id: string = "";
  charData: ICharacter | null = null;
}
</script>

<style lang="less" scoped>
.container {
  user-select: none;
}
</style>
