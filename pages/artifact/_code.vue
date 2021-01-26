<template>
  <div v-if="code && artifact" class="gsm-item">
    <v-card max-width="560" class="mx-auto">
      <v-card-title>
        <v-list-item two-line>
          <v-list-item-action>
            <v-avatar color="grey" size="48" />
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="headline"> {{ artifact.toString() }}</v-list-item-title>
            <v-list-item-subtitle v-text="$t(`artifact.part.${artifact.part}`)" />
          </v-list-item-content>
        </v-list-item>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-list-item v-for="attr in artifact.attrs" :key="attr.type" two-line>
            <v-list-item-content>
              <v-list-item-subtitle v-text="$t(`buff.${attr.type}`)" />
              <v-list-item-title class="headline" v-text="renderAttr(attr.type, attr.value)" />
            </v-list-item-content>
          </v-list-item>
        </v-row>
        <v-divider class="my-2" />
        <v-card-text v-text="artifact.desc" />
      </v-card-text>
    </v-card>
  </div>
  <div v-else class="error">{{ $t("ui.item404") }}</div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { ARTIFACT, BuffType, IArtifact, IArtifactType } from "~/modules/core";
import { Artifact } from "~/modules/core/Artifact";

@Component<Page>({
  // server
  async asyncData({ params: { code }, $content, app }) {
    const rst: Partial<Page> = { code, artifactTypes: null, artifact: null };
    const id = Artifact.getTypeId(code);
    const res = await $content(app.i18n.locale, "relic").where({ id }).fetch<IArtifactType>().catch(console.error);
    if (Array.isArray(res)) {
      rst.artifactTypes = { [id]: res[0] };
      rst.artifact = Artifact.fromCode(code, { [id]: res[0] });
    }

    return rst;
  },
  // set html header
  head() {
    // Set Meta Tags for this Page
    const title = this.$t("title.sub", [this.artifact?.toString()]) as string;
    return { title };
  },
})
export default class Page extends Vue {
  code!: string;
  artifact: Artifact | null = null;
  artifactTypes!: { [id: number]: IArtifactType } | null;

  renderAttr(type: BuffType, value: number) {
    if (type in ARTIFACT.ENCODE_RATIO) {
      return value;
    } else {
      return (value * 100).toFixed(1) + "%";
    }
  }

  @Watch("$route.params.code")
  created() {
    if (!(this.artifact instanceof Artifact)) {
      this.artifact = new Artifact((this.artifact as any) as IArtifact, this.artifactTypes!);
    }
  }
}
</script>
