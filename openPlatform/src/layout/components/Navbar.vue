<template>
  <div class="navbar-box">
    <div class="navbar">
      <div class="left-box">
        <div class="back-box">
          <div class="back">
            <svg-icon icon-class="more"  class="more"/>
            <svg-icon icon-class="enlogo"  class="enlogo"/>
          </div>
        </div>
        <breadcrumb class="breadcrumb-container" />
      </div>


      <div class="right-menu">
        <NavMemberList :isWorker="false"></NavMemberList>
      </div>
    </div>
  </div>

</template>

<script>
import { mapGetters } from 'vuex';
import Breadcrumb from '@/components/Breadcrumb';
import Hamburger from '@/components/Hamburger';
import NavMemberList from '@/components/NavMemberList';
export default {
  components: {
    Breadcrumb,
    Hamburger,
    NavMemberList
  },
  data(){
    return{
      isShowDialog:false,
      toname:this.$store.state.user.toname,
    };
  },
  mounted(){


  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar');
    },
    async logout() {
      await this.$store.dispatch('user/logout');
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },

  }
};
</script>

<style lang="scss" scoped>
  .el-dropdown-item{
    display: flex;
    align-items: center;
    padding: 10px 15px;
    font-size: 12px;
  }
  .yuan{
    width: 20px;
    height: 20px;
    border: 1px solid #cccccc;
    border-radius: 20px;
    margin-right: 5px;
  }
  .lastStatus,.lastStatusSuccess{
    padding: 0px 15px;
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
  }
  .addBotton{
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    border-top: 1px solid #cccccc;
  }



  .navbar-box{
    position: fixed;
    width: 100%;
    left: 0;
    top: 0;
    z-index: 3;
  }
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  /*overflow: hidden;*/
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  transform: translate3d(0, 0, 0);
  padding-right: 20px;
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    display: flex;
    align-items: center;
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: flex;
      align-items: center;
      span{
        height: 20px;
        line-height: 20px;
        color: #fff;
        font-size: 12px;
        font-weight: bold;
        padding: 0px 30px;
        background-color:var(--aeo-primary-color);
        border-radius: 10px;
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
        }
      }
    }

    .avatar-container {
      margin-right: 20px;

      .list-menu{
        width: 100%;
        position: absolute;
        height: 100px;
        left: 0;
        top: 53px;
        z-index: 2;
        text-align: right;
        background-color: #fff;
        box-shadow: 2px 2px 10px rgba(48, 65, 217, 0.2);
        padding: 0 10px;
        font-size: 12px;
        li{
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: keep-all;
          line-height: 25px;
          &.active{
            color: var(--aeo-primary-color);
          }
        }
      }
      .avatar-wrapper {
        display: flex;
        align-items: center;
        cursor: pointer;
        /*margin-top: 5px;*/
        position: relative;
        /*padding: 0 20px;*/
        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 30px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          font-size: 12px;
        }
        span{

          /*margin-left: 20px;*/
          color: var(--aeo-primary-color);
          margin-right: 5px;
          font-size: 12px;

        }
        i{
          color: var(--aeo-primary-color);
        }
      }
    }
  }
  .exit{
    margin-right: 10px;
  }
  .exit_box{
    /*border*/
    padding: 0 10px;
  }
  .user-dropdown{
    width: 100%;
  }

}
.back{
  height: 50px;
  text-align: center;
  color: #333;
  line-height: 50px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  /*border-right: 1px solid rgba(0,21,41,0.08);*/
  background: #fff;
  overflow: hidden;
  box-sizing: border-box;
  /*border-bottom: 1px solid #222222;*/
  span{
    margin-left: 15px;
  }
}
.back-box{
  width: 150px;
  box-sizing: border-box;
  box-shadow: -3px 1px 4px rgba(0,21,41,.08);
}
  .left-box{
    display: flex;
    align-items: center;
  }
.enlogo{
  width: 55px !important;
  height: 30px !important;
  margin-left: 5px;
}
</style>
