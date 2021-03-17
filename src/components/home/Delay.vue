<div class="dtc-chart">
     <HorizontalBar :chartdata="chartData" :options="chartOptions"  />
</div>

<script>
//import VueCharts from "vue-chartjs";
import { HorizontalBar, mixins } from "vue-chartjs";
import { store, mutations, actions } from "@/store/global.js";
const { reactiveData } = mixins;
let labels = `一般、皮膚、頭部、鼻喉、口腔、胸部、心臟血管、腹部、新陳代謝、血液、腎臟、泌尿生殖器、性病、四肢及軀幹、聽力及聽器、視力及視器、神經系統`;
labels = labels.split("、");
//#7 &$inlinecount=allpages&$skip=0&$top=10
const PRE_URL = "/reportStatistics/OverTimeCount?startDate={%0}&endDate={%1}&$top=10";
export default {
  extends: HorizontalBar,
  mixins: [reactiveData],
  name: "homeDelayPersonf",
  props: ["time"],
  data() {
    return {
      total: 0,
      income: 0,
      labels,
      types: [],
      chartdata: {},
      options: {
        responsive: true,
        maintainAspectRatio: false,
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
  props: ["year", "month"],
  methods: {
    getRandomInt() {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
    },
    convertMin2Hour(num) {
      let h = num;
      h = (num / 60).toFixed(2);
      return h;
    },
    async getData() {
      let qs = "phone=" + sessionStorage.phone;
      qs += "&date=" + this.year + "-" + (this.month < 10 ? "0" + this.month : this.month);
      let items = await actions.getUnreadMsgStats(qs);

      const c1 = items[0]?.count1 > 0 ? items[0].count1 : 0;
      const c2 = items[1]?.count2 > 0 ? items[1].count2 : 0;
      this.total = c1 + c2;
      if (this.total) this.drawReport([c1, c2], ["診斷數量", "線上諮詢數量"]);
      else this.drawReport([0, 0], ["診斷數量", "線上諮詢數量"]);
    },
    drawReport(data, labels) {
      this.chartData = {
        labels,
        datasets: [
          {
            label: `總數(共${this.total}筆)`,
            backgroundColor: "#dc3545",
            data,
          },
        ],
      };
    },
  },
  async mounted() {
    this.types = await actions.getCancerTypes();
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
}
</style>
