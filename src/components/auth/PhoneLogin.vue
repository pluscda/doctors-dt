<template>
  <section class="dtc-phone">
    <van-overlay :show="showMask" @click="showMask = false" style="z-index:9999;">
      <van-loading type="spinner" class="mt-4" />
    </van-overlay>
    <main>
      <h2>
        <span class="mr-3"><i class="fas fa-sign-in-alt"></i></span>名醫會館(醫生端)
      </h2>
      <b-button size="lg" @click="loginLine">登入會館</b-button>
    </main>
  </section>
</template>

<script>
import { store, mutations, actions } from "@/store/global.js";
import liff from "@line/liff";
import Vue from "vue";
export default {
  name: "login",
  data() {
    return {
      showKeyboard: true,
      phone: "0928012503",
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
    async connectWithStrapi() {
      try {
        const { jwt: jwt1 } = await this.loginStrapi();
        window.token = jwt1;
        if (!window.token) {
          const { jwt: jwt2 } = await this.registerStrapi().catch((e) => {
            alert("something wrong at app jwt connectWithStrapi");
            return;
          });
          window.token = jwt2;
        }
        mutations.login(store.lineProfile.userId);
      } catch (e) {
        alert("請檢查驗證號碼" + e);
      }
    },
    async registerStrapi() {
      const { jwt } = await actions.registerStrapi({ username: store.lineProfile.userId, password: store.PASSWORD });
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
    async loginLine() {
      // ckc@datacom.com.tw / 22458558   ; line dev login user/pass
      await liff.init({ liffId: "1655686518-8xOGVJBq" });
      await liff.login();
      let isLineApp = liff.isInClient();
      //isLineApp = false;
      if (isLineApp) {
        store.lineProfile = await liff.getProfile();
        const ret = await liff.getDecodedIDToken();
        store.lineProfile.email = ret.email;
        await this.connectWithStrapi();
      } else {
        await this.connectWithStrapi();
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
