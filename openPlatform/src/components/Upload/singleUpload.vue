<template> 
  <div>
    <el-upload
      :action="useOss?ossUploadUrl:minioUploadUrl"
      :headers="{Authorization: 'bearer ' + $tokenBox.getItem('token')}"
      :multiple="false" :show-file-list="false"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :on-preview="handlePreview">
      <el-button v-if="type" :loading="loading" size="small" :type="type?'primary':''">{{loading?'正在上传':'立即上传'}}</el-button>
      <el-button v-else size="small">上传图标</el-button>
      <div slot="tip" v-if="type=='zip'">{{fileName}}</div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="fileList[0].url" alt="">
    </el-dialog>
  </div>
</template>
<script>

  export default {
    name: 'singleUpload',
    props: {
      value: String,
      type:String
    },
    computed: {
      imageUrl() {
        return this.value;
      },
      imageName() {
        if (this.value != null && this.value !== '') {
          return this.value.substr(this.value.lastIndexOf('/') + 1);
        }
          return null;

      },
      fileList() {
        return [{
          name: this.imageName,
          url: this.imageUrl
        }];
      },
      showFileList: {
        get: function () {
          return this.value !== null && this.value !== ''&& this.value!==undefined;
        },
        set: function (newValue) {
        }
      },
      ossUploadUrl(){
        if(this.type === 'zip'){
          return  process.env.VUE_APP_BASE_API1 + 'img/oss/uploads';
        }
        return  process.env.VUE_APP_BASE_API1 + 'img/oss/upload';
      }
    },
    data() {
      return {
        fileName:'',
        loading:false,
        dataObj: {
          policy: '',
          signature: '',
          key: '',
          ossaccessKeyId: '',
          dir: '',
          host: ''
        },
        dialogVisible: false,
        useOss:true, //使用oss->true;使用MinIO->false
        minioUploadUrl:'http://localhost:8080/minio/upload'

      };
    },
    methods: {
      emitInput(val) {
        this.$emit('input', val);
      },
      handleRemove(file, fileList) {
        this.emitInput('');
      },
      handlePreview(file) {
        this.dialogVisible = true;
      },
      beforeUpload(file) {
        this.loading = true;
        let _self = this;
        if(!this.useOss){
          return true;
        }
        if(this.type === 'zip'){
          const isZIP = file.type;
          const isLt500M = file.size / 1024 / 1024 < 500;

          if (isZIP == 'application/zip' || isZIP == 'application/x-zip' || isZIP == 'application/x-zip-compressed' || isZIP =='application/octet-stream' ) {

          }else{
            this.$message.error('执行程序只能是ZIP格式!');
            this.loading = false;
            return false;
          }
          if (!isLt500M) {
            this.$message.error('程序大小不能超过 500M!');
            this.loading = false;
            return false;
          }
        }else{
          const isJPG = file.type;
          const isLt2M = file.size / 1024 / 1024 < 2;

          if (isJPG !='image/png' && isJPG !='image/jpeg') {
            this.$message.error('图片只能是jpg或者png格式!');
            return false;
          }
          if (!isLt2M) {
            this.$message.error('图片大小不能超过 2M!');
            return false;
          }
        }
      },
      handleUploadSuccess(res, file) {
        this.loading = false;
        this.showFileList = true;
        this.fileList.pop();
        let url = '';

        if(this.useOss){
          if (typeof res.result === 'object') {
            if (Array.isArray(res.result)) {
              this.fileName = res.result[0].fileName;
              url = res.result[0].fileDownloadUri;
            } else {
              url = res.result.fileDownloadUri;
            }
          }
        }else{
          url = res.data.url;
        }
        this.fileList.push({name: file.name, url: url});
        this.emitInput(this.fileList[0].url);
      }
    }
  };
</script>
<style>

</style>


