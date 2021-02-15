import "reflect-metadata";
import Component from "vue-class-component";

Component.registerHooks(["beforeRouteEnter", "beforeRouteLeave", "beforeRouteUpdate"]);
