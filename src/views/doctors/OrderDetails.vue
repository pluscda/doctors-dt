<template>
  <section class="dtc-main-section">
    <div class="close-dlg">
      <i class="fas fa-times-circle"></i>
    </div>
    <header class="ask-header print-hide">
      診斷報告撰寫作業
      <div class="center-vgh-btn">
        <toggle-button
          class="mt-1"
          :width="162"
          :height="25"
          :font-size="16"
          v-model="showAll"
          :labels="{
            checked: '顯示病患詳情(F1)',
            unchecked: '顯示病患詳情(F1)',
          }"
        />
      </div>
    </header>
    <div class="dtc-search pl-2 print-hide" v-if="showAll">
      <b-input-group prepend="檢查日期">
        <b-input readonly v-model="checkTime"></b-input>
      </b-input-group>
      <b-input-group prepend="病患姓名">
        <b-input readonly v-model="personName"></b-input>
      </b-input-group>
      <b-input-group prepend="病患性別">
        <b-input readonly v-model="gender"></b-input>
      </b-input-group>
      <b-input-group prepend="病患身高">
        <b-input readonly v-model="personHeight"></b-input>
      </b-input-group>
      <b-input-group prepend="病患年齡">
        <b-input readonly v-model="age"></b-input>
      </b-input-group>
      <b-input-group prepend="檢查單號">
        <b-input readonly v-model="item.ReqNo"></b-input>
      </b-input-group>
      <b-input-group prepend="身份證號">
        <b-input readonly v-model="id"></b-input>
      </b-input-group>
      <b-input-group prepend="出生日期">
        <b-input readonly v-model="birthday"></b-input>
      </b-input-group>
      <b-input-group prepend="病患體重">
        <b-input readonly v-model="personWeight"></b-input>
      </b-input-group>
    </div>
    <main class="main-sec">
      <nav class="nav-opts mb-1 mx-2 mt-2 py-2 ml-4 print-hide">
        <b-check switch size="large" button-variant="primary" style="color:black;" class="mt-2 mr-2" v-model="continuousBtn"
          >連續報告({{ item.number }}/{{ totalCount }})</b-check
        >
        <div
          class="bar-icon mt-2 mr-2 go-prev"
          style="color: black;font-size: 18px;"
          @click="goPreReport"
          :style="item.number == 1 ? 'cursor: not-allowed;color:(--dark)' : ''"
        >
          <i class="fas fa-caret-left"></i>
        </div>
        <div class="bar-icon mt-2 mr-3 go-next" style="color: black;font-size: 18px;" @click="goNextReport">
          <i class="fas fa-caret-right"></i>
        </div>

        <b-button variant="primary" @click="save" :disabled="!item.judge"
          ><span class="pr-1"><i class="fas fa-save"></i></span>暫存報告(F5)</b-button
        >
        <b-button variant="success" @click="save(true)" :disabled="!item.judge"
          ><span class="pr-1"><i class="fas fa-check"></i></span>正式報告(F6)</b-button
        >

        <b-button @click="$router.push('/waitlist')"
          ><span class="pr-1"><i class="fas fa-arrow-left"></i></span>返回清單(F4)</b-button
        >
        <div></div>
      </nav>
      <section class="nav-left-right mx-2" :class="item.ProcedureCode == 'fv' ? 'dtc-fv' : 'dtc-ios'">
        <div ref="reportLeft" class="left">
          <b-textarea v-model="item.judge" autofocus placeholder="請在此輸入報告..." spellcheck="false" no-resize class="input-area-dtc"></b-textarea>
        </div>
        <div ref="reportRight" class="right"></div>
      </section>
    </main>
    <div id="dtc-print-it" class="show-while-print"></div>
  </section>
</template>

<script>
import queryString from "qs";
import moment from "dayjs";
import { store, actions } from "@/store/global.js";

const zero = "T00:00:00Z";
export default {
  name: "childdetail",
  data() {
    return {
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
    async save(offical) {
      const str = offical ? "正式報告" : "暫存報告";
      try {
        await actions.updateOrder(item);
        this.$bvToast.toast(`儲存${str}成功`, {
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
    this.$mousetrap.bind("f1", () => {
      this.showAll = !this.showAll;
      return false;
    });
    this.$mousetrap.bind("f3", () => {
      this.doShowPhraseDlg();
      return false;
    });
    this.$mousetrap.bind("f4", () => {
      this.$router.push("waitlist");
    });
    this.$mousetrap.bind("f5", () => {
      this.temporarySave();
      return false;
    });
    this.$mousetrap.bind("f6", () => {
      this.officalSave();
      return false;
    });
    this.$mousetrap.bind("f7", () => {
      this.goPreReport();
      return false;
    });
    this.$mousetrap.bind("f8", () => {
      this.goNextReport();
      return false;
    });

    try {
      //
    } catch (e) {
      alert(e);
    }
  },
  async created() {},

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
  grid-template-columns: 2fr 1fr;
  gap: 0.6rem;
  box-shadow: 0 100vh 0 #e5e5e5;
  .left,
  .right {
    border-radius: 12px;
    background: white;
    min-height: calc(100vh - 270px);
    margin-bottom: 30px;
    border-color: #a5d9ec !important;
  }
  .right {
    padding: 1rem;
    img {
      width: 100%;
      object-fit: cover;
    }
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
.go-prev::after,
.go-next::after {
  position: absolute;
  bottom: -20px;
  left: -2px;
  font-size: 12px;
  content: "(F7)";
}
.go-next::after {
  content: "(F8)";
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
