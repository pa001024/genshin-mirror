<template>
  <div class="gsm-Character">
    <div class="name">{{ name }}</div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({})
export default class Character extends Vue {
  @Prop() name!: string;
  // start
  mounted() {}
}
</script>

<style lang="less" scoped>
.gsm-Character {
  color: red;
}
</style>
