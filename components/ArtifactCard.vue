<template>
  <v-card class="relic-card" :to="'/artifact/set/' + type.setId">
    <div class="relic-avatar pa-2" :class="['rarity-' + type.rarity]">
      <v-img :src="`/img/relic/${type.name}.png`" width="70" height="70" />
    </div>
    <Rarity class="relic-rarity" :value="type.rarity" />
    <div class="relic-name" v-text="type.localeName"></div>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import type { IArtifact, IArtifactType } from "~/modules/core";

@Component({})
export default class ArtifactCard extends Vue {
  @Prop() value!: IArtifact;
  @Prop() type!: IArtifactType;
}
</script>

<style lang="less">
.relic-card {
  && {
    display: inline-block;
    width: 86px;
  }
  .relic-avatar {
    justify-items: center;
    background: var(--white);
    border-bottom-right-radius: 25px;
    overflow: hidden;
    position: relative;
    display: inline-block;
    user-select: none;

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
  .relic-rarity {
    position: absolute;
    bottom: 28px;
    text-align: center;
    left: 0;
    right: 0;
    filter: drop-shadow(1px 2px 2px var(--shadow-reverce));
  }
  .relic-name {
    color: var(--black);
    text-align: center;
    padding: 4px 2px;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    overflow-wrap: normal;
    white-space: nowrap;
    font-size: 12px;
    max-width: 86px;
  }
}
</style>
