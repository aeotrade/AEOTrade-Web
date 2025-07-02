<template>
  <div class="w-container">
    <img class="banner" src="../../assets/appManage/banner.png">
    <div class="section">
      <div style="margin-bottom: 30px" class="title-bar">应用管理</div>

      <el-tabs v-model="activeTab" @tab-click="changeTab">
        <el-tab-pane label="自建应用" name="first"></el-tab-pane>
      </el-tabs>

      <div class="search-box" v-if="activeTab === 'first'">
        <div class="label">应用名称：</div>
        <el-input v-model="input" placeholder="请输入应用名称" style="width:273px;margin-right: 60px;"></el-input>
        <el-button size="small" style="margin-right: 10px;" @click="tempSearch = '';input = '';pageInfo.pageNo = 1;getList()">重置
        </el-button>
        <el-button size="small" type="primary" @click="tempSearch = input;pageInfo.pageNo = 1;getList(input)">查询</el-button>
      </div>
    </div>
    <div style="margin-bottom: 70px" class="section" >
      <div style="display: flex;justify-content: space-between;align-items: center;">
        <el-button @click="dialogVisible = true;" type="primary" size="small" v-if="activeTab === 'first'">
          <div style="font-size: 14px;">创建应用</div>
        </el-button>

        <table-switch-bar :type="folderCard" :order="folderOrder" @change-type="changeFolderType"></table-switch-bar>
      </div>
      <el-table
        height="430px"
        v-if="folderCard == 'list'"
        :data="tableData"
        style="width: 100%;margin-top: 20px;">

        <el-table-column
          label="图标"
          align="center">
          <template slot-scope="scope">
            <div style="display: flex;justify-content: center;align-items: center;height: 92px;">
              <img :src="scope.row.appLogo" style="border-radius: 50%" width="64px" height="64px">
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="应用名称"
          align="center">
          <template slot-scope="scope">
            <div>{{scope.row.appName}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="createdBy"
          label="创建人"
          align="center">
        </el-table-column>

        <el-table-column
          prop="provider"
          label="状态"
          v-if="activeTab === 'first'"
          align="center">
          <template slot-scope="{row}">
            {{row.publishStatus == 1 ? '已发布': '未发布'}}
          </template>
        </el-table-column>
        <el-table-column
          v-else
          prop="provider"
          label="状态"
          align="center">
          <template slot-scope="{row}">
            {{publishStatusMap [row.publishStatus]}}
          </template>

        </el-table-column>
        <el-table-column
          label="更新时间"
          align="center">

          <template slot-scope="scope">
            {{ formatDate(scope.row.updatedTime) }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="jump(scope.row)">编辑
            </el-button>
            <el-button
              v-if="scope.row.status!='已发布'"
              type="text"
              @click="handleDelete(scope.row)">删除
            </el-button>
            <div v-else style="width: 42px;display: inline-block;"></div>
          </template>
        </el-table-column>
        <div slot="empty" style="margin-bottom: 20px;">
          <div>
            <img src="../../assets/appManage/nodata.png" style="width: 230px;margin: 90px 0 0 0;">
          </div>
          <div>
            当前没有自建应用，请去<span class="tip" @click="dialogVisible = true;">创建应用！</span>
          </div>
        </div>
      </el-table>
      <el-scrollbar v-else class="card-box" style="height: 460px;width:100%;margin: 0 -18px;">
        <div style="display: flex;flex-wrap: wrap; padding-top: 20px;" v-if="tableData.length">
          <div class="card-item" v-for="(item,i) in tableData" :key="i" @click="jump(item)">
            <img width="50px" height="50px"
                 style="border-radius: 50%;box-shadow: 0px 2px 6px 0px rgba(107, 136, 255, .2);"
                 :src="item.appLogo">
            <div class="info">
              <div class="ellipsis" style="width: 181px">{{item.appName}}</div>
              <span class="ellipsis" style="width: 190px;display: block">{{item.subhead}}</span>
            </div>
            <div class="tag">
              <div class="tag-item success" v-if="item.publishStatus == 1">已上架</div>
              <div class="tag-item warning" v-if="item.publishStatus == 0">审核中</div>
              <div class="tag-item info" v-if="item.publishStatus == 2">已下架</div>

            </div>
            <el-button class="del-btn" size="mini" style="height: 24px;width: 60px;line-height: 8px;" @click.stop="handleDelete(item)">
              删除
            </el-button>
          </div>
        </div>
        <div class="no-data" v-else>
          <div>
            <img src="../../assets/appManage/nodata.png" style="width: 230px;margin: 90px 0 40px 0;">
          </div>
          <div>
            当前没有公开应用，请去<span class="tip" @click="$router.push('/appManage/create')">创建应用！</span>
          </div>
        </div>
      </el-scrollbar>
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
    <el-dialog
      :visible.sync="dialogVisible"
      append-to-body
      :close-on-click-modal="false"
      width="680px">
      <div slot="title" class="dia-title">
        创建应用
      </div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="应用名称：" prop="appName">
          <el-input v-model.trim="ruleForm.appName" placeholder="请输入应用名称"></el-input>
        </el-form-item>
        <el-form-item label="应用副标题：" prop="subhead">
          <el-input placeholder="请输入应用副标题" v-model.trim="ruleForm.subhead"></el-input>
        </el-form-item>
        <el-form-item label="图标：" prop="appLogo">
          <div style="display: flex;align-items: center">
            <img width="70px" height="70px" style="margin-right: 21px;object-fit: cover;border-radius:50%;"
                 :src="ruleForm.appLogo">
            <upLoad v-model="ruleForm.appLogo"></upLoad>
          </div>
          <div class="upload-tip">请上传JPG/PNG格式、240*240px以上、1:1 、2MB 以内的无圆角图标</div>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center;">
        <el-button @click="cancel" size="small" style="width: 80px;height: 30px;line-height: 10px;">取消
        </el-button>
        <el-button type="primary" @click="submit" size="small"
                   style="width: 80px;height: 30px;line-height: 10px;">创建
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import tableSwitchBar from '@/components/tableSwitchBar';
  import upLoad from '@/components/Upload/singleUpload';
  import dayjs from 'dayjs';
  export default {
    name: 'index',
    components: {tableSwitchBar, upLoad},
    data() {
      var checkName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请填写应用名称'));
        } else {

          callback();
        }
      };
      return {
        tempSearch :'',
        options: [],
        vipTypeId:'',
        name:'',
        input: '',
        tableData: [
        ],
        vipList:[
        ],
        folderCard: 'card',
        folderOrder: true,
        pageInfo: {
          pageNo: 1,
          pageSize: 10
        },
        publishStatusMap: {
           0 : '审核中',
           1 : '已上架',
           2 : '已下架'
        },
        total: 0,
        dialogVisible: false,
        ruleForm: {
          appName: '',
          subhead: '',
          appLogo: 'http://aeotrade-launch-advisor.oss-cn-zhangjiakou.aliyuncs.com/aeotrade/images/20230331/app-icon.png',
          memberId: this.$store.state.user.memberId
        },
        rules: {
          appName: [
            {required: true, validator: checkName, trigger: 'blur'},
            {min: 0, max: 32, message: '应用名称长度在32个字符内', trigger: 'blur'}
          ],
          subhead: [
            {required: true, message: '请填写应用副标题', trigger: 'blur'},
            {min: 0, max: 255, message: '应用副标题长度在255个字符内', trigger: 'blur'}
          ]
        },
        timer: null,
        activeTab: 'first',
        isAppServiceProvider: false, // 是应用服务商
        staffId:JSON.parse(this.$tokenBox.getItem('info')).bind.staffid,
        memberId:JSON.parse(this.$tokenBox.getItem('info')).bind.memberid,
        memberName: JSON.parse(this.$tokenBox.getItem('info')).bind.membername,
        staffName: JSON.parse(this.$tokenBox.getItem('info')).user.staffname

      };
    },
    mounted() {
      this.getVipType();
      this.getVipInfos();
      this.getList();
    },
    methods: {
      formatDate(time) {
    return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
  },
      getVipType(){
        this.$api.app.getVipType({}).then(res => {
          if (res.code == 200) {
            this.vipList = [{typeName:'全部',id:''},...res.result];
          }
        }).catch(error => {

        });
      },
      changeTab() {
         this.folderCard = 'card';
         this.pageInfo = {
          pageNo: 1,
          pageSize: 10
        };
         this.getList();
      },
      jump(row) {
        if (this.activeTab == 'first') {
        this.$router.push({path: 'edit', query: {id: row.id, cid: row.clientId}});
        }else{
          this.$router.push({path: 'create', query: {id: row.id, cid: row.clientId}});
        }
      },
      submit() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.$api.appmng.createApp({...this.ruleForm, createBy: this.staffName}).then(res => {
              if (res.code == 200) {
                this.$router.push({path: 'edit', query: {id: res.result.id, cid: res.result.clientId, f: 1}});
              }
            }).catch(error => {
              error.data.forEach(item => {
                if (item.problem_field == 'name') {
                  this.$refs['ruleForm'].fields[0].validateMessage = '连接器名称重复，换个名字吧';
                  this.$refs['ruleForm'].fields[0].validateState = 'error';
                }
              });
            });

          }

        });
      },
      cancel() {
        this.dialogVisible = false;
        this.$refs['ruleForm'].resetFields();
        this.options = [];
      },
      getList() {
        if (this.activeTab == 'first') {
          let params = {
          pageNo: this.pageInfo.pageNo,
          pageSize: this.pageInfo.pageSize,
          name: this.tempSearch || '',
          sort: this.folderOrder ? 'desc' : 'asc',
          memberId: this.$store.state.user.memberId
        };

        this.$api.appmng.getAppList(params).then(res => {
          this.total = res.totalSize;
          this.tableData = res.result;
        });

        }

        this.$api.app.getAppList(params).then(res => {
          this.total = res.totalSize;
          this.tableData = res.result;
        });

      },
      handleSizeChange(val) {
        this.pageInfo.pageNo = 1;
        this.pageInfo.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.pageInfo.pageNo = val;
        this.getList();
      },

      getVipInfos(){
        this.$api.app.getVipInfos({apply: 1, id: this.$store.state.user.memberId}).then(res => {
          if(res.result && res.result.some(vip => vip.code === 'app_ser_pro')){
            this.isAppServiceProvider = true;
          }
        });
      }
    }
  };
