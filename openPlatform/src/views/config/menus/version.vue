<template>
  <div class="menu-container">
    <div class="title">
      版本发布
      <span>发布连接器可以为其他用户提供便利，使得他们可以更加轻松地实现数据传输和共享。</span>
    </div>
    <el-button  type="primary" @click="dialogVisible = true" style="width: 120px;">版本发布</el-button>
    <el-table
      height="530px"
      :data="tableData"
      style="width: 100%;margin-top: 20px;">
      <el-table-column
        type="index"
        label="版本序号"
        width="150px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="version_no"
        label="版本号"
        align="center">
        <template slot-scope="scope">
          <div style="cursor: pointer;color: var(--aeo-primary-color)" @click="look(scope.row.id)">{{scope.row.version_no}}</div>
        </template>
      </el-table-column>

      <el-table-column
        prop="version_status"
        label="版本状态"
        align="center">
                <template slot-scope="scope">
                  <div class="status">
                    <div :class="stateColorMap[scope.row.version_status]"></div>
                    <div class="option" @click="openFiledDialog(scope.row)">{{scope.row.version_status}}</div>
                  </div>
                </template>
      </el-table-column>
      <el-table-column
        prop="publish_time"
        label="发布成功时间"
        align="center">
      </el-table-column>
      <div slot="empty" style="margin-bottom: 20px;">
        <div>
          <img src="@/assets/connector/noversion.svg" style="width: 230px;margin: 90px 0 0 0;">
        </div>
        <div>
          当前没有版本发布！
        </div>
      </div>
    </el-table>
    <el-dialog
      :visible.sync="dialogVisible"
      append-to-body
      :before-close="clear"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      title="版本发布"
      width="680px">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
        <el-form-item label="版本号：" prop="version_no">
          <el-input v-model.trim="ruleForm.version_no" placeholder="格式：v1.0.0"></el-input>
        </el-form-item>
        <el-form-item label="连接器版本内容：" prop="version_desc">
          <el-input :rows="4" type="textarea" placeholder="请输入连接器版本内容描述" v-model.trim="ruleForm.version_desc"></el-input>
        </el-form-item>
        <el-form-item label="部署方式：" prop="deployment_method">
          <el-radio-group v-model="ruleForm.deployment_method">
            <el-radio label="aeotrade">部署慧贸贸</el-radio>
            <el-popover
              placement="top-start"
              width="420"
              trigger="hover"
              content="慧贸提供云服务支持，提供全面运维支持，确保服务稳定性。">
              <i slot="reference" class="el-icon-question"
                 style="font-size: 16px;margin:0px 50px 0 10px;vertical-align: -1px;"></i>
            </el-popover>
            <el-radio label="private">部署私有云</el-radio>
            <el-popover
              placement="top-start"
              width="410"
              trigger="hover"
              content="部署在企业的服务器，由企业自行定制各种连接器服务。">
              <i slot="reference" class="el-icon-question"
                 style="font-size: 16px;margin:0px 0 0 10px;vertical-align: -1px;"></i>
            </el-popover>

          </el-radio-group>
        </el-form-item>
        <el-form-item label="服务器地址：" prop="server_url">
          <el-input v-model="ruleForm.server_url" placeholder=""></el-input>
          <div class="tip">请填写你连接器的接口访问地址加端口，如：https://www.aeotrade.com:80/ap</div>
        </el-form-item>
        <el-form-item label="客户端执行程序：" prop="client_exe">
          <upLoad v-model="ruleForm.client_exe" type="zip" ref="uplaod"></upLoad>
          <div class="tip">如果你的连接器需要在客户端上执行，请上传连接器执行程序，格式为ZIP</div>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center;">
        <el-button @click="clear" size="small"
                   style="width: 80px;height: 30px;line-height: 10px;">取消
        </el-button>
        <el-button type="primary" @click="submit" size="small"
                   style="width: 80px;height: 30px;line-height: 10px;">发布
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="detailsVisible"
      append-to-body
      :close-on-click-modal="false"
      title="版本发布详情"
      width="680px">
      <el-form ref="ruleForm" label-width="140px" class="demo-ruleForm">
        <el-form-item label="版本号：">
          {{details.version_no}}
        </el-form-item>
        <el-form-item label="连接器版本内容：">
          <div style="padding-top: 10px;line-height: 20px;">
            {{details.version_desc}}
          </div>

        </el-form-item>
        <el-form-item label="部署方式：">
          {{details.deployment_method}}
        </el-form-item>
        <el-form-item label="服务器地址：">
          {{details.server_url}}
        </el-form-item>
        <el-form-item label="客户端执行程序：" prop="client_exe" v-if="details.client_exe_download_url">
          <el-button size="small" type="primary"><a :href="details.client_exe_download_url">点击下载</a></el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      :visible.sync="FiledDialogVisible"
      append-to-body
      :modal="false"
      :close-on-click-modal="false"
      title="失败原因"
      width="480px">
      <p>{{errMsg.reason}}</p>
      <div slot="footer" class="dialog-footer" style="text-align: right">
        <el-button @click="FiledDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="reSend">重新发布</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import upLoad from "@/components/Upload/singleUpload";

  export default {
    name: "version",
    components: {upLoad},
    data() {
      return {
        errMsg:{},
        stateColorMap:{
          '发布中':'ing',
          '已发布':'ed',
          '发布失败':'err',
        },
        tableData: [],
        dialogVisible: false,
        detailsVisible: false,
        FiledDialogVisible: false,
        ruleForm: {
          version_no: '',
          version_desc: '',
          deployment_method: 'aeotrade',
          server_url: '',
          client_exe: ''
        },
        details: {},
        rules: {
          version_no: [
            {min: 0, max: 64, message: '版本号长度在64个字符内', trigger: 'blur'},
            {required: true, message: '请填写版本号', trigger: 'blur'}
          ],
          version_desc: [
            {required: true, message: '请填写连接器版本描述', trigger: 'blur'},
            {min: 0, max: 255, message: '连接器版本描述长度在255个字符内', trigger: 'blur'}
          ],
          deployment_method: [
            {required: true, message: '请选择部署方式', trigger: 'change'}
          ],
          server_url: [
            {required: true, message: '请填写服务器地址', trigger: 'blur'},
            {min: 0, max: 255, message: '服务地址长度在255个字符内', trigger: 'blur'}
          ]
        },
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      clear(){
        this.$refs['ruleForm'].resetFields();
        this.dialogVisible = false
      },
      reSend(){
        this.FiledDialogVisible =  false
        this.$api.connector.infoVersion(this.$route.query.id,this.errMsg.id).then(res => {
          this.ruleForm = res.data;
          this.ruleForm.client_exe = res.data.client_exe_download_url
          let map ={
            "部署慧贸贸":'aeotrade',
            "部署私有云":'private',
          }
          this.ruleForm.deployment_method = map[res.data.deployment_method];
          this.ruleForm.id = this.errMsg.id
          this.dialogVisible = true;
        })
      },
      openFiledDialog(row){
        if (row.version_status === '发布失败'){
          this.errMsg = row
          this.FiledDialogVisible =  true
        }

      },
      look(id) {
        this.$api.connector.infoVersion(this.$route.query.id,id).then(res => {
          this.details = res.data;
          this.detailsVisible = true;
        })
      },
      getList() {
        this.$api.connector.getVersion(this.$route.query.id).then(res => {
          this.tableData = res.data.records;
        })
      },
      submit() {
        if (this.$refs['uplaod'].$data.loading){
          this.$message.error('客户端执行程序正在上传中,暂时不能发布')
          return
        }
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            let {version_no,version_desc,deployment_method,server_url,client_exe,id} = this.ruleForm
            let  params = {version_no,version_desc,deployment_method,server_url,client_exe}
            if (id){
              // 重新发布
              this.$api.connector.editVersion(this.$route.query.id,id, params).then(() => {
                this.dialogVisible = false;
                this.$refs['ruleForm'].resetFields();
                this.getList()
              })
            }else{
              // 发布
              this.$api.connector.creatVersion(this.$route.query.id, params).then(() => {
                this.dialogVisible = false;
                this.$refs['ruleForm'].resetFields();
                this.getList()
              })

            }
          }
        });

      },
    }
  }
