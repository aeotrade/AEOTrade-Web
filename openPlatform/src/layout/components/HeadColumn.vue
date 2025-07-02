<template>
  <section style="width: 100%;overflow: hidden">
    <div class="m-box" style="position: fixed;height: 50px;display: flex;align-items: center;left: 0;top: 0;z-index: 1000;width: 100%;background-color: #fff;padding-right:20px;box-shadow: 0 1px 4px rgba(0,21,41,0.08);
transform: translate3d(0, 0, 0);">
      <div class="m-brandCon" style="width: 90px;display: flex;align-items: center;justify-content: center">
        <img class="m-enlogo" src="@/assets/logo.svg" alt="" style=" height: 40px;width:40px;cursor: pointer">
      </div>
      <div
        style="display: flex;align-items: center;cursor: pointer;font-size:16px;color:#5F6E84;padding-left: 10px;left: 148px;text-align: left;font-family: SourceHanSansSC-bold;">
        <span style="padding-left: 5px;margin-right: 5px">慧贸贸开放平台</span>
      </div>
      <div class="m-right-menu-item" style=" display: flex;align-items: center;margin-left: auto;font-size: 12px">
        <img class="m-enlogo" src="@/assets/kefu.svg" alt=""
             style="font-size:14px;cursor: pointer;width: 14px;height: 14px;margin-right: 10px">
        <span
              style="border-right: 1px solid #E0E0E0;padding-right: 20px;margin-right: 20px;cursor: pointer" @click="help">帮助中心</span>
        <img class="m-enlogo" src="@/assets/kefu.svg" alt=""
             style="font-size:14px;cursor: pointer;width: 14px;height: 14px;margin-right: 10px">
        <span
              style="border-right: 1px solid #E0E0E0;padding-right: 20px;margin-right: 20px;cursor: pointer" @click="kefu">在线客服</span>

        <div style="margin-right: 20px;cursor: pointer;width: 200px">
          <el-dropdown trigger="click"  @command="handleCommand" @visible-change="dropdownVisible">
            <div class="el-dropdown-link" style="display: flex;align-items: center">
               <img style="width: 20px;border-radius: 100%;height: 20px;margin-right: 10px;" :src="selectCompany.logoImg" alt="">
              <span :title="selectCompany.memberName" style="display: inline-block;width: 160px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;">{{selectCompany.memberName}}</span>
              <i class="el-icon-arrow-down el-icon--right" style="transition: transform 0.28s" :class="dropdownShow ? 'icon-rotate': ''"></i>
            </div>
            <el-dropdown-menu class="dropdown-class" slot="dropdown">
              <el-dropdown-item  :command="item" v-for="(item) in companyList" v-if="!item.selected" :key="item.memberName">
                <span >{{item.memberName}}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

        </div>
        <div class="m-user" title="退出系统" @click="exsit" style="    width: 26px;height: 26px;border-radius: 100%;background-color: #fff;color: #333;display: flex;align-items: center;justify-content: center;box-shadow: 1px 1px 4px rgba(0,21,41,.08);
">
          <img src="@/assets/exit.svg" class="m-user-head" style=" width: 12px;height: 12px;cursor: pointer;" title="退出系统">
        </div>

      </div>
    </div>
    <div class="appContainer" ></div>
  </section>
</template>

<script>

  import tokenBox from "../../utils/auth";


  export default {
    name: 'HeadColumn',
    data(){
      return{
        companyList:[],
        selectCompany:{},
        dropdownShow: false,
        uscc: JSON.parse(tokenBox.getItem('info')).bind.uscc,
        authList: [],  // 自动采集授权列表
      };
    },
    created() {
      this.getCompanyList();
    },
    methods:{
      dropdownVisible(val){
        this.dropdownShow = val
      },
      exsit(){
        // 退出方法
        let logout = () => {
          try {
            user.logout();
          }catch (e) {}
        }
        if(this.$store.getters.onProgressCount){
          this.$confirm('正在进行采集任务，退出登录会暂停所有采集任务，是否继续？', '提示', {
            confirmButtonText: '继续',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // 暂停所有采集任务
            setTimeout(() => {
              logout()
            }, 1000)
          });
        }else{
          logout()
        }
      },

      switchMember(item){
        let params={
          staffId:this.$tokenBox.getItem('staffId'),
          memberId:item.id.toString(),
          type:2

        };
        this.$tokenBox.setItem('UC',item.uscCode);
        this.$api.app.getUserInfo(params).then(res=>{
          this.$tokenBox.setItem('kindId',res.result.bind.kindid);
          this.$tokenBox.setItem('memberId',item.id);
          this.$store.state.user.info='';
          this.$tokenBox.setItem('UC',res.result.bind.uscc);


          this.$nextTick(() => {
            if(!window.__POWERED_BY_QIANKUN__){
              // 客户端环境
              location.replace(location);
            }else{
              this.$api.app.updateLastMemberId({memberId:item.id,staffId:this.$tokenBox.getItem('staffId'), workBenchId:this.$tokenBox.getItem('DefaultWORKBENCHNID' )}).then((res)=>{
                location.replace(location);
              });
            }
          });
        });
      },
      handleCommand(command) {
        this.selectCompany=command;
        this.switchMember(command)
      },
      getCompanyList(){
        let id=this.$tokenBox.getItem('staffId');

        let memberId=this.$tokenBox.getItem('memberId');


        this.$api.app.getUserCompanyList({id}).then(res=>{
          res.result.forEach(item =>{
            item.selected=false;
            if (memberId==item.id){
              item.selected=true;
              this.selectCompany=item
            }
          });
          this.companyList=res.result;
        });
      },
      help(){
        window.open('http://help.aeotrade.com')
      },
      kefu(){
        let url = 'https://work.weixin.qq.com/kfid/kfc2982fbad7f93897a'
        if(window.openInBrowser){
          // 客户端使用打开
          window.openInBrowser(url)
        }else{
          window.open(url)
        }

      },
    }
  };
</script>

<style lang="css" scope>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    outline: none;
  }

  .changebtn {
    width: 120px;
    height: 25px;
    line-height: 24px;
    border-radius: 32px;
    background-color: rgba(255, 255, 255, 100);
    text-align: center;
    border: 1px solid var(--aeo-primary-color-7);
    color: #3D5AFE;
  }

  .changebtn:hover {
    background-color: var(--aeo-primary-color);
    border: 1px solid var(--aeo-primary-color-7);
    color: #fff;
  }

  .main-loading {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-size: 16px;
    color: #424242;
  }

  .main-loading img {
    height: 120px;
    width: 120px;
    margin-bottom: 50px;


  }
  .icon-rotate{
    transform: rotate(180deg);
  }
  .dropdown-class{
    max-height: 600px;
    overflow-y: auto;
  }
  /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  .dropdown-class::-webkit-scrollbar{
    width: 7px;
    height: 7px;
    background-color: #F5F5F5;
  }

  /*定义滚动条轨道 内阴影+圆角*/
  .dropdown-class::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: #F5F5F5;
  }

  /*定义滑块 内阴影+圆角*/
  .dropdown-class::-webkit-scrollbar-thumb{
    border-radius: 10px;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, .1);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .1);
    background-color: #c8c8c8;
  }
</style>
