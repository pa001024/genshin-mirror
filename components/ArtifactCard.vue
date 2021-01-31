<template>
  <nuxt-link :to="'artifact/' + type.id" tag="v-card" class="relic-card">
    <v-card-text>
      <div class="relic-name" v-text="type.localeName"></div>
      <Rarity :value="type.rarity" />
    </v-card-text>
  </nuxt-link>
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
  max-width: 200px;
}
</style>
