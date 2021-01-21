<template>
  <div class="promote-level">
    <v-btn icon :size="size" @click="promoteLevel = Math.max(0, promoteLevel - 1)">
      <v-icon>mdi-chevron-left</v-icon>
    </v-btn>
    <v-rating v-model="promoteLevel" :length="6" hover :size="24">
      <template v-slot:item="props">
        <v-icon :size="size" :color="props.isFilled ? 'grey' : 'grey lighten-2'" @click="props.click">
          {{ props.isFilled ? "mdi-star" : "mdi-star-outline" }}
        </v-icon>
      </template>
    </v-rating>
    <v-btn icon :size="size" @click="promoteLevel = Math.min(6, promoteLevel + 1)">
      <v-icon>mdi-chevron-right</v-icon>
    </v-btn>
  </div>
</template>
<script lang="ts">
import "reflect-metadata";
import { Vue, Component, VModel, Prop } from "vue-property-decorator";

@Component({})
export default class PromoteLevel extends Vue {
  @VModel() promoteLevel!: number;
  @Prop({ default: 30 }) size!: number;
}
</script>

<style lang="less" scoped>
.promote-level {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
