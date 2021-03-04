<template>
  <div class="gsm-build-index">
    <v-row>
      <!-- 左边栏 -->
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
                    <v-btn v-if="selectedBuild && bd.id === selectedBuild.id" icon small :to="`/build/${bd.id}`">
                      <v-icon size="16">mdi-pencil</v-icon>
                    </v-btn>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-list>
        </v-card>
      </v-col>
      <!-- 主内容 -->
      <v-col cols="8">
        <v-card v-if="selectedBuild">
          <v-card-title class="headline">
            <v-text-field v-if="editTitle" v-model="selectedBuild.title" autofocus />
            <v-btn
              v-if="editTitle"
              icon
              @click="
                editTitle = false;
                commitEdit();
              "
            >
              <v-icon>mdi-check</v-icon>
            </v-btn>
            <v-btn v-if="editTitle" icon @click="editTitle = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <div v-if="!editTitle" class="title-editable" @click="editTitle = true">
              {{ selectedBuild.title || $t("ui.untitled") }}
            </div>
          </v-card-title>
          <v-card-text>
            <div class="avatars-container d-flex">
              <CharCard v-for="(char, index) in avatars" :key="index" class="mx-1" :value="char" :link="false" @click="selectedCharSlot = index" />
            </div>
            <!-- 弹出:选择角色 -->
            <v-overlay v-if="false" :value="selectedCharSlot >= 0" transition="scroll-y-reverse-transition">
              <v-card v-if="selectedAvatar" class="avatar-level-edit">
                <v-card-title class="headline">
                  <v-btn icon @click="selectedCharSlot = -1">
                    <v-icon>mdi-arrow-left</v-icon>
                  </v-btn>
                  <CharImage :id="selectedAvatarId" avatar />
                  {{ avatars[selectedAvatarId].localeName }}
                  <v-spacer />
                  <v-btn icon @click="removeUserAvatar({ id: selectedAvatarId })">
                    <v-icon color="red darken-3">mdi-delete</v-icon>
                  </v-btn>
                  <v-slide-x-transition>
                    <v-btn v-if="avatarChanged" icon @click="editUserAvatar(selectedAvatar)">
                      <v-icon>mdi-check</v-icon>
                    </v-btn>
                  </v-slide-x-transition>
                  <v-btn icon @click="selectedAvatarId = ''">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-card-title>
                <v-card-text>
                  <div class="main-level">
                    <C13nLevel v-model="selectedAvatar.talentLevel" class="mb-1" />
                    <PromoteLevel v-model="selectedAvatar.promoteLevel" />
                    <v-slider
                      v-model="selectedAvatar.level"
                      :label="$t('ui.level', [selectedAvatar.level])"
                      :min="minLvl(selectedAvatar.promoteLevel)"
                      :max="maxLvl(selectedAvatar.promoteLevel)"
                      hide-details
                    />
                  </div>
                  <div class="skill-level">
                    <div class="skill-level__input">
                      <input v-model="selectedAvatar.attackLevel" type="number" :min="1" :max="10" />
                      <span>{{ $t("ui.attackSkill") }}</span>
                    </div>
                    <div class="skill-level__input">
                      <input v-model="selectedAvatar.eLevel" type="number" :min="1" :max="10" />
                      <span>{{ $t("ui.elemSkill") }}</span>
                    </div>
                    <div class="skill-level__input">
                      <input v-model="selectedAvatar.qLevel" type="number" :min="1" :max="10" />
                      <span>{{ $t("ui.elemBurst") }}</span>
                    </div>
                  </div>
                  <v-card-text align="center">{{ $t("ui.skillLevelDesc") }}</v-card-text>
                </v-card-text>
              </v-card>
              <v-card v-else class="avatar-level-edit" flat>
                <v-card-title class="py-0">
                  <CharImage :id="selectedAvatarId" avatar :size="48" />
                  <v-card flat>
                    <v-card-title class="headline">
                      <span class="name mr-2">{{ avatars[selectedAvatarId].localeName }}</span>
                    </v-card-title>
                    <v-card-subtitle>
                      <Rarity :value="avatars[selectedAvatarId].rarity" />
                    </v-card-subtitle>
                  </v-card>
                  <v-spacer />
                  <v-btn icon @click="selectedAvatarId = ''">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-card-title>
                <v-card-actions>
                  <v-btn block @click="addDefaultAvatar(selectedAvatarId)">
                    <v-icon>mdi-lock-open</v-icon>
                    {{ $t("ui.unlock") }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-overlay>
            {{ selectedBuild }}
          </v-card-text>
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
  editTitle = false;
  selectedCharSlot = -1;

  setUserBuild(variables: SetUserBuildMutationVariables) {
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
    this.setUserBuild({ data: { ...defaultData, avatars: "[]" } });
  }

  selectBuild(bd: IUserBuild) {
    this.editTitle = false;
    this.selectedBuild = bd;
  }

  commitEdit() {
    if (!this.selectedBuild) return;
    const bd = this.selectedBuild;
    this.setUserBuild({
      data: { id: bd.id, title: bd.title, cores: bd.cores, tags: bd.tags, cover: bd.cover, desc: bd.desc, avatars: JSON.stringify(bd.avatars) },
    });
  }

  get avatars() {
    if (!this.selectedBuild) return [];
    const rst = this.selectedBuild.avatars;
    return rst.concat(Array(4 - (rst ? rst.length : 0)).fill(null));
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
