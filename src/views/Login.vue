<template>
  <section class="dtc-login" :style="isLogin ? '' : 'justify-content: center;'">
    <PhoneLogin></PhoneLogin>
    <footer class="provides-login" hidden>
      <b-button @click="toGithub" variant="warning">Github Login</b-button>
      <b-button @click="toFb" variant="success">Facebook Login</b-button>
    </footer>
  </section>
</template>

<script>
import { store, mutations, actions } from "@/store/global.js";
import PhoneLogin from "@/components/auth/PhoneLogin.vue";

const titles = ["預約紀錄(6)", "提問(5)", "意見反饋(1)", "我的收藏(2)", "系統設置"];

const labels = ["共有6筆記錄", "你有一則已答覆", "廠商有兩則反饋", "你有兩個收藏", "客製化個人設定"];

export default {
  name: "loginHome",
  data() {
    return {
      titles,
      labels,
      phone: sessionStorage.phone,
      idDoc: location.href.includes("isdoc=true"),
    };
  },
  computed: {
    isLogin() {
      return sessionStorage.isLogin || store.isLogin;
    },
    myPhone() {
      const phone = sessionStorage.phone ? sessionStorage.phone.slice(0, 6) : "";
      return phone;
    },
  },
  components: {
    PhoneLogin,
  },
  methods: {
    toGithub() {
      location.href = "https://dtchealth.datacom.com.tw/connect/github";
    },
    toFb() {
      location.href = "https://dtchealth.datacom.com.tw/connect/facebook";
    },
    open(item, i) {
      if (i == 0) {
        this.$router.push("myorderlist");
      }
    },
    logout() {
      mutations.logout();
      store.activeTab = 0;
      this.$router.push("home");
      location.reload(true);
    },
  },
  mounted() {
    store.activeTab = 3;
  },
  watch: {},
};
</script>
<i18n>
{
  "zh-tw": {
    "title": "名醫會館"
    
  },
  "zh-cn": {
    "title": "名医会馆"
  }
}
</i18n>

<style lang="scss" scoped>
.dtc-login {
  background: var(--strapi-blue);
  width: 100vw;
  color: var(--light);
  position: relative;
  height: 100vh;
  overflow: hidden;
  display: grid;
}
.logo,
.logo2 {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  object-fit: cover;
}
.logo2 {
  top: 500px;
}
.login {
  position: relative;
  h2 {
    text-align: center;
    font-size: 24px;
    margin-bottom: 1rem;
    margin-top: 1rem;
  }
}
.provides-login {
  position: fixed;
  bottom: 10px;
  left: 10px;
  display: grid;
  grid-template-columns: repeat(13, max-content);
  gap: 1rem;
}
</style>
