import ButtonComponent from './index.vue';

// 添加install方法
const Hmbtn = {
  install: function (Vue) {
    Vue.component("Hmbtn", ButtonComponent);
  }
};

// 导出
export default Hmbtn;
