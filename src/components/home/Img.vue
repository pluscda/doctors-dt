<div class="dtc-chart">
    <Doughnut :chartdata="chartData" :options="chartOptions"  />
</div>

<script>
import { Doughnut, mixins } from "vue-chartjs";
const { reactiveData } = mixins;
const types = ["已完成", "未完成", "待處理"];
// #2
const PRE_URL = "/reportStatistics/ImageQuality?startDate={%0}&endDate={%1}&$inlinecount=allpages&$skip=0&$top=11111440";
export default {
  labels: types,
  extends: Doughnut,
  mixins: [reactiveData],
  name: "homeImg",
  props: ["time"],
  data() {
    return {
      chartdata: {},
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
  methods: {
    getRandomInt() {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
    },

    async getData(num = 1) {
      this.$root.$emit("影像品質", true);
      let imgs = await window.axios.get("/GeneralData/SelectNoList?groupNo=ImageQuality");
      let arr = [];
      const today = window.dtcToday;
      const start = window.dtcStart(num);
      imgs = imgs.Items;
      imgs.forEach((s) => {
        arr.push(s.Name);
      });
      this.labels = arr;
      const url = PRE_URL.replace(/{%0}/, start).replace(/{%1}/, today);
      try {
        const map = await window.axios.get(url);
        const data = [map[0].IMAGEQUALITY30_COUNT, map[0].IMAGEQUALITY40_COUNT, map[0].IMAGEQUALITY60_COUNT];
        this.$root.$emit("影像品質", false);
        this.drawReport(data);
      } catch (e) {
        alert(e);
      }
      //this.labels = labels;
      //this.drawReport(data);
    },
    drawReport(data) {
      const labels = ["已完成", "未完成", "待處理"];
      this.chartData = {
        labels: [`${labels[0]}(${data[0]})`, `${labels[1]}(${data[1]})`, `${labels[2]}(${data[2]})`],
        datasets: [
          {
            label: "體位",
            backgroundColor: ["#41B883", "#E46651", "#ffc107"],
            data,
          },
        ],
      };
    },
  },
  async mounted() {
    this.drawReport([this.getRandomInt(), this.getRandomInt(), this.getRandomInt()]);
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
