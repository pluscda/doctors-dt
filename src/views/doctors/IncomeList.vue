<template>
  <section class="dtc-main-section">
    <header class="ask-header">收支明細</header>
    <div class="dtc-search pl-2">
      <b-select v-model="year" :options="years"></b-select>
      <b-select v-model="month" :options="months"></b-select>
    </div>

    <header class="my-header">
      <h2>{{ year }} 年 {{ month }} 月名醫會館收支明細</h2>
    </header>

    <header class="my-header">
      <h2>陳朝明(醫師)</h2>
    </header>

    <header class="dtc-report">
      <div style="font-weight:500" v-for="item in titles" :key="item">{{ item }}</div>
    </header>
    <main class="dtc-report dtc-main" style="border-top:0" v-for="(item, i) in items" :key="i">
      <div>{{ item.orderDate.split("T")[0] }}</div>
      <div>{{ item.id }}</div>
      <div>
        {{ (item.inqueryCate && allCate.find((s) => s.value == item.inqueryCate) && allCate.find((s) => s.value == item.inqueryCate).text) || item.inqueryCate }}
      </div>
      <div>{{ $formatPrice(item.paidAmount) }}</div>
      <div>{{ discount }}</div>
      <div>{{ $formatPrice(item.paidAmount * discount) }}</div>
    </main>
    <main v-if="!items.length" class="my-header" style="border:1px solid black;border-top:0">
      暫無資料
    </main>
  </section>
</template>

<script>
import { store, actions } from "@/store/global.js";
import moment from "dayjs";
import queryString from "qs";

const titles = ["下單日期", "訂單編號", "客戶病狀", "支付金額", "乘以", "實際所得"];
const headers = [
  { name: "留言數量", key: "totalMsg", sortDesc: null },
  { name: "客戶姓名", key: "lineClientDisplayName", sortDesc: null },
  { name: "客戶信箱", key: "clientEmail", sortDesc: null },
  { name: "支付金額", key: "paidAmount", sortDesc: null },
  { name: "處理狀態", key: "orderStatus", sortDesc: null },
  { name: "下單日期", key: "orderDate", sortDesc: null },
  { name: "客戶病狀", key: "inqueryCate", sortDesc: null },
  { name: "客戶電話", key: "clientLinePhone", sortDesc: null },
  { name: "收到快遞", key: "hardCopyReceived", sortDesc: null },
  { name: "寄回快遞", key: "copySendBack", sortDesc: null },
  { name: "醫生收到快遞", key: "docHasCopy", sortDesc: null },
];

