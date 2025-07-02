<template>
  <div class="switchbar">
    <div :class="type==item.type ? 'icon-bg' : ''" v-for="(item,i) in showType" :key="i">
      <svg-icon @click="changeType(item.type)" :icon-class="type==item.type ? item.selIcon : item.icon"/>
    </div>
   <div :class="{'icon-bg':order,'disabled':disabled}">
     <svg-icon @click="changeType('order')" :icon-class="order == true ? 'sort' : 'sort'" />
   </div>
  </div>
</template>

<script>
export default {
  name: 'tableSwitchBar',
  props:{
    type: {
      type: String,
      default: 'card'   // card or list
    },
    order: {
      default: false  // asc or desc
    },
    disabled:{
      defalut: false
    }
  },
  data(){
    return {
      showType:[  //显示类型
        {type: 'card', icon:'cardView',selIcon:'cardView'},
        {type: 'list', icon:'listView',selIcon:'listView'}]
    }
  },
  methods:{
    changeType(type){
      this.$emit('change-type', type);
    }
  }
}
</script>

<style lang="scss" scoped>
  .disabled{
    cursor:not-allowed!important;
    color: #B6BED1!important;
  }
  .switchbar{
    width: 100px;
    height: 32px;
   // background-color: rgba(235, 237, 240, 100);
    box-shadow: 0px 2px 4px 0px var(--aeo-primary-color-9);
    font-size: 14px;
    padding: 8px 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #B6BED1;
    >div{
      cursor: pointer;
      font-size:16px;
      &:hover{
        color: var(--aeo-primary-color-2);
      }
    }
  .active{
      color: #3D5AFE;
    }
  }
  .icon-bg{
    color: var(--aeo-primary-color-2)
  }

</style>
