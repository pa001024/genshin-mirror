<template>
  <v-card class="weapon-card" :class="{ inactive }" @click="$emit('click', $event)">
    <nuxt-link v-if="link" :to="'weapon/' + value.id" class="nolink">
      <div class="weapon-avatar" :class="['rarity-' + value.rarity]" :style="{ height: (small ? 80 : 106) + 'px' }">
        <ItemImage v-if="item" :id="item" :size="small ? 24 : 32" class="ele-icon" />
        <WeaponImage :id="value.id" :size="small ? 80 : 106" class="mx-auto" />
        <div v-if="refine" class="refine-view">C{{ refine }}</div>
      </div>
      <div v-if="lv" class="weapon-name" :class="{ small }">Lv.{{ lv }}</div>
      <div v-else class="weapon-name" :class="{ small }" v-text="value.localeName"></div>
    </nuxt-link>
    <template v-else>
      <div class="weapon-avatar" :class="['rarity-' + value.rarity]" :style="{ height: (small ? 80 : 106) + 'px' }">
        <ItemImage v-if="item" :id="item" :size="small ? 24 : 32" class="ele-icon" />
        <WeaponImage :id="value.id" :size="small ? 80 : 106" :type="small ? 'thumb' : 'full'" class="mx-auto" />
        <div v-if="refine" class="refine-view" :class="{ refine5: refine === 5 }">{{ refine }}</div>
      </div>
      <div v-if="lv" class="weapon-name" :class="{ small }">Lv.{{ lv }}</div>
      <div v-else class="weapon-name" :class="{ small }" v-text="value.localeName"></div>
    </template>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import type { IWeapon } from "~/modules/core";

@Component({})
export default class WeaponCard extends Vue {
  @Prop() value!: IWeapon;
  @Prop({ type: Boolean, default: false }) small!: boolean;
  @Prop({ type: Boolean, default: true }) link!: boolean;
  @Prop({ type: Boolean, default: false }) inactive!: boolean;
  @Prop({ type: Number }) refine?: number;
  @Prop({ type: Number }) lv?: number;
  @Prop({ type: String }) item?: string;
}
</script>

<style lang="less">
.weapon-card {
  && {
    display: inline-block;
    border-radius: 5px;
    overflow: hidden;
    user-select: none;
    cursor: pointer;
  }
  .refine-view {
    position: absolute;
    left: 0;
    top: 0;
    background: var(--cover);
    border-radius: 4px;
    color: var(--text-grey);
    font-weight: 600;
    padding: 3px 4px 0;
    line-height: 1em;
    margin: 2px;
    &.refine5 {
      background: #d1752d;
      color: #ffe14b;
    }
  }
  &.selected {
    background: var(--shadow);
  }
  &.inactive {
    filter: grayscale(1);
  }
  .weapon-avatar {
    justify-items: center;
    background: var(--white);
    border-bottom-right-radius: 25px;
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
  .weapon-name {
    color: var(--black);
    text-align: center;
    padding: 4px 2px;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    overflow-wrap: normal;
    white-space: nowrap;
    max-width: 106px;
    &.small {
      font-size: 12px;
      max-width: 80px;
    }
  }
}
</style>
