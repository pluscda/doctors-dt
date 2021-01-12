<template>
  <div id="app">
    <DtcNavBar v-if="!$route.path.includes('login')"></DtcNavBar>
    <router-view></router-view>
  </div>
</template>

<script>
import { store, mutations, actions } from "@/store/global.js";
import DtcNavBar from "./views/doctors/DtcNavbar";
import Vue from "vue";

export default {
  name: "app",
  data() {
    return {
      active: 0,
    };
  },
  computed: {
    isLogin() {
      return store.isLogin;
    },
    isDoc() {
      return true;
    },
  },
  methods: {
    goDocList() {
      this.$router.push("doclist");
    },
  },
  components: {
    DtcNavBar,
  },
  async created() {
    store.cates = await actions.getCancerTypes();
  },
  watch: {
    $route(to, from) {
      if (to.path.includes("home")) {
        this.active = 0;
      } else if (to.path.includes("doclist")) {
        this.active = 1;
      } else if (to.path.includes("login")) {
        this.active = 3;
      }
    },
  },
};
</script>

<style>
#app {
  margin: 0px;
  padding: 0px;
  font-family: var(--font-family-sans-serif);
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  color: var(--dark);
  background: var(--light) !important;
  overflow-x: hidden !important;
}
html,
body {
  scroll-behavior: smooth;
  overflow-x: hidden !important;
}
.grecaptcha-badge {
  opacity: 0 !important;
  display: none !important;
  width: 0px !important;
  height: 0px !important;
  z-index: -1;
}
</style>
