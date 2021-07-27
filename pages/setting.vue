<template>
  <v-form ref="form">
    <v-container>
      <!-- <v-row>
        <v-col cols="12" md="4"> -->
      <v-radio-group :value="travelerGender" row @change="setTravelerGender($event)">
        <template #label>{{ $t("ui.travelerGender") }}</template>
        <v-radio v-for="gender in [0, 1]" :key="gender" :label="$t(`gender.${gender}`)" :value="gender"></v-radio>
      </v-radio-group>
      <v-radio-group :value="$i18n.locale" row @change="changeLang">
        <template #label>{{ $t("ui.language") }}</template>
        <v-radio v-for="locale in availableLocales" :key="locale.code" :label="locale.name" :value="locale.code"></v-radio>
      </v-radio-group>
      <v-radio-group :value="timezone" row @change="setTimezone($event)">
        <template #label>{{ $t("ui.server") }}</template>
        <v-radio v-for="zone in availableTimezone" :key="zone.zone" :label="zone.name" :value="zone.zone"></v-radio>
      </v-radio-group>
      <!-- </v-col>
      </v-row> -->
      <v-btn color="error" class="mr-4" @click="reset" v-text="$t('ui.reset')" />
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";

@Component({
  head() {
    const title = this.$t("title.sub", [this.$t("navigate.setting")]) as string;
    return { title };
  },
})
export default class IndexPage extends Vue {
  @Getter("app/travelerGender") travelerGender!: number;
  @Getter("app/timezone") timezone!: number;
  @Action("app/setTravelerGender") setTravelerGender!: (v: number) => void;
  @Action("app/setTimezone") setTimezone!: (v: number) => void;

  get availableLocales() {
    return (this.$i18n.locales as any)?.filter((v: any) => v.name);
  }

  get availableTimezone() {
    return [
      { name: "天空岛/世界树", zone: 4 },
      { name: "North America", zone: -9 },
      { name: "Europe", zone: -11 },
    ];
  }

  changeLang(code?: string) {
    const to = code || this.$i18n.defaultLocale || "en";
    console.log("set locale to", to);
    this.$i18n.setLocale(to);
  }

  reset() {
    this.changeLang();
    this.setTravelerGender(0);
  }
}
</script>
