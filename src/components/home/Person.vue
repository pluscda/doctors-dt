<div class="dtc-chart">
    <Radar :chartdata="chartData" :options="chartOptions"  />
</div>

<script>
//import VueCharts from "vue-chartjs";
import { Radar, mixins } from "vue-chartjs";
const { reactiveData } = mixins;

// #8 last one
export default {
  extends: Radar,
  mixins: [reactiveData],
  name: "homeDevice",
  props: ["time", "person"],
  data() {
    return {
      chartdata: {},
      labels: window.taipeis,
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    };
  },
  methods: {
    getRandomInt() {
      return Math.floor(Math.random() * (1050 - 5 + 1)) + 225;
    },
    async getData() {
      // TODO: get data from person id and time
      //this.drawReport(data);
    },
    async drawReport(data) {
      const labels = this.labels;
      this.chartData = {
        labels,
        datasets: [
          {
            label: "免疫原因",
            backgroundColor: "rgba(255,99,132,0.2)",
            borderColor: "rgba(255,99,132,1)",
            pointBackgroundColor: "rgba(255,99,132,1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(255,99,132,1)",
            data
          }
        ]
      };
    }
  },
  async mounted() {
    const data = [
      this.getRandomInt(),
      this.getRandomInt(),
      this.getRandomInt(),
      this.getRandomInt(),
      this.getRandomInt(),
      this.getRandomInt(),
      this.getRandomInt(),
      this.getRandomInt(),
      this.getRandomInt(),
      this.getRandomInt(),
      this.getRandomInt(),
      this.getRandomInt()
    ];
    this.drawReport(data);
  },
  watch: {
    time(val) {
      // val from 1 ~ 4
    },
    person(val) {
      //person id
    }
  }
};
</script>

<style lang="scss" scoped>
.dtc-chart {
  color: white;
}
</style>
