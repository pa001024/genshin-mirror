<template>
  <div class="gsm-build-index">
    <v-row>
      <v-col cols="4">
        <div class="my-2">
          <v-btn color="indigo" block @click="newBuild">{{ $t("ui.new") }}</v-btn>
        </div>
        <v-card>
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="title">{{ $t("ui.myBuilds") }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list dense nav>
              <v-list-item v-if="!builds || !builds.length">
                <v-list-item-content>
                  <v-list-item-title>{{ $t("ui.thereIsNothing") }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-for="bd in builds" :key="bd.id" link @click="selectBuild(bd)">
                <v-list-item-content>
                  <v-list-item-title>{{ bd.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Getter } from "vuex-class";
import { IUserBuild } from "~/modules/core";

@Component<Page>({
  // set html header
  head() {
    // Set Meta Tags for this Page
    const title = this.$t("title.sub", [this.$t("navigate.build")]) as string;
    return { title };
  },
})
export default class Page extends Vue {
  @Getter("app/uid") uid!: string;
  @Getter("app/builds") builds!: IUserBuild[];

  newBuild() {
    if (this.uid) {
      //
    }
  }

  selectBuild(_bd: IUserBuild) {}
}
</script>
