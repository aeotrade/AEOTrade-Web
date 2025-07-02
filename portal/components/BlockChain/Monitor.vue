<script setup>
import { CountTo as BaseCountTo } from "vue3-count-to";
import { getCbdData } from "@/api/blockChain";
import worldMapData from "./world.js";
const props = defineProps({
  type: String,
});

const nowTime = ref("2020-01-01"); // 数据最近更新时间
const parseTypeName = ref({ import: "进口", export: "出口" });
const data = ref({
  update_time: "2022-02-21 17:43:02",
  today_ex_order_qty: 0,
  this_month_ex_order_qty: 0,
  this_year_ex_order_qty: 0,
  this_month_ex_turnover: 0,
  this_year_ex_turnover: 0,
  this_month_ex_ret_tax: 0,
  this_year_ex_ret_tax: 0,
  ex_turnover_trend: [
    {
      data_month: "1月",
      data_num: 0,
    },
    {
      data_month: "2月",
      data_num: 0,
    },
    {
      data_month: "3月",
      data_num: 0,
    },
    {
      data_month: "4月",
      data_num: 0,
    },
    {
      data_month: "5月",
      data_num: 0,
    },
    {
      data_month: "6月",
      data_num: 0,
    },
    {
      data_month: "7月",
      data_num: 0,
    },
    {
      data_month: "8月",
      data_num: 0,
    },
    {
      data_month: "9月",
      data_num: 0,
    },
    {
      data_month: "10月",
      data_num: 0,
    },
    {
      data_month: "11月",
      data_num: 0,
    },
    {
      data_month: "12月",
      data_num: 0,
    },
  ],
  ex_ret_tax_trend: [
    {
      data_month: "1月",
      data_num: 0,
    },
    {
      data_month: "2月",
      data_num: 0,
    },
    {
      data_month: "3月",
      data_num: 0,
    },
    {
      data_month: "4月",
      data_num: 0,
    },
    {
      data_month: "5月",
      data_num: 0,
    },
    {
      data_month: "6月",
      data_num: 0,
    },
    {
      data_month: "7月",
      data_num: 0,
    },
    {
      data_month: "8月",
      data_num: 0,
    },
    {
      data_month: "9月",
      data_num: 0,
    },
    {
      data_month: "10月",
      data_num: 0,
    },
    {
      data_month: "11月",
      data_num: 0,
    },
    {
      data_month: "12月",
      data_num: 0,
    },
  ],
  ex_goods_rank: [
    {
      goods_name: "",
      goods_num: 0,
    },
    {
      goods_name: "",
      goods_num: 0,
    },
    {
      goods_name: "",
      goods_num: 0,
    },
    {
      goods_name: "",
      goods_num: 0,
    },
    {
      goods_name: "",
      goods_num: 0,
    },
  ],
  ex_goods_ratio: [
    {
      goods_name: "",
      goods_num: 0,
    },
    {
      goods_name: "",
      goods_num: 0,
    },
    {
      goods_name: "",
      goods_num: 0,
    },
    {
      goods_name: "",
      goods_num: 0,
    },
    {
      goods_name: "",
      goods_num: 0,
    },
  ],
  ex_country_rank: [
    {
      country_name: "",
      country_num: 0,
    },
    {
      country_name: "",
      country_num: 0,
    },
    {
      country_name: "",
      country_num: 0,
    },
    {
      country_name: "",
      country_num: 0,
    },
    {
      country_name: "",
      country_num: 0,
    },
  ],
  ex_order_qty_trend: {
    month_ex_order_qty: 0,
    ex_order_qty_data: [
      {
        data_month: "1月",
        data_num: 0,
      },
      {
        data_month: "2月",
        data_num: 0,
      },
      {
        data_month: "3月",
        data_num: 0,
      },
      {
        data_month: "4月",
        data_num: 0,
      },
      {
        data_month: "5月",
        data_num: 0,
      },
      {
        data_month: "6月",
        data_num: 0,
      },
      {
        data_month: "7月",
        data_num: 0,
      },
      {
        data_month: "8月",
        data_num: 0,
      },
      {
        data_month: "9月",
        data_num: 0,
      },
      {
        data_month: "10月",
        data_num: 0,
      },
      {
        data_month: "11月",
        data_num: 0,
      },
      {
        data_month: "12月",
        data_num: 0,
      },
    ],
  },
  trade_mode_ratio: [
    {
      trade_mode_name: "",
      trade_mode_num: 0,
    },
    {
      trade_mode_name: "",
      trade_mode_num: 0,
    },
    {
      trade_mode_name: "",
      trade_mode_num: 0,
    },
    {
      trade_mode_name: "",
      trade_mode_num: 0,
    },
    {
      trade_mode_name: "",
      trade_mode_num: 0,
    },
    {
      trade_mode_name: "",
      trade_mode_num: 0,
    },
  ],
  ex_country_hotspot_map: [],
  im_turnover_trend: [
    {
      data_month: "1月",
      data_num: 0,
    },
    {
      data_month: "2月",
      data_num: 0,
    },
    {
      data_month: "3月",
      data_num: 0,
    },
    {
      data_month: "4月",
      data_num: 0,
    },
    {
      data_month: "5月",
      data_num: 0,
    },
    {
      data_month: "6月",
      data_num: 0,
    },
    {
      data_month: "7月",
      data_num: 0,
    },
    {
      data_month: "8月",
      data_num: 0,
    },
    {
      data_month: "9月",
      data_num: 0,
    },
    {
      data_month: "10月",
      data_num: 0,
    },
    {
      data_month: "11月",
      data_num: 0,
    },
    {
      data_month: "12月",
      data_num: 0,
    },
  ],
  im_goods_rank: [
    {
      goods_name: "",
      goods_num: 0,
    },
    {
      goods_name: "",
      goods_num: 0,
    },
    {
      goods_name: "",
      goods_num: 0,
    },
    {
      goods_name: "",
      goods_num: 0,
    },
    {
      goods_name: "",
      goods_num: 0,
    },
  ],
  im_goods_ratio: [
    {
      goods_name: "",
      goods_num: 0,
    },
    {
      goods_name: "",
      goods_num: 0,
    },
    {
      goods_name: "",
      goods_num: 0,
    },
    {
      goods_name: "",
      goods_num: 0,
    },
    {
      goods_name: "",
      goods_num: 0,
    },
  ],
  im_country_rank: [
    {
      country_name: "",
      country_num: 0,
    },
    {
      country_name: "",
      country_num: 0,
    },
    {
      country_name: "",
      country_num: 0,
    },
    {
      country_name: "",
      country_num: 0,
    },
    {
      country_name: "",
      country_num: 0,
    },
  ],
  im_order_qty_trend: {
    month_im_order_qty: 0,
    im_order_qty_data: [
      {
        data_month: "1月",
        data_num: 0,
      },
      {
        data_month: "2月",
        data_num: 0,
      },
      {
        data_month: "3月",
        data_num: 0,
      },
      {
        data_month: "4月",
        data_num: 0,
      },
      {
        data_month: "5月",
        data_num: 0,
      },
      {
        data_month: "6月",
        data_num: 0,
      },
      {
        data_month: "7月",
        data_num: 0,
      },
      {
        data_month: "8月",
        data_num: 0,
      },
      {
        data_month: "9月",
        data_num: 0,
      },
      {
        data_month: "10月",
        data_num: 0,
      },
      {
        data_month: "11月",
        data_num: 0,
      },
      {
        data_month: "12月",
        data_num: 0,
      },
    ],
  },
}); // 接口数据
const timer = ref("");