</script>

<style scoped lang="scss">
  ::v-deep {
    .el-input--mini .el-input__inner {
      background-color: #fff;
    }

    .el-table__cell.gutter {
      background-color: #f7f8f9;
    }

    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }

  .upload-tip {
    height: 20px;
    color: rgba(187, 187, 187, 1);
    font-size: 12px;
  }

  .demo-ruleForm {
    width: 500px;
    margin: 0 auto;

    ::v-deep {
      .el-input__inner {
        height: 30px;
        line-height: 30px;
        border-radius: 4px;
      }
    }
  }

  .no-data {
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .card-box {
    .card-item {
      position: relative;
      display: flex;
      width: 360px;
      height: 120px;
      background-color: #fff;
      margin: 0 18px 36px 18px;
      padding: 0 30px;
      box-shadow: 0px 4px 12px 0px var(--aeo-primary-color-9);
      display: flex;
      align-items: center;
      cursor: pointer;
      transition: .3s;

      img {
        margin-right: 20px;
      }

      .info {
        width: 180px;

        div {
          font-size: 16px;
          margin-bottom: 5px;
        }

        .ellipsis {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        span {
          display: -webkit-box;
          overflow: hidden;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          color: rgba(146, 154, 176, 1);
          font-size: 12px;
        }

      }

      .tag {
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 14px;
        text-align: center;

        .tag-item {
          width: 60px;
          height: 24px;
          line-height: 24px;
          border-radius: 4px;
          &.warning {
            color: #FF5C00;
            background: rgba(255, 92, 0, 0.1);
          }

          &.success {
            color: #10CF29;
            background-color: #D6F4D3;
          }

          &.error {
            color: #FF9202;
            background-color: #FFE7CC;
          }
        }

      }

      .el-button {
        position: absolute;
        right: 10px;
        bottom: 20px;
        display: none;
      }

      &:hover {
        .el-button {
          display: block;
        }

        transform: translateY(-5px);
      }
    }
  }

  .dia-title {
    color: rgba(48, 48, 48, 1);
    font-size: 16px;
    font-weight: bold;

    span {
      color: rgba(136, 136, 136, 1);
      font-size: 12px;
      font-weight: normal;
      margin-left: 10px;
    }
  }

  .banner {
    width: 100%;
  }

  .tip {
    color: var(--aeo-primary-color);
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  .search-box {
    display: flex;
    align-items: center;
    margin-top: 20px;

    ::v-deep {
      .el-input__inner {
        height: 40px;
        line-height: 40px;
        border-radius: 6px;
      }
    }

    .label {
      color: rgba(16, 16, 16, 1);
      font-size: 14px;
      margin-right: 20px;
    }

    .el-button {
      width: 80px;
      height: 30px;
      line-height: 10px;
    }
  }

  .section {
    margin-top: 20px;
    padding: 17px 20px 14px 20px;
    background-color: #fff;

    .title-bar {
      position: relative;
      color: rgba(16, 16, 16, 1);
      font-size: 14px;
      font-weight: bold;
      padding-left: 14px;

      &::before {
        position: absolute;
        content: '';
        top: -4px;
        left: 0;
        width: 4px;
        height: 24px;
        background-color: rgba(71, 87, 255, 0.9);
      }
    }
  }
  .open-app-iframe{

  }
  .del-btn{
    background-color: rgb(236,239,255);
    color: var(--aeo-primary-color);
    border-color: var(--aeo-primary-color)70;
    &:hover{
      background-color: var(--aeo-primary-color);
      color: #fff;
    }
  }
</style>
