<script setup>
import { updateUserStatus } from "@/api/api";
const emit = defineEmits(["dialogClose"]);
const { user } = useUser();
const curr = ref(0);
const vList = reactive([

]);
const member = user.value.bind.memberid;

onMounted(() => {
  let video = document.getElementById("video");
  video.pause();
  let vLen = vList.length;
  video.addEventListener("ended", () => {
    //加载数据
    ++curr.value;
    if (curr.value >= vLen) {
      curr.value = 0; //重新循环播放
      video.src = vList[curr.value].src;
    }
    video.src = vList[curr.value].src;

    if (video.src.indexOf("123") > -1) {
      curr.value++;
      video.src = vList[curr.value].src;
    }
    video.load();
  });
});

const close = () => {
  let staffId = cookies.getItem("staffId");
  let type = "webVideo";
  updateUserStatus({
    memberId: member,
    staffId,
    value: 1,
    type,
  }).then((res) => {
    // console.log(res2)
  });
  emit("dialogClose");
};
const changeVideo = (index) => {
  let video = document.getElementById("video");
  curr.value = index;
  video.src = vList[curr.value].src;
  video.load();
};
</script>

<template>
  <div>
    <div class="el-dialog__wrapper" style="z-index: 2008">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="dialog"
        class="el-dialog"
        style="
          margin-top: 100px;
          width: 690px;
          padding: 0px;
          border-radius: 9px;
        "
      >
        <div class="Guid-box">
          <div class="title">{{ vList[curr].title }}</div>
          <video
            id="video"
            :src="vList[curr].src"
            style="width: 100%; height: 390px"
            controls="controls"
            preload="auto"
          ></video>
          <div class="desc">{{ vList[curr].desc }}</div>
          <div
            style="
              width: 100%;
              border-bottom: 1px solid rgba(var(--el-color-primary-rgb), 0.1);
              margin-bottom: 16px;
            "
          ></div>
          <div style="display: flex; transform: translateX(-8px)">
            <div style="width: 190px; margin-right: 30px">
              <div class="type">创建合约</div>
              <div
                :class="['type-title', curr === index ? 'active' : '']"
                v-for="(item, index) in vList.slice(0, 3)"
                @click="changeVideo(index)"
                :key="index"
              >
                <svg-icon :icon-class="item.icon" class="helpIcon" />
                <span> {{ item.title }} </span>
              </div>
            </div>
            <div style="flex: 1; margin-right: 30px">
              <div class="type">查看合约</div>
              <div
                :class="['type-title', curr === index + 3 ? 'active' : '']"
                v-for="(item, index) in vList.slice(3, 6)"
                @click="changeVideo(3 + index)"
                :key="index"
              >
                <svg-icon :icon-class="item.icon" class="helpIcon" />
                <span> {{ item.title }} </span>
              </div>
            </div>
            <div style="width: 160px">
              <div class="type">探索应用</div>
              <div
                :class="[
                  'type-title',
                  item.enable ? 'enable' : '',
                  curr === index + 6 ? 'active' : '',
                ]"
                v-for="(item, index) in vList.slice(6, 9)"
                @click="changeVideo(6 + index)"
                :key="index"
              >
                <svg-icon :icon-class="item.icon" class="helpIcon" />
                <span> {{ item.title }} </span>
              </div>
            </div>
          </div>
          <div
            style="
              color: #fff;
              font-size: 20px;
              position: absolute;
              top: -35px;
              left: 0;
              font-weight: bold;
            "
          >
            新手引导
          </div>
          <el-icon
            style="
              color: #fff;
              font-size: 26px;
              position: absolute;
              opacity: 0.8;
              top: -35px;
              right: 0;
              cursor: pointer;
            "
            @click="close"
          > <CircleCloseFilled /> </el-icon>
        </div>
        <div></div>
      </div>
    </div>
    <div class="v-modal" tabindex="0" style="z-index: 2007"></div>
  </div>
</template>

<style scoped lang="scss">
.Guid-box {
  background: linear-gradient(
    180deg,
    rgba(241, 246, 253, 1) 0%,
    rgba(253, 250, 255, 1) 100%
  );
  box-shadow: 0px 6px 14px 0px rgba(var(--el-color-primary-rgb), 0.14);
  position: relative;
  border-radius: 9px;
  width: 720px;
  height: 690px;
  box-sizing: border-box;
  padding: 30px 30px 35px;
  .title {
    font-size: 18px;
    margin-bottom: 20px;
    font-weight: bold;
  }
  .desc {
    color: #9199ac;
    font-size: 12px;
    margin-bottom: 19px;
    margin-top: 16px;
  }
  .type {
    font-size: 12px;
    padding-left: 8px;
    color: #424242;
    margin-bottom: 10px;
  }
  .type-title {
    font-size: 14px;
    color: #101010;
    height: 30px;
    line-height: 30px;
    cursor: pointer;
    margin-bottom: 5px;
    &:hover {
      background-color: rgba(233, 234, 242, 0.9);
      text-decoration: underline;
    }
  }
  .active {
    background-color: rgba(233, 234, 242, 0.9);
  }
  .enable {
    opacity: 0.4;
  }
  .helpIcon {
    margin: 0 8px;
    color: #7e829d;
  }
}
</style>
