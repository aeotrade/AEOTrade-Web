<template>
  <div>
    <div class="section">
      <div class="title">
        执行动作
        <span>执行动允许授权用户添加，修改，查询数据。通过创建执行动作，允许您的用户将其他应用系统中的数据同步到您的应用中。</span>
      </div>
      <div class="search-box">
        <span>名称：</span>
        <el-input v-model="search" placeholder="请输入执行动作名称" style="width: 280px;margin: 0 100px 0 16px"></el-input>
        <el-button size="small" style="margin-right: 10px;" @click="search='';pageInfo.pageNo=1;getList()">重置</el-button>
        <el-button size="small" type="primary" @click="pageInfo.pageNo=1;getList(search)">查询</el-button>
      </div>
    </div>
    <div class="section" style="height: calc(100vh - 220px)">
      <el-button size="small" type="primary" style="width: 120px;" @click="$router.push({path:'/config/movementDetails',query:$route.query})">添加执行动作</el-button>
      <el-table
        height="530px"
        :data="tableData"
        style="width: 100%;margin-top: 20px;">
        <el-table-column
          prop="name"
          label="名称"
          align="center">
        </el-table-column>
        <el-table-column
          label="描述"
          width="200"
          align="center">
          <template slot-scope="scope">
            <el-tooltip  popper-class="noBorder"  placement="top"  effect="light" :enterable="false" >
              <div slot="content" style="max-width: 275px">{{scope.row.desc}}</div>
              <p style="cursor: pointer;width:175px; white-space: nowrap;text-overflow: ellipsis;overflow: hidden" class="font">{{scope.row.desc}}</p>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          label="编码"
          width="200"
          align="center">
          <template slot-scope="scope">
            <el-tooltip  popper-class="noBorder"  placement="top" effect="light" :enterable="false" >
              <div slot="content" style="max-width: 275px">{{scope.row.code}}</div>
              <p style="cursor: pointer;width:175px; white-space: nowrap;text-overflow: ellipsis;overflow: hidden" class="font">{{scope.row.code}}</p>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="创建时间"
          align="center">
          <template slot-scope="scope">
            <div>{{new Date(scope.row.create_time).toLocaleString()}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="data_model"
          label="数据模型"
          align="center">
        </el-table-column>
        <el-table-column
          prop="name"
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)">
            </el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)">
            </el-button>
          </template>
        </el-table-column>
        <div slot="empty" style="margin-bottom: 20px;">
          <div>
            <img src="@/assets/connector/nomovement.svg" style="width: 230px;margin: 90px 0 0 0;">
          </div>
          <div>
            当前没有执行动作，请去<span class="tip" @click="$router.push({path:'/config/movementDetails',query:{id:$route.query.id}})">添加执行动作</span>！
          </div>
        </div>
      </el-table>
      <div style="margin: 10px 10px 0 0;display: flex;justify-content: space-between">
        <div></div>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageInfo.pageNo"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>

</template>

<script>
  export default {
    name: "event",
    data(){
      return{
        search:'',
        tableData:[],
        pageInfo: {
          pageNo: 1,
          pageSize: 10
        },
        total: 0,
      }
    },
    mounted() {
      this.getList()
    },
    methods:{
      getList(search) {
        let params = {
          currpage: this.pageInfo.pageNo,
          pagesize: this.pageInfo.pageSize,
          search
        }
        this.$api.connector.getAction(this.$route.query.id,params).then(res => {
          this.total = res.data.total;
          this.pageInfo.pageNo = res.data.currpage;
          this.pageInfo.pageSize = res.data.pagesize;
          this.tableData = res.data.records;
        })
      },
      handleSizeChange(val) {
        this.pageInfo.pageNo = 1;
        this.pageInfo.pageSize = val;
        this.getList()
      },
      handleCurrentChange(val) {
        this.pageInfo.pageNo = val;
        this.getList()
      },
      handleDelete(row) {
        this.$confirm(this.$store.state.user.connectorInfo.status === '已发布'?'删除执行动作会影响到用户正在使用该事件的协作合约，你确认这样做吗？':'确认删除执行动作吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.$api.connector.delAction(this.$route.query.id,row.id).then(res => {
            if (this.tableData.length == 1 && this.pageInfo.pageNo > 1) {
              this.pageInfo.pageNo--
            }
            this.getList()
          })
        })

      },
      handleEdit(row) {
        this.$router.push({path:'/config/movementDetails',query:{id:this.$route.query.id,ids:row.id}})
      },
    }
  }
</script>

<style scoped lang="scss">
  .search-box{
    color: rgba(16, 16, 16, 1);
    font-size: 14px;
    display: flex;
    align-items: center;
    margin-top: 34px;
    ::v-deep{
      .el-button {
        width: 80px;
        height: 30px;
        line-height: 10px;
      }
      .el-input__inner{
        height: 40px;
        width: 273px;
      }
    }
  }
  .section{
    color: rgba(16, 16, 16, 1);
    background-color: #fff;
    padding: 16px 25px;
    margin-bottom: 20px;
    .title{
      font-weight: bold;
      color: rgba(16, 16, 16, 1);
      font-size: 18px;
      span{
        font-size: 12px;
      }
    }
  }
  .tip {
    color: var(--aeo-primary-color);
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
</style>
<style>
.noBorder{
  border: 0px!important;
  box-shadow: 0px 2px 6px 0px var(--aeo-primary-color-9);
}
.noBorder .popper__arrow{
  display: none;
}
.customTimePopoverClass .el-popover__title{
  text-align: center;
}
</style>
