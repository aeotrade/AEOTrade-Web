<template>
    <div class="card-container">
      <div class="card-content" style="padding-top: 0px">
        <div class="card-icon" v-if="cardType!='checked'" @click="jump">
          <img src="../../assets/disk.svg">
        </div>
        <div class="card-icon" v-if="cardType=='checked'">
          <img src="../../assets/disk.svg">
        </div>
        <div class="card-info" v-if="cardType=='checked'" @click="jump">
          <div class="item"><span>案卷档号：</span>{{cardContent.biz_id}}</div>
          <div class="item"><span>报关单号：</span>{{cardContent.entry_no}}</div>
          <div class="item"><span>业务发生时间：</span>{{cardContent.DecHead_IEDate.substring(0,4)+'-'+cardContent.DecHead_IEDate.substring(4,6)+'-'+cardContent.DecHead_IEDate.substring(6)}}</div>
        </div>
        <div class="card-info" v-if="cardType=='groupDate'" @click="jump">
          <div class="item" style="width: 140px;">
            <span v-if="!cardContent._id || cardContent._id=='无'">
              其他
              <el-tooltip effect="light" placement="top" :visible-arrow="false">
                <div slot="content">不满足当前分组条件，但又真<br>实存在的数据。</div>
                <svg-icon class="wenhao" icon-class="wenhao"></svg-icon>
              </el-tooltip>
            </span>
            <span v-else>{{time==0?cardContent._id.toString():time==1?cardContent._id.toString().slice(0,6):cardContent._id.toString().slice(0,4)}}</span>
          </div>
          <div class="item" style="margin-top: 15px"><span style="font-weight: normal">共计：</span>{{cardContent.sum}} {{type === 'file' ? '件': '卷'}}
            <span v-if="cardContent.sum == '0'">
              <el-tooltip effect="light" placement="top-start" :visible-arrow="false">
                <div slot="content">根据您当前档案柜设置的筛选条件未找到符合条件的相关文件、案<br>卷。您可根据你的需求新建档案柜或修改筛选条件。</div>
                <svg-icon class="wenhao" icon-class="wenhao"></svg-icon>
              </el-tooltip>
            </span>
          </div>
        </div>
        <div class="card-info" v-if="cardType=='groupIndex'" @click="jump">
          <div class="item" style="width: 140px;">
            <span v-if="!cardContent._id || cardContent._id=='无'">
              其他
              <el-tooltip effect="light" placement="top" :visible-arrow="false">
                <div slot="content">不满足当前分组条件，但又真<br>实存在的数据。</div>
                <svg-icon class="wenhao" icon-class="wenhao"></svg-icon>
              </el-tooltip>
            </span>
            <span v-else>
              <span v-if="showTabData">{{time==0?cardContent._id.toString():time==1?cardContent._id.toString().slice(0,6):cardContent._id.toString().slice(0,4)}}</span>
              <span v-else>{{cardContent._id}}</span>
            </span>
          </div>
          <div class="item" style="margin-top: 15px"><span style="font-weight: normal">共计：</span>{{cardContent.sum}} {{type === 'file' ? '件': '卷'}}
            <span v-if="cardContent.sum == '0'">
              <el-tooltip effect="light" placement="top-start" :visible-arrow="false">
                <div slot="content">根据您当前档案柜设置的筛选条件未找到符合条件的相关文件、案<br>卷。您可根据你的需求新建档案柜或修改筛选条件。</div>
                <svg-icon class="wenhao" icon-class="wenhao"></svg-icon>
              </el-tooltip>
            </span>
          </div>
        </div>
        <div class="card-info" v-if="cardType=='groupDelivery'||cardType=='groupIDelivery'" @click="jump">
          <div class="item">
            <span v-if="!cardContent._id || cardContent._id=='无'">
              其他
              <el-tooltip effect="light" placement="top" :visible-arrow="false">
                <div slot="content">不满足当前分组条件，但又真<br>实存在的数据。</div>
                <svg-icon class="wenhao" icon-class="wenhao"></svg-icon>
              </el-tooltip>
            </span>
            <span v-else>
              <span v-if="showTabData">{{time==0?cardContent._id.toString():time==1?cardContent._id.toString().slice(0,6):cardContent._id.toString().slice(0,4)}}</span>
              <span v-else>{{cardContent._id}}</span>
            </span>
          </div>
          <div class="item" style="margin-top: 25px"><span style="font-weight: normal">共计：</span>{{cardContent.sum}} {{type === 'file' ? '件': '卷'}}
            <span v-if="cardContent.sum == '0'">
              <el-tooltip effect="light" placement="top-start" :visible-arrow="false">
                <div slot="content">根据您当前档案柜设置的筛选条件未找到符合条件的相关文件、案<br>卷。您可根据你的需求新建档案柜或修改筛选条件。</div>
                <svg-icon class="wenhao" icon-class="wenhao"></svg-icon>
              </el-tooltip>
            </span>
          </div>
        </div>
        <div class="card-info" v-if="cardType=='groupTradeCountry' || cardType== 'supervision'" @click="jump">
          <div class="item">
            <span v-if="!cardContent._id || cardContent._id=='无'">
              其他
              <el-tooltip effect="light" placement="top" :visible-arrow="false">
                <div slot="content">不满足当前分组条件，但又真<br>实存在的数据。</div>
                <svg-icon class="wenhao" icon-class="wenhao"></svg-icon>
              </el-tooltip>
            </span>
            <span v-else>{{cardContent._id}}</span>
          </div>
