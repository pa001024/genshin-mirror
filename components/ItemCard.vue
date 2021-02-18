<template>
  <v-card class="item-card" :class="{ inactive }" :flat="icon" @click="$emit('click', $event)">
    <nuxt-link v-if="link" :to="'item/' + value.id" class="nolink">
      <div :class="['rarity-' + value.rarity, !icon && 'item-avatar']" :style="{ height: size + 'px' }">
        <ItemImage :id="value.id" :size="size" class="mx-auto" />
      </div>
      <div v-if="!icon" class="item-name" :class="{ small }" v-text="value.localeName"></div>
    </nuxt-link>
    <template v-else>
      <div :class="['rarity-' + value.rarity, !icon && 'item-avatar']" :style="{ height: size + 'px' }">
        <ItemImage :id="value.id" :size="size" class="mx-auto" />
      </div>
      <div v-if="!icon" class="item-name" :class="{ small }" v-text="value.localeName"></div>
    </template>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import type { IItem } from "~/modules/core";

@Component({})
export default class ItemCard extends Vue {
  @Prop() value!: IItem;
  @Prop({ type: Boolean, default: false }) icon!: boolean;
  @Prop({ type: Boolean, default: false }) small!: boolean;
  @Prop({ type: Boolean, default: true }) link!: boolean;
  @Prop({ type: Boolean, default: false }) inactive!: boolean;

  get size() {
    if (this.icon) return 32;
    if (this.small) return 80;
    return 106;
  }
}
</script>

<style lang="less">
.item-card {
  && {
    display: inline-block;
    border-radius: 5px;
    overflow: hidden;
    user-select: none;
    cursor: pointer;
  }
  &.selected {
    background: var(--shadow);
  }
  &.inactive {
    filter: grayscale(1);
  }
  .item-avatar {
    justify-items: center;
    background: var(--white);
    overflow: hidden;
    position: relative;

    .ele-icon {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 1;
    }
    &.rarity-1 {
      background: #85898b;
    }
    &.rarity-2 {
      background: #649c84;
    }
    &.rarity-3 {
      background: #5e8aa9;
    }
    &.rarity-4 {
      background: #9181bd;
    }
    &.rarity-5 {
      background: #a57c3f;
    }
  }
  .item-name {
    color: var(--black);
    text-align: center;
    padding: 4px 0;
    font-weight: 600;
    &.small {
      font-size: 12px;
    }
  }
}
</style>
