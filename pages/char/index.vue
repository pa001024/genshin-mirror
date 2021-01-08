<template>
  <v-card class="mx-auto">
    <v-list>
      <template v-for="(item, index) in data">
        <v-subheader v-if="item.subtitle" :key="item.subtitle">
          {{ subtitle }}
        </v-subheader>
        <v-list-item v-if="item.name" :key="item.name">
          <v-list-item-action>
            <v-icon>{{ item.name }}</v-icon>
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title
              ><nuxt-link :to="'char/' + item.name">{{ item.name }}</nuxt-link></v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>

        <v-divider v-if="index > 0 && item.subtitle" :key="index"></v-divider>
      </template>
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
    const res = (await $content("common/char", {}).only(["name", "region"]).sortBy("region", "asc").fetch().catch()) as any;
    rst.data = res;
    if (rst.data) {
      rst.page = await $content(app.i18n.locale, "char")
        .fetch()
        .catch(err => {
          console.error(err);
        });
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

  get items() {
    return this.data?.reduce((r, item, index) => {
      if (index === 0 || r[index - 1].region !== item.region) {
        r.push({ subtitle: this.$t(`region.${item.region}`) as string });
      }
      r.push(item);
      return r;
    }, [] as Partial<ICharacter & { subtitle: string }>[]);
  }
}
</script>
