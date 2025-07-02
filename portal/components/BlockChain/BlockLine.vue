<script setup>
const { $eChart } = useNuxtApp();
const echarts = ref();
const props = defineProps({
  data: { type: Array, required: true }
});
const myChart = ref(null)

const series = computed(() => {
  if (props.data.length) {
    return props.data
      .map((item) => {
        return item.TxNum;
      })
      .reverse();
  } else {
    return [];
  }
})

const xaxis = computed(() => {
  if (props.data.length) {
    return props.data
      .map((item) => {
        return parseTime(item.Timestamp, "{h}:{i}");
      })
      .reverse();
  } else {
    return [];
  }
})



const drawEcharts = () => {
  // 基于准备好的dom，初始化echarts实例
  myChart.value = $eChart.init(echarts.value);
  // 绘制图表

  let option = {
    legend: {
      textStyle: { color: "#fff" },
    },
    grid: {
      left: "10%",
      top: "10%",
      right: "5%",
      bottom: "18%",
    },
    xAxis: {
      data: xaxis.value,
      axisLine: {
        lineStyle: {
          color: "#6e7079",
        },
      },
      axisLabel: {
        // X轴的文字
        color: "#d8dadf",
      },
      axisPointer: {
        show: true,
        type: "shadow",
      },
    },
    yAxis: {
      splitLine: {
        lineStyle: {
          color: "#384a66",
        },
      },
      axisLabel: {
        // Y轴的文字
        color: "#d8dadf",
      },
    },
    tooltip: {
      show: true,
      formatter: "时间：{b} 交易数量：{c} 条",
    },
    series: [
      {
        name: "交易量",
        data: series.value,
        type: "line",
        showSymbol: false,
        smooth: 0.5, // 平滑
        itemStyle: {
          color: "#2478f2",
        },
      },
    ],
  };
  myChart.value.setOption(option);
};

watch(()=>props.data,()=>{drawEcharts()}, {deep: true})

onMounted(() => {
  nextTick(()=>{
    drawEcharts();
    console.log(series,series.value)
  })
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
