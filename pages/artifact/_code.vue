<template>
  <div v-if="code && artifact">
    <v-card max-width="560" class="mx-auto gsm-artifact-card">
      <v-card-title>
        <v-list-item two-line>
          <!-- <v-list-item-action>
            <v-avatar color="grey" size="48" />
          </v-list-item-action> -->
          <v-list-item-content>
            <v-list-item-title class="headline"> {{ artifact.localeName }}</v-list-item-title>
            <v-list-item-subtitle v-text="$t(`artifactPart.${artifact.part}`)" />
          </v-list-item-content>
        </v-list-item>
      </v-card-title>
      <v-card-text>
        <div class="headline relic-main-prop">
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-subtitle v-text="$t(`buff.${artifact.mainAttr.type}`)" />
              <v-list-item-title class="headline" v-text="renderAttr(artifact.mainAttr.type, artifact.mainAttr.value)" />
              <Rarity :value="artifact.rarity" />
            </v-list-item-content>
          </v-list-item>
        </div>
        <v-divider class="my-2" />
        <v-card-text>
          <v-chip label small class="relic-level">+{{ artifact.level }}</v-chip>
          <ul class="relic-sub-props my-4">
            <li v-for="(attr, idx) in artifact.attrs" :key="attr.type" cols="12">
              <span class="stat-line">{{ $t(`buff.${attr.type}`) }}+{{ renderAttr(attr.type, attr.value) }}</span>
              <span v-if="powerupInfo" class="powerup-info">
                <span v-if="powerupInfo[idx].n > 1" class="desc">
                  {{ renderPowerUpInfo(powerupInfo[idx]) }}
                </span>
                <v-chip class="tier-label" x-small label>T{{ powerupInfo[idx].tier }}</v-chip>
              </span>
            </li>
          </ul>
          <v-row v-if="setInfo">
            <v-col class="set-info-title py-1" cols="12">{{ setInfo.localeName }}:</v-col>
            <v-col v-for="(lvl, i) in setInfo.levels" :key="i" cols="12" class="py-1">{{ $t("ui.setDesc", [lvl.need]) }}: {{ lvl.desc }}</v-col>
          </v-row>
        </v-card-text>
        <v-divider class="my-2" />
        <v-card-text v-text="artifact.desc" />
      </v-card-text>
    </v-card>
  </div>
  <div v-else class="error">{{ $t("ui.item404") }}</div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { ARTIFACT, BuffType, IArtifact, IArtifactSet, IArtifactType } from "~/modules/core";
import { Artifact, IAttrPowerUpInfo } from "~/modules/core/Artifact";

@Component<Page>({
  // server
  async asyncData({ params: { code }, $content, app }) {
    const rst: Partial<Page> = { code, artifactTypes: null, artifact: null, setInfo: null };
    const id = Artifact.getTypeId(code);
    const res = await $content(app.i18n.locale, "relic").where({ id }).fetch<IArtifactType>().catch(console.error);
    if (Array.isArray(res)) {
      const atype = res[0];
      rst.artifactTypes = { [id]: atype };
      rst.artifact = Artifact.fromCode(code, { [id]: atype });
      const sets = await $content(app.i18n.locale, "relicset").where({ id: atype.setId }).fetch<IArtifactSet>().catch(console.error);
      if (Array.isArray(sets)) {
        rst.setInfo = sets[0];
      }
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
  setInfo!: IArtifactSet | null;
  powerupInfo: IAttrPowerUpInfo[] | null = null;

  renderAttr(type: BuffType, value: number) {
    if (type in ARTIFACT.ENCODE_RATIO) {
      return value.toFixed(0);
    } else {
      return (value * 100).toFixed(1) + "%";
    }
  }

  renderPowerUpInfo(info: IAttrPowerUpInfo) {
    return info.values.map(v => `${this.renderAttr(info.type, v[1])}${v[2] > 1 ? ` * ${v[2]}` : ""}`).join(" + ");
  }

  @Watch("$route.params.code")
  created() {
    if (!this.powerupInfo) {
      this.artifact = new Artifact((this.artifact as any) as IArtifact, this.artifactTypes!);
      this.powerupInfo = this.artifact.powerupInfo;
    }
  }
}
</script>

<style lang="less">
.gsm-artifact-card {
  .set-info-title {
    color: #5db257;
  }
  .relic-sub-props {
    color: var(--black);
    line-height: 2;
    li {
      position: relative;
      .powerup-info {
        position: absolute;
        color: var(--text-grey);
        right: 1rem;
      }
    }
    .tier-label {
      width: 36px;
      padding: 0;
      justify-content: center;
    }
  }
  .relic-level {
    font-size: 0.875rem;
  }
}
</style>
