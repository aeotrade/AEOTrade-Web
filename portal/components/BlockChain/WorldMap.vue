

<script setup>
  import geoCoordMap from './world'

   const props = defineProps({
      type:{
        type: String,
        default:'import'
      },
      worldData:{
        type:Array,
        default:()=>[]
      }
   }
     
   )
    const { $eChart } = useNuxtApp()
    const echarts = ref()
    const  worldChart = ref(null) // charts模板，默认为空
    const  initTimeoutId = ref(0)
    const  loading = ref(true)
    const center = reactive({name:'中国北京',value:[116.25, 40.26]})
   
    const  drawMap=()=>{
        /* 画地图 */
        worldChart.value.setOption({
          geo: {
            map: "world",
            show: true,
            roam: true, //是否允许缩放
            zoom: 1.2,  // 缩放
            layoutCenter: ["50%", "50%"], //地图位置
            itemStyle: {
              normal: {
                show: 'true',
                color: "#446afe", //地图背景色
                borderColor: "#222949",//省市边界线
                textColor: 'yellow',
              }
            },
            emphasis: {
              show: true,
              color: "rgba(37, 43, 61, .5)", //悬浮背景
              normal: {label: {show: true}},
              label: {
                color: '#fff'
              }
            }
          },
          series: defaultData()
        })
      }
      const  reqMapData=()=> {
        /* 解析地图数据 */
        let res = null;
        try {
          let name = center.name;
          let res = convertData(props.worldData);
          if (worldChart.value !== null) {
            worldChart.value.setOption({
              series: [
                {
                  name: name,
                  type: 'lines',
                  zlevel: 1,
                  data: res
                }, {
                  name: name,
                  type: 'lines',
                  zlevel: 2,
                  data: res
                }, {
                  name: name,
                  type: 'scatter',
                  data: [{
                    name: name,
                    value: center.value,
                    visualMap: false
                  }]
                },
                {
                  name: name,
                  type: 'effectScatter',
                  data:props.worldData
                }
              ]
            })
          }
        } catch (e) {
          console.log("e", e)
        }
        return res
      }
      const   convertData=(data)=> {
        // 数据转换为echarts识别格式
        let res = [];
        data.forEach((item)=>{
          res.push({
            fromName: props.type === 'import' ? item.name: center.name,
            toName: props.type === 'import' ? center.name : item.name,
            coords: props.type === 'import' ? [item.value, center.value] : [center.value , item.value]
          });
        })
        return res;
      }
      const defaultData=()=> {
        /* 默认(没有数据) */
        let name = '北京';
        let color = ['#ffffff'];
        let planePath = 'path://M995.679767 658.818049c-8.943231-1.490539-23.848617-2.981077-44.716157-4.471615-73.03639-8.943231-207.184862-26.829694-295.126638-38.754003l-19.377001-5.962154h-2.981077l-44.716157-13.414848c-4.471616 90.922853-10.43377 166.94032-17.886463 225.071325v10.43377l22.358078 10.43377 70.055313 32.791849c2.981077 1.490539 4.471616 4.471616 4.471616 7.452693l1.490539 55.149927v4.471615c0 2.981077-1.490539 5.962154-4.471616 4.471616l-114.77147-19.377001c-8.943231 22.358079-17.886463 34.282387-31.30131 35.772925h-1.490539c-13.414847 0-23.848617-11.924309-31.30131-35.772925l-114.77147 17.886463c-2.981077 0-4.471616-1.490539-4.471616-4.471616v-4.471616l1.490539-55.149927c0-2.981077 1.490539-5.962154 4.471615-7.452693l70.055313-32.791849 22.358079-10.43377V819.796215c-5.962154-58.131004-10.43377-134.148472-14.905386-225.071324l-46.206696 13.414847h-4.471615l-19.377002 4.471616c-87.941776 10.43377-222.090247 26.829694-295.126637 35.772925-20.86754 2.981077-35.772926 4.471616-44.716158 4.471616-23.848617 2.981077-25.339156-26.829694-7.452692-37.263464 2.981077-1.490539 56.640466-29.810771 123.714701-67.074236v-38.754003c0-14.905386 11.924309-26.829694 26.829695-26.829694s26.829694 11.924309 26.829694 26.829694v8.943232c40.244541-20.86754 81.979622-43.225619 119.243086-64.093159v-44.716157c0-14.905386 11.924309-26.829694 26.829694-26.829695s26.829694 11.924309 26.829694 26.829695v14.905385c23.848617-11.924309 43.225619-23.848617 56.640466-31.30131-1.490539-174.393013 11.924309-308.541485 61.112082-332.390101 2.981077-1.490539 4.471616-1.490539 7.452693-2.981078 1.490539 0 4.471616 0 5.962154-1.490538h5.962154c1.490539 0 4.471616 0 5.962154 1.490538 2.981077 0 4.471616 1.490539 7.452693 2.981078 49.187773 23.848617 62.60262 157.997089 58.131005 332.390101 13.414847 7.452693 32.791849 17.886463 55.149927 29.810772v-14.905386c0-14.905386 11.924309-26.829694 26.829694-26.829694s26.829694 11.924309 26.829695 26.829694v44.716157c37.263464 20.86754 78.998544 43.225619 119.243085 65.583698V506.783115c0-14.905386 11.924309-26.829694 26.829695-26.829694s26.829694 11.924309 26.829694 26.829694v44.716157c68.564774 37.263464 122.224163 67.074236 123.714702 68.564775 25.339156 10.43377 23.848617 41.73508-1.490539 38.754002z';
        let series = [];
        [["北京"]].forEach(() => {
          series.push(
            {
              name: name,
              type: 'lines',
              zlevel: 1,
              effect: {
                show: true,
                period: 20,
                trailLength: 0.3,
                color: '#fff',
                symbolSize: 3
              },
              lineStyle: {
                normal: {
                  width: 0,
                  curveness: 0.2,
                }
              },
              data: []
            },
            {  //  飞机 和 飞行的轨迹
              name: name,
              type: 'lines',
              zlevel: 2,
              effect: {
                show: true,
                period: 20,
                trailLength: 0,
                symbol: planePath,
                symbolSize: 15
              },
              lineStyle: {
                color: '#fff',
                type: 'dotted',  // 虚线轨迹
                width: 2,
                opacity: 0.6,
                curveness: 0.2
              },
              data: []
            },
            {  // 北京的五角星显示
              name: name,
              type: "scatter",
              coordinateSystem: "geo",
              zlevel: 2,
              rippleEffect: {
                period: 4,
                brushType: "stroke",
                scale: 3
              },
              label: {
                normal: {
                  show: true,
                  color: "#fff",  // 文字颜色
                  position: 'top',
                  formatter: "{b}",
                  fontSize: 14,
                  fontWeight: 'bold'
                },
                emphasis: {
                  show: true,
                  color: "#FF6A6A"
                }
              },
              symbol: "path://M511.082606 89.707115 640.347668 381.582695 957.756785 415.585113 720.110293 628.727515 785.8526 941.099918 509.716492 780.939195 232.943888 940.007027 299.926442 627.883287 63.132364 413.8107 380.657114 381.064902 511.082606 89.707115Z",
              symbolSize: 20,
              itemStyle: {
                normal: {
                  show: true,
                  color: "#fff",
                },
                emphasis: {
                  show: true,
                  color: "#FF6A6A"
                }
              },
              data: [{
                name: '北京',
                value: geoCoordMap['北京'] ? geoCoordMap['北京'] : '',
              }]
            },
            {    // 目的地 的 地点名称显示
              name: name,
              type: 'effectScatter',
              coordinateSystem: 'geo',
              zlevel: 2,
              rippleEffect: {
                period: 4,
                brushType: 'stroke',
              },
              label: {
                show: true,
                color: color,
                position: [30, 10],
                formatter: '{b}',
                fontWeight: 'bolder'
              },
              itemStyle: {
                normal: {
                  color: color
                },
              },
              emphasis: {
                itemStyle: {
                  show: false,
                }
              },
              symbol: 'circle',
              symbolSize: function (val) {
                return 10;
              }
            }
          )
        });
        return series
      }

    onMounted(()=> {
       initTimeoutId.value = setTimeout(() => {
        worldChart.value = $eChart.init(echarts.value);
        drawMap();
        drawLine()
      }, 2000)
    })
    
   
    
    onBeforeUnmount(()=>{
      clearTimeout(initTimeoutId.value)
    })
</script>

<template>
  <div v-loading="loading" ref="echarts" class="mychart" >
  </div>
</template>

<style lang="scss" scoped>
  .mychart{
    width: 100%;
    height: 400px;
  }
  :deep(.el-loading-mask){
    background-color: transparent;
  }
</style>
