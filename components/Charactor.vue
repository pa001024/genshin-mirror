<template>
  <div class="gsm-charactor">
    <div class="name">{{ name }}</div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({})
export default class Charactor extends Vue {
  @Prop() name!: string;
  // start
  mounted() {}
}
</script>

<style lang="less" scoped>
.gsm-charactor {
  color: red;
}
</style>
