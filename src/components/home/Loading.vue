<template>
  <section class="loadingApi">
    <div>
      資料處理中請稍後。
      <b-spinner type="grow" label="Spinning"></b-spinner>
      <b-spinner type="grow" label="Spinning"></b-spinner>
      <b-spinner type="grow" label="Spinning"></b-spinner>
    </div>
  </section>
</template>

<script>
// import Swal from "sweetalert2";

export default {
  data() {
    return {};
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
.loadingApi {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: rgba(#000, 0.7);
  border-radius: 5px;
  display: grid;
  place-items: center;
  color: white;
  z-index: 99999999999999999999;
}
</style>
