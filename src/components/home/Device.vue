<div class="dtc-chart">
    <Radar :chartdata="chartData" :options="chartOptions"  />
</div>

<script>
//import VueCharts from "vue-chartjs";
///device/Workload?startDate=2018-11-26T16:00:00.000Z&endDate=2020-02-04T16:00:00.000Z&$inlinecount=allpages&$skip=10&$top=10
import { Radar, mixins } from "vue-chartjs";
import moment from "dayjs";
const { reactiveData } = mixins;

let labels = `一般、皮膚、頭部、鼻喉、口腔、胸部、心臟血管、腹部、新陳代謝、血液、腎臟、泌尿生殖器、性病、四肢及軀幹、聽力及聽器、視力及視器、神經系統`;
labels = labels.split("、");

//#5
const PRE_URL = "/device/Workload?startDate={%0}&endDate={%1}&$inlinecount=allpages&$skip=0&$top=440";
export default {
  extends: Radar,
  mixins: [reactiveData],
  name: "homeDevice",
  props: ["time"],
  data() {
    return {
      labels: [],
      chartdata: {},
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
  methods: {
    async getData(num = 1) {
      this.$root.$emit("儀器使用", true);
      const labels = [];
      const data = [];
      const today = window.dtcToday;
      const start = window.dtcStart(num);
      const url = PRE_URL.replace(/{%0}/, start).replace(/{%1}/, today);
      try {
        const map = await window.axios.get(url);
        map.Items.forEach((s) => {
          labels.push(s.Name);
          data.push(s.TotalCount);
        });
      } catch (e) {
        alert(e);
      }
      this.labels = labels;
      this.$root.$emit("儀器使用", false);
      this.drawReport(data);
    },
    drawReport(data) {
      // const labels = this.labels;
      this.chartData = {
        labels,
        datasets: [
          {
            label: "免役原因",
            backgroundColor: "rgba(255,99,132,0.2)",
            borderColor: "rgba(255,99,132,1)",
            pointBackgroundColor: "rgba(255,99,132,1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(255,99,132,1)",
            // backgroundColor: ["#41B883", "#E46651", "#343a40", "#20c997", "#17a2b8", "#e83e8c", "#ffc107"],
            data,
          },
        ],
      };
    },
    getRandomInt() {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
    },
  },
  async mounted() {
    //await this.getData();
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
      this.getRandomInt(),
    ];
    this.drawReport(data);
  },
  watch: {
    time(val) {
      this.getData(val);
    },
  },
};
</script>

<style lang="scss" scoped>
.dtc-chart {
  color: white;
}
</style>
