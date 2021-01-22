<template>
  <div class="skill-level">
    <v-btn icon :size="size" :disabled="level <= 1" @click="level--">
      <v-icon>mdi-chevron-left</v-icon>
    </v-btn>
    <div class="headline bind-value">
      {{ "Lv." + level }}
    </div>
    <v-btn icon :size="size" :disabled="level >= max" @click="level++">
      <v-icon>mdi-chevron-right</v-icon>
    </v-btn>
  </div>
</template>
<script lang="ts">
import "reflect-metadata";
import { Vue, Component, VModel, Prop } from "vue-property-decorator";

@Component({})
export default class SkillLevel extends Vue {
  @VModel() level!: number;
  @Prop() max!: number;
  @Prop({ default: 36 }) size!: number;
}
</script>

<style lang="less" scoped>
.skill-level {
  display: flex;
  align-items: center;
  justify-content: center;
}
.bind-value {
  min-width: 120px;
  text-align: center;
}
</style>
