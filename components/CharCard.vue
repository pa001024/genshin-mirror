<template>
  <v-card class="char-card">
    <nuxt-link :to="'char/' + value.id" class="nolink">
      <div class="char-avatar" :class="['rarity-' + value.rarity]">
        <ElementIcon :element="value.element" class="ele-icon" />
        <CharImage :id="value.id" :size="106" class="mx-auto" />
      </div>
      <div class="char-name" v-text="value.localeName"></div>
    </nuxt-link>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import type { IAvatar } from "~/modules/core";

@Component({})
export default class CharCard extends Vue {
  @Prop() value!: IAvatar;
}
</script>
