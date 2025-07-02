<template>
  <div>
    <div class="use-content">
      <div class="left-titleName" @click="jump">
        <el-icon style="margin: 0 10px; font-size: 24px"><ArrowLeft /></el-icon>
        <span>{{
          data.length > 20 ? data.slice(0, 20) + "..." : data || "未命名的合约"
        }}</span>
      </div>
      <div class="mian-info">
        <el-icon class="first_line"><ArrowRight /></el-icon>
        <el-icon class="two_line"><ArrowRight /></el-icon>
        <el-tabs v-model="step" @tab-click="tabChange" :before-leave="tabsRouterLeave">
          <el-tab-pane :name="item.name" v-for="(item, index) in stepArr">
            <template #label>
              <div
                style="
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  height: 50px;
                "
                class="tabsLabel"
              >
                <div
                  :class="[
                    step === item.name ? 'active' : 'normal',
                    'step-number',
                  ]"
                >
                  {{ index + 1 }}
                </div>
                <span style="font-size: 18px; margin-left: 6px">{{
                  item.label
                }}</span>
              </div>
            </template>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="left-titleName" style="visibility: hidden">
        {{ name || "未命名的合约" }}
      </div>
    </div>
    <nuxt-page></nuxt-page>
  </div>
</template>

<script setup>

const router = useRouter();
const route = useRoute();
const data =useContractName()
const stepArr = reactive([
  { label: "基本信息", name: "/connect/processEngine/baseInfo", path: "/connect/processEngine/baseInfo" },
  {
    label: "编辑活动",
    name: "/connect/processEngine/editActive",
    path: "/connect/processEngine/editActive",
  },
  {
    label: "启用合约",
    name: "/connect/processEngine/startContract",
    path: "/connect/processEngine/startContract",
  },
]);
const name = ref("未命名的合约");

const HasRouterChange= ref(false)
const jump = () => {
  let backUrl = sessionStorage.getItem('contractBackUrl')
  if(backUrl){
    console.log(backUrl)
    //faker url
    //router.push('/workbench/connect/contractBackUrl')
    window.location.replace(backUrl)
  }else{
    router.push('/workbench/connect/myContract')
  }

};
const step = useContractStep()
step.value = route.path
const tabChange = (tab) => {
  console.log(333333,'tabChange')
  let pathRouter = stepArr.filter((item) => tab.paneName == item.name);
  let id = route.query.id;
  router.push({ path: pathRouter[0].path, query: { id } });

};

const tabsRouterLeave = ()=>{
    console.log(111111111111,'tabsRouterLeave')
       if(!HasRouterChange.value){
        // 路由发生变化
        HasRouterChange.value = false
        return false
       }
}

watch(()=>route.path,(newValue,pldValue,)=>{
  console.log(2222222,'watch')
  console.log(pldValue,newValue);
  HasRouterChange.value = true
  step.value = newValue
})

</script>

<style scoped lang="scss">
.use-content {
  height: 50px;
  display: flex;
  justify-content: space-between;
  position: fixed;
  top: 0;
  width: 100%;
  padding-left: 10px;
  z-index: 99;
  background-color: #fff;
  align-items: center;
  box-shadow: 0 2px 6px 0 rgba(var(--el-color-primary-rgb), 0.12);
}
.left-titleName {
  cursor: pointer;
  font-size: 16px;
  color: #101010;
  display: flex;
  align-items: center;
  span {
    color: #101010;
    &hover {
      color: var(--el-color-primary);
    }
    font-weight: bold;
  }
}
.step-number {
  width: 18px;
  height: 18px;
  font-size: 14px;
  border-radius: 50%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
}
.tabsLabel {
  &:hover {
    .normal {
      color: #fff;
      background-color: var(--el-color-primary);
    }
  }
}
.normal {
  border: #d9e2eb 1px solid;
  background-color: #f2f4f6;
  color: #b8c1cb;
}

.active {
  color: #fff;
  background-color: var(--el-color-primary);
}
.mian-info {
  position: relative;
}
.first_line {
  position: absolute;
  font-size: 12px;
  top: 19px;
  left: 132px;
}
.two_line {
  position: absolute;
  font-size: 12px;
  top: 19px;
  left: 308px;
}

:deep(){
  .el-tabs__header {
    width: 490px;
    height: 50px;
    margin-bottom: 0;
  }
  .el-tabs__item {
    color: #aaaeb3;
    font-family: SourceHanSansSC-medium;
    :hover {
      color: var(--el-color-primary);
    }
  }
  .is-active {
    color: #101010;
  }
  .el-tabs__nav-wrap {
    height: 50px;
  }
  .el-tabs__nav {
    height: 50px;
  }
  .el-tabs__item {
    height: 50px;
    padding: 0 40px;
  }

  .el-tabs__active-bar {
    width: 40px !important;
    height: 4px;
    margin-left: 41px;
    top: 45px;
    border-radius: 8px;
  }
  .el-tabs__nav-wrap::after {
    background-color: #fff;
  }

  .acn:before {
    transform: rotate(-45deg) translateY(-4px);
    transform-origin: 0 0;
  }
  .acn:before {
    content: "";
    display: inline-block;
    position: absolute;
    height: 15px;
    width: 1px;
    background: #c0c4cc;
  }
  .acn:after {
    transform: rotate(45deg) translateY(4px);
    transform-origin: 100% 100%;
  }
  .acn:after {
    content: "";
    display: inline-block;
    position: absolute;
    height: 15px;
    width: 1px;
    background: #c0c4cc;
  }
}
</style>
