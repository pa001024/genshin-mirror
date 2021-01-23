<template>
  <v-app id="inspire">
    <v-system-bar v-if="isStandlone" app>
      <v-spacer></v-spacer>
      <v-icon>mdi-square</v-icon>
      <v-icon>mdi-circle</v-icon>
      <v-icon>mdi-triangle</v-icon>
    </v-system-bar>

    <!-- 顶栏 -->
    <v-app-bar app clipped-right flat height="72">
      <v-btn icon @click="drawer = true">
        <GsIcon v-if="!drawer" type="logo" :size="32" />
      </v-btn>
      <v-spacer></v-spacer>
      <div style="height: 24px" class="mr-4">
        <v-switch v-model="$vuetify.theme.dark" inset :label="$t('ui.switchTheme')" />
      </div>
      <div class="username">
        {{ username }}
      </div>
      <!-- <v-responsive max-width="156">
        <v-text-field dense flat hide-details rounded solo-inverted></v-text-field>
      </v-responsive> -->
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app width="56">
      <!-- 站头 -->
      <nuxt-link to="/">
        <v-btn color="transparent" fab elevation="0" small class="d-block text-center mx-auto mt-4 main-site-btn"><GsIcon type="logo" /></v-btn>
      </nuxt-link>
      <v-divider color="white" class="mx-3 my-5"></v-divider>

      <!-- 主导航栏 -->
      <v-tooltip v-for="item in links" :key="item.name" right>
        <template v-slot:activator="{ on, attrs }">
          <nuxt-link :to="item.path">
            <v-btn color="transparent" v-bind="attrs" fab elevation="0" small class="d-block text-center mx-auto mb-4 main-nav-btn" v-on="on"
              ><GsIcon :type="item.icon"
            /></v-btn>
          </nuxt-link>
        </template>
        <span>{{ $t(`navigate.${item.name}`) }}</span>
      </v-tooltip>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>

    <!-- <v-footer app color="transparent" height="72" inset>
      <v-text-field background-color="grey lighten-1" dense flat hide-details rounded solo></v-text-field>
    </v-footer> -->
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Getter } from "vuex-class";

@Component({})
export default class DefaultLayout extends Vue {
  @Getter("app/username") username!: string;

  get isStandlone() {
    return false;
  }

  links = [
    { name: "avatar", path: "/char", icon: "avatar" },
    { name: "weapon", path: "/weapon", icon: "weapon" },
    { name: "artifact", path: "/artifact", icon: "artifact" },
    { name: "enemy", path: "/enemy", icon: "quest" },
    { name: "material", path: "/item", icon: "mineral" },
    { name: "setting", path: "/setting", icon: "setting" },
  ];

  drawer = null;
}
</script>

<style lang="less" scoped>
.main-nav-btn {
  font-size: 1.5rem !important;
}
.main-site-btn {
  font-size: 2rem !important;
}
</style>
