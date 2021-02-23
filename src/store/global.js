import Vue from "vue";

let PASSWORD = "weR168@healther.dtc.tw"
const ordersText = ["等待醫師處理中","醫生處理中","醫師已結案","醫師過期未結案"];
const orderStatus = ["waiting","process", "finish","exception"].map((s,i) =>( {
  value:s,
  text: ordersText[i]
}));

const init = {
  isLogin: false,
  fireUid:'',
  PASSWORD,
  activeTab: 0,
  cates:[],
  imgPrefix: process.env.NODE_ENV === 'production'? 'https://dtchealth.datacom.com.tw' : `http://${location.hostname}:1337`,
  isDoctor: false,
  orderStatus,
  editItem:'',
  MIN_NON_CANCER_NUM: 34,
  lineProfile:{},
};
export let store = Vue.observable({
  ...init,
});

export let actions = {
  async getCount(url){
     return await axios.get(url);
  },
  async updateOrder(item){
     return axios.put('dtc-orders/' + item.id, item);
  },
  async getDoctors(qs){
    const url = "doctors?" + qs;
    const url2 = "doctors/count?" + qs;
    const count = await actions.getCount(url2);
    const items = await axios.get(url);
    return {count, items};
    //const url = this.id ? "doctors?cid_eq=" + this.id : `doctors?_limit=30&_start=${this.skip}`;
    //this.docs = await axios.get(url);
  },
  async getDocInfo(phone){
    return axios.get('doctores?phone_eq=' + sessionStorage.phone);
  },
  async getCancerStats(qs){
    return axios.get('hits/cancer-job?' + qs);
  },
  async getInqueryStats(qs){
    return axios.get('hits/inquery-job?' + qs);
  },
  async getIncomeStats(qs){
    return axios.get('hits/income?' + qs);
  },
  async getUnreadMsgStats(qs){
    return axios.get('hits/msg-count?' + qs);
  },
  async getTopIncomeStats(qs){
    return axios.get('hits/top-income?' + qs);
  },
 
  async getOrders(qs){
    const url = "dtc-orders?" + qs;
    const url2 = "dtc-orders/count?" + qs;
    const count = await actions.getCount(url2);
    const items = await axios.get(url);
    return {count, items};
  },
  async addOrder(item){
      return await axios.post('dtc-orders', item);
  },
  async getCancerTypes(){
     return await axios.get('cancer-types');
  },
  
  async registerStrapi(obj){
    try{
      obj.email = obj.username.includes("@") ? obj.username : obj.username + PASSWORD;
      return await axios.post("auth/local/register", obj);
    }catch(e){
      return e;
    }
  },
  async loginStrapi(obj){
    try{
      //https://strapi.io/documentation/developer-docs/latest/guides/auth-request.html#login-as-a-reader
      return await axios.post("auth/local", obj);
    }catch(e){
      return e;
    }
  },
   
};
export let mutations = {
  login(phone) {
    store.isLogin = true;
    sessionStorage.isLogin = "true";
    sessionStorage.phone = phone;
  },
  async logout() {
    store.isLogin = false; // need this line to tigger other pages; DO NOT REMOVE
    sessionStorage.clear();
    localStorage.clear();
    store = Vue.observable({
      ...init,
    });
  },
};

