<div class="dtc-chart my-chart">
    <HorizontalBar :chartdata="chartData" :options="chartOptions"  />
</div>

<script>
//import VueCharts from "vue-chartjs";
import { HorizontalBar, mixins } from "vue-chartjs";
const { reactiveData } = mixins;

export default {
  extends: HorizontalBar,
  mixins: [reactiveData],
  name: "notenrolled",
  props: ["NoCheckInCount", "CheckInCount"],
  data() {
    return {
      deviceId: 1,
      myTime: 1,
      lables: [],
      chartdata: {},
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          labels: {
            // This more specific font property overrides the global property
            fontSize: 16,
          },
        },
        scales: {
          xAxes: [
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
  computed: {
    myTotal() {
      return +this.NoCheckInCount + +this.CheckInCount;
    },
    myRate() {
      const n = (+this.CheckInCount / this.myTotal) * 100;
      return n > 0 ? n.toFixed(1) : 0;
    },
  },
  methods: {
    drawReport(data) {
      const labels = [];
      this.chartData = {
        labels: ["體檢人數", "實際報到人數"],
        datasets: [
          {
            label: `報到比率(${this.myRate}%)`,
            backgroundColor: "#ffc107",
            data,
          },
        ],
      };
    },
  },
  async mounted() {
    this.rate = this.myRate;
    this.drawReport([this.myTotal, this.CheckInCount]);
  },
  watch: {
    NoCheckInCount(val) {
      this.drawReport([this.myTotal, this.CheckInCount]);
    },
    CheckInCount(val) {
      this.drawReport([this.myTotal, this.CheckInCount]);
    },
  },
};
</script>

<style lang="scss" scoped>
.dtc-chart {
  color: white;
}
</style>