<!--          <div class="item"><span style="font-weight: normal">最近更新：</span>{{cardContent.time.substr(0,10)}}</div>-->
          <div class="item" style="margin-top: 25px"><span style="font-weight: normal">共计：</span>{{cardContent.sum}} {{type === 'file' ? '件': '卷'}}
            <span v-if="cardContent.sum == '0'">
              <el-tooltip effect="light" placement="top-start" :visible-arrow="false">
                <div slot="content">根据您当前档案柜设置的筛选条件未找到符合条件的相关文件、案<br>卷。您可根据你的需求新建档案柜或修改筛选条件。</div>
                <svg-icon class="wenhao" icon-class="wenhao"></svg-icon>
              </el-tooltip>
            </span>
          </div>
        </div>
        <div class="card-info" v-if="cardType=='intellectFile'" @click="jump">
          <div class="item">
            <span v-if="!cardContent.name || cardContent.name=='无'">
              其他
              <el-tooltip effect="light" placement="top" :visible-arrow="false">
                <div slot="content">不满足当前分组条件，但又真<br>实存在的数据。</div>
                <svg-icon class="wenhao" icon-class="wenhao"></svg-icon>
              </el-tooltip>
            </span>
            <span v-else>{{cardContent.name}}</span>
          </div>
          <div class="item"><span style="font-weight: normal">共计：</span>{{cardContent.num}} {{type === 'file' ? '件': '卷'}}
            <span v-if="cardContent.sum == '0'">
              <el-tooltip effect="light" placement="top-start" :visible-arrow="false">
                <div slot="content">根据您当前档案柜设置的筛选条件未找到符合条件的相关文件、案<br>卷。您可根据你的需求新建档案柜或修改筛选条件。</div>
                <svg-icon class="wenhao" icon-class="wenhao"></svg-icon>
              </el-tooltip>
            </span>
          </div>
        </div>
        <div class="card-info" v-if="cardType=='productCategory'" @click="jump">
          <div v-if="cardContent._id.length < 40" class="item category">
            <span v-if="!cardContent._id || cardContent._id=='无'">
              其他
              <el-tooltip effect="light" placement="top" :visible-arrow="false">
                <div slot="content">不满足当前分组条件，但又真<br>实存在的数据。</div>
                <svg-icon class="wenhao" icon-class="wenhao"></svg-icon>
              </el-tooltip>
            </span>
            <span v-else>{{ cardContent._id}}</span>
          </div>
          <el-tooltip v-else effect="light" :content="cardContent._id" placement="top-start">
            <div class="item category"><span>{{cardContent._id}}</span></div>
          </el-tooltip>
          <div class="item"><span style="font-weight: normal">共计：</span>{{cardContent.sum}} {{type === 'file' ? '件': '卷'}}
            <span v-if="cardContent.sum == '0'">
              <el-tooltip effect="light" placement="top-start" :visible-arrow="false">
                <div slot="content">根据您当前档案柜设置的筛选条件未找到符合条件的相关文件、案<br>卷。您可根据你的需求新建档案柜或修改筛选条件。</div>
                <svg-icon class="wenhao" icon-class="wenhao"></svg-icon>
              </el-tooltip>
            </span>
          </div>
        </div>
      </div>
      <div class="btn-group">

        <Hmbtn class="down-btn" icon="packageDown" @click="down" v-if="cardType!='checked'&&cardContent.sum!='0'">打包下载</Hmbtn>

        <Hmbtn class="down-btn" v-if="cardType === 'intellectFile'" icon="delete" @click="del">删除</Hmbtn>
      </div>

    </div>
