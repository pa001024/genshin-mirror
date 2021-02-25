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
              <v-list-item v-if="!userBuilds || !userBuilds.length">
                <v-list-item-content>
                  <v-list-item-title>{{ $t("ui.thereIsNothing") }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-for="bd in userBuilds" :key="bd.id" nuxt class="build-list-item" @click="selectBuild(bd)">
                <v-list-item-content>
                  <v-list-item-title>
                    <v-icon size="12">{{ selectedBuild && bd.id === selectedBuild.id ? "mdi-rhombus" : "mdi-rhombus-outline" }}</v-icon>
                    {{ bd.title || $t("ui.untitled") }}
                  </v-list-item-title>
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
import { MeDocument, SetUserBuildDocument, SetUserBuildMutation, SetUserBuildMutationVariables, UserBuildsDocument } from "~/api/generated/graphql";
import { IUserBuild } from "~/modules/core";

@Component<Page>({
  // set html header
  head() {
    // Set Meta Tags for this Page
    const title = this.$t("title.sub", [this.$t("navigate.build")]) as string;
    return { title };
  },
  apollo: {
    me: MeDocument,
    userBuilds: UserBuildsDocument,
  },
})
export default class Page extends Vue {
  selectedBuild: IUserBuild | null = null;

  setUserAvatar(variables: SetUserBuildMutationVariables) {
    return this.$apollo.mutate<SetUserBuildMutation>({ mutation: SetUserBuildDocument, variables, refetchQueries: ["UserBuilds"] });
  }

  newBuild() {
    const defaultData: IUserBuild = {
      cores: [],
      tags: [],
      cover: "",
      desc: "",
      avatars: [],
    };
    this.setUserAvatar({ data: { ...defaultData, avatars: "[]" } });
  }

  selectBuild(bd: IUserBuild) {
    this.selectedBuild = bd;
  }
}
</script>
<style lang="less">
.gsm-build-index {
  .build-list-item.active::after {
    content: "";
    border-left: 4px solid;
  }
}
</style>
