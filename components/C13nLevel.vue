<template>
  <div class="c13n-level">
    <v-btn icon :size="size" :disabled="level <= 0" @click="level--">
      <v-icon>mdi-chevron-left</v-icon>
    </v-btn>
    <v-rating v-model="level" :length="6" hover :size="size">
      <template #item="props">
        <v-icon :size="size" :color="props.isFilled ? 'grey lighten-4' : 'grey darken-2'" @click="props.click">
          {{ props.isFilled ? "mdi-hexagram-outline" : "mdi-lock-outline" }}
        </v-icon>
      </template>
    </v-rating>
    <v-btn icon :size="size" :disabled="level >= 6" @click="level++">
      <v-icon>mdi-chevron-right</v-icon>
    </v-btn>
  </div>
</template>
<script lang="ts">
import "reflect-metadata";
import { Vue, Component, VModel, Prop } from "vue-property-decorator";

@Component({})
export default class C13nLevel extends Vue {
  @VModel() level!: number;
  @Prop({ default: 24 }) size!: number;
}
</script>

<style lang="less">
.c13n-level {
  display: flex;
  align-items: center;
  justify-content: center;
  .v-icon.v-icon--link {
    border: 1px solid;
    padding: 3px;
    margin: 2px;
  }
}
</style>