</template>

<script>
    export default {
      name: "card",
      props:{
        showTabData:{},
        time:{},
        //卡片类型
        cardType:{
          type:String,
          default:'checked'
        },
        // 数据类型 文件 还是 案卷  file folder
        type: {
          type: String,
          default: 'file'
        },
        //卡片内容
        cardContent:{

        }
      },
      data(){
          return{
            checked:false,
          };
      },
      computed:{
        isDown(){
          return this.$store.state.user.isDown;
        }
      },
      methods:{
        jump() {
          // if(this.cardType == "groupTradeCountry"){
          //   this.$router.push({path: '/fileGrouping/fileFolder',query:{
          //       type : this.cardType,
          //       value : {
          //         label:this.cardContent._id,
          //         value:this.cardContent.code
          //       }
          //     }});
          // }else if(this.cardType == "intellectFile"){
          //   this.$router.push({path: '/fileGrouping/fileFolder',query:{
          //       type : this.cardType,
          //       value : {
          //         label:this.cardContent.name,
          //         value:this.cardContent.id
          //       }
          //     }});
          // }else {
          //   this.$router.push({path: '/fileGrouping/fileFolder',query:{
          //       type : this.cardType,
          //       value : this.cardContent._id || this.cardContent.id
          //     }});
          // }
          this.$emit('click',this.cardContent)
        },

        //打包下载事件
        down(){
          let downFunc = this.$parent.packageDown || this.$parent.$parent.packageDown
          downFunc(this.cardContent)
        },
        // 删除
        del(){
          let deleteFunc = this.$parent.deleteCustomArchives || this.$parent.$parent.deleteCustomArchives
          deleteFunc(this.cardContent);
        }
      }
    };
</script>

<style scoped lang="scss">
  .wenhao{
    margin-left: 12px;
  }
  .down-btn{
    transition: .3s;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
  }
  .down-btn:nth-child(2){
    margin-left: 15px;
  }
  .card-container{
    position: relative;
    padding: 10px 10px 40px 10px;
    color: rgba(16, 16, 16, 100);
    font-size: 14px;
    /*<!--box-shadow: 0px 2px 6px -3px rgba(61, 90, 254, .2);-->*/
    font-family: Roboto;
    .card-content{
      display: flex;
      /*justify-content: space-between;*/
      align-items: start;
      margin-top: 10px;
      .card-icon{
        width: 80px;
        height: 70px;
        margin-right: 7px;
        /*flex-shrink: 0;*/
      }
      .card-info{
        cursor: pointer;
        width: 61%;
        /*height: 82px;*/
        /*overflow-y: hidden;*/
        margin-left: 25px;
        .item{
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 10px;
          /*min-width: 273px;*/
          span{
            font-weight: bold;
          }
        }
      }
    }
  }
  .card-item:hover{
    .down-btn{
      opacity: 1;
    }
  }
  .btn-group{
    margin-top: -5px;
    display: flex;
    justify-content: center;
    position: absolute;
    left: 0;
    width: 100%;
  }
  .category{
    /*display: -webkit-box;*/
    /*-webkit-box-orient: vertical;*/
    /*-webkit-line-clamp: 2;*/
    /*overflow: hidden;*/
  }
</style>
