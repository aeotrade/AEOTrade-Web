<template>
  <div class="tooltip">
<!--    <el-popover  placement="top"  trigger="hover">-->
<!--      <div slot="reference">-->
<!--        &lt;!&ndash; msg数组传参，多行展示 &ndash;&gt;-->
<!--        <p v-for="(item, index) in messages" :key="index">{{item}}</p>-->
<!--      </div>-->
<!--      <i class="el-icon-question que" style="margin-left:5px;"></i>-->
<!--    </el-popover>-->
    <el-popover
      placement="top"
      trigger="hover"
      :visible-arrow="false"
      width="250"
      >
      <div v-for="(item, index) in messages" :key="index">{{item}}</div>
      <template #reference>
        <el-icon class="que" style="margin-left:5px;">
          <QuestionFilled />
        </el-icon>
      </template>
    </el-popover>
  </div>
</template>

<script setup>

   const props =    defineProps({
    messages:{
      type: Array,
      default: []
    }
   })
     
</script>

<style lang="scss" scope>
.tooltip{display: inline-block;vertical-align: middle;}
.que{
  color: #424242;
  font-size: 14px;
  &:hover{
  color: var(--el-color-primary);
}
}
</style>
