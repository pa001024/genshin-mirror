<template>
  <v-card v-if="uid" class="inv-main mx-auto">
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

    <client-only>
      <template #placeholder>
        <div class="pa-8">Loading...</div>
      </template>
      <v-tabs-items v-model="tab">
        <v-tab-item value="char">
          <div class="inv-char-list pa-4">
            <!-- 内容 -->
            <CharCard
              v-for="item in mergedAvatars"
              :key="item.id"
              :value="item"
              class="ma-1"
              small
              :link="false"
              :class="{ selected: selectedAvatar && selectedAvatar.avatarId === item.id }"
              :c13n="item.c13n"
              :lv="item.lv"
              :inactive="item.inactive"
              @click="selectAvatar(item)"
            />
            <v-overlay v-if="selectedAvatarId" :value="selectedAvatarId" transition="scroll-y-reverse-transition">
              <v-card v-if="selectedAvatar" class="avatar-level-edit">
                <v-card-title class="headline">
                  <CharImage :id="selectedAvatarId" avatar />
                  {{ avatars[selectedAvatarId].localeName }}
                  <v-spacer />
                  <v-btn icon @click="removeUserAvatar({ id: selectedAvatarId })">
                    <v-icon color="red darken-3">mdi-delete</v-icon>
                  </v-btn>
                  <v-slide-x-transition>
                    <v-btn v-if="avatarChanged" icon @click="editUserAvatar(selectedAvatar)">
                      <v-icon :class="{ spin: avatarSaveLoading }">{{ avatarSaveLoading ? "mdi-sync" : "mdi-check" }}</v-icon>
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
          </div>
        </v-tab-item>
        <v-tab-item value="weapon">
          <div class="inv-weapon-list pa-4">
            <v-tabs v-model="weaponType" centered show-arrows>
              <v-tabs-slider></v-tabs-slider>

              <v-tab href="#1">{{ $t("weapon.1") }}</v-tab>
              <v-tab href="#2">{{ $t("weapon.2") }}</v-tab>
              <v-tab href="#3">{{ $t("weapon.3") }}</v-tab>
              <v-tab href="#4">{{ $t("weapon.4") }}</v-tab>
              <v-tab href="#5">{{ $t("weapon.5") }}</v-tab>
            </v-tabs>
            <!-- 内容 -->
            <WeaponCard
              v-for="item in mergedWeapons"
              :key="item.id"
              :value="item"
              class="ma-1"
              small
              :link="false"
              :class="{ selected: selectedWeapon && selectedWeapon.weaponId === item.id }"
              :refine="item.refine"
              :lv="item.lv"
              :inactive="item.inactive"
              @click="selectWeapon(item)"
            />
            <v-overlay v-if="selectedWeaponId" :value="selectedWeaponId">
              <v-card v-if="selectedWeapon" class="weapon-level-edit">
                <v-card-title class="headline">
                  {{ weapons[selectedWeaponId].localeName }}
                  <v-spacer />
                  <v-btn icon @click="removeUserWeapon({ id: selectedWeaponId })">
                    <v-icon color="red darken-3">mdi-delete</v-icon>
                  </v-btn>
                  <v-slide-x-transition>
                    <v-btn v-if="weaponChanged" icon @click="editUserWeapon(selectedWeapon)">
                      <v-icon :class="{ spin: weaponSaveLoading }">{{ weaponSaveLoading ? "mdi-sync" : "mdi-check" }}</v-icon>
                    </v-btn>
                  </v-slide-x-transition>
                  <v-btn icon @click="selectedWeaponId = ''">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-card-title>
                <v-card-text>
                  <div class="main-level">
                    <RefineLevel v-model="selectedWeapon.refineLevel" class="mb-1" />
                    <PromoteLevel v-model="selectedWeapon.promoteLevel" />
                    <v-slider
                      v-model="selectedWeapon.level"
                      :label="$t('ui.level', [selectedWeapon.level])"
                      :min="minLvl(selectedWeapon.promoteLevel)"
                      :max="maxLvl(selectedWeapon.promoteLevel)"
                      hide-details
                    />
                  </div>
                </v-card-text>
              </v-card>
              <v-card v-else class="weapon-level-edit" flat>
                <v-card-title class="py-0">
                  <WeaponImage :id="selectedWeaponId" :size="48" />
                  <v-card flat>
                    <v-card-title class="headline">
                      <span class="name mr-2">{{ weapons[selectedWeaponId].localeName }}</span>
                    </v-card-title>
                    <v-card-subtitle>
                      <Rarity :value="weapons[selectedWeaponId].rarity" />
                    </v-card-subtitle>
                  </v-card>
                  <v-spacer />
                  <v-btn icon @click="selectedWeaponId = ''">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-card-title>
                <v-card-actions>
                  <v-btn block @click="addDefaultWeapon(selectedWeaponId)">
                    <v-icon>mdi-lock-open</v-icon>
                    {{ $t("ui.unlock") }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-overlay>
          </div>
        </v-tab-item>
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
      <v-snackbar v-model="showMsg" :timeout="4000">
        <v-icon size="24">mdi-alert</v-icon>
        {{ msg }}
        <template #action="{ attrs }">
          <v-btn color="blue" text v-bind="attrs" @click="showMsg = false">{{ $t("ui.close") }}</v-btn>
        </template>
      </v-snackbar>
    </client-only>
  </v-card>
  <v-skeleton-loader v-else type="list-item-avatar, divider, list-item-three-line, card-heading, image, actions">{{ $t("ui.pleaseLogin") }}</v-skeleton-loader>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { cloneDeep, filter, keyBy, partition } from "lodash";
import type { IArtifact, IArtifactSet, IArtifactType, IAvatar, IUserAvatar, IUserWeapon, IWeapon } from "~/modules/core";
import {
  MeDocument,
  RemoveUserCharacterDocument,
  RemoveUserCharacterMutation,
  RemoveUserCharacterMutationVariables,
  RemoveUserWeaponDocument,
  RemoveUserWeaponMutation,
  RemoveUserWeaponMutationVariables,
  SetUserCharacterDocument,
  SetUserCharacterMutation,
  SetUserCharacterMutationVariables,
  SetUserWeaponDocument,
  SetUserWeaponMutation,
  SetUserWeaponMutationVariables,
  UserCharactersDocument,
  UserCharactersQuery,
  UserWeaponsDocument,
  UserWeaponsQuery,
} from "~/api/generated/graphql";

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
    const weapons = await $content(app.i18n.locale, "weapon")
      .only(["id", "name", "localeName", "type", "rarity"])
      .sortBy("rarity", "desc")
      .fetch<IWeapon>()
      .catch(console.error);
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
  apollo: {
    me: MeDocument,
    userCharacters: UserCharactersDocument,
    userWeapons: UserWeaponsDocument,
  },
})
export default class Page extends Vue {
  me?: { id: string; username: string };
  get uid() {
    return this.me?.id;
  }

