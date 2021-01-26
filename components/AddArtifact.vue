<template>
  <div class="mx-auto">
    <!-- <nuxt-link to="/doc/artifact">文档</nuxt-link> -->
    <v-row>
      <v-col v-if="types" class="d-flex flex-wrap">
        <v-row justify="center" class="mt-2 mb-2">
          <v-rating v-model="rarity" />
        </v-row>
        <v-tabs-items v-model="rarity">
          <v-tab-item v-for="r in 5" :key="r" :value="r">
            <v-container fluid class="d-flex flex-wrap">
              <ArtifactCard v-for="item in filteredTypes(r)" :key="item.id" :type="item" class="ma-1" />
            </v-container>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { filter } from "lodash";
import { Vue, Component, VModel } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";
import type { IArtifact, IArtifactType, IArtifactSet } from "~/modules/core";

/**
 * 圣遗物选择器
 *
 * 选择顺序: 选择套装->部位->主属性->副属性
 */
@Component({})
export default class AddArtifact extends Vue {
  @Action("app/loadArtifactData") loadArtifactData!: () => void;
  @Getter("app/artifactTypes") types!: { [id: number]: IArtifactType };
  @Getter("app/artifactSets") sets!: IArtifactSet[];
  @VModel() value!: IArtifact;

  rarity = 5;

  filteredTypes(r: number) {
    console.log(this.types);

    return filter(this.types, v => v.rarity === r);
  }

  mounted() {
    this.loadArtifactData();
  }
}
</script>

<style lang="less">
.relic-card {
  max-width: 200px;
}
</style>
