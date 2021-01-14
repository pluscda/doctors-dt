<div class="dtc-chart">
    <Doughnut :chartdata="chartData" :options="chartOptions"  />
</div>

<script>
import { Doughnut, mixins } from "vue-chartjs";
const { reactiveData } = mixins;
import { store, mutations, actions } from "@/store/global.js";
const types = ["已完成", "未完成", "待處理"];
//
export default {
  labels: types,
  extends: Doughnut,
  mixins: [reactiveData],
  name: "homeImgcst",

  data() {
    return {
      chartdata: {},
      options: {
        responsive: true,
        maintainAspectRatio: false,
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
      const items = await actions.getInqueryStats(qs);
      const data = [];
      let labels = [];
      items.forEach((s) => {
        if (s.count && +s.count > 0) {
          data.push(s.count);
          labels.push(s.status);
        }
      });
      labels = labels.map((s) => this.$formatStatus(s));
      this.drawReport(data, labels);
    },
    drawReport(data, labels) {
      this.chartData = {
        labels,
        datasets: [
          {
            label: "體位",
            backgroundColor: ["#41B883", "#E46651", "#ffc107", "#dc3545"],
            data,
          },
        ],
      };
    },
  },
  async mounted() {
    this.getData();
    // this.drawReport([this.getRandomInt(), this.getRandomInt(), this.getRandomInt()]);
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
}
</style>
