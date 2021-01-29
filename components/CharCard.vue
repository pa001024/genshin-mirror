<template>
  <v-card class="char-card" @click="$emit('click', $event)">
    <nuxt-link v-if="link" :to="'char/' + value.id" class="nolink">
      <div class="char-avatar" :class="['rarity-' + value.rarity]" :style="{ height: (small ? 80 : 106) + 'px' }">
        <ElementIcon :element="value.element" :size="small ? 24 : 32" class="ele-icon" />
        <CharImage :id="value.id" :size="small ? 80 : 106" class="mx-auto" />
      </div>
      <div class="char-name" v-text="value.localeName"></div>
    </nuxt-link>
    <template v-else>
      <div class="char-avatar" :class="['rarity-' + value.rarity]" :style="{ height: (small ? 80 : 106) + 'px' }">
        <ElementIcon :element="value.element" :size="small ? 24 : 32" class="ele-icon" />
        <CharImage :id="value.id" :size="small ? 80 : 106" class="mx-auto" />
      </div>
      <div class="char-name" v-text="value.localeName"></div>
    </template>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import type { IAvatar } from "~/modules/core";

@Component({})
export default class CharCard extends Vue {
  @Prop() value!: IAvatar;
  @Prop({ type: Boolean, default: false }) small!: boolean;
  @Prop({ type: Boolean, default: true }) link!: boolean;
}
</script>

<style lang="less">
.char-card {
  && {
    display: inline-block;
    position: relative;
    border-radius: 5px;
    overflow: hidden;
    user-select: none;
    cursor: pointer;
  }
  &.selected {
    background: var(--shadow);
  }
  .char-avatar {
    justify-items: center;
    background: var(--white);
    border-bottom-right-radius: 25px;
    overflow: hidden;

    .ele-icon {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 1;
    }
    &.rarity-4 {
      background: #9181bd;
    }
    &.rarity-5 {
      background: #a57c3f;
    }
  }
  .char-name {
    color: var(--black);
    text-align: center;
    padding: 4px 0;
    font-weight: 600;
  }
}
</style>
