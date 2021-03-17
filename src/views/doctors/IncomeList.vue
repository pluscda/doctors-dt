<template>
  <section class="dtc-main-section mb-4">
    <header class="ask-header">收支明細</header>
    <div class="dtc-search pl-2">
      <b-input-group prepend="年">
        <b-select v-model="year" :options="years"></b-select>
      </b-input-group>
      <b-input-group prepend="月">
        <b-select v-model="month" :options="months"></b-select>
      </b-input-group>
      <b-input-group prepend="選擇醫生">
        <b-select v-model="phone" :options="doctors"></b-select>
      </b-input-group>
    </div>

    <header class="my-header mt-2">
      <h2>{{ year }} 年 {{ month }} 月名醫會館所得合計明細</h2>
    </header>

    <header class="my-header">
      <h2>{{ (phone && doctors.find((s) => phone == s.value).text) || "全部醫院醫生" }}</h2>
    </header>
    <section v-if="phone">
      <header class="dtc-report">
        <div style="font-weight:500" v-for="item in titles" :key="item">{{ item }}</div>
      </header>
      <main class="dtc-report dtc-main" style="border-top:0" v-for="(item, i) in items" :key="i">
        <div>{{ item.id }}</div>
        <div>{{ item.orderDate.split("T")[0] }}</div>
        <div>
          {{ (item.inqueryCate && allCate.find((s) => s.value == item.inqueryCate) && allCate.find((s) => s.value == item.inqueryCate).text) || item.inqueryCate }}
        </div>
        <div>{{ $formatPrice(item.paidAmount) }}</div>
        <div>{{ item.discount || "0.85" }}</div>
        <div>{{ $formatPrice(item.paidAmount * (item.discount ? item.discount : discount)) }}</div>
      </main>
    </section>
    <section v-else>
      <header class="dtc-report">
        <div style="font-weight:500" v-for="item in adminTitles" :key="item">{{ item }}</div>
      </header>
      <main class="dtc-report dtc-main" style="border-top:0" v-for="(item, i) in adminRows" :key="i">
        <div>{{ i + 1 }}</div>
        <div>{{ item.doctoreLongName }}</div>
        <div>
          {{ item.paidCount }}
        </div>
        <div>{{ $formatPrice(item.paidAmount) }}</div>
        <div>{{ item.discount || "0.85" }}</div>
        <div>{{ $formatPrice(item.paidAmount * (item.discount ? item.discount : discount)) }}</div>
      </main>
    </section>
    <main v-if="!items.length" class="my-header" style="border:1px solid black;border-top:0">
      暫無資料
    </main>
    <footer v-if="items.length" class="dtc-report" style="border-top:0;">
      <main style="grid-column: 1/ 6;text-align:center; border-right:1px solid black; line-height:40px; ">
        總實際所得合計
      </main>
      <main style="text-align:center;  line-height:40px; font-size:12px;">
        {{ grossIncome }}
      </main>
    </footer>
  </section>
</template>

<script>
import { store, actions } from "@/store/global.js";
import moment from "dayjs";
import * as R from "ramda";

const allValues = { value: null, text: "全部醫院醫生", discount: 0.85 };
const titles = ["訂單編號", "客戶下單日期", "客戶病狀", "支付金額", "乘以", "實際所得"];
const adminTitles = ["序號", "醫生", "客戶訂單數", "總收入", "乘以", "實際所得"];

