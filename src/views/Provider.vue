<template>
  <section class="dtc-login">
    <h3>{{ provider }}</h3>
    {{ loginInfo }}
  </section>
</template>

<script>
import { store, mutations, actions } from "@/store/global.js";
import queryString from "query-string";

export default {
  name: "loginHomeProvider",
  data() {
    return {
      loginInfo: "",
      provider: "",
    };
  },
  computed: {
    isLogin() {
      return sessionStorage.isLogin || store.isLogin;
    },
  },
  components: {},
  methods: {},
  async mounted() {
    const { provider } = this.$route.params;
    this.provider = provider;
    const { access_token } = queryString.parse(location.search);
    try {
      this.loginInfo = await axios.get(`auth/${provider}/callback?access_token=` + access_token);
    } catch (e) {
      this.loginInfo = JSON.stringify(e, null, 2);
    }
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
.fb-btn {
  position: fixed;
  top: 10px;
  left: 10px;
}
</style>
