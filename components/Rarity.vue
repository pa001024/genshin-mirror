<template>
  <div class="rarity" :class="{ fixed }">
    <GsIcon v-for="i in star" :key="i" type="star" />
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({})
export default class Rarity extends Vue {
  @Prop() star!: number;
  @Prop() fixed!: boolean;
}
</script>

<style lang="less" scoped>
.rarity {
  display: inline-block;
  user-select: none;
  color: #ffcc32;
  filter: drop-shadow(0 0 1px rgba(189, 152, 40, 0.3));

  &.fixed {
    width: 5.5em;
  }
}
</style>