</script>

<style scoped lang="scss">
  .status {
    display: flex;
    justify-content: center;
    align-items: center;

    div {
      margin: 0 5px;

      &:first-child {
        width: 12px;
        height: 12px;
        border-radius: 50%;

        &.ing {
          background-color: var(--aeo-primary-color);
        }

        &.ed {
          background-color: #0BD700;
        }
        &.err {
          background-color: #FF0404;
          & + .option {
            color: #FF0404;
            cursor: pointer;
            text-decoration: underline;
          }
        }

      }
    }
  }

  .demo-ruleForm {
    width: 570px;
    margin: 0 auto;

    ::v-deep {
      .el-input__inner {
        height: 30px;
        line-height: 30px;
        border-radius: 4px;
      }

      .el-radio {
        margin-right: 0px;
      }
    }
  }

  .tip {
    line-height: 18px;
    color: rgba(199, 199, 199, 1);
    font-size: 12px;
  }

  .menu-container {
    color: rgba(16, 16, 16, 1);
    background-color: #fff;
    padding: 16px 25px;
    height: 100%;

    .title {
      font-weight: bold;
      color: rgba(16, 16, 16, 1);
      font-size: 18px;
      margin-bottom: 34px;

      span {
        font-size: 12px;
      }
    }
  }
</style>
