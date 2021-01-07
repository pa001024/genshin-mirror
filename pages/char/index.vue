<template>
  <v-card class="mx-auto">
    <v-list>
      <v-list-group v-for="item in data" :key="item.name" :prepend-icon="item.action">
        <v-list-item-content>
          <v-list-item-title v-text="item.name"></v-list-item-title>
        </v-list-item-content>
      </v-list-group>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { ICharacter } from "~/modules/core";

@Component<Page>({
  // server
  async asyncData({ $content, app }) {
    const rst: Partial<Page> = { data: null, page: null };
    try {
      const res = (await $content("common/char.json").fetch()) as any;
      rst.data = res;
    } catch (e) {}
    if (rst.data) {
      rst.page = await $content(app.i18n.locale + "/char").fetch();
    }
    return rst;
  },
  // set html header
  head() {
    // Set Meta Tags for this Page
    const title = this.$t("title.char") as string;
    return { title };
  },
})
export default class Page extends Vue {
  data: ICharacter[] | null = null;
  page: any = null;
}
</script>
