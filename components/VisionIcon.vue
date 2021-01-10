<template>
  <img class="vision-icon" :src="url" :style="{ width: size, height: size }" />
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { ElementType } from "~/modules/core";

@Component({})
export default class VisionIcon extends Vue {
  @Prop() type!: ElementType;
  @Prop({ default: 20 }) size!: number;

  get url() {
    return "/img/misc/" + ElementType[this.type] + ".png";
  }
}
</script>

<style lang="less" scoped>
.vision-icon {
  display: inline-block;
  user-select: none;
}
</style>
