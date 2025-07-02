<template>
  <div class="w-container">
    <img class="banner" src="../../assets/connector/banner.png">
    <div class="section">
      <div class="title-bar">连接器管理</div>
      <div class="search-box">
        <div class="label">连接器名称：</div>
        <el-input v-model="input" placeholder="请输入连接器名称" style="width:273px;margin-right: 60px;"></el-input>
        <el-button size="small" style="margin-right: 10px;" @click="tempSearch = '';input = '';pageInfo.pageNo = 1;getList()">重置
        </el-button>
        <el-button size="small" type="primary" @click="tempSearch = input;pageInfo.pageNo = 1;getList(input)">查询</el-button>
      </div>
    </div>
    <div class="section">
      <div style="display: flex;justify-content: space-between;align-items: center;">
        <el-button @click="dialogVisible = true;" type="primary" size="small"
                   style="width: 160px;height:40px;position: relative">
          <img src="../../assets/connector/create.svg" style="position: absolute;left: 18px;top: 8px;">
          <div style="margin-left: 25px;font-size: 16px;">创建连接器</div>
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
              <img :src="scope.row.image" width="64px" height="64px">
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="名称"
          align="center">
          <template slot-scope="scope">
            <div @click="jump(scope.row)" style="cursor: pointer;color: var(--aeo-primary-color)">{{scope.row.name}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="version"
          label="版本"
          align="center">
        </el-table-column>
        <el-table-column
          prop="category"
          label="类型"
          align="center">
          <template slot-scope="scope">
            {{scope.row.category.toString()}}
          </template>
        </el-table-column>
        <el-table-column
          prop="provider"
          label="提供商"
          align="center">
        </el-table-column>
        <el-table-column
          prop="status"
          label="发布状态"
          align="center">
        </el-table-column>
        <el-table-column
          prop="visibility"
          label="可见范围"
          align="center">
        </el-table-column>
        <el-table-column
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="jump(scope.row)">配置
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
            <img src="../../assets/connector/nodata.svg" style="width: 230px;margin: 90px 0 0 0;">
          </div>
          <div>
            当前没有连接器，<span class="tip" @click="dialogVisible = true;">请去创建连接器</span>！
          </div>
        </div>
      </el-table>
      <el-scrollbar v-else class="card-box" style="height: 460px;width:100%;margin: 0 -18px;">
        <div style="display: flex;flex-wrap: wrap; padding-top: 20px;" v-if="tableData.length">
          <div class="card-item" v-for="(item,i) in tableData" :key="i" @click="jump(item)">
            <img width="50px" height="50px"
                 style="border-radius: 50%;box-shadow: 0px 2px 6px 0px rgba(107, 136, 255, .2);"
                 :src="item.image">
            <div class="info">
              <!--              <div class="ellipsis" style="width: 181px">{{item.connector_name.length>10?item.connector_name:item.connector_name}}</div>-->
              <div class="ellipsis" style="width: 181px">{{item.name}}</div>
              <span>{{item.desc}}</span>
              <div style="color: rgba(146, 154, 176, 1);font-size:12px;margin-top:2px;">版本号：{{item.version}}</div>
            </div>
            <div class="tag">
              <div class="tag-item success" v-if="item.status == '已发布'">已发布</div>
              <div class="tag-item error" v-if="item.status == '审核中'">审核中</div>
              <div class="tag-item error" v-if="item.status == '未发布'">未发布</div>
            </div>
            <el-button class="del-btn"  v-if="item.status !== '已发布'" size="mini" style="height: 24px;width: 60px;line-height: 8px;" @click.stop="handleDelete(item)">
              删除
            </el-button>
          </div>
        </div>
        <div class="no-data" v-else>
          <div>
            <img src="@/assets/connector/nodata.svg" style="width: 230px;margin: 90px 0 40px 0;">
          </div>
          <div>
            当前没有连接器，<span class="tip" @click="dialogVisible = true;">请去创建连接器</span>！
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
      :before-close="cancel"
      :close-on-click-modal="false"
      width="680px">
      <div slot="title" class="dia-title">
        创建连接器
        <span>以下信息用于开发连接器配置数据传输的对列信息，详情见<a href="https://help.aeotrade.com/c289/af56/5ecd" target="_blank" style="color: var(--aeo-primary-color);margin-left:0;">连接器开发规范</a>。</span>
      </div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="106px" class="demo-ruleForm">
        <el-form-item label="名称：" prop="name">
          <el-input v-model.trim="ruleForm.name" placeholder="请输入连接器名称"></el-input>
        </el-form-item>
        <el-form-item label="描述：" prop="desc">
          <el-input :rows="4" type="textarea" placeholder="请输入连接器描述" v-model="ruleForm.desc"></el-input>
        </el-form-item>
        <el-form-item label="类型：" prop="category">
          <el-select v-model="ruleForm.category" multiple placeholder="请选择连接器类型" style="width: 400px;">
            <el-option v-for="(item,i) in category" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图标：" prop="image">
          <div style="display: flex;align-items: center">
            <img width="70px" height="70px" style="margin-right: 21px;object-fit: cover;border-radius:50%;"
                 :src="ruleForm.image">
            <upLoad v-model="ruleForm.image"></upLoad>
          </div>
          <div class="upload-tip">请上传JPG/PNG格式、建议240*240px以上、1:1 、2MB 以内的无圆角图标</div>
        </el-form-item>
        <el-form-item>
         <span slot="label">
              <span>自动开通</span>
              <el-tooltip style="diaplay:inline"  content="新注册用户自动开通本连接器" placement="top">
                  <i class="el-icon-question" />
              </el-tooltip>
              <span>：</span>
           </span>
          <el-radio-group v-model="ruleForm.is_auto_open">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="可见范围：" prop="visibility">
          <el-radio-group v-model="ruleForm.visibility">
            <el-radio label="public">公开</el-radio>
            <el-radio label="private">私有</el-radio>
            <el-radio label="partial">部分可见</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="" prop="visible_org" v-if="ruleForm.visibility == 'partial'">
          <el-select
            v-model="ruleForm.visible_org"
            multiple
            filterable
            remote
            reserve-keyword
            no-data-text="暂无数据"
            style="width: 400px;"
            :remote-method="remoteMethod">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.memberName"
              :value="item.id">
            </el-option>
          </el-select>
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
  import upLoad from "@/components/Upload/singleUpload";
  export default {
    name: "index",
    components: {tableSwitchBar, upLoad},
    data() {
      var checkName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请填写连接器名称'));
        } else {

          callback();
        }
      };
      return {
        tempSearch:'',
        category: [],
        options: [],
        input: '',
        tableData: [],
        folderCard: 'card',
        folderOrder: true,
        pageInfo: {
          pageNo: 1,
          pageSize: 10
        },
        total: 0,
        dialogVisible: false,
        ruleForm: {
          name: '',
          desc: '',
          category: [],
          provider: this.$store.state.user.info.bind.membername,
          image: 'http://aeotrade-launch-advisor.oss-cn-zhangjiakou.aliyuncs.com/aeotrade/images/20230320/moren.png',
          visibility: 'public',
          visible_org: [],
          is_auto_open:false
        },
        rules: {
          name: [
            {required: true, validator: checkName, trigger: 'blur'},
            {min: 0, max: 32, message: '连接器名称长度在32个字符内', trigger: 'blur'}
          ],
          desc: [
            {required: true, message: '请填写连接器描述', trigger: 'blur'},
            {min: 0, max: 255, message: '连接器描述长度在255个字符内', trigger: 'blur'}
          ],
          category: [
            {required: true, message: '请选择连接器类型', trigger: 'change'}
          ]
        },
        timer: null
      }
    },
    mounted() {
      this.getCategory()
      this.getList()
    },
    methods: {
      getCategory() {
        this.$api.connector.getCategories().then(res => {
          this.category = res.data
        })
      },
      jump(row) {
        this.$router.push('/config?id=' + row.id)
      },
      submit() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            if (this.ruleForm.visibility !== 'partial') {
              this.ruleForm.visible_org = []
            }
            this.$api.connector.createConnector(this.ruleForm).then(res => {
              if (res.code == 0) {
                this.pageInfo.pageNo = 1;
                this.$router.push('/config?id=' + res.data)
                this.dialogVisible = false;
              }
            }).catch((error => {
              error.data.forEach(item => {
                if (item.problem_field == 'name') {
                  this.$refs['ruleForm'].fields[0].validateMessage = '连接器名称重复，换个名字吧'
                  this.$refs['ruleForm'].fields[0].validateState = 'error'
                }
              })
            }))

          }

        });
      },
      cancel() {
        this.dialogVisible = false;
        this.$refs['ruleForm'].resetFields();
        this.options = [];
      },
      remoteMethod(query) {
        if (query !== '' && query.length >= 2) {
          if (this.timer) {
            clearTimeout(this.timer)
          }
          this.timer = setTimeout(() => {
            this.$api.app.getUserCompany({uscc: query}).then(res => {
              this.options = res.result;
            })
          }, 500)

        } else {
          this.options = [];
        }
      },
      getList() {
        let params = {
          currpage: this.pageInfo.pageNo,
          pagesize: this.pageInfo.pageSize,
          search:this.tempSearch || '',
          sort_rule: this.folderOrder ? 'create_time_desc' : 'create_time_asc'
        }
        this.$api.connector.getConnectors(params).then(res => {
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
        this.$confirm('确定删除未发布的连接器吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.$api.connector.delConnector(row.id).then(res => {
            if (this.tableData.length == 1 && this.pageInfo.pageNo > 1) {
              this.pageInfo.pageNo--
            }
            this.getList()
          })
        })
      },
      handleEdit(row) {

      },
      changeFolderType(val) {
        if (val == "order") {
          this.folderOrder = !this.folderOrder;
          this.getList()
        } else {
          this.folderCard = val;
        }
      },
    }
  }
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
    .del-btn{
      background-color: rgb(236,239,255);
      color: var(--aeo-primary-color);
      border-color: var(--aeo-primary-color);
      &:hover{
        background-color: var(--aeo-primary-color);
        color: #fff;
      }
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
</style>
