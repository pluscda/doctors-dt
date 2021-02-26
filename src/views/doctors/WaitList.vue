<template>
  <section class="dtc-main-section">
    <header class="ask-header">診斷報告</header>
    <div class="dtc-search pl-2">
      <b-input-group prepend="處理狀態">
        <b-select :options="orderStatus" v-model="status" @change="getData"></b-select>
      </b-input-group>
      <b-input-group prepend="客戶病狀">
        <b-select :options="cancerCates" v-model="cate" @change="getData"></b-select>
      </b-input-group>
      <b-input-group prepend="客戶電話">
        <b-input v-model="phone"></b-input>
      </b-input-group>
      <b-button class="mr-1" variant="light" @click="searchDb" size="sm"> <i class="fas fa-search"></i>進行查詢 </b-button>
      <b-button variant="info" @click="clearSearch" size="sm"> <i class="fas fa-eraser"></i>清除條件 </b-button>
    </div>
    <header class="dtc-grid-header my-dark ml-1" style="margin:0;">
      <div>操作</div>
      <div v-for="(item, i) in headers" :key="i" @click="sort(item)">
        {{ item.name }}
        <span v-show="item.sortDesc === null">
          <i class="fas fa-sort"></i>
        </span>
        <span v-show="item.sortDesc === false">
          <i class="fas fa-sort-up"></i>
        </span>
        <span v-show="item.sortDesc">
          <i class="fas fa-sort-down"></i>
        </span>
      </div>
    </header>
    <main v-if="!items.length" class="dtc-grid-header main-dtc-body ml-1">
      <div style="grid-column: 1 / -1;padding: 20px 0px;font-size:24px;color:black;">
        暫無資料
      </div>
    </main>

    <main
      class="dtc-grid-header main-dtc-body ml-1"
      v-for="(item, i) in items"
      :key="i"
      style="color:black;"
      :style="i % 2 == 0 ? 'background-color: #F5F5F5;' : 'background-color: #E0E0E0;'"
    >
      <div>
        <b-button size="sm" variant="info" class="mx-2" @click="wirteReport(item)">報告撰寫</b-button>
      </div>
      <div style="display:grid;grid-template-columns: 60px max-content">
        <b-form-checkbox v-model="item.viewItemComment" style="margin-top:2px;" class="ml-1" @change="viewComment(item)" switch> </b-form-checkbox>
        <div>{{ item.totalMsg || 0 }}</div>
      </div>

      <div>{{ item.lineClientDisplayName || "暫無資料" }}</div>
      <div>{{ item.clientEmail || "暫無資料" }}</div>
      <div>{{ $formatPrice(item.paidAmount) }}</div>
      <div>{{ $formatStatus(item.orderStatus) }}</div>
      <div>{{ $twDate(item.orderDate) }}</div>
      <div>{{ (item.inqueryCate && allCate.find((s) => s.value == item.inqueryCate) && allCate.find((s) => s.value == item.inqueryCate).text) || item.inqueryCate }}</div>
      <div>{{ item.clientLinePhone ? clientLinePhone : "暫無資料" }}</div>
      <div>{{ item.hardCopyReceived ? $twDate(item.hardCopyReceived).split(" ")[0] : "否" }}</div>
      <div>{{ item.copySendBack ? $twDate(item.copySendBack).split(" ")[0] : "否" }}</div>
      <div>{{ item.docHasCopy ? $twDate(item.docHasCopy).split(" ")[0] : "否" }}</div>

      <nav v-if="item.viewItemComment" class="mb-2" style="text-align:left;">
        <b-button :disabled="!item.addedComment" @click="addNewDoctorComment(item)" class="mt-1 mb-1 ml-2" variant="primary" size="sm">確認新增留言</b-button>
        <b-textarea v-model="item.addedComment" placeholder="請在此輸入留言..." no-resize spellcheck="false" rows="4" style="width:99vw;"> </b-textarea>
      </nav>
      <footer v-if="item.viewComment">
        <main v-for="(note, k) in item.message" :key="k">
          <section class="mb-1" style="color:white;" :style="note.docComment ? 'background:#1f7cd3;' : 'background:#f3d6d2;color:black !important;'">
            <div class="msg-line-grid">
              <van-icon name="pending-payment" size="20px" v-if="getMsgStatus(note).includes('未讀取')" />
              <van-icon name="certificate" color="black" size="20px" v-if="getMsgStatus(note).includes('已讀取')" />
              <span>{{ getMsgStatus(note) }}</span>
              <span>{{ $twDate(note.commentAt, "@") }}</span>

              <span class="mark-as-read" v-if="!note.read && note.userComment" @click.stop="updateReadStatus(note)">註記已讀</span>
            </div>
            <div style="line-height:22px;">{{ note.docComment ? "醫生留言" : "客戶說" }}: {{ note.docComment || note.userComment }}</div>
          </section>
        </main>
      </footer>
    </main>

    <footer class="dtx-footer mb-3">
      <b-pagination v-model="currentPageNum" :total-rows="rowCount" :per-page="pagingRowPerPage" aria-controls="dataTable1" align="center" class="mt-2">
        <span slot="first-text">
          <i class="fas fa-fast-backward"></i>
        </span>
        <span slot="prev-text">
          <i class="fas fa-step-backward"></i>
        </span>
        <span slot="next-text">
          <i class="fas fa-step-forward"></i>
        </span>
        <span slot="last-text">
          <i class="fas fa-fast-forward"></i>
        </span>
        <span slot="page" slot-scope="{ page, active }">
          <b v-if="active">{{ page }}</b>
          <i v-else>{{ page }}</i>
        </span>
      </b-pagination>
      <b-select :options="rows" class="mt-2" v-model="pagingRowPerPage"></b-select>
      <div class="mt-3" style="color:black;">{{ totalCountStr }}</div>
    </footer>
  </section>
