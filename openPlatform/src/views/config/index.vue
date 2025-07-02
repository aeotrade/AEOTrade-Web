<template>
    <div class="config">
      <div class="menu">
        <div class="info">
          <i class="el-icon-arrow-left" @click="$router.replace('/connector')"></i>
          <img width="60px" height="60px" :src="info.image" style="object-fit: cover">
          <div class="title">
            {{info.name}}
            <div class="tag">
              <div class="tag-item error" v-if="info.status == '未发布'">未发布</div>
              <div class="tag-item error" v-else-if="info.status == '审核中'">审核中</div>
              <div class="tag-item success" v-else>已发布</div>
            </div>
          </div>
        </div>
        <div class="tip">
          <i class="el-icon-info"></i>
          <span>连接器发布后，当前配置方可生效</span>
          <span @click="$router.push({path:'/config/version',query:{id:$route.query.id}})" style="margin-left: 5px;color: var(--aeo-primary-color);text-decoration: underline;cursor: pointer">版本发布</span>
        </div>
        <div class="menu-list">
          <div :class="{'menu-item':true,'active':actRoute === item.path}" v-for="(item,i) in menuList" :key="i" @click="change(item)">
            <svg-icon :icon-class="item.icon"></svg-icon>
            <span>{{item.title}}</span>
          </div>
        </div>
      </div>
      <div class="menus-wrapper">
        <router-view></router-view>
      </div>
    </div>
</template>

<script>
    export default {
        name: "index",
      data(){
          return{
            menuList:[
              {icon:'1.基本信息',title:'1.基本信息',path:'/config/basic'},
              {icon:'2.账号配置',title:'2.账号配置',path:'/config/account'},
              {icon:'3.触发事件',title:'3.触发事件',path:'/config/event'},
              {icon:'4.执行动作',title:'4.执行动作',path:'/config/movement'},
              {icon:'5.版本发布',title:'5.版本发布',path:'/config/version'}
            ]
          }
      },
      computed:{
        actRoute(){
          return this.$route.meta.actRoute;
        },
        info(){
          return this.$store.state.user.connectorInfo
        }
      },
      mounted() {
        this.getInfo()
      },
      methods:{
        getInfo(){
          this.$api.connector.getCategoriesInfo(this.$route.query.id).then(res=>{
            this.$store.state.user.connectorInfo =  res.data;
          })
        },
        change(item){
          this.$router.push({path:item.path,query:{id:this.$route.query.id}})
        }
      }
    }
</script>

<style scoped lang="scss">
  .tag {
    margin-top: 5px;
    font-size: 12px;
    text-align: center;
    .tag-item {
      width: 50px;
      height: 20px;
      line-height: 20px;
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
  .config{
    padding-top: 50px;
    height: 100vh;
    display: flex;
    .menu{
      width: 320px;
      flex-shrink: 0;
      .info{
        padding-left: 10px;
        display: flex;
        align-items: center;
        height: 94px;
        border-bottom: 1px solid #E2983680;
        i{
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: #fff;
          font-size: 26px;
          font-weight: bold;
          color: #6d6d6d;
          cursor: pointer;
          transition: .1s;
          &:hover{
            background-color: rgb(245,245,245);
          }
        }
        img{
          margin: 0 7px 0 6px;
          border-radius: 50%;
        }
        .title{
          color: rgba(16, 16, 16, 1);
          font-size: 18px;
          font-weight: bold;
          width: 190px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .tip{
        font-size: 12px;
        background-color: rgba(249, 172, 20, 0.06);
        color: #E29836;
        height: 40px;
        display: flex;
        align-items: center;
        i{
          margin: 0 10px;
        }
      }
      .menu-list{
        .menu-item{
          font-size: 18px;
          cursor: pointer;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          span{
            margin-left: 13px;
          }
          &:hover{
            color: var(--aeo-primary-color);
            background-color: var(--aeo-primary-color-9);
          }
          &.active{
            color: var(--aeo-primary-color);
            background-color: var(--aeo-primary-color-9);
          }
        }
      }
    }
    .menus-wrapper{
      height: 100%;
      width: 100%;
      background-color: #f7f8f9;
      padding: 20px 0 0 20px;
    }
  }
</style>
