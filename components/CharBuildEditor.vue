<template>
  <div class="char-build-editor">
    <div class="char-main">
      <CharCard :value="char" small :link="false" />
    </div>
    <div class="weapon-main">
      <WeaponCard :value="weapon" small :link="false" />
    </div>
    <div class="artifact-main">
      <ArtifactCard v-for="(artfact, index) in artfacts" :key="index" :value="artfact" :link="false" />
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, VModel, Prop } from "vue-property-decorator";
import type { IArtifact, IAvatar, IUserAvatar, IWeapon } from "~/modules/core";

@Component({})
export default class CharBuildEditor extends Vue {
  @VModel() value!: IUserAvatar;
  @Prop() char!: IAvatar;
  @Prop() weapon!: IWeapon;
  @Prop() artfacts!: IArtifact[];
}
</script>
