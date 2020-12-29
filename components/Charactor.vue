<template>
  <div class="gsm-Character">
    <div class="name">{{ name }}</div>
    <div class="data">{{ json(data) }}</div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { ICharacter } from "~/core";

@Component({})
export default class Character extends Vue {
  @Prop() name!: string;
  @Prop() data!: ICharacter;
  // start
  mounted() {}
  json(obj: any) {
    return JSON.stringify(obj);
  }
}
</script>

<style lang="less" scoped>
.gsm-Character {
  display: block;
  color: red;
}
</style>
