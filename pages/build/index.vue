<template>
  <v-container class="gsm-build-index">
    <v-row>
      <v-app-bar class="d-sm-none">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

        <v-toolbar-title v-if="selectedBuild">{{ selectedBuild.title }}</v-toolbar-title>

        <v-spacer></v-spacer>

        <!-- <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn> -->
      </v-app-bar>
      <v-col cols="4" class="d-none d-sm-block">
        <v-card>
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="title d-flex">
                  <div class="d-flex align-center">
                    {{ $t("ui.myBuilds") }}
                  </div>
                  <v-spacer />
                  <v-btn type="primary" @click="newBuild">{{ $t("ui.new") }}</v-btn>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list dense nav>
              <v-list-item v-if="!userBuilds || !userBuilds.length">
                <v-list-item-content>
                  <v-list-item-title>{{ $t("ui.thereIsNothing") }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                v-for="bd in userBuilds"
                :key="bd.id"
                class="build-list-item"
                :class="{ active: selectedBuild && bd.id === selectedBuild.id }"
                @click="selectBuild(bd)"
              >
                <v-list-item-content>
                  <v-list-item-title class="d-flex align-center">
                    <v-icon size="12" class="mr-1">{{ selectedBuild && bd.id === selectedBuild.id ? "mdi-rhombus" : "mdi-rhombus-outline" }}</v-icon>
                    {{ bd.title || $t("ui.untitled") }}
                    <v-spacer />
                    <template v-if="selectedBuild && bd.id === selectedBuild.id">
                      <v-dialog v-model="removeBuildDialog" width="500">
                        <v-card>
                          <v-card-title class="headline">{{ $t("ui.alertTitle") }}</v-card-title>

                          <v-card-text>{{ $t("ui.removeBuildTip") }}</v-card-text>

                          <v-divider></v-divider>

                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn text @click="removeBuildDialog = false">{{ $t("ui.cancel") }}</v-btn>
                            <v-btn color="primary" text @click="confirmRemoveBuild">{{ $t("ui.confirm") }}</v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                      <v-btn icon small @click="removeBuildDialog = toRemoveBuild = selectedBuild.id">
                        <v-icon color="red darken-3">mdi-delete</v-icon>
                      </v-btn>
                      <v-btn icon small :to="`/build/${bd.id}`">
                        <v-icon size="16">mdi-pencil</v-icon>
                      </v-btn>
                    </template>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-list>
        </v-card>
      </v-col>
      <!-- 选择 -->
      <v-navigation-drawer v-model="drawer" absolute bottom temporary>
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="title d-flex">
                <div class="d-flex align-center">
                  {{ $t("ui.myBuilds") }}
                </div>
                <v-spacer />
                <v-btn type="primary" @click="newBuild">{{ $t("ui.new") }}</v-btn>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-list dense nav>
            <v-list-item v-if="!userBuilds || !userBuilds.length">
              <v-list-item-content>
                <v-list-item-title>{{ $t("ui.thereIsNothing") }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-for="bd in userBuilds"
              :key="bd.id"
              class="build-list-item"
              :class="{ active: selectedBuild && bd.id === selectedBuild.id }"
              @click="selectBuild(bd)"
            >
              <v-list-item-content>
                <v-list-item-title class="d-flex align-center">
                  <v-icon size="12" class="mr-1">{{ selectedBuild && bd.id === selectedBuild.id ? "mdi-rhombus" : "mdi-rhombus-outline" }}</v-icon>
                  {{ bd.title || $t("ui.untitled") }}
                  <v-spacer />
                  <template v-if="selectedBuild && bd.id === selectedBuild.id">
                    <v-dialog v-model="removeBuildDialog" width="500">
                      <v-card>
                        <v-card-title class="headline">{{ $t("ui.alertTitle") }}</v-card-title>

                        <v-card-text>{{ $t("ui.removeBuildTip") }}</v-card-text>

                        <v-divider></v-divider>

                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn text @click="removeBuildDialog = false">{{ $t("ui.cancel") }}</v-btn>
                          <v-btn color="primary" text @click="confirmRemoveBuild">{{ $t("ui.confirm") }}</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                    <v-btn icon small @click="removeBuildDialog = toRemoveBuild = selectedBuild.id">
                      <v-icon color="red darken-3">mdi-delete</v-icon>
                    </v-btn>
                    <v-btn icon small :to="`/build/${bd.id}`">
                      <v-icon size="16">mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-list>
      </v-navigation-drawer>

      <!-- 主内容 -->
      <v-col cols="12" sm="8">
        <v-card v-if="selectedBuild" flat>
          <v-card-title class="headline">{{ $t("ui.preview") }}</v-card-title>
          <v-card-text>
            <div class="avatars-container">
              <CharCard v-for="(char, index) in selectedBuild.avatars" :key="index" class="mx-1" :value="char" :link="false" />
            </div>
          </v-card-text>
          <v-divider v-if="selectedBuild.desc" />
          <v-card-text v-if="selectedBuild.desc">
            {{ selectedBuild.desc }}
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-btn :to="`/build/${selectedBuild.id}`">{{ $t("ui.edit") }}</v-btn>
            <v-btn @click="removeBuildDialog = toRemoveBuild = selectedBuild.id">{{ $t("ui.delete") }}</v-btn>
          </v-card-actions>
        </v-card>
        <div v-else class="help">{{ $t("ui.pleaseSelectBuild") }}</div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import {
  MeDocument,
  RemoveUserBuildDocument,
  RemoveUserBuildMutation,
  RemoveUserBuildMutationVariables,
  SetUserBuildDocument,
  SetUserBuildMutation,
  SetUserBuildMutationVariables,
  UserBuildsDocument,
  UserBuildsQuery,
} from "~/api/generated/graphql";
import { IAvatar, IUserBuild } from "~/modules/core";

@Component<Page>({
  // set html header
  head() {
    // Set Meta Tags for this Page
    const title = this.$t("title.sub", [this.$t("navigate.build")]) as string;
    return { title };
  },
  // server
  async asyncData({ $content, app }) {
    const rst: Partial<Page> = { avatarData: {} };
    const res = await $content(app.i18n.locale, "char").only(["id", "name", "localeName", "element", "rarity", "weapon"]).fetch<IAvatar>().catch(console.error);
    if (Array.isArray(res)) rst.avatarData = res.reduce<{ [x: string]: IAvatar }>((r, v) => (r[v.id] = v) && r, {});
    return rst;
  },
  apollo: {
    me: MeDocument,
    userBuilds: UserBuildsDocument,
  },
})
export default class Page extends Vue {
  selectedBuild: IUserBuild | null = null;
  editTitle = false;
  avatarData: { [x: string]: IAvatar } = {};

  removeBuildDialog = false;
  toRemoveBuild = "";
  drawer = false;

  /// ==== mutation ====
  setUserBuild(variables: SetUserBuildMutationVariables) {
    return this.$apollo.mutate<SetUserBuildMutation>({ mutation: SetUserBuildDocument, variables, refetchQueries: ["UserBuilds"] });
  }

  removeUserBuild(variables: RemoveUserBuildMutationVariables) {
    return this.$apollo.mutate<RemoveUserBuildMutation>({
      mutation: RemoveUserBuildDocument,
      variables,
      update: (cache, { data }) => {
        if (!data) return;
        const builds = cache.readQuery({ query: UserBuildsDocument }) as UserBuildsQuery;
        builds.userBuilds = builds.userBuilds.filter(v => v.id !== data.removeUserBuild.id);
        cache.writeQuery({ query: UserBuildsDocument, data: builds });
      },
    });
  }

  confirmRemoveBuild() {
    if (this.toRemoveBuild) {
      this.removeUserBuild({ id: this.toRemoveBuild });
      this.toRemoveBuild = "";
      this.removeBuildDialog = false;
    }
  }

  newBuild() {
    const defaultData: IUserBuild = {
      cores: [],
      tags: [],
      cover: "",
      desc: "",
      avatars: [],
    };
    this.setUserBuild({ data: { ...defaultData, avatars: "[]" } });
  }

  selectBuild(bd: IUserBuild) {
    this.editTitle = false;
    this.selectedBuild = bd;
  }

  commitEdit() {
    this.editTitle = false;
    if (!this.selectedBuild) return;
    const bd = this.selectedBuild;
    this.setUserBuild({
      data: { id: bd.id, title: bd.title, cores: bd.cores, tags: bd.tags, cover: bd.cover, desc: bd.desc, avatars: JSON.stringify(bd.avatars) },
    });
  }
}
</script>
<style lang="less">
.gsm-build-index {
  .build-list-item {
    .v-list-item__title.v-list-item__title {
      line-height: 28px;
    }
    &.active {
      padding-right: 0;
      border-right: 4px solid;
    }
  }
  .title-editable {
    border: 1px solid transparent;
  }
  .title-editable:hover {
    border-color: unset;
  }
  .empty-char-plus {
    display: inline-block;
    width: 80px;
  }
}
</style>
