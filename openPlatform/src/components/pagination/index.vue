<template>
  <el-pagination
    :layout="layout"
    :page-sizes="pageSizes"
    :page-size="pageSize"
    :total="total"
    :current-page="currentPage"
    @size-change='handelSizeChange'
    @current-change="handelPageChange"
  >
  </el-pagination>

</template>

<script>
  export default {
    props:{
      //每页条数
      pageSize:{
        default:5
      },
      //分页器的每页显示
      pageSizes:{
        type:Array,
        required:false,
        default() {
          return [10, 20, 30, 40];
        }
      },
      //组件
      layout:{
        type:String,
        required:false,
        default:"total, sizes, prev, pager, next, jumper"
      },
      //总条数
      total:{
        type:Number,
        required:false,
        default:0
      },
      //当前页
      currentPage:{
        type:Number,
        required:false,
        default:1
      }
    },
    data() {
      return {
      }
    },
    methods: {
      // 每页条数
      handelSizeChange(val) {
        //触发父组件事件@size-change
        this.$emit('size-change',val);
      },
      // 翻页
      handelPageChange(page) {
        //触发父组件事件@page-change
        this.$emit('page-change',page);
      }
    }
  };
</script>
<style scoped lang="scss">

</style>
