<template>
  <div class="my-homepage">
    <h1>Doctor home</h1>
  </div>
</template>

<script>
import { store, mutations, actions } from "@/store/global.js";

export default {
  name: "home",
  data() {
    return {};
  },
  components: {},
  methods: {},
  mounted() {
    if (!sessionStorage.token) {
      this.$router.push("login");
    }
  },
};
</script>

<style lang="scss" scoped>
.my-homepage {
  width: 100vw;
  overflow-x: hidden !important;
  color: black;
}
</style>
