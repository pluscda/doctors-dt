<template>
  <section class="dtc-main-section">
    <header class="ask-header">歷史報告</header>
    <div class="dtc-search pl-2">
      <b-input-group prepend="處理狀態">
        <b-select :options="orderStatus" v-model="status" @change="getData"></b-select>
      </b-input-group>
      <b-input-group prepend="客戶病狀">
        <b-select :options="allCates" v-model="cate" @change="getData"></b-select>
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
      <div style="display:grid; grid-template-columns: max-content max-content">
        <b-button size="sm" variant="info" class="mx-2" @click="wirteReport(item)">報告撰寫</b-button>
        <b-form-checkbox v-model="item.viewItemComment" :disabled="!item.message.length" style="margin-top:2px;" class="ml-1" @change="viewComment(item)" switch
          >查看留言</b-form-checkbox
        >
      </div>
      <div v-if="!item.viewComment" @click="addComment(item)" style="cursor:pointer;">{{ item.message.length }} <i class="fas fa-plus-circle"></i></div>
      <div
        v-else
        @click="
          item.viewComment = false;
          hideTextarea(item);
        "
        style="cursor:pointer;"
      >
        {{ item.message.length }}<i class="fas fa-minus-circle"></i>
      </div>
      <div>{{ item.docUnreadMsg || 0 }}</div>
      <div>{{ item.cusUnreadMsg || 0 }}</div>
      <div>{{ $formatPrice(item.paidAmount) }}</div>
      <div>{{ $formatStatus(item.orderStatus) }}</div>
      <div>{{ $twDate(item.orderDate) }}</div>
      <div>{{ item.inqueryCate && allCates.find((s) => s.value == item.inqueryCate).text }}</div>
      <div>{{ item.orderPhoneNum }}</div>
      <div>{{ item.hardCopyReceived ? "是" : "否" }}</div>
      <div>{{ item.copySendBack ? "是" : "否" }}</div>
      <div>{{ item.docHasCopy ? "是" : "否" }}</div>

      <nav v-if="item.addNewComment" class="mb-2 add-comment">
        <b-textarea v-model="item.addedComment" placeholder="請在此輸入留言..." no-resize spellcheck="false" rows="4" style="width:99vw;"> </b-textarea>
        <b-button :disabled="!item.addedComment" @click="addNewDoctorComment(item)" class="mt-1 mr-2" variant="primary" size="sm" style="float:left">新增留言</b-button>
        <b-button class="mt-1" size="sm" style="float:left" @click="hideTextarea(item)">取消</b-button>
      </nav>
      <footer v-if="item.viewComment">
        <main v-for="(note, k) in item.message" :key="k">
          <section class="mb-1" style="color:white;" :style="note.docComment ? 'background:#1f7cd3;' : 'background:#0f579b;'">
            <div>
              <span class="mr-2" v-if="note.docComment"><i class="fas fa-hospital-user"></i></span>
              <span class="mr-2" v-else> <i class="fas fa-chevron-circle-right"></i></span>

              {{ $twDate(note.commentAt) }}
            </div>
            <div class="pb-3">{{ note.docComment || note.userComment }}</div>
          </section>
        </main>
      </footer>
    </main>

    <footer class="dtx-footer">
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

const headers = [
  { name: "留言數量", key: "totalMsg", sortDesc: null },
  { name: "醫生未讀留言", key: "docUnreadMsg", sortDesc: null },
  { name: "客戶未讀留言", key: "cusUnreadMsg", sortDesc: null },
  { name: "支付金額", key: "paidAmount", sortDesc: null },
  { name: "處理狀態", key: "orderStatus", sortDesc: null },
  { name: "下單日期", key: "orderDate", sortDesc: null },
  { name: "客戶病狀", key: "inqueryCate", sortDesc: null },
  { name: "客戶電話", key: "orderPhoneNum", sortDesc: null },
  { name: "收到快遞", key: "hardCopyReceived", sortDesc: null },
  { name: "寄回快遞", key: "copySendBack", sortDesc: null },
  { name: "醫生收到快遞", key: "docHasCopy", sortDesc: null },
];

const zero = "T00:00:00";
const rows = [10, 20, 50];
export default {
  name: "historylist",
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
    allCates() {
      let arr = store.cates.map((s) => ({
        value: s.cid,
        text: s.name,
      }));
      arr.unshift({ value: 0, text: "全部" });
      return arr;
    },
    orderStatus() {
      let arr = [...store.orderStatus];
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
          this.orderBy.push(s.sortDesc ? `${s.key}:desc` : `${s.key}:asc`);
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
    async getData() {
      let qs = "doctorPhone=" + sessionStorage.phone;
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
      }

      if (this.cate) {
        qs += "&inqueryCate=" + this.cate;
      }

      if (this.phone) {
        qs += "&orderPhoneNum=" + this.phone;
      }

      const { items, count } = await actions.getOrders(qs);
      this.items = [...items];
      this.rowCount = count;
      this.totalCountStr = `共${count} 筆`;
    },
  },
  async mounted() {
    this.getData();
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
  grid-template-columns: 200px repeat(4, 100px) 120px 180px repeat(4, 120px) 1fr;

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
</style>
