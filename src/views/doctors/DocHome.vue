<template>
  <section class="dashboard">
    <main>
      <aside>
        <b-select v-model="row1_1" :options="years"></b-select>
        <b-select v-model="row1_1_1" :options="months"></b-select>
        <h6 class="mt-2 ml-3">診斷數量</h6>
      </aside>
      <CstChart :year="row1_1" :month="row1_1_1"></CstChart>
    </main>
    <main>
      <aside>
        <b-select v-model="row1_3" :options="years"></b-select>
        <b-select v-model="row1_3_1" :options="months"></b-select>
        <h6 class="mt-2 ml-3">診斷數量累計金額</h6>
      </aside>
      <Person :year="row1_3" :month="row1_3_1"></Person>
    </main>
    <main>
      <aside>
        <b-select v-model="row1_2" :options="years"></b-select>
        <b-select v-model="row1_2_1" :options="months"></b-select>
        <h6 class="mt-2 ml-3">線上諮詢數量</h6>
      </aside>
      <ImgDtc :year="row1_2" :month="row1_2_1"></ImgDtc>
    </main>

    <main>
      <aside>
        <b-select v-model="row2_1" :options="years"></b-select>
        <b-select v-model="row2_1_1" :options="months"></b-select>
        <h6 class="mt-2 ml-3">線上諮詢累計金額</h6>
      </aside>
      <Finish :year="row2_1" :month="row2_1_1"></Finish>
    </main>
    <main>
      <aside>
        <b-select v-model="row2_2" :options="years"></b-select>
        <b-select v-model="row2_2_1" :options="months"></b-select>
        <h6 class="mt-2 ml-3" style="font-size:15px;">TOP 10 客戶貢獻(NOTE:用客戶手機)</h6>
      </aside>
      <Workload :year="row2_2" :month="row2_2_1"></Workload>
    </main>
    <main>
      <aside>
        <b-select v-model="row2_3" :options="years"></b-select>
        <h6 class="mt-2 ml-3">線上諮詢完成率 (報到-完成總評)</h6>
      </aside>
      <Delay :time="row2_3"></Delay>
    </main>
  </section>
</template>

<script>
import CstChart from "@/components/home/Cst";
import Device from "@/components/home/Device";
import Workload from "@/components/home/Workload";
import ImgDtc from "@/components/home/Img";
import Finish from "@/components/home/Finish";
import Delay from "@/components/home/Delay";
import Person from "@/components/home/Person";
import Loading from "@/components/home/Loading";
import { store, mutations } from "@/store/global.js";

Chart.defaults.global.defaultFontStyle = "bold";
Chart.defaults.global.defaultFontColor = "#343a40";
Chart.defaults.global.defaultFontFamily = "Microsoft JhengHei";
Chart.helpers.merge(Chart.defaults.global.plugins.datalabels, {
  anchor: "end",
  align: "start",
});

let year = new Date().getFullYear();
const years = new Array(2).fill().map((s, i) => ({ value: year - i, text: year - i + "年" }));
const months = new Array(12).fill().map((s, i) => ({ value: i + 1, text: i + 1 + "月" }));
export default {
  name: "homedashboard",

  data() {
    return {
      months,
      years,
      row1_1: year - 1,
      row1_1_1: 7,
      row1_2: year - 1,
      row1_2_1: 7,
      row1_3: year - 1,
      row1_3_1: 7,
      row2_1: year - 1,
      row2_1_1: 7,
      row2_2: year - 1,
      row2_2_1: 7,
      row2_3: year - 1,
    };
  },
  components: {
    CstChart,
    Device,
    Workload,
    ImgDtc,
    Finish,
    Delay,
    Person,
    Loading,
  },
  computed: {
    isLogin() {
      return store.isLogin;
    },
  },
  methods: {},

  async mounted() {},
  async beforeCreate() {},
};
</script>

<style lang="scss" scoped>
.dashboard {
  background: var(--dark) !important;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding: 10px;
  > main {
    display: grid;
    border-radius: 10px;
    background: white;
    min-width: 420px;
    max-height: 45vh;
    height: 47vh;
    grid-template-rows: 30px calc(100% - 60px);
    grid-template-columns: calc(100% - 5px);
    padding: 10px;
    color: black;
    gap: 1rem;
    h6 {
      font-size: 18px;
    }
  }
}

aside {
  display: grid;
  grid-template-columns: repeat(13, max-content);
  gap: 2px;
}
</style>
