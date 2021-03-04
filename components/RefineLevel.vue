<template>
  <div class="refine-level">
    <v-btn icon :size="size" :disabled="level <= 0" @click="level--">
      <v-icon>mdi-chevron-left</v-icon>
    </v-btn>
    <div v-for="lv in 5" :key="lv" class="refine-level-item" :class="{ lv5: lv === 5, selected: level === lv }" @click="changed(lv)">
      {{ lv }}
    </div>
    <v-btn icon :size="size" :disabled="level >= 6" @click="level++">
      <v-icon>mdi-chevron-right</v-icon>
    </v-btn>
  </div>
</template>
<script lang="ts">
import "reflect-metadata";
import { Vue, Component, VModel, Prop } from "vue-property-decorator";

@Component({})
export default class RefineLevel extends Vue {
  @VModel() level!: number;
  @Prop({ default: 36 }) size!: number;
  changed(lv: number) {
    this.$emit("input", lv);
  }
}
</script>

<style lang="less">
.refine-level {
  display: flex;
  align-items: center;
  justify-content: center;
  .refine-level-item {
    cursor: pointer;
    user-select: none;
    &.selected {
      background: var(--shadow);
    }

    border-radius: 4px;
    color: var(--text-grey);
    font-size: 1.3rem;
    font-weight: 600;
    padding: 3px 4px 0;
    line-height: 1em;
    margin: 2px;
    &.lv5.selected {
      color: #ffe14b;
      background: #d1752d;
    }
  }
}
</style>
