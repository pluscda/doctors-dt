<template>
  <section class="dtc-main-section">
    <div class="close-dlg">
      <i class="fas fa-times-circle"></i>
    </div>
    <header class="ask-header print-hide">
      診斷報告: 撰寫作業
    </header>
    <div class="dtc-search pl-2 print-hide">
      <b-input-group prepend="檢查日期">
        <b-input type="date" v-model="inspectDate"></b-input>
      </b-input-group>
      <b-input-group prepend="病患姓名">
        <b-input v-model="name"></b-input>
      </b-input-group>
      <b-input-group prepend="病患性別">
        <b-select :options="sexs" v-model="sex"></b-select>
      </b-input-group>
      <b-input-group prepend="病患身高">
        <b-input v-model="height"></b-input>
      </b-input-group>
      <b-input-group prepend="病患年齡">
        <b-input v-model="age"></b-input>
      </b-input-group>
      <b-input-group prepend="身份證號">
        <b-input v-model="personId"></b-input>
      </b-input-group>
      <b-input-group prepend="出生日期">
        <b-input type="date" v-model="birthday"></b-input>
      </b-input-group>
      <b-input-group prepend="病患體重">
        <b-input v-model="weight"></b-input>
      </b-input-group>
      <b-button variant="primary" @click="saveBasic">儲存病患基本資料</b-button>
    </div>
    <main class="main-sec">
      <nav class="nav-opts mb-1  mt-2 py-2 ml-1">
        <b-button variant="primary" @click="save(false)" :disabled="!item.judge"
          ><span class="pr-1"><i class="fas fa-save"></i></span>暫存報告</b-button
        >
        <b-button variant="success" @click="save(true)" :disabled="!item.judge"
          ><span class="pr-1"><i class="fas fa-check"></i></span>正式報告</b-button
        >

        <b-button @click="$router.go(-1)"
          ><span class="pr-1"><i class="fas fa-arrow-left"></i></span>返回清單</b-button
        >
        <div></div>
      </nav>
      <section class="nav-left-right">
        <div>
          <b-textarea v-model="item.judge" autofocus placeholder="請在此輸入報告..." spellcheck="false" no-resize class="input-area-dtc"></b-textarea>
        </div>
      </section>
    </main>
  </section>
</template>

<script>
import queryString from "qs";
import moment from "dayjs";
import { store, actions } from "@/store/global.js";
import Vue from "vue";

const zero = "T00:00:00Z";
let inspectDate, name, sex, weight, age, personId, birthday, height;
const sexs = [
  { value: 1, text: "男" },
  { value: 2, text: "女" },
];
export default {
  name: "childdetail",
  data() {
    return {
      sexs,
      itemsHolderList: [],
      itemsAllList: [],
      item: { ...store.editItem },
      showAll: true,
      checkTime: "",
      personName: "",
      gender: "",
      personHeight: "",
      age: "",
      id: "",
      inspectDate,
      name,
      sex: 1,
      weight,
      age,
      personId,
      birthday,
      height,
    };
  },
  components: {},
  computed: {
    showPhraseDlg() {
      return store.showPhraseDlg;
    },
    totalCount() {
      return this.itemsHolderList.length + 1;
    },
    isOfficalReport() {
      return this.reportDetail.Status == 30;
    },
  },
  methods: {
    async saveBasic() {
      //const { inspectDate, name, sex, weight, age, personId, birthday, height } = this.data;
      this.item.report = {};
      this.item.report.inspectDate = this.inspectDate;
      this.item.report.name = this.name;
      this.item.report.sex = this.sex == 1 ? "male" : "female";
      this.item.report.weight = this.weight;
      this.item.report.personId = this.personId;
      this.item.report.birthday = this.birthday;
      this.item.report.height = this.height;
      this.item.report.age = this.age;
      try {
        await actions.updateOrder(this.item);
        this.$bvToast.toast(`儲存病患基本資料成功`, {
          title: "系統資訊",
          autoHideDelay: 5000,
          variant: "success",
        });
      } catch (e) {
        alert("client :" + e);
      }
    },
    async save(offical) {
      const str = offical ? "正式報告" : "暫存報告";
      if (!offical) {
        this.item.orderStatus = "process";
      } else {
        this.item.orderStatus = "finish";
      }
      try {
        await actions.updateOrder(this.item);
        this.$bvToast.toast(`${str}成功`, {
          title: "系統資訊",
          autoHideDelay: 5000,
          variant: "success",
        });
      } catch (e) {
        alert("client :" + e);
      }
    },
    setPersonInfo() {},
  },
  async mounted() {
    this.$mousetrap.bind("f5", () => {
      this.save(false);
      return false;
    });
    this.$mousetrap.bind("f6", () => {
      this.save(true);
      return false;
    });
    this.$mousetrap.bind("f4", () => {
      this.$router.go(-1);
    });
  },
  async created() {
    if (!this.item.report) return;
    this.inspectDate = moment(this.item.report.inspectDate).format("YYYY-MM-DD");
    this.name = this.item.report.name;
    this.sex = this.item.report.sex == "male " ? 1 : 2;
    this.height = this.item.report.height;
    this.personId = this.item.report.personId;
    this.birthday = moment(this.item.report.birthday).format("YYYY-MM-DD");
    this.weight = this.item.report.weight;
    this.age = this.item.report.age;
  },

  watch: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.dtc-main-section {
  color: black;
  overflow-x: auto;
  position: relative;
  min-height: calc(100vh - 75px);
  background: white;
}
.dtc-grid-header {
  display: grid;
  grid-template-columns: 80px 1fr 160px 180px 180px; //repeat(4, 1fr);
  grid-auto-flow: column;
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
  margin-bottom: 12px;
  grid-template-columns: repeat(5, max-content);
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
  position: relative;
}

.main-sec {
  background: #e5e5e5;
  box-shadow: 200px 0 0 #e5e5e5, -200px 0 0 #e5e5e5;
}
.nav-opts {
  display: grid;
  grid-template-columns: repeat(8, max-content) 1fr max-content;
  gap: 0.6rem;
}
.nav-left-right {
  display: grid;
  padding: 3px;
  textarea {
    width: calc(100vw - 7px);
    height: calc(100vh - 272px);
  }
}

.dtx-phrase {
  position: fixed;
  top: 0px;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(#000, 0.95);
  z-index: 8;
  .main-phrase {
    width: 80%;
    max-width: 1440px;
  }
}
.center-vgh-btn {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: grid;
  place-items: center;
}
.bar-icon {
  border-radius: 50%;
  background: var(--light);
  width: 20px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  cursor: pointer;
  position: relative;
}

.vghOptText {
  width: 300px;
  height: 100px;
  margin-left: 3rem;
}
.my-opts {
  margin-left: 30px;
  display: grid;
  grid-template-columns: repeat(22, max-content);
}
.vghOpt4Text {
  width: 300px;
  height: 100px;
  margin-left: 19px;
}
@media print {
  .dtc-main-section {
    min-height: 0px;
  }
  .print-hide {
    display: none;
  }

  .nav-left-right {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: max-content;
  }
  .dtc-fv {
    .right {
      margin-top: 20px;
    }
  }
  .dtc-ios {
    .right {
      margin-top: 20px;
    }
  }
}

.input-area-dtc {
  width: 100%;
  height: 100%;
}
</style>
