<template>
  <v-card class="inv-main mx-auto">
    <v-tabs v-model="tab" centered icons-and-text>
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
          <v-row>
            <v-col cols="12" :lg="4">
              <!-- 内容 -->
              <CharCard
                v-for="item in avatars"
                :key="item.id"
                :value="item"
                class="ma-1"
                small
                :link="false"
                :class="{ selected: selectedAvatar && selectedAvatar.avatarId === item.id }"
                @click="selectAvatar(item)"
              />
            </v-col>
            <v-col v-if="selectedAvatar" cols="12" lg="8">
              <v-card class="avatar-level-edit" flat>
                <v-card-title class="headline">{{ char.localeName }}</v-card-title>
                <v-card-text>
                  <div class="main-level">
                    <PromoteLevel v-model="selectedAvatar.promoteLevel" />
                    <v-slider v-model="selectedAvatar.level" :label="$t('ui.level', [selectedAvatar.level])" :min="minCharLvl" :max="maxCharLvl" />
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
            </v-col>
            <v-col v-else cols="12" lg="8">{{ $t("ui.pleaseSelectAvatar") }}</v-col>
          </v-row>
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
import { cloneDeep } from "lodash";
import type { IArtifact, IArtifactSet, IArtifactType, IAvatar, IUserAvatar, IUserWeapon, IWeapon } from "~/modules/core";

/**
 * 库存 inventory
 *
 * 管理圣遗物/角色/武器等入口
 */
@Component<Page>({
  // server
  async asyncData({ $content, app }) {
    const rst: Partial<Page> = { avatars: null, weapons: null, types: null, sets: null };
    const avatars = await $content(app.i18n.locale, "char")
      .only(["id", "name", "localeName", "element", "rarity", "weapon"])
      .sortBy("rarity", "desc")
      .fetch<IAvatar>()
      .catch(console.error);
    if (Array.isArray(avatars)) rst.avatars = avatars.reduce<{ [id: string]: IAvatar }>((r, v) => (r[v.id] = v) && r, {});
    const weapons = await $content(app.i18n.locale, "relic").only(["id", "name", "localeName"]).fetch<IWeapon>().catch(console.error);
    if (Array.isArray(weapons)) rst.weapons = weapons.reduce<{ [id: string]: IWeapon }>((r, v) => (r[v.id] = v) && r, {});
    const types = await $content(app.i18n.locale, "relic").fetch<IArtifactType>().catch(console.error);
    if (Array.isArray(types)) rst.types = types.reduce<{ [id: string]: IArtifactType }>((r, v) => (r[v.id] = v) && r, {});
    const sets = await $content(app.i18n.locale, "relicset").fetch<IArtifactSet>().catch(console.error);
    if (Array.isArray(sets)) rst.sets = sets.reduce<{ [id: string]: IArtifactSet }>((r, v) => (r[v.id] = v) && r, {});
    return rst;
  },
  // set html header
  head() {
    // Set Meta Tags for this Page
    const title = this.$t("title.sub", [this.$t("navigate.inv")]) as string;
    return { title };
  },
})
export default class Page extends Vue {
  @Getter("app/userAvatars") userAvatars!: IUserAvatar[];
  @Getter("app/userWeapons") userWeapons!: IUserWeapon[];
  @Getter("app/artifacts") artifacts!: IArtifact[];
  @Action("app/loadArtifacts") loadArtifacts!: () => void;
  @Action("app/removeAvatar") removeAvatar!: (id: string) => void;
  overlay = false;
  menu = false;
  tab = "char";
  // data
  avatars: { [id: string]: IAvatar } | null = null;
  weapons: { [id: string]: IWeapon } | null = null;
  types: { [id: string]: IArtifactType } | null = null;
  sets: { [id: string]: IArtifactSet } | null = null;
  // select bind
  selectedAvatar: IUserAvatar | null = null;
  selectedWeapon = null;
  selectedArtifactType = null;
  selectedArtifactSet = null;

  get char() {
    return this.avatars && this.selectedAvatar && this.avatars[this.selectedAvatar.avatarId];
  }

  selectAvatar(a: IAvatar) {
    const current =
      this.userAvatars.find(v => v.avatarId === a.id) ||
      ({ avatarId: a.id, level: 90, promoteLevel: 6, talentLevel: 0, attackLevel: 6, eLevel: 6, qLevel: 6 } as IUserAvatar);
    this.selectedAvatar = cloneDeep(current);
  }

  get minCharLvl() {
    return [1, 20, 40, 50, 60, 70, 80][this.selectedAvatar!.promoteLevel];
  }

  get maxCharLvl() {
    return [20, 40, 50, 60, 70, 80, 90][this.selectedAvatar!.promoteLevel];
  }

  deleteAvatar(_ua: IUserAvatar) {
    //
  }

  // 加载角色数据
  created() {}
}
</script>
<style lang="less">
.inv-main {
  display: block;
}
.avatar-level-edit {
  .skill-level {
    margin-top: 24px;
    display: flex;
    .skill-level__input {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      align-items: center;
      input {
        border: thin solid var(--shadow);
        color: var(--text-grey);
        border-radius: 4px;
        margin-bottom: 8px;
        min-width: 0;
        outline: none;
        text-align: center;
        width: 64px;
        height: 28px;
      }
      span {
        font-size: 0.75rem;
      }
    }
  }
}
</style>
