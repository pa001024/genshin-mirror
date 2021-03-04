<template>
  <v-card class="char-card" :class="{ inactive }" :to="link && value ? '/char/' + value.id : void 0" @click="$emit('click', $event)">
    <div class="char-avatar" :class="[value ? 'rarity-' + value.rarity : '']" :style="{ height: (small ? 80 : 106) + 'px' }">
      <ItemImage v-if="item" :id="item" :size="small ? 24 : 32" class="ele-icon" />
      <ElementIcon v-else-if="value" :element="value.element" :size="small ? 24 : 32" class="ele-icon" />
      <CharImage v-if="value" :id="value.id" :size="small ? 80 : 106" class="mx-auto" />
      <v-icon v-else class="mx-auto" :size="small ? 80 : 106">mdi-plus</v-icon>
      <div v-if="c13n" class="c13n-view">C{{ c13n }}</div>
    </div>
    <div v-if="lv" class="char-name" :class="{ small }">Lv.{{ lv }}</div>
    <div v-else class="char-name" :class="{ small }" v-text="value ? value.localeName : $t('ui.addChar')"></div>
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
  @Prop({ type: Boolean, default: false }) inactive!: boolean;
  @Prop({ type: Number }) c13n?: number;
  @Prop({ type: Number }) lv?: number;
  @Prop({ type: String }) item?: string;
}
</script>

<style lang="less">
.char-card {
  && {
    display: inline-block;
    border-radius: 5px;
    overflow: hidden;
    user-select: none;
    cursor: pointer;
  }
  .c13n-view {
    position: absolute;
    left: 0;
    bottom: 0;
    background: var(--cover);
    border-top-right-radius: 4px;
    color: var(--text-grey);
    font-weight: 600;
    padding: 3px 4px 0;
    line-height: 1em;
  }
  &.selected {
    background: var(--shadow);
  }
  &.inactive {
    filter: grayscale(1);
  }
  .char-avatar {
    justify-items: center;
    background: var(--shadow);
    border-bottom-right-radius: 25px;
    overflow: hidden;
    position: relative;

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
    &.small {
      font-size: 12px;
    }
  }
}
</style>
