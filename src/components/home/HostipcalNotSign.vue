<div class="dtc-chart my-chart">
    <lBar :chartdata="chartData" :options="chartOptions"  />
</div>

<script>
//import VueCharts from "vue-chartjs";
import { Bar, mixins } from "vue-chartjs";
const { reactiveData } = mixins;

export default {
  extends: Bar,
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
    getRandomInt() {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
    },
    drawReport(data, labels) {
    
      this.chartData = {
        labels,
        datasets: [
          {
            label: `筆數`,
            backgroundColor: "#E46651",
            data,
          },
        ],
      };
    },
  },
  async mounted() {
    //TODO: need AJAX to get real data from server
    const d1 = this.getRandomInt();
    const d2 = this.getRandomInt();
    const d3 = this.getRandomInt();
    const d4 = this.getRandomInt();
    const labels = ["未讀取訊息數量", "讀取訊息數量","體檢人數2", "實際報到人數2"];
    this.drawReport([d1,d2,d3,d4], labels);
  },
  watch: {
  
  },
};
</script>

<style lang="scss" scoped>
.dtc-chart {
  color: white;
}
</style>
