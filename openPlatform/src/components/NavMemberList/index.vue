<template>
  <div style="display: flex;align-items: center;">
    <div class="xialabox" style="z-index: 999;display: flex;align-items: center;justify-content: flex-end" id="box">
      <span  @click="show=!show" class="memberName">{{name}}</span>
      <div class="shangXia" @click="show=!show" v-if="isWorker">
        <img src="@/assets/xia.png" :class="{jianTouActive:show}">
      </div>
      <ul :class="!show?'ulNone':''" v-if="isWorker">
        <li v-for="(item,index) in companyMemberList" :key="index" :class="active==index?'on':''" @click="checkItem(index)">
          <div class="yuan">
            <svg-icon icon-class="gou" style="font-size: 22px;position: relative;top: -6px;left: -2px" v-if="item.checkStutas"></svg-icon>
          </div>
          <div class="memberName">{{item.memberName}}</div>
        </li>
      </ul>
    </div>
    <p @click="jump('setPage')" v-if="isWorker">
      <i class="el-icon-setting" style="font-size: 20px;cursor: pointer"></i>
    </p>
    <div class="right-menu-item" v-if="isWorker" >
      <div class="user" title="退出系统">
        <svg-icon icon-class="exit" @click="exit"  class="user-head"/>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
      name: "index",
      props:{
        isWorker:{
          type:Boolean,
          default:true
        }
      },
      data(){
          return{
            companyMemberList:[],
            show:false,
            active:0,
          };
      },
      mounted(){

        document.addEventListener('mouseup', (event) => {
          let sp = document.getElementById('box');

          if (sp) {
            if (!sp.contains(event.target)) {
              this.show=false;
            }
          }
        }, false);
      },
      methods:{
        jump(str){
          this.$tokenBox.setItem('toname',str);
          this.$store.state.tagsView.visitedViews=[];
          if(str=='goodsCoding'){
            if(this.checked){
              this.$router.replace({path:'/workOverview/index'});
            }else {
              this.$router.push({path:'/'+str});
            }
          }else {
            this.$router.push({path:'/'+str});
          }

        },
        exit(){
          this.$store.commit('user/set_memberId', null);
          this.$tokenBox.setItem('memberId',null);
          this.$tokenBox.setItem('info',null);
          this.$router.push({path:'/'});

        },
        getList(){
          let info=JSON.parse(this.$tokenBox.getItem('info'));

          let id=''+info.bind.staffid;

          this.$api('/uac/uac/manager/list','get',{id:id}).then((res)=>{
            let companyMemberList=[];

            this.$store.state.user.managerList=res.result;

            res.result.forEach((item)=>{

              if(item.id==this.memberId){

                 item.checkStutas=true;
              }else {
                item.checkStutas=false;
              }

              companyMemberList.push(item);
            });
            this.companyMemberList=companyMemberList;
          });
        },

        checkItem(index){
          if(this.companyMemberList[index].checkStutas){
            return;
          }
          let data=JSON.parse(JSON.stringify(this.companyMemberList))
          data.map((item,indexs)=>{
            if(indexs==index){
              return item.checkStutas=true;
            }
            return item.checkStutas=false;
          })
          this.companyMemberList=data;
          let info=JSON.parse(this.$tokenBox.getItem('info'));

           this.$store.state.user.name=this.companyMemberList[index].memberName;
              this.$store.state.user.memberId=''+this.companyMemberList[index].id
              info.bind.memberid=''+this.companyMemberList[index].id
              info.bind.membername=this.companyMemberList[index].memberName;
              info.bind.staffname=this.companyMemberList[index].staffName;
              info.bind.uscc=this.companyMemberList[index].uscCode;
          this.$tokenBox.setItem('memberId',''+this.companyMemberList[index].id)
          this.$tokenBox.setItem('info',info);
          this.show=false;
        }

      },

      computed:{
        name(){
          let checked=this.companyMemberList.filter((item)=>{return item.checkStutas==true;})

          if(checked[0]){
            return checked[0].memberName;
          }
        },
        memberId(){
          return this.$store.state.user.memberId;
        },
      }
    };
</script>

<style scoped lang="scss">
  .memberName{
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: keep-all;
    cursor: pointer;
  }
  .xialabox{
    z-index: 999;
    display: flex;
    min-width: 140px;
    align-items: center;
    position: relative;
    margin-right: 10px;
    .shangXia{
      cursor: pointer;
      display: flex;
      align-items: center;
      img{
        width: 20px;
        transform: rotate(0deg);
        transition: .6s;
      }
      .jianTouActive{
        transform: rotate(-180deg);
      }
    }
    ul{
      width: 240px;
      box-shadow: 0 0 3px rgba(51,102,255,.3);
      position: absolute;
      top: 50px;
      z-index: 999;
      transition: .6s;
      overflow: hidden;
      border-radius: 2px;
      opacity: 1;
      background-color: #f9f9f9;
      .addCompany{
        height: 40px;
        text-align: center;
        line-height: 40px;
        cursor: pointer;
      }
      li{
        width: 100%;
        height: 35px;
        line-height: 35px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding: 0px 10px ;
        box-sizing: border-box;
        border-bottom: 1px solid #ECECEC;
        position: relative;
        overflow: hidden;
        &:hover{
          color: #3d5afe;
        }
      }
    }
    .ulNone{
      height: 0px;
      overflow: hidden;
      opacity: 0;
    }
  }
  .yuan{
    width: 18px;
    height: 18px;
    border: 1px solid #cccccc;
    border-radius: 20px;
    margin-right: 10px;
  }


  .lastStatus,.lastStatusSuccess,.lastStatusNone{
    padding:0px 15px;
    height:18px ;
    border-radius: 10px;
    background-color: #FE4E48;
    color: #fff;
    line-height: 18px;
    text-align: center;
    margin-left: 5px;
  }
  .lastStatusSuccess{
    background-color: #24912C;
    cursor: pointer;
  }
  .lastStatusNone{
    background-color: #ccc;
  }
  .user{
    width: 26px;
    height: 26px;
    border-radius: 100%;
    background-color: #fff;
    color: #333;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 1px 1px 4px rgba(0,21,41,.08);
    margin:0 20px;
    .user-head{
      width: 12px;
      height: 12px;
      cursor: pointer;
    }
  }
</style>