// 当前页面的标题
const pageTitle = computed(() => {
  let data1 = {
    import: "慧贸OS进口业务概览",
    export: "慧贸OS出口业务概览",
  };
  return data1[props.type];
});
// 地图的各国坐标数据
const worldData = computed(() => {
  let data1 = {
    rcep14: [
      "缅甸",
      "泰国",
      "越南",
      "老挝",
      "柬埔寨",
      "文莱",
      "马来西亚",
      "印度尼西亚",
      "韩国",
      "日本",
      "菲律宾",
      "新加坡",
      "澳大利亚",
      "新西兰",
    ],
    global: [
      "缅甸",
      "柬埔寨",
      "印度尼西亚",
      "日本",
      "菲律宾",
      "新加坡",
      "澳大利亚",
      "新西兰",
      "俄罗斯",
      "赞比亚",
      "美国",
      "巴西",
      "尼泊尔",
      "德国",
      "加拿大",
    ],
  };
  let t = "global";
  return data1[t].map((item) => {
    return {
      name: item,
      value: worldMapData[item],
    };
  });
});
// 文字颜色
const getMainCardDescColor = computed(() => {
  let style = {};
  style.color = props.type == "import" ? "#fad711" : "#fad711";
  return style;
});
// 近12月主要商品排名
const goods_rank = computed(() => {
  return props.type === "import"
    ? data.value.im_goods_rank
    : data.value.ex_goods_rank;
});
// 近12月主要商品占比
const goods_ratio = computed(() => {
  return props.type === "import"
    ? data.value.im_goods_ratio
    : data.value.ex_goods_ratio;
});
// 进出口国排行前5
const country_rank = computed(() => {
  return props.type === "import"
    ? data.value.im_country_rank
    : data.value.ex_country_rank;
});
// 当日进出口量
const today_order_qty = computed(() => {
  return props.type === "import"
    ? data.value.today_im_order_qty
    : data.value.today_ex_order_qty;
});
// 当月进出口量
const month_order_qty = computed(() => {
  return props.type === "import"
    ? data.value.this_month_im_order_qty
    : data.value.this_month_ex_order_qty;
});
// 当年进出口量
const year_order_qty = computed(() => {
  return props.type === "import"
    ? data.value.this_year_im_order_qty
    : data.value.this_year_ex_order_qty;
});
// 月进出口量(Echarts的上面统计数据)
const month_order_qty2 = computed(() => {
  return props.type == "import"
    ? data.value.im_order_qty_trend.month_im_order_qty
    : data.value.ex_order_qty_trend.month_ex_order_qty;
});
// 订单量趋势
const orderTrend = computed(() => {
  return props.type == "import"
    ? data.value.im_order_qty_trend.im_order_qty_data
    : data.value.ex_order_qty_trend.ex_order_qty_data;
});

