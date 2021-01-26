<template>
  <v-card class="inv-main mx-auto">
    <v-tabs v-model="tab" centered dark icons-and-text>
      <v-tabs-slider></v-tabs-slider>

      <v-tab href="#char">
        {{ $t("navigate.avatar") }}
        <GsIcon type="char" size="28" />
      </v-tab>

      <v-tab href="#weapon">
        {{ $t("navigate.weapon") }}
        <GsIcon type="weapon" size="28" />
      </v-tab>

      <v-tab href="#artifact">
        {{ $t("navigate.artifact") }}
        <GsIcon type="artifact" size="28" />
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item value="char">
        <div class="inv-char-list pa-4">
          <v-menu
            v-for="ua in userAvatars"
            :key="ua.id"
            v-model="menu"
            bottom
            right
            transition="scale-transition"
            origin="top left"
            :close-on-content-click="false"
          >
            <template #activator="{ on }">
              <v-chip pill close v-on="on" @click="loadAvatar(ua)" @click:close="deleteAvatar(ua)">
                <CharImage id="Diluc" avatar />
                Diluc
              </v-chip>
            </template>
            <v-card width="300">
              <v-list dark>
                <v-list-item>
                  <v-list-item-avatar>
                    <CharImage id="Diluc" />
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>Diluc</v-list-item-title>
                    <v-list-item-subtitle>Diluc</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn icon @click="menu = false">
                      <v-icon>mdi-close-circle</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
              <v-list>
                <v-list-item>
                  <v-list-item-content v-if="char">
                    <v-slider
                      v-model="char.level"
                      :label="$t('ui.levels')"
                      persistent-hint
                      :hint="$t('ui.level', [char.level])"
                      :max="char.maxLevel"
                      :min="char.minLevel"
                    />
                    <PromoteLevel />
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
        </div>
      </v-tab-item>
      <v-tab-item value="weapon"> </v-tab-item>
      <v-tab-item value="artifact">
        <v-card flat>
          <!-- <nuxt-link to="/doc/artifact">文档</nuxt-link> -->
          <v-row>
            <v-col v-if="types" cols="6" class="d-flex flex-wrap">
              <v-btn @click="overlay = !overlay">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
              <v-overlay absolute :value="overlay">
                <AddArtifact />
                <v-btn color="success" @click="overlay = false">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-overlay>
            </v-col>
            <v-col cols="6"> </v-col>
          </v-row>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";
import { Avatar, IArtifact, IArtifactType, IAvatar, IUserAvatar, IUserWeapon, IWeapon } from "~/modules/core";

/**
 * 库存 inventory
 *
 * 管理圣遗物/角色/武器等入口
 */
@Component<Page>({
  // server
  // async asyncData({ $content, app }) {
  //   const rst: Partial<Page> = { types: null, sets: null };
  //   const types = (await $content(app.i18n.locale, "relic").fetch().catch(console.error)) as any;
  //   const sets = (await $content(app.i18n.locale, "relicset").fetch().catch(console.error)) as any;
  //   rst.types = types;
  //   rst.sets = sets;
  //   return rst;
  // },
  // set html header
  head() {
    // Set Meta Tags for this Page
    const title = this.$t("title.sub", [this.$t("title.artifact")]) as string;
    return { title };
  },
})
export default class Page extends Vue {
  @Getter("app/avatars") avatars!: { [id: string]: IAvatar } | null;
  @Getter("app/weapons") weapons!: { [id: string]: IWeapon } | null;
  @Getter("app/userAvatars") userAvatars!: IUserAvatar[];
  @Getter("app/userWeapons") userWeapons!: IUserWeapon[];
  @Getter("app/artifacts") artifacts!: IArtifact[];
  @Getter("app/artifactTypes") types!: IArtifactType[];
  @Action("app/loadArtifacts") loadArtifacts!: () => void;
  @Action("app/removeAvatar") removeAvatar!: (id: string) => void;
  overlay = false;
  menu = false;
  tab = "char";

  filteredTypes(r: number) {
    return this.types?.filter(v => v.rarity === r);
  }

  char: Avatar | null = null;
  loadAvatar(ua: IUserAvatar) {
    const a = this.avatars && this.avatars[ua.avatarId];
    if (a) this.char = new Avatar(a);
  }

  deleteAvatar(_ua: IUserAvatar) {
    //
  }
}
</script>
<style lang="less">
.inv-main {
  display: block;
}
</style>
