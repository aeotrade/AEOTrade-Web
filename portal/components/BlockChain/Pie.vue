<script setup>

const props=defineProps( {
     data: {type: Array, required: true},
     namelabel: String,
     valuelabel: String,
     unit: {
       type: String,
       default: ''
     },
     showlegend: {type: Boolean, default: false},
     winwidth: Number,                // 窗口宽度
   })
     const { $eChart } = useNuxtApp()
     const echarts = ref()
     const  myChart=ref(null)     // echart实例对象



    const xaxisData = computed(()=>{
       if(props.data.length){
         return props.data.map(item => {
           if(item[props.namelabel].length > 20){
             return props[props.namelabel].slice(0, 20) + '...';
           }else{
             return item[props.namelabel]
           }
         })
       }
     })

    const seriesData=computed(()=>{
       if(props.data.length){
         return props.data.map(item => {
           return {name: item[props.namelabel], value: item[props.valuelabel]}
         })
       }
     })

     const   drawEcharts=()=>{
       // 基于准备好的dom，初始化echarts实例
       myChart.value = $eChart.init(echarts.value);
       // 绘制图表

       let option = {
         title: {
           show: false,
           text: 'Weather Statistics',
           subtext: 'Fake Data',
           left: 'center'
         },
         tooltip: {
           show:true,
           position: (point, params, dom) => {
             return [point[0] - 30, point[1] - 70]
           },
           trigger: 'item',
           formatter: '{b} : {c} ' + props.unit + '   {d} %'
         },
         color: ['#fbdab2', '#f7b463', '#f39423', '#f9c78b', '#f5a544', '#f39423'],
         legend: {
           show: props.showlegend,
           orient: 'vertical', // 纵向
           right: 2,
           top: 'center',
           itemWidth: 15,
           textStyle: {color: '#fff'},
           data: xaxisData.value
         },
         series: [
           {
             type: 'pie',
             center: [props.showlegend ? '35%' : '50%', '50%'],
             radius: ['30%', '50%'],
             data: seriesData.value,
             itemStyle: {
               borderRadius: props.showlegend ? 0 : [5, 5],
             },
             startAngle: 190,
             label: {
               color: '#fff',
               formatter: '{b}   {d}%'
             },
             emphasis: {
               itemStyle: {
                 shadowBlur: 10,
                 shadowOffsetX: 0,
                 shadowColor: 'rgba(0, 0, 0, 0.5)'
               }
             }
           }
         ]
       }
       myChart.value.setOption(option);
     }

   watch(()=>props.winwidth,
    ()=>{
     myChart.value.resize() // 重新渲染echarts  }
    })

     watch(()=>props.data.length,()=>{drawEcharts()})



   onMounted(()=> {
     drawEcharts()
   })
</script>

<template>
  <div class="echarts" ref="echarts"></div>
</template>

<style lang="scss" scoped>
.echarts {
  height: 100%;
}
</style>