onMounted(() => {
  nextTick(() => {
    getData();
    timer.value = setInterval(() => {
      getData();
    }, 15000);
  });
});

//获取数据
const getData = async () => {
  const res = await getCbdData(props.type);
  data.value = res.result;
};
onBeforeUnmount(() => {
  clearInterval(timer.value);
});
</script>

<template>
  <ClientOnly>
    <div class="busi-data-page" style="height: 100vh; overflow-x: hidden">
      <img
        src="./img/background.png"
        :style="{ height: '100%' }"
        alt=""
        class="background"
      />
      <!--头部标题图片-->
      <div class="title-wrapper" :style="{ width: '100%', height: '8%' }">
        <img src="./img/title-background.png" alt="" class="title-png" />
        <div
          style="
            color: #fff;
            font-weight: bold;
            text-align: center;
            font-size: 30px;
            line-height: 60px;
          "
          class="background"
        >
          {{ pageTitle }}
        </div>
        <div class="back" style="position: absolute; top: 45%">
          <div></div>
          <div>
            <i class="el-icon-time"></i>数据更新时间：<span>{{
              data.update_time
            }}</span>
          </div>
        </div>
      </div>
      <div class="separator" :style="{ height: '1.8%' }"></div>
      <div
        class="line-wrapper"
        style="display: flex; justify-content: space-between; height: 88%"
      >
        <div class="main-left">
          <div
            style="position: relative"
            class="main-card-item main-card-left-item-3"
          >
            <h5 class="card-title">
              近12月主要商品{{ parseTypeName[type] }}排名
            </h5>
            <div class="echart-unit">单位：票</div>
            <BlockChain-Bar
              :data="goods_rank"
              namelabel="goods_name"
              valuelabel="goods_num"
              :color="['#FD9E49', '#FBEB37', '#28FFB5', '#5B9DFF', '#83FAFA']"
            ></BlockChain-Bar>

            <!--          <ProgressBar title="主要商品echarts" :data="goods_rank"></ProgressBar>-->
          </div>
          <div class="main-card-item main-card-left-item-3">
            <h5 class="card-title">
              近12月主要{{ parseTypeName[type] }}热卖商品占比
            </h5>
            <BlockChain-Pie
              :data="goods_ratio"
              namelabel="goods_name"
              valuelabel="goods_num"
            ></BlockChain-Pie>
          </div>
          <div
            style="position: relative"
            class="main-card-item main-card-left-item-3"
          >
            <h5 class="card-title">
              近12月{{ parseTypeName[type] }}国排行前五
            </h5>
            <div class="echart-unit">单位：票</div>
            <BlockChain-Bar
              :data="country_rank"
              namelabel="country_name"
              valuelabel="country_num"
              :color="['#F47A2D', '#B000FF', '#FBEB37', '#2AB0FC', '#83FAFA']"
            ></BlockChain-Bar>
          </div>
        </div>
        <div class="main-center">
          <div class="main-center-dash">
            <div class="dash-item">
              <div class="dash-item-title-wrap">
                <img src="./img/orders.svg" />
                当日{{ parseTypeName[type] }}单量
              </div>
              <div class="dash-item-num-wrap">
                <img src="./img/arrow.gif" />
                <span class="dash-item-num">
                  <!--                {{today_order_qty}}-->
                  <BaseCountTo
                    :startVal="0"
                    :endVal="today_order_qty"
                    :duration="3000"
                    :autoplay="true"
                    ref="example1"
                  ></BaseCountTo> </span
                >票
              </div>
            </div>
            <div class="dash-item">
              <div class="dash-item-title-wrap">
                <img src="./img/orders.svg" />
                当月{{ parseTypeName[type] }}单量
              </div>
              <div class="dash-item-num-wrap">
                <img src="./img/arrow.gif" />
                <span class="dash-item-num">
                  <!--{{month_order_qty}}-->
                  <BaseCountTo
                    :startVal="0"
                    :endVal="month_order_qty"
                    :duration="3000"
                    :autoplay="true"
                    ref="example2"
                  ></BaseCountTo> </span
                >票
              </div>
            </div>
            <div class="dash-item">
              <div class="dash-item-title-wrap">
                <img src="./img/orders.svg" />
                当年{{ parseTypeName[type] }}单量
              </div>
              <div class="dash-item-num-wrap">
                <img src="./img/arrow.gif" />
                <span class="dash-item-num">
                  <!--                {{year_order_qty}}-->
                  <BaseCountTo
                    :startVal="0"
                    :endVal="year_order_qty"
                    :duration="3000"
                    :autoplay="true"
                    ref="example3"
                  ></BaseCountTo> </span
                >票
              </div>
            </div>
          </div>
          <div class="main-center-title">
            近12月{{ parseTypeName[type] }}贸易国热点
          </div>
          <div class="main-center-map">
            <!--          :style="getMapGif()"-->
            <BlockChain-WorldMap :type="type" :world-data="worldData" />
          </div>
          <div
            class="main-card-item main-center-bottom-card"
            style="position: relative"
          >
            <h5 :style="{ backgroundSize: '50% 50%' }" class="card-title">
              {{ parseTypeName[type] }}订单量趋势
            </h5>
            <div class="echart-unit" style="top: 24px; right: 105px">
              单位：票
            </div>
            <div class="center-bottom-dash">
            </div>
            <BlockChain-BarNormal
              :data="orderTrend"
              namelabel="data_month"
              valuelabel="data_num"
            ></BlockChain-BarNormal>
          </div>
        </div>
        <div class="main-right">
          <div
            v-if="type === 'export'"
            style="
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            "
          >
            <div class="main-card-item main-card-right-item-3-top">
              <h5 class="card-title">{{ parseTypeName[type] }}成交额</h5>
              <div class="main-card-desc">
                <div class="desc-item">
                  <div class="desc-item-title">
                    <img src="./img/money.svg" />
                    当月成交额
                  </div>
                  <span class="desc-item-num" :style="getMainCardDescColor">
                    <BaseCountTo
                      :startVal="0"
                      :endVal="data.this_month_ex_turnover"
                      :duration="3000"
                      :autoplay="true"
                      ref="example3"
                    ></BaseCountTo>
                  </span>
                  万元
                </div>
                <div class="desc-item">
                  <div class="desc-item-title">
                    <img src="./img/money.svg" />
                    当年成交额
                  </div>
                  <span class="desc-item-num" :style="getMainCardDescColor">
                    <!--                  {{data.this_year_ex_turnover}}-->
                    <BaseCountTo
                      :startVal="0"
                      :endVal="data.this_year_ex_turnover"
                      :duration="3000"
                      :autoplay="true"
                      ref="example3"
                    ></BaseCountTo>
                  </span>
                  万元
                </div>
              </div>
              <BlockChain-Line
                :data="data.ex_turnover_trend"
                namelabel="data_month"
                valuelabel="data_num"
              ></BlockChain-Line>
            </div>
            <div class="main-card-item main-card-right-item-3-center">
              <h5 class="card-title">近12月主要贸易方式占比</h5>
              <BlockChain-Pie
                :showlegend="true"
                :data="data.trade_mode_ratio"
                unit="票"
                namelabel="trade_mode_name"
                valuelabel="trade_mode_num"
              ></BlockChain-Pie>
            </div>
            <div class="main-card-item main-card-right-item-3-top">
              <h5 class="card-title">{{ parseTypeName[type] }}退税额</h5>
              <div class="main-card-desc">
                <div class="desc-item">
                  <div class="desc-item-title">
                    <img src="./img/money.svg" />
                    当月出口退税额
                  </div>
                  <span class="desc-item-num" :style="getMainCardDescColor">
                    <!--                    {{data.this_month_ex_ret_tax}}-->
                    <BaseCountTo
                      :startVal="0"
                      :endVal="data.this_month_ex_ret_tax"
                      :duration="3000"
                      :autoplay="true"
                      ref="example3"
                    ></BaseCountTo>
                  </span>
                  万元
                </div>
                <div class="desc-item">
                  <div class="desc-item-title">
                    <img src="./img/money.svg" />
                    当年出口退税额
                  </div>
                  <span class="desc-item-num" :style="getMainCardDescColor">
                    <!--                    {{data.this_year_ex_ret_tax}}-->
                    <BaseCountTo
                      :startVal="0"
                      :endVal="data.this_year_ex_ret_tax"
                      :duration="3000"
                      :autoplay="true"
                      ref="example3"
                    ></BaseCountTo>
                  </span>
                  万元
                </div>
              </div>
              <BlockChain-Line
                color="orange"
                :data="data.ex_ret_tax_trend"
                namelabel="data_month"
                valuelabel="data_num"
              ></BlockChain-Line>
            </div>
          </div>

          <div
            style="
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            "
            v-else
          >
            <div class="main-card-item main-card-right-item-2-top">
              <h5 class="card-title">{{ parseTypeName[type] }}成交额</h5>
              <div class="main-card-desc">
                <div class="desc-item">
                  <div class="desc-item-title">
                    <img src="./img/money.svg" />
                    当月成交额
                  </div>
                  <span class="desc-item-num" :style="getMainCardDescColor">
                    <!--                    {{data.this_month_im_turnover}}-->
                    <BaseCountTo
                      :startVal="0"
                      :endVal="data.this_month_im_turnover"
                      :duration="3000"
                      :autoplay="true"
                      ref="example3"
                    ></BaseCountTo>
                  </span>
                  万元
                </div>
                <div class="desc-item">
                  <div class="desc-item-title">
                    <img src="./img/money.svg" />
                    当年成交额
                  </div>
                  <span class="desc-item-num" :style="getMainCardDescColor">
                    <!--                    {{data.this_year_im_turnover}}-->
                    <BaseCountTo
                      :startVal="0"
                      :endVal="data.this_year_im_turnover"
                      :duration="3000"
                      :autoplay="true"
                      ref="example3"
                    ></BaseCountTo>
                  </span>
                  万元
                </div>
              </div>
              <BlockChain-Line
                color="orange"
                :data="data.im_turnover_trend"
                namelabel="data_month"
                valuelabel="data_num"
              ></BlockChain-Line>
            </div>

            <div class="main-card-item main-card-right-item-2-bottom">
              <h5 class="card-title">近12月主要贸易方式占比</h5>
              <BlockChain-Pie
                :showlegend="true"
                :data="data.trade_mode_ratio"
                unit="票"
                namelabel="trade_mode_name"
                valuelabel="trade_mode_num"
              ></BlockChain-Pie>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<style scoped lang="scss">
