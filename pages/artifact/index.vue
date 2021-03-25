<template>
  <v-container class="artifact-index">
    <v-row>
      <v-col :sm="6" :md="4" :lg="2" class="tool-section" to="/set">
        <v-card class="role-section py-4" to="/artifact/set">
          <v-card-title style="font-size: 2rem; display: block">
            <GsIcon type="artifact" />
          </v-card-title>
          <v-card-text>
            {{ $t("ui.artifactSet") }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="ma-2">
      <nuxt-link to="/artifact/0KwsDKB0J43NA1gC2l">test</nuxt-link>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component<Page>({
  // set html header
  head() {
    // Set Meta Tags for this Page
    const title = this.$t("title.sub", [this.$t("title.artifact")]) as string;
    return { title };
  },
})
export default class Page extends Vue {}
</script>
<style lang="less">
.artifact-index {
  .role-section {
    cursor: pointer;
    text-align: center;
    margin-bottom: 24px;
    display: block;
    text-decoration: none;
  }
}
</style>
