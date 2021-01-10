<template>
  <v-container>
    <!-- 筛选 -->
    <v-card class="char-filter mb-3">
      <v-card-title>角色</v-card-title>
      <v-card-text> </v-card-text>
    </v-card>
    <!-- 数据 -->
    <v-card class="mx-auto">
      <v-list>
        <template v-for="(item, index) in data">
          <!-- 分类标题 -->
          <v-subheader v-if="item.subtitle" :key="item.subtitle">
            {{ subtitle }}
          </v-subheader>
          <!-- 内容 -->
          <nuxt-link :key="item.name" :to="'char/' + item.name" class="nolink">
            <v-list-item v-if="item.name">
              <v-list-item-action>
                <v-avatar><CharImage :name="item.name" /></v-avatar>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title>
                  {{ $t(`char.${item.name}`) }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </nuxt-link>

          <v-divider v-if="index > 0 && item.subtitle" :key="index"></v-divider>
        </template>
      </v-list>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { ICharacter } from "~/modules/core";

@Component<Page>({
  // server
  async asyncData({ $content, app }) {
    const rst: Partial<Page> = { data: null, page: null };
    const res = (await $content("common/char").only(["name", "region", "element"]).sortBy("region", "asc").fetch().catch()) as any;
    rst.data = res;
    if (rst.data) {
      rst.page = await $content(app.i18n.locale, "char").fetch().catch(console.error);
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

<style lang="less" scoped>
.nolink {
  color: rgba(0, 0, 0, 0.87);
  text-decoration: none;
}
</style>
