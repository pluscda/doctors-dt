<div class="dtc-chart">
    <Bar :chartdata="chartData" :options="chartOptions"  />
</div>

<script>
//import VueCharts from "vue-chartjs";
import { Bar, mixins } from "vue-chartjs";
const { reactiveData } = mixins;
// #1
const PRE_URL =
  "/reportStatistics/NegativeCount?startDate={%0}&endDate={%1}&$inlinecount=allpages&$skip=0&$top=11111440";
export default {
  extends: Bar,
  mixins: [reactiveData],
  name: "homeCST",
  props: ["time"],
  data() {
    return {
      chartdata: {},
      labels: window.taipeis,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    };
  },
  methods: {
    async getData(num = 1) {
      // CSTID: "CST2019001", CSTNAME: "肺癌", NEGATIVE_COUNT: 18, POSITIVE_COUNT: 3}
      this.$root.$emit("陰性報告", true);
      const labels = [];
      let data1 = [];
      let data2 = [];
      const today = window.dtcToday;
      const start = window.dtcStart(num);
      const url = PRE_URL.replace(/{%0}/, start).replace(/{%1}/, today);
      try {
        const map = await window.axios.get(url);
        map.Items.forEach(s => {
          labels.push(s.CSTNAME);
          data1.push(s.POSITIVE_COUNT);
          data2.push(s.NEGATIVE_COUNT);
        });
      } catch (e) {
        alert(e);
      }
      this.labels = [...labels];
      this.$root.$emit("陰性報告", false);
      this.drawReport(data1, data2);
    },
    async drawReport(data1, data2) {
      const labels = this.labels;
      this.chartData = {
        labels,
        datasets: [
          {
            label: "12個行政區人數",
            backgroundColor: "#41B883",
            data: data1
          }
        ]
      };
    }
  },
  async mounted() {
    this.drawReport([
      100,
      300,
      600,
      500,
      100,
      300,
      400,
      100,
      100,
      300,
      400,
      100
    ]);
  },
  watch: {
    time(val) {
      this.getData(val);
    }
  }
};
</script>

<style lang="scss" scoped>
.dtc-chart {
  color: white;
}
</style>
