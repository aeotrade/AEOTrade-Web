<template>
  <div class="head">
    <div class="title">
      <div class="buleLine"></div>
      {{name}}
    </div>
    <slot name="search"></slot>
  </div>
</template>

<script>
export default {
  name: "searchTitle",
  props:{
        name:String
  }
}
</script>

<style scoped lang="scss">
.head{
  ::v-deep{
    .el-input__inner{
      width: 250px;
      height: 30px;
    }
    .el-form-item__label{
      font-size: 12px;
      font-weight: normal;
    }
  }

  padding: 15px 10px 15px;
  background-color: #fff;
  box-sizing: border-box;
}
.title{
  .buleLine{
    width: 4px;
    height: 24px;
    background-color: var(--aeo-primary-color);
    margin-right: 13px;
    font-family: SourceHanSansSC-bold;
  }
  display: flex;
  align-items: center;
  color: rgba(16, 16, 16, 100);
  box-sizing: border-box;
  font-size: 14px;
  font-family: SourceHanSansSC-bold;
  font-weight: bold;
}
</style>
