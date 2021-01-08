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
  name: "homexxxxxx",
  data() {
    return {
      chartdata: {},
      taipeis: window.taipeis,
      labels: [],
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    };
  },
  methods: {
    getRandomInt() {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
    },
    async getData() {
      // TODO: get data from person id and time
      //this.drawReport(data);
    },
    async drawReport(data1, data2, data3) {
      const labels = window.taipeis; //this.labels;
      this.chartData = {
        labels,
        datasets: [
          {
            label: "常備役",
            backgroundColor: "rgba(255,99,132,0.2)",
            borderColor: "rgba(255,99,132,1)",
            pointBackgroundColor: "rgba(255,99,132,1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(255,99,132,1)",
            data: data1
          },
          {
            label: "替代役",
            backgroundColor: "rgba(23,162,184,0.2)",
            borderColor: "rgba(23,162,184,1)",
            pointBackgroundColor: "rgba(223,162,184,1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(23,162,184,1)",
            data: data2
          },
          {
            label: "免役",
            backgroundColor: "rgba(255,193,7,0.2)",
            borderColor: "rgba(255,193,7)",
            pointBackgroundColor: "rgba(255,193,7,1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(255,193,7,1)",
            data: data3
          }
        ]
      };
    }
  },
  async mounted() {
    // this.$root.$emit("個別逾時", true);
    // const map = await window.axios.get("/api/Device");
    // let arr = [];
    // map.Items.forEach(s => {
    //   arr.push(s.Name);
    // });
    // const labels = arr;
    // const data = [];
    // labels.forEach(() => {
    //   data.push(this.getRandomInt());
    // });
    // this.labels = labels;
    // this.drawReport(data);
    // this.$root.$emit("個別逾時", false);
    const data1 = [
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
    const data2 = [
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
    const data3 = [
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
    this.drawReport(data1, data2, data3);
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
