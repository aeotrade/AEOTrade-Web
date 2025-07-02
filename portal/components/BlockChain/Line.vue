<template>
  <div class="echarts" ref="echarts"></div>
</template>

<script setup>
  const props = defineProps({
    data: {type: Array, required: true},
      namelabel: String,
      valuelabel: String,
      winwidth: Number,                // 窗口宽度
      color: {
        type: String,
        default: 'blue',
        validator: val => ['blue', 'orange'].indexOf(val) > -1
      }
  })
  const { $eChart } = useNuxtApp()
const echarts = ref()
    const    myChart=ref( null)     // echart实例对象

    onMounted(()=> {
      drawEcharts()
    })
   
    const  xaxisData = computed( () =>{
        if(props.data.length){
          return props.data.map(item => {
            if(item[props.namelabel].length > 20){
              return item[props.namelabel].slice(0, 20) + '...';
            }else{
              return item[props.namelabel]
            }
          })
        }
      })
      const seriesData=computed( ()=>{
        if(props.data.length){
          return props.data.map(item => item[props.valuelabel])
        }
      })
      const  drawEcharts=()=>{
        // 基于准备好的dom，初始化echarts实例
        myChart.value = $eChart.init(echarts.value);
        // 绘制图表

        let option = {
          grid:{
            left: '15%',
            top: '10%',
            right: '5%',
            bottom: '40%'
          },
          tooltip: {
            show:true,
            // position: (point, params, dom) => {
            //   return [point[0] - 30, point[1] - 70]
            // },
            // trigger: 'item',
            formatter: '{b}  {c} 万元'
          },
          xAxis: {
            data: xaxisData.value,
            axisLine: {
              lineStyle:{
                color: '#6e7079'
              }
            },
            axisLabel: {   // X轴的文字
              color: '#d8dadf'
            },
            axisPointer: {
              show: true,
              type: 'shadow'
            }
          },
          yAxis: {
            splitLine:{
              lineStyle: {
                color: '#384a66'
              }
            },
            axisLabel: {   // X轴的文字
              color: '#d8dadf'
            },
          },
          series: [{
            data: seriesData.value,
            type: "line",
            smooth: 0.5,  // 平滑
            itemStyle: {
              color: props.color === 'blue' ? '#2478f2' : '#f39423'
            },
            areaStyle: {
              color: props.color === 'blue' ? 'rgba(39, 114, 242, 0.25)' : 'rgba(241, 147, 37, 0.25)'
            }
          }]
        }
        myChart.value.setOption(option);
      }
    
    watch( {
      winwidth:{
        handler(newValue, oldValue) {
          // 当 message 发生变化时触发的回调函数
          myChart.value.resize()   // 重新渲染echarts
        }
      },
      data:{
        handler(){
          drawEcharts()
        }
       
      }
    })
    
   
    
</script>

<style lang="scss" scoped>
  .echarts{
    height: 100%;
  }
</style>
