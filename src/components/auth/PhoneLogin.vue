<template>
  <section class="dtc-phone"></section>
</template>

<script>
import { store, mutations, actions } from '@/store/global.js';
import queryString from 'qs';
export default {
  name: 'login',
  data() {
    return {};
  },
  computed: {},

  mounted() {
    const qs = location.href.split('?')[1];
    alert(qs);
    const parsed = queryString.parse(qs);
    if (!parsed) {
      return;
    } else {
      store.lineProfile = parsed;
    }
    sessionStorage.phone = store.lineProfile.userId;
    sessionStorage.token = store.lineProfile.jwt;
    mutations.login(store.lineProfile.userId);
    console.log(JSON.stringify(store.lineProfile));
    this.$router.push('/home');
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
