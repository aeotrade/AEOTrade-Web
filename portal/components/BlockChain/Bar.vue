<script setup>
const { $eChart } = useNuxtApp();
const echarts = ref();

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

const drawEcharts = () => {
  // 基于准备好的dom，初始化echarts实例
  myChart.value = $eChart.init(echarts.value);
  // 绘制图表

  let option = {
    tooltip: {
      show: true,
      position: (point, params, dom) => {
        return [point[0] - 30, point[1] - 70];
      },
      formatter: "{b}:  &nbsp; {c} 票",
    },
    // legend: {
    //     data: ["销量","热门"]
    // },
    color: props.color,
    colorBy: "data",
    grid: {
      left: "0%",
      top: "9%",
      right: "0%",
      bottom: "9%",
    },
    xAxis: {
      show: false,
    },
    yAxis: {
      data: xaxisData.value,
      show: false,
      // axisTick:{
      //   show:false
      // },
      // axisLine: {
      //   //隐藏y轴线
      //   show: false
      // }
    },

    series: [
      {
        name: "进口总金额",
        type: "bar",
        data: seriesData.value,
        itemStyle: {
          normal: {
            borderRadius : [3, 3, 3, 3],
          },
        },
        barCategoryGap: "85%",
        label: {
          show: true,
          formatter: "{b}          {c}",
          color: "#FFF",
          position: [5, -15],
        },
      },
    ],
  };
  myChart.value.setOption(option);
};

watch(
  () => props.winwidth,
  () => {
    myChart.value.resize(); // 重新渲染echarts
  }
);
watch(
  () => props.data.length,
  () => {
    drawEcharts();
  }
);

onMounted(() => {
  drawEcharts();
});
</script>

<template>
  <div class="echarts" ref="echarts"></div>
</template>

<style lang="scss" scoped>
.echarts {
  height: 100%;
}
</style>