  setUserAvatar(variables: SetUserCharacterMutationVariables) {
    return this.$apollo.mutate<SetUserCharacterMutation>({
      mutation: SetUserCharacterDocument,
      variables,
      refetchQueries: ["UserCharacters"],
    });
  }

  removeUserAvatar(variables: RemoveUserCharacterMutationVariables) {
    this.selectedAvatarId = "";
    return this.$apollo.mutate<RemoveUserCharacterMutation>({
      mutation: RemoveUserCharacterDocument,
      variables,
      update: (cache, { data }) => {
        const avatars = cache.readQuery({ query: UserCharactersDocument }) as UserCharactersQuery;
        avatars.userCharacters = avatars.userCharacters.filter(v => v.id !== data?.removeUserCharacter.id);
        cache.writeQuery({ query: UserCharactersDocument, data: avatars });
      },
    });
  }

  setUserWeapon(variables: SetUserWeaponMutationVariables) {
    return this.$apollo.mutate<SetUserWeaponMutation>({ mutation: SetUserWeaponDocument, variables, refetchQueries: ["UserWeapons"] });
  }

  removeUserWeapon(variables: RemoveUserWeaponMutationVariables) {
    this.selectedWeaponId = "";
    return this.$apollo.mutate<RemoveUserWeaponMutation>({
      mutation: RemoveUserWeaponDocument,
      variables,
      update: (cache, { data }) => {
        const avatars = cache.readQuery({ query: UserWeaponsDocument }) as UserWeaponsQuery;
        avatars.userWeapons = avatars.userWeapons.filter(v => v.id !== data?.removeUserWeapon.id);
        cache.writeQuery({ query: UserWeaponsDocument, data: avatars });
      },
    });
  }

  userCharacters!: IUserAvatar[];
  userWeapons!: IUserWeapon[];

  overlay = false;
  menu = false;
  tab = "char";
  // data
  avatars: { [id: string]: IAvatar } | null = null;
  weapons: { [id: string]: IWeapon } | null = null;
  types: { [id: string]: IArtifactType } | null = null;
  sets: { [id: string]: IArtifactSet } | null = null;

  // avatar
  selectedAvatarId: string = "";
  selectedAvatar: IUserAvatar | null = null;
  avatarSaveLoading = false;
  avatarChanged = false;

  // weapon
  weaponType = 1;
  selectedWeaponId = "";
  selectedWeapon: IUserWeapon | null = null;
  weaponSaveLoading = false;
  weaponChanged = false;

