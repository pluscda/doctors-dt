<div class="dtc-chart">
    
    <Bar :chartdata="chartData" :options="chartOptions"  />
</div>

<script>
//import VueCharts from "vue-chartjs";
import { Bar, mixins } from "vue-chartjs";
import { store, mutations, actions } from "@/store/global.js";
const { reactiveData } = mixins;
// #4
const PRE_URL_1 = "/reportStatistics/DxStatusTotalCount?staftype=20&startDate={%0}&endDate={%1}";
const PRE_URL_2 = "/reportStatistics/DxStatusTotalVerifyCount?startDate={%0}&endDate={%1}";
const PRE_URL_3 = "/reportStatistics/DxStatusTotalCount?staftype=35&startDate={%0}&endDate={%1}";
const PRE_URL_4 = "/reportStatistics/DxStatusTotalCount?staftype=51&startDate={%0}&endDate={%1}";

const years = ["109", "108", "107", "106"];
export default {
  labels: [],
  extends: Bar,
  mixins: [reactiveData],
  name: "workload",
  props: ["time", "type"],
  data() {
    return {
      years,
      year: "109",
      url: PRE_URL_1,
      currentTime: "",
      chartdata: {},
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    };
  },
  props: ["year", "month"],
  methods: {
    getRandomInt() {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
    },
    async getData() {
      let qs = "phone=" + sessionStorage.phone;
      qs += "&date=" + this.year + "-" + (this.month < 10 ? "0" + this.month : this.month);
      const items = await actions.getTopIncomeStats(qs);
      const data = [];
      let labels = [];
      items.forEach((s) => {
        data.push(s.income);
        labels.push(s.phone);
      });
      //labels = labels.map((s) => this.$formatStatus(s));
      this.drawReport(data, labels);
    },
    drawReport(data, labels) {
      this.chartData = {
        labels,
        datasets: [
          {
            label: "客戶累計金額(單位 NT)",
            backgroundColor: "#E46651",
            data,
          },
        ],
      };
    },
  },
  async mounted() {
    this.getData();
  },
  watch: {
    year(val) {
      this.getData();
    },
    month(val) {
      this.getData();
    },
  },
};
</script>

<style lang="scss" scoped>
.dtc-chart {
  color: white;
  position: relative;
  .years-dtc {
    position: absolute;
    top: -60px;
    left: 10%;
    width: 200px;
    height: 40px;
  }
}
</style>