.back {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  position: absolute;
  z-index: 101;
  top: 3.6%;
  width: 100%;
  font-weight: bold;
  padding: 0 30px;
  color: #fff;
  .back-btn {
    cursor: pointer;
  }
  i {
    margin-right: 10px;
  }
}
.new-container {
  width: 66.25%;

  .frame-wrapper {
    width: 49%;
    height: 98.5%;
  }
}

.new-wrapper {
  display: flex;
  justify-content: space-between;
  height: 49%;
}

.busi-data-page {
  min-width: 1700px;
  min-height: 900px;
  /*height: 100%;*/
  position: relative;
}

.background {
  width: 100%;
  height: auto;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}

.title-wrapper {
  position: relative;
  overflow-y: hidden;
  z-index: 100;
}

.title-png {
  position: relative;
  width: 100%;
  height: auto;
  z-index: 3;
  transform: translateY(-8px);
}

.separator {
  width: 100%;
}

.line-wrapper {
  margin: 0 1.1%;
  position: relative;
  overflow: hidden;
  z-index: 100;
  overflow-x: inherit;
}

.two-col-layout {
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  justify-content: space-between;
}

.frame-wrapper {
  position: relative;
}

.one-col-frame {
  position: absolute;
  z-index: 3;
  height: auto;
  top: 0;
  left: 0;
}

