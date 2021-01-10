<template>
  <img class="char-image" :src="url" :style="{ width: size, height: size }" />
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { ElementType } from "~/modules/core";

@Component({})
export default class CharImage extends Vue {
  @Prop() name!: string;
  @Prop() element!: ElementType;
  @Prop({ default: "thumb" }) type!: "thumb" | "portrait";
  @Prop({ default: 32 }) size!: number;

  get url() {
    return "/img/char/" + this.type + "/" + this.name + ".png";
  }
}
</script>

<style lang="less" scoped>
.char-image {
  display: inline-block;
  user-select: none;
}
</style>
