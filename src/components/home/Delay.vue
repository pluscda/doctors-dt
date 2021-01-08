<div class="dtc-chart">
     <HorizontalBar :chartdata="chartData" :options="chartOptions"  />
</div>

<script>
//import VueCharts from "vue-chartjs";
import { HorizontalBar, mixins } from "vue-chartjs";
const { reactiveData } = mixins;
let labels = `一般、皮膚、頭部、鼻喉、口腔、胸部、心臟血管、腹部、新陳代謝、血液、腎臟、泌尿生殖器、性病、四肢及軀幹、聽力及聽器、視力及視器、神經系統`;
labels = labels.split("、");
//#7 &$inlinecount=allpages&$skip=0&$top=10
const PRE_URL =
  "/reportStatistics/OverTimeCount?startDate={%0}&endDate={%1}&$top=10";
export default {
  extends: HorizontalBar,
  mixins: [reactiveData],
  name: "homeDelay",
  props: ["time"],
  data() {
    return {
      labels,
      chartdata: {},
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
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
    getRandomInt() {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
    },
    convertMin2Hour(num) {
      let h = num;
      h = (num / 60).toFixed(2);
      return h;
    },
    async getData(num = 1) {
      this.$root.$emit("逾時報告", true);
      const labels = [];
      const data = [];
      const today = window.dtcToday;
      const start = window.dtcStart(num);
      const url = PRE_URL.replace(/{%0}/, start).replace(/{%1}/, today);
      try {
        const map = await window.axios.get(url);
        map.Items.forEach(s => {
          labels.push(s.EMPLOYEENAME);
          data.push(s.OVERTIME > 0 ? this.convertMin2Hour(s.OVERTIME) : 0);
        });
      } catch (e) {
        alert(e);
      }
      this.labels = labels;
      this.$root.$emit("逾時報告", false);
      this.drawReport(data);
    },
    drawReport(data) {
      const labels = this.labels;
      this.chartData = {
        labels,
        datasets: [
          {
            label: "平均作業時間(單位天數)",
            backgroundColor: "#dc3545",
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