</template>

<script>
import { store, actions } from "@/store/global.js";
import moment from "dayjs";
import queryString from "qs";

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
let itemIdViewComment = "";
export default {
  name: "waitList",
  data() {
    return {
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
    cancerCates() {
      let arr = store.cates
        .filter((s) => +s.cid < 34)
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
    toggleMsgArea(item) {
      if (item.viewComment) {
        this.addComment(item);
      } else {
        this.hideTextarea(item);
      }
    },
    async updateReadStatus(item, note) {
      note.read = true;
      await actions.updateOrder(item);
      await this.getData();
      const ret = this.items.find((s) => item.id == s.id);
      if (ret) {
        ret.viewComment = true;
        this.items = [...this.items];
      }
    },
    getMsgStatus(item) {
      let str = item.docComment && item.read ? "客戶已讀取" : "";
      if (!str) str = item.docComment && !item.read ? "客戶未讀取" : "";
      if (!str) str = item.userComment && !item.read ? "醫生未讀取" : "";
      if (!str) str = item.userComment && item.read ? "醫生已讀取" : "";
      return str;
    },
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
        this.items = [...this.items];
        this.$bvToast.toast(`新增留言成功`, {
          title: "系統資訊",
          autoHideDelay: 5000,
          variant: "success",
        });
        itemIdViewComment = item.id;
        setTimeout(this.getData(), 100);
        const lineId = item.orderPhoneNum?.length > 10 ? item.orderPhoneNum : "U2a9bc2736efe3c6a0d361fef34efdb83";
        const obj2 = { id: lineId };
        item.realName ? "" : (item.realName = "DTC tester");
        obj2.msg = `${item.realName}醫師留言:\n ${obj.docComment}`;
        actions.lineMsg(obj2);
      } catch (e) {
        alert("client :" + e);
      }
    },
    addComment(item) {
      item.viewComment = true;
      item.addNewComment = true;
      this.toggleComment = true;
      this.items = [...this.items];
    },
    viewComment(item) {
      requestAnimationFrame(() => {
        item.viewComment ? (item.viewComment = false) : (item.viewComment = true);
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
          this.orderBy.push(s.sortDesc ? `${s.key}:DESC` : `${s.key}:ASC`);
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
        qs += "&inqueryCate_lt=" + store.MIN_NON_CANCER_NUM;
      }

      if (this.phone) {
        qs += "&clientLinePhone=" + this.phone;
      }

      if (id) {
        qs = "id=" + id;
      }
      const { items, count } = await actions.getOrders(qs);
      if (itemIdViewComment) {
        const item = items.find((s) => s.id == itemIdViewComment);
        if (item) {
          item.viewComment = true;
          item.viewItemComment = true;
          itemIdViewComment = "";
        }
      }
      this.items = [...items];
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
.dtc-grid-header {
  display: grid;
  grid-template-columns: 100px repeat(4, 100px) 120px 180px repeat(4, 120px) 1fr;

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
.mark-as-read {
  display: inline-block;
  clip-path: polygon(10% 1%, 100% 0%, 100% 99%, 10% 100%, 0% 50%);
  background: linear-gradient(to right, #da5afa, #c735ec);
  height: 25px;
  width: 70px;
  text-align: center;
  color: white;
  font-size: 12px;
  line-height: 25px;
  transform: translateY(-5px);
}
.msg-line-grid {
  display: grid;
  grid-template-columns: repeat(10, max-content);
  grid-gap: 6px;
}
</style>
