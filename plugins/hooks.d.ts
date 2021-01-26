import type { Route, RawLocation } from "vue-router";
import type { VNode } from "vue";

declare module "vue/types/vue" {
  // Augment component instance type
  interface Vue {
    // data?(): object;
    beforeCreate?(): void;
    created?(): void;
    beforeMount?(): void;
    mounted?(): void;
    beforeDestroy?(): void;
    destroyed?(): void;
    beforeUpdate?(): void;
    updated?(): void;
    activated?(): void;
    deactivated?(): void;
    // eslint-disable-next-line no-undef
    render?(createElement: CreateElement): VNode;
    errorCaptured?(err: Error, vm: Vue, info: string): boolean | undefined;
    serverPrefetch?(): Promise<unknown>;
    beforeRouteEnter?(to: Route, from: Route, next: (to?: RawLocation | false | ((vm: Vue) => void)) => void): void;

    beforeRouteLeave?(to: Route, from: Route, next: (to?: RawLocation | false | ((vm: Vue) => void)) => void): void;

    beforeRouteUpdate?(to: Route, from: Route, next: (to?: RawLocation | false | ((vm: Vue) => void)) => void): void;
  }
}