const zero = "T00:00:00.000Z";
const rows = [10, 20, 50];
let year = new Date().getFullYear();
const years = new Array(2).fill().map((s, i) => ({ value: year - i, text: year - i }));
const months = new Array(12).fill().map((s, i) => ({ value: i + 1, text: i + 1 }));
export default {
  name: "incomeList",
  data() {
    return {
      adminTitles,
      discount: 0.85,
      titles,
      years,
      months,
      year,
      month: moment().month() + 1,
      orderBy: [],
      Code: "",
      Text: "",
      dtcPublic: false,
      showEdit: false,
      number: "",
      name: "",
      id: "",
      items: [],
      currentPageNum: 1,
      rowCount: 0,
      pagingRowPerPage: 11180,
      search: false,
      rows,
      totalCountStr: "",
      editItem: "",
      toggleComment: false,
      cate: 0,
      status: 0,
      phone: null,
      doctors: [],
      adminRows: [],
    };
  },
  components: {},
  computed: {
    grossIncome() {
      if (!this.items.length) return "";
      const total = this.items.reduce((accumulator, { paidAmount, discount }) => {
        const t = discount ? discount : this.discount;
        return (accumulator += paidAmount * t);
      }, 0);
      return "NT $" + this.$formatPrice(parseInt(total));
    },
    normalCates() {
      let arr = store.cates
        .filter((s) => +s.cid > 33)
        .map((s) => ({
          value: s.cid,
          text: s.name,
        }));
      arr.unshift({ value: 0, text: "全部" });
      return arr;
    },
    allCate() {
      return store.cates.map((s) => ({
        value: s.cid,
        text: s.name,
      }));
    },
  },
  methods: {
    async getDDL() {
      const { items: docs } = await actions.getDoctors("_limit=590");
      this.doctors = docs.map((s) => ({
        value: s.phone,
        text: `${s.name} (${s.hospital})`,
        discount: s.discount,
      }));
      this.doctors.unshift(allValues);
    },
    async getData(phone) {
      this.adminRows = [];
      this.items = [];
      let qs = sessionStorage.isAdmin ? "" : "doctorPhone=" + sessionStorage.phone;
      phone ? (qs = "doctorPhone=" + phone) : "";
      qs += "&_limit=" + this.pagingRowPerPage;
      qs += "&_sort=doctorPhone:ASC";
      const startTime = moment(`${this.year}-${this.month}-01`).format("YYYY-MM-DD");
      const endTime = moment(`${this.year}-${this.month}-01`)
        .endOf("month")
        .add(1, "days")
        .format("YYYY-MM-DD");
      qs += `&orderDate_gte=${startTime}T00:00:00.000Z&orderDate_lt=${endTime}T00:00:00.000Z`;
      const { items, count } = await actions.getOrders(qs);
      this.items = items;
      let groupIncome = R.groupWith((a, b) => a.doctorPhone == b.doctorPhone, items);
      const arr = [];
      groupIncome.forEach((s) => {
        s[0].paidCount = 1;
        if (s.length > 1) {
          const t = s.reduce((acc, { paidAmount }) => {
            return (acc += paidAmount);
          }, 0);
          s[0].paidAmount = t;
          s[0].paidCount = s.length;
        }
        s[0].doctoreLongName = this.doctors.find((t) => t.value == s[0].doctorPhone).text;
        arr.push(s[0]);
      });
      const byIncome = R.descend(R.prop("paidAmount"));
      this.adminRows = R.sort(byIncome, arr);

      this.rowCount = count;
      this.totalCountStr = `共${count} 筆`;
    },
  },
  async mounted() {
    await this.getDDL();
    this.getData();
  },
  watch: {
    month() {
      this.getData();
    },
    year() {
      this.getData();
    },
    phone(v) {
      this.getData(v);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.dtc-main-section {
  overflow-x: auto;
  background: #fbfbfb;
  position: relative;
  min-height: calc(100vh - 75px);
}
.my-header,
.my-footer {
  width: calc(190px + 280px + 160px + 3 * 120px + 2px);
  display: block;
  text-align: center;
  font-weight: 500;
  height: 40px;
  line-height: 40px;
  margin: 0 auto;
  border: 1px solid black;
  border-bottom: 0px;
}

.dtc-report {
  width: max-content;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 190px 280px 160px repeat(3, 120px);
  height: 40px;
  border: 1px solid black;
  text-align: center;
  > div {
    height: 40px;
    line-height: 40px;
    font-size: 1rem;
    border-right: 1px solid black;
  }
  > div:last-child {
    border-right: none;
  }
}
.dtc-main {
  > * {
    font-size: 12px !important;
  }
}
.dtc-grid-header {
  display: grid;
  grid-template-columns: 90px repeat(4, 120px) 120px 180px repeat(4, 120px) 1fr;

  text-align: center;
  padding-right: 0px;
  border: 1px solid white;

  > div {
    border-right: 1px solid white;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    font-size: 14px;
    padding: 4px 0;
  }
  > div:last-child {
    border-right: none;
  }
}
.my-dark {
  > div {
    background: var(--gray);
    color: white;
  }
}
.dtc-link {
  color: var(--primary);
  cursor: pointer;
}
.dtc-search {
  position: relative;
  display: grid;
  width: calc(120px + 190px + 160px + 3 * 120px + 2px);
  max-height: 40px;
  margin: 0 auto;
  margin-bottom: 20px;
  grid-template-columns: repeat(34, max-content);
  grid-gap: 1rem;
}
.search-btns {
  position: absolute;
  display: flex;
  flex-direction: column;
  > button:not(:first-child) {
    margin-top: 1rem;
  }
  right: 2px;
  top: 0px;
}
.dtx-footer {
  display: grid;
  grid-template-columns: max-content max-content max-content;
  justify-content: center;
  grid-gap: 12px;
}
.container-dtx {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(#000, 0.8);
  display: grid;
  place-items: center;
  z-index: 999;
}
.dtx-form {
  width: 800px;
  height: 300px;
  padding: 12px;
  border-radius: 5px;
  background: var(--light);
  display: grid;
  grid-template-columns: repeat(2, 1fr);

  grid-gap: 12px;
  > div {
    max-height: 40px;
  }
  button {
    justify-self: center;
    max-height: 40px;
  }
}
.main-dtc-body {
  &:hover {
    background-color: rgba(0, 0, 0, 0.075);
  }
  > div {
    line-height: 24px;
  }
}
.input-group-text {
  color: white;
  background: #757575;
}

.close-phrase-icon {
  cursor: pointer;
  float: right;
  font-size: 30px;
  color: var(--success);
  transform: translate(-20px, -20px);
}
.edit-row-dtc {
  display: grid;
  grid-template-columns: max-content max-content;
  grid-gap: 4px;
}
.close-dlg {
  float: right;
  color: var(--light);
  font-size: 24px;
  cursor: pointer;
  margin-top: 0px;
  margin-right: 10px;
}
.ask-header {
  background: #646b74;
  box-shadow: 100vw 0 0 #646b74;
  height: 42px;
  color: white;
  font-size: 20px;
  padding-left: 10px;
  line-height: 42px;
  margin-bottom: 12px;
}
/deep/ .btn-light {
  background: #1f7cd3;
  border-color: #1f7cd3;
  color: white;
}
/deep/ .btn-info {
  background: #0f579b;
  border-color: #0f579b;
}
/deep/ .btn-success {
  background: #17a2b8;
  border-color: #17a2b8;
}
/deep/ .page-item.active .page-link {
  background: #808080;
  border-color: #808080;
}
.dtc-grid-header {
  footer {
    background: var(--snap-blue);
    color: white;
    text-align: left;
    //padding: 10px;
    grid-column: 1/-1;
    section {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: max-content;
      padding: 0 10px;
      gap: 3px;
      border-radius: 10px;
      > div {
        padding: 10px;
      }
    }
  }
}
.grid-2-btn {
  display: grid;
  grid-template-columns: repeat(10, max-content);
  grid-gap: 0.5rem;
  padding-left: 10px;
}
</style>
