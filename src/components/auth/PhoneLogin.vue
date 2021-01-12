<template>
  <section class="dtc-phone">
    <van-overlay :show="showMask" @click="showMask = false" style="z-index:9999;">
      <van-loading type="spinner" class="mt-4" />
    </van-overlay>
    <main>
      <h2>
        <span class="mr-3"><i class="fas fa-sign-in-alt"></i></span>DTC Health 健康通行證
      </h2>
      <div class="phone-div">
        <input v-model="phone" placeholder="請輸入手機號碼" minlength="10" maxlength="10" />
      </div>
      <div class="phone-div mt-3 short-code">
        <div class="code-btn" @click="register" v-show="phone.length == 10">獲取短信驗證碼</div>
        <input placeholder="請輸入短信驗證碼" minlength="6" maxlength="6" v-model="code" v-show="needCode" />
      </div>

      <div class="login" @click="confirmSMSCode" v-show="enableLogin">登入</div>
    </main>
    <button :id="recaptchaDomId" note="google requried this invisable div"></button>
    <!-- <pre style="color:white;">{{ user }}</pre> -->
  </section>
</template>

<script>
import { store, mutations, actions } from "@/store/global.js";
import Vue from "vue";
export default {
  name: "login",
  data() {
    return {
      showKeyboard: true,
      phone: "0928012500",
      needCode: "",
      code: "654321",
      confirmationSMSCodeResult: "",
      user: "",
      jwt: "",
      recaptchaDomId: "sign-in-button",
      showMask: false,
    };
  },
  computed: {
    isLogin() {
      return sessionStorage.isLogin || store.isLogin;
    },
    enableLogin() {
      return this.code && this.code.length == 6 && !isNaN(this.code) && this.needCode;
    },
  },

  methods: {
    async register() {
      try {
        this.showMask = true;
        this.confirmationSMSCodeResult = await actions.registerByMobilePhone(`+886${this.phone}`, this.recaptchaDomId);
        this.needCode = true;
        this.showMask = false;
      } catch (e) {
        Vue.$toast.error("請檢查電話號碼是否正確");
        this.showMask = false;
      }
    },
    async confirmSMSCode() {
      try {
        this.showMask = true;
        await this.confirmationSMSCodeResult.confirm(this.code);
      } catch (e) {
        location.reload();
        Vue.$toast.error("請檢查驗證號碼" + e);
        this.showMask = false;
      }
      try {
        const { jwt } = await this.loginStrapi();
        if (!jwt) this.registerStrapi();
      } finally {
        sessionStorage.token = this.jwt;
        localStorage.token = this.jwt;
        this.user = JSON.stringify(this.user, null, 2);
        this.showMask = false;
        mutations.login(this.phone);
        //this.$router.push("home");
      }
    },
    async registerStrapi() {
      const { user, jwt } = await actions.registerStrapi({ username: this.phone, password: store.PASSWORD });
      if (jwt) {
        this.user = user;
        store.isDoctor = user.isDoctor ? "true" : "";
        this.jwt = jwt;
        this.$router.push("home");
      }
    },
    async loginStrapi() {
      sessionStorage.phone = this.phone;
      try {
        const { user, jwt } = await actions.loginStrapi({ identifier: this.phone, password: store.PASSWORD });
        if (jwt) {
          this.user = user;
          store.isDoctor = user.isDoctor ? "true" : "";
          this.jwt = jwt;
          this.$router.push("home");
        }
        return { jwt };
      } catch (e) {
        return { jwt: "" };
      }
    },
  },
  mounted() {
    // alert("0928012588".length);
  },
};
</script>

<style lang="scss" scoped>
::-webkit-input-placeholder {
  /* Chrome/Opera/Safari */
  color: darken(#f8f9fa, 23);
}
.dtc-phone {
  width: 100%;
  position: relative;
  color: white;
  text-align: center;
  display: grid;
  place-items: center;
  main {
    width: 400px;
    height: 400px;
    h2 {
      font-size: 20px;
      margin-top: 20px;
      margin-bottom: 40px;
    }
    input {
      border: none;
      display: inline-block;
      width: 400px;
      background: transparent;
      border-bottom: 1px solid white;
      height: 40px;
      font-size: 13px;
    }
  }
}

.short-code {
  position: relative;
  .code-btn {
    display: block;
    position: absolute;
    content: attr(data-msg);
    font-size: 12px;
    color: orange;
    top: 16px;
    right: 0px;
  }
}
.login {
  border-radius: 20px;
  font-size: 18px;
  background: var(--success);
  text-align: center;
  color: white;
  width: 400px;
  height: 40px;
  line-height: 40px;
  margin-top: 3rem;
}
</style>
