<div class="dtc-chart">
    <Doughnut :chartdata="chartData" :options="chartOptions"  />
</div>

<script>
import { Doughnut, mixins } from "vue-chartjs";
const { reactiveData } = mixins;
const types = ["分常備役", "替代役", "免役"];
// #2
const PRE_URL =
  "/reportStatistics/ImageQuality?startDate={%0}&endDate={%1}&$inlinecount=allpages&$skip=0&$top=11111440";
export default {
  labels: types,
  extends: Doughnut,
  mixins: [reactiveData],
  name: "homeImgDis",
  props: ["FinishedCount", "UnFinishedCount"],
  data() {
    return {
      chartdata: {},
      options: {
        legend: {
          labels: {
            // This more specific font property overrides the global property
            fontSize: 16,
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
  methods: {
    drawReport(data) {
      const labels = ["已填寫", "未填寫"]; // this.labels;
      this.chartData = {
        labels: [`${labels[0]}(${data[0]})`, `${labels[1]}(${data[1]})`],
        datasets: [
          {
            label: "填寫",
            backgroundColor: ["#41B883", "#E46651"],
            data,
          },
        ],
      };
    },
  },
  async mounted() {
    this.drawReport([this.FinishedCount, this.UnFinishedCount]);
  },
  watch: {
    FinishedCount(val) {
      this.drawReport([this.FinishedCount, this.UnFinishedCount]);
    },
    UnFinishedCount(val) {
      this.drawReport([this.FinishedCount, this.UnFinishedCount]);
    },
  },
};
</script>

<style lang="scss" scoped>
.dtc-chart {
  color: white;
}
</style>
