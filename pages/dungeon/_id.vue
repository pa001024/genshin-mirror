<template>
  <div v-if="data" class="gsm-dungeon">
    <v-card max-width="560" class="mx-auto">
      <v-card-title>
        <v-list-item two-line class="mt-2">
          <v-list-item-action>
            <v-avatar color="grey" size="48" />
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="headline"> {{ data.localeName }}</v-list-item-title>
            <v-list-item-subtitle v-text="data.name" />
          </v-list-item-content>
        </v-list-item>
      </v-card-title>
      <v-card-text>
        <div class="desc" v-html="parseDesc(data.desc)" />
        <v-divider class="mb-2 mt-4" />
        <v-row>
          <v-col cols="6">
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-subtitle v-text="$t('ui.dungeonType')" />
                <v-list-item-title class="headline" v-text="$t(`dungeon.${data.type}`)" />
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="6">
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-subtitle v-text="$t('ui.recommandElements')" />
                <v-list-item-title>
                  <ElementIcon v-for="ele in data.elements" :key="ele" :element="ele" />
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
  <div v-else class="error">{{ $t("ui.dungeon404") }}</div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { IDungeon } from "~/modules/core";

@Component<Page>({
  // server
  async asyncData({ params: { id }, $content, app }) {
    const rst: Partial<Page> = { id, data: null };
    if (id.includes("../")) return { id };
    const res = (await $content(app.i18n.locale, "dungeon")
      .where({ id: +id })
      .fetch()
      .catch(console.error)) as any;
    rst.data = res && res[0];

    return rst;
  },
  // set html header
  head() {
    // Set Meta Tags for this Page
    const title = this.$t("title.sub", [this.data?.localeName]) as string;
    return { title };
  },
})
export default class Page extends Vue {
  id: string = "";
  data: IDungeon | null = null;

  parseDesc(str: string) {
    return str.replace(/<color=(.+?)>(.+?)<\/color>/g, `<span style="color:$1">$2</span>`).replace(/\n/g, "<br>");
  }
}
</script>
