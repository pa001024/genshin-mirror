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
      <v-btn icon class="mr-2" @click="$vuetify.theme.dark = !$vuetify.theme.dark">
        <v-icon>{{ $vuetify.theme.dark ? "mdi-brightness-2" : "mdi-white-balance-sunny" }}</v-icon>
      </v-btn>
      <v-menu v-if="username" offset-y>
        <template #activator="{ on, attrs }">
          <v-btn plain v-bind="attrs" v-on="on">
            {{ username }}
          </v-btn>
        </template>
        <v-list>
          <v-list-item :to="'/user/' + uid">
            <v-list-item-title>{{ $t("ui.mySpace") }}</v-list-item-title>
          </v-list-item>
          <v-list-item class="nolink" to="/" @click="logout">
            <v-list-item-title>{{ $t("ui.logout") }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <nuxt-link v-else to="/login" tag="div">
        <v-btn icon>
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </nuxt-link>
      <!-- <v-responsive max-width="156">
        <v-text-field dense flat hide-details rounded solo-inverted></v-text-field>
      </v-responsive> -->
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app width="56">
      <!-- 站头 -->
      <nuxt-link to="/" exact>
        <v-btn color="transparent" fab elevation="0" small class="d-block text-center mx-auto mt-4 main-site-btn"><GsIcon type="logo" /></v-btn>
      </nuxt-link>
      <v-divider color="white" class="mx-3 my-5"></v-divider>

      <!-- 主导航栏 -->
      <v-tooltip v-for="item in links" :key="item.name" right>
        <template #activator="{ on, attrs }">
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
import { Action, Getter } from "vuex-class";

@Component({})
export default class DefaultLayout extends Vue {
  @Getter("app/username") username!: string;
  @Getter("app/uid") uid!: string;
  @Action("app/logout") logout!: string;

  get isStandlone() {
    return false;
  }

  links = [
    { name: "avatar", path: "/char", icon: "char" },
    { name: "weapon", path: "/weapon", icon: "weapon" },
    { name: "artifact", path: "/artifact", icon: "artifact" },
    { name: "enemy", path: "/enemy", icon: "enemy" },
    { name: "material", path: "/item", icon: "mineral" },
    { name: "inv", path: "/my", icon: "char_item" },
    { name: "setting", path: "/setting", icon: "setting" },
  ];

  drawer = null;

  created() {
    if (this.$store.state.app.auth) {
      console.log("user has login");
      this.$axios.setHeader("Authorization", this.$store.state.app.auth);
    }
  }
}
</script>

<style lang="less" scoped>
.main-nav-btn {
  font-size: 1.5rem !important;
}
.main-site-btn {
  font-size: 2rem !important;
}
.nuxt-link-active .v-btn::before {
  opacity: 0.1;
}
</style>
