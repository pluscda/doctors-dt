<template>
  <div style="position:sticky;top:0;z-index:3;">
    <b-navbar toggleable="lg" type="dark" class="dtc-bg">
      <b-navbar-brand @click="$router.push('/home')" style="max-width:200px;cursor:pointer;"><i class="fas fa-sign-in-alt mr-2"></i> 名醫會館(醫生端)</b-navbar-brand>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item @click="$router.push('/home')">首頁</b-nav-item>
          <b-nav-item @click="$router.push('/historylist')">歷史報告</b-nav-item>
          <b-nav-item @click="$router.push('/waitlist')">診斷報告</b-nav-item>
          <b-nav-item @click="$router.push('/asklist')">線上諮詢</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
      <b-navbar-nav class="ml-auto">
        <div class="login-name">
          W<span>e</span>lco<span>m</span>e
          {{ myInfo }}
        </div>
        <div class="bar-icon" id="popover-9" style="color:black;" hidden>
          <i class="fas fa-user-alt"></i>
        </div>
        <b-popover target="popover-9" title="個人專區" triggers="hover" placement="bottom">
          <b-button size="sm" variant="danger" @click="logout">登出</b-button>
        </b-popover>
      </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<script>
import { store, mutations } from "@/store/global.js";
export default {
  name: "navbardoc",
  data() {
    return {};
  },
  computed: {
    myInfo() {
      let email = store.lineProfile?.email ? store.lineProfile.email : ""; // ? window.phone.slice(0, 9) : "";
      let name = store.lineProfile?.displayName ? store.lineProfile.displayName : window.phone;
      return !email ? name : name + " | " + email;
    },
  },
  components: {},
  methods: {
    async logout() {},
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.dtc-bg {
  background: #10579b;
  max-height: 70px;
}
.bar-icon {
  border-radius: 50%;
  background: var(--light);
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  cursor: pointer;
  display: inline-block;
}
/deep/ .nav-item .nav-link {
  color: white !important;
}
.login-name {
  margin-right: 12px;
  padding: 4px 12px;
  font-size: 14px;
  color: var(--primary);
  background: white;
  border-radius: 5px;
  width: max-content;
  line-height: 22px;
}
</style>