.one-col-frame2 {
  position: absolute;
  z-index: 3;
  height: auto;
  top: 0;
}

.two-col-frame {
  position: absolute;
  z-index: 3;
  height: auto;
  left: 0;
}

.three-col-frame {
  position: absolute;
  width: 100%;
  height: auto;
  z-index: 3;
}

.sub-title-wrapper {
  position: absolute;
  width: 100%;
  top: 5%;
  z-index: 3;
}

.sub-title {
  color: white;
  font-weight: bold;
  font-size: 16px;
  position: relative;
  height: auto;
  text-align: center;
}

.three-col-inner-panel {
  overflow: hidden;
  position: absolute;
  top: 100px;
  left: 0;
  width: 100%;
  /*border: 1px solid red;*/
}

.two-col-inner-panel {
  position: absolute;
  top: 100px;
  left: 0;
  width: 100%;
  /*border: 1px solid red;*/
}

.one-col-inner-panel {
  position: absolute;
  top: 15%;
  height: 80%;
  left: 0;
  width: 100%;
  /*border: 1px solid red;*/
}

.seat {
  width: auto;
  height: 20px;
}

.layout-flex {
  display: flex;
  /*justify-content: center;*/
}

.virtual-line {
  border: 1px dashed #046291;
  padding: 0 20px;
  width: 80%;
}

