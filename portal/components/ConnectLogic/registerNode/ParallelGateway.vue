<template>
  <div class="ParallelGateway">
    <!--    <div class="top-title" :style="{'background':bgColor}">{{activeId}}</div>-->
    <div class="text-value">
      <img src="../background/parallelGatewayFill.svg" alt=""  v-if="backgroundColor == '#ffff00B3'">
      <img src="../background/parallelGateway.svg" alt="" v-else>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      name: {
        type:String,
        default:'未命名'
      },
      eventAction:{
        type:String,
        default:'默认动作'
      },
      bgColor:{
        type:String,
        default:'#4dd079'
      },
      backgroundColor:{
        type:String,
        default:''
      }
    },
    methods: {
      done(type) {
        this.$emit('select-button', type)
      }
    }
  }
</script>

<style scoped>
  .ParallelGateway{
    width: 80px;
    height: 80px;
    user-select: none;
  }
  .text-value{
    width: 80px;
    height: 80px;
    /*background: url('../background/parallelGateway.svg') no-repeat;*/
    cursor: grab;

  }
  .text-value img{
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
  .lf-node-selected .text-value{
    /*background-color: rgba(243, 245, 255, 1) !important;
    border: 8px solid #dee4ff;*/
  }


</style>
