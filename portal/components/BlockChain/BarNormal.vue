<template>
  <div class="echarts" ref="echarts"></div>
</template>

<script setup>
const { $eChart } = useNuxtApp();
const echarts = ref("");
const props = defineProps({
  data: { type: Array, required: true },
  namelabel: String,
  valuelabel: String,
  winwidth: Number, // 窗口宽度
  color: { type: Array },
  leftNum: {
    default: "10%",
  },
});

const myChart = ref(null); // echart实例对象

const drawEcharts = () => {
  // 基于准备好的dom，初始化echarts实例
  myChart.value = $eChart.init(echarts.value);
  // 绘制图表

  let option = {
    color: ["#3398DB"],
    tooltip: {
      trigger: "axis",
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
      },
      formatter: "{b}{a}:  {c} 票",
    },
    grid: {
      left: "8%",
      top: "15%",
      right: "10%",
      bottom: "8%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        data: xaxisData.value,
        axisTick: {
          alignWithLabel: true,
        },
        // name: "类型",
        nameTextStyle: {
          verticalAlign: "top",
          lineHeight: 29,
        },
        axisLabel: {
          // X轴的文字
          color: "#dcdddf",
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        // name: '档案份数',
        nameTextStyle: {
          align: "right",
        },
        axisLabel: {
          // X轴的文字
          color: "#dcdddf",
        },
        splitLine: {
          show: false,
        },
        min: 0,
        max: seriesData.value.reduce((total, cur) => {
          return total + cur;
        }, 0)
          ? null
          : 10, // 当数据全为0时，设置max为10，使柱状图Y轴更美观
      },
    ],
    series: [
      {
        name: "订单量",
        type: "bar",
        barWidth: "45%",
        data: seriesData.value,
        itemStyle: {
          normal: {
            color: "#f39423",
            label: {
              show: false, //开启显示
              position: "top", //在上方显示
              formatter: "{c}",
              textStyle: {
                //数值样式
                color: "black",
              },
            },
          },
        },
      },
    ],
  };
  myChart.value.setOption(option);
};

const xaxisData = computed(() => {
  if (props.data.length) {
    return props.data
      .map((item) => {
        if (item[props.namelabel].length > 20) {
          return item[props.namelabel].slice(0, 20) + "...";
        } else {
          return item[props.namelabel];
        }
      })
      .reverse();
  }
});
const seriesData = computed(() => {
  if (props.data.length) {
    return props.data.map((item) => item[props.valuelabel]).reverse();
  }
});

watch(()=>props.winwidth,()=>{ myChart.value.resize()})

watch(()=>props.data.length,()=>{drawEcharts()})



onMounted(() => {
  nextTick(()=>{
    drawEcharts();
  })

});
</script>

<style lang="scss" scoped>
.echarts {
  height: 100%;
}
</style>