const zero = "T00:00:00";
const rows = [10, 20, 50];
let year = new Date().getFullYear();
const years = new Array(2).fill().map((s, i) => ({ value: year - i, text: year - i + "年" }));
const months = new Array(12).fill().map((s, i) => ({ value: i + 1, text: i + 1 + "月" }));
export default {
  name: "incomeList",
  data() {
    return {
      discount: 0.85,
      titles,
      years,
      months,
      year,
      month: 3,
      orderBy: [],
      Code: "",
      Text: "",
      dtcPublic: false,
      showEdit: false,
      number: "",
      name: "",
      id: "",
      headers,
      items: [],
      currentPageNum: 1,
      rowCount: 0,
      pagingRowPerPage: 10,
      search: false,
      rows,
      totalCountStr: "",
      editItem: "",
      toggleComment: false,
      cate: 0,
      status: 0,
      phone: "",
    };
  },
  components: {},
  computed: {
    myEditItem() {
      return store.editItem;
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
    orderStatus() {
      let arr = [...store.orderStatus].slice(0, 2);
      arr.push({ value: "exception", text: "逾時未處理完" });
      arr.unshift({ value: 0, text: "全部" });
      return arr;
    },
  },
  methods: {
    wirteReport(item) {
      store.editItem = { ...item };
      this.$router.push("orderdetail");
    },
    hideTextarea(item) {
      item.addNewComment = item.addNewDoctorComment = "";
      this.items = [...this.items];
    },
    async addNewDoctorComment(item) {
      const obj = {};
      obj.docComment = item.addedComment;
      //const str = moment().format("YYYY-MM-DD HH:mm");
      obj.commentAt = new Date().toISOString();
      obj.rating = 0;
      obj.userComment = "";
      obj.read = false;
      item.message.unshift(obj);
      try {
        await actions.updateOrder(item);
        item.addedComment = "";
        item.addNewComment = "";
        this.items = [...this.items];
        this.$bvToast.toast(`新增留言成功`, {
          title: "系統資訊",
          autoHideDelay: 5000,
          variant: "success",
        });
        setTimeout(this.getData(), 200);
        const lineId = item.orderPhoneNum?.length > 10 ? item.orderPhoneNum : "U2a9bc2736efe3c6a0d361fef34efdb83";
        const obj2 = { id: lineId };
        item.realName ? "" : (item.realName = "DTC tester");
        let url = store.lineUrl + "orderid=" + item.id;
        obj2.msg = `${item.realName}醫師留言:\n ${obj.docComment}\n\n${url}`;
        actions.lineMsg(obj2);
      } catch (e) {
        alert("client :" + e);
      }
    },

    viewComment(item) {
      requestAnimationFrame(() => {
        item.viewComment ? (item.viewComment = false) : (item.viewComment = true);
        item.addNewComment = item.viewComment;
        this.items = [...this.items];
      });
    },
    sort(item) {
      if (item.sortDesc) {
        item.sortDesc = null;
      } else if (false === item.sortDesc) {
        item.sortDesc = true;
      } else if (null === item.sortDesc) {
        item.sortDesc = false;
      }
      this.orderBy = [];
      this.headers.forEach((s) => {
        if (s.sortDesc !== null) {
          this.orderBy.push(s.sortDesc ? `${s.key}:desc` : `${s.key}`);
        }
      });
      this.getData();
    },
    searchDb() {
      this.search = true;
      this.getData();
    },
    async clearSearch() {
      this.status = 0;
      this.cate = 0;
      this.phone = "";
      this.search = false;
      this.getData();
    },
    async getData(id) {
      let qs = sessionStorage.isAdmin ? "" : "doctorPhone=" + sessionStorage.phone;

      qs += "&_limit=" + this.pagingRowPerPage;
      if (this.orderBy.length) {
        qs += "&_sort=" + this.orderBy.join(",");
      }
      if (this.currentPageNum > 1) {
        qs += `&_start=` + (this.currentPageNum - 1) * this.pagingRowPerPage;
      }
      // filters by user
      if (this.status) {
        qs += "&orderStatus=" + this.status;
      } else {
        qs += "&orderStatus=waiting&orderStatus=process&orderStatus=exception";
      }

      if (this.cate) {
        qs += "&inqueryCate=" + this.cate;
      } else {
        qs += "&inqueryCate_gt=" + (store.MIN_NON_CANCER_NUM - 1);
      }

      if (this.phone) {
        qs += "&clientLinePhone=" + this.phone;
      }

      if (id) {
        qs = "id=" + id;
      }

      const { items, count } = await actions.getOrders(qs);
      this.items = items;
      this.rowCount = count;
      this.totalCountStr = `共${count} 筆`;
    },
  },
  async mounted() {
    const str = location.href.split("?")[1];
    const { id } = queryString.parse(str);
    this.getData(id);
  },
  async created() {
    store.cates = await actions.getCancerTypes();
  },
  watch: {
    currentPageNum(v) {
      this.currentPageNum = v;
      this.getData().catch((e) => {});
    },
    pagingRowPerPage(v) {
      this.getData().catch((e) => {});
    },
    myEditItem() {
      this.getData().catch((e) => {});
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
.my-header {
  width: calc(120px + 190px + 160px + 3 * 120px + 2px);
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
  grid-template-columns: 120px 190px 160px repeat(3, 120px);
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
  max-height: 40px;
  margin-bottom: 12px;
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