.has-margin-top {
  margin-top: 20px;
}

:deep(.el-input__inner) {
  background-color: inherit;
  border-color: #0093d3;
  color: white;
  padding: 0 0 0 5px;
}

:deep(.el-input--prefix .el-input__inner) {
  padding-left: 5px;
}

:deep(.el-input--suffix .el-input__inner) {
  padding-right: 0;
}

.top-card {
  /*margin-right: 1.5%;*/
  width: 100%;
  display: flex;
  justify-content: space-between;
}
/*.card-item{*/
/*  display: flex;*/
/*  justify-content: center;*/
/*  align-items: center;*/
/*  background: url("./img/dash-data-bg.png");*/
/*  background-size: 100% 100%;*/
/*  color: #fff;*/
/*}*/
.card-item-6 {
  width: 15%;
}
.card-item-4 {
  width: 22.5%;
}
.main-left {
  display: inline-block;
  width: 25%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.main-center {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 48%;
  height: 100%;
  background-size: 100% 100%;
  color: #fff;
}
.main-right {
  display: inline-block;
  width: 25%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.main-card-item {
  background-size: 100% 100%;
  color: #fff;
  padding: 15px;
}
.main-card-left-item-3 {
  background: url("./img/left-bg.png");
  background-size: 100% 100%;
  height: 32%;
}
.main-card-right-item-2-top {
  background: url("./img/right-top-bg-import.png");
  background-size: 100% 100%;
  height: 57%;
  width: 100%;
}
.main-card-right-item-2-bottom {
  background: url("./img/right-top-bg-import.png");
  background-size: 100% 100%;
  height: 41%;
  width: 100%;
}
.main-card-right-item-3-top {
  background: url("./img/right-top-bg.png");
  background-size: 100% 100%;
  height: 34%;
  width: 100%;
}
.main-card-right-item-3-center {
  background: url("./img/right-center-bg.png");
  background-size: 100% 100%;
  height: 28%;
  width: 100%;
}
.main-center-dash {
  height: 9%;
  width: 100%;
  display: flex;
  justify-content: space-around;
}
.main-center-title {
  height: 6.4%;
  width: 100%;
  background: url("./img/center-12-title-bg.png");
  background-size: 100% 100%;
  font-size: 28px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
}
.main-center-map {
  height: 52%;
  width: 100%;
  /*background: url("./img/map-fake.gif");*/
  background-size: 100% 100%;
}
.main-center-bottom-card {
  height: 24%;
  width: 100%;
  background: url("./img/center-bg.png");
  background-size: 100% 100%;
}
.card-title {
  font-size: 18px;
  background: url("./img/left-right-title-bg.png");
  background-size: 100% 50%;
  background-repeat: no-repeat;
  background-position: 0% 90%;
}
.main-center-dash {
  display: flex;
  justify-content: space-around;
  .dash-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .dash-item-title-wrap {
      margin-bottom: 10px;
      font-size: 18px;
      display: flex;
      img {
        margin-right: 5px;
      }
    }
    .dash-item-num-wrap {
      img {
        width: 24px;
      }
      font-size: 16px;
      .dash-item-num {
        font-size: 32px;
        color: #fad711;
        display: inline-block;
        margin-right: 5px;
      }
    }
  }
}
.center-bottom-dash {
  text-align: right;
}
.main-card-desc {
  display: flex;
  width: 100%;
  margin-top: 10px;
  .desc-item {
    width: 50%;
    .desc-item-title {
      display: flex;
      font-size: 14px;
      margin-bottom: 8px;
      img {
        margin-right: 5px;
      }
    }
    .desc-item-num {
      font-size: 22px;
    }
  }
}
.echart-unit {
  position: absolute;
  right: 20px;
  top: 55px;
  font-size: 12px;
}
</style>