  // artifact
  selectedArtifactType = "";
  selectedArtifactSet = "";

  // common
  showMsg = false;
  msg = "";

  @Watch("selectedAvatar", { deep: true })
  onSelectedAvatarChange(next: IUserAvatar | null, prev: IUserAvatar | null) {
    if (prev === null || next === null) {
      this.avatarChanged = false;
    } else if (prev.avatarId === next.avatarId) {
      this.avatarChanged = true;
    }
  }

  @Watch("selectedWeapon", { deep: true })
  onSelectedWeaponChange(next: IUserWeapon | null, prev: IUserWeapon | null) {
    if (prev === null || next === null) {
      this.weaponChanged = false;
    } else if (prev.weaponId === next.weaponId) {
      this.weaponChanged = true;
    }
  }

  selectAvatar(a: IAvatar) {
    this.selectedAvatarId = a.id;
    const current = this.userCharacters.find(v => v.avatarId === a.id);
    if (!current) {
      this.selectedAvatar = null;
      return;
    }
    this.selectedAvatar = cloneDeep(current);
  }

  selectWeapon(a: IWeapon) {
    this.selectedWeaponId = a.id;
    const current = this.userWeapons.find(v => v.weaponId === a.id);
    if (!current) {
      this.selectedWeapon = null;
      return;
    }
    this.selectedWeapon = cloneDeep(current);
  }

  async editUserAvatar(ua: IUserAvatar) {
    this.avatarSaveLoading = true;
    try {
      await this.setUserAvatar({
        data: {
          avatarId: ua.avatarId,
          level: +ua.level,
          promoteLevel: +ua.promoteLevel,
          talentLevel: +ua.talentLevel,
          attackLevel: +ua.attackLevel,
          eLevel: +ua.eLevel,
          qLevel: +ua.qLevel,
        },
      });
      this.avatarChanged = false;
    } catch {
      this.showMsg = true;
      this.msg = this.$t("ui.syncFailed") as string;
    }
    this.avatarSaveLoading = false;
  }

  async editUserWeapon(uw: IUserWeapon) {
    this.weaponSaveLoading = true;
    try {
      await this.setUserWeapon({
        data: {
          weaponId: uw.weaponId,
          level: +uw.level,
          promoteLevel: +uw.promoteLevel,
          refineLevel: +uw.refineLevel,
        },
      });
      this.weaponChanged = false;
    } catch {
      this.showMsg = true;
      this.msg = this.$t("ui.syncFailed") as string;
    }
    this.weaponSaveLoading = false;
  }

  addDefaultAvatar(id: string) {
    const ua: IUserAvatar = {
      avatarId: id,
      level: 90,
      promoteLevel: 6,
      talentLevel: 0,
      attackLevel: 6,
      eLevel: 6,
      qLevel: 6,
    };
    this.setUserAvatar({ data: ua });
    this.selectedAvatar = cloneDeep(ua);
  }

  addDefaultWeapon(id: string) {
    const uw: IUserWeapon = {
      weaponId: id,
      level: 90,
      promoteLevel: 6,
      refineLevel: 1,
    };
    this.setUserWeapon({ data: uw });
    this.selectedWeapon = cloneDeep(uw);
  }

  get mergedAvatars() {
    const um = keyBy(this.userCharacters, "avatarId");
    const [enabled, disabled] = partition(this.avatars, v => um[v.id]);
    return enabled
      .map(v => {
        const u = um[v.id];
        return {
          ...v,
          lv: u.level,
          c13n: u.talentLevel,
        } as IExtendedAvatar;
      })
      .concat(disabled.map(v => ({ ...v, inactive: true })));
  }

  get mergedWeapons() {
    const um = keyBy(this.userWeapons, "weaponId");
    const [enabled, disabled] = partition(
      filter(this.weapons, v => v.type === +this.weaponType),
      v => um[v.id]
    );
    return enabled
      .map(v => {
        const u = um[v.id];
        return {
          ...v,
          lv: u.level,
          refine: u.refineLevel,
        } as IExtendedWeapon;
      })
      .concat(disabled.map(v => ({ ...v, inactive: true })));
  }

  minLvl(promoteLevel: number) {
    return [1, 20, 40, 50, 60, 70, 80][promoteLevel];
  }

  maxLvl(promoteLevel: number) {
    return [20, 40, 50, 60, 70, 80, 90][promoteLevel];
  }

  @Watch("uid")
  reloadData() {
    // console.log("reloadData...");
    // this.fetchAvatars();
    // this.fetchWeapons();
  }
}

interface IExtendedAvatar extends IAvatar {
  lv?: number;
  c13n?: number;
  inactive?: boolean;
}
interface IExtendedWeapon extends IWeapon {
  lv?: number;
  refine?: number;
  inactive?: boolean;
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
