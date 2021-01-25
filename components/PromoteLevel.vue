<template>
  <div class="promote-level">
    <v-btn icon :size="size" :disabled="level <= 0" @click="level--">
      <v-icon>mdi-chevron-left</v-icon>
    </v-btn>
    <v-rating v-model="level" :length="6" hover :size="size">
      <template v-slot:item="props">
        <v-icon :size="size" :color="props.isFilled ? 'grey lighten-4' : 'grey darken-2'" @click="props.click">
          {{
            "M12.33 1.127c2.391 7.311 3.266 8.155 10.544 10.541 0.319 0.105 0.318 0.556-0 0.66-7.312 2.392-8.156 3.267-10.542 10.545-0.104 0.319-0.556 0.318-0.66-0-2.392-7.312-3.267-8.155-10.545-10.542-0.319-0.105-0.318-0.556 0-0.66 7.312-2.392 8.155-3.267 10.543-10.544 0.104-0.319 0.556-0.319 0.66 0z"
          }}
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
export default class PromoteLevel extends Vue {
  @VModel() level!: number;
  @Prop({ default: 36 }) size!: number;
}
</script>

<style lang="less">
.promote-level {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
