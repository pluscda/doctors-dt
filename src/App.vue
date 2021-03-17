<template>
  <div id="app">
    <DtcNavBar v-if="!$route.path.includes('login')"></DtcNavBar>
    <router-view></router-view>
  </div>
</template>

<script>
import { store, mutations, actions } from "@/store/global.js";
import DtcNavBar from "./views/doctors/DtcNavbar";

/*
 The entry point @ PhoneLogin.vue . It will get qurystring info from Line App's link
 if one try to acess the page without using the Link App to lauch this vue app,
 one needs to clicks "Welcome" in header part. Click "e", will become admin role.
*/
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
    async connectWithStrapi() {
      sessionStorage.token = "";
      try {
        const { jwt: jwt1 } = await this.loginStrapi();
        if (!jwt1) {
          const { jwt: jwt2 } = await this.registerStrapi().catch((e) => {
            alert("something wrong at app jwt connectWithStrapi");
            return;
          });
          sessionStorage.token = jwt2;
        } else {
          sessionStorage.token = jwt1;
        }
        mutations.login(store.lineProfile.userId);
      } catch (e) {
        alert("請檢查驗證號碼" + e);
      }
    },
    async registerStrapi() {
      const { jwt } = await actions.registerStrapi({
        username: store.lineProfile.userId,
        password: store.PASSWORD,
        email: store.lineProfile.email,
      });
      return { jwt };
    },
    async loginStrapi() {
      try {
        const { jwt } = await actions.loginStrapi({ identifier: store.lineProfile.userId, password: store.PASSWORD });
        return { jwt };
      } catch (e) {
        return { jwt: "" };
      }
    },
    goDocList() {
      this.$router.push("doclist");
    },
  },
  components: {
    DtcNavBar,
  },
  async mounted() {
    const https = location.href.includes("https");
    if (!https) {
      // at dev mode; change to other phone when needed; the phone must exist in DB for one doctor's phone
      sessionStorage.phone = "U806ad99ce58ec0b8ea4a2652f21b3299";
      store.lineProfile.userId = sessionStorage.phone;
      await this.connectWithStrapi();
    }
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
