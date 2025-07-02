<template>
  <header class="app-header">
    <div class="header-left">
      <img v-if="companyLogo" :src="companyLogo" alt="公司Logo" class="company-logo" />
      <a v-else href="/"><img src="@/assets/img/logo.png" style="height: 35px;"></a>
      <span v-if="companyName" class="company-name">{{ companyName }}</span>
    </div>
    <div v-if="userAvatar" class="header-right">
      <img :src="userAvatar" alt="用户头像" class="user-avatar" />
    </div>
  </header>
</template>

<script setup>
const companyLogo = ref(''); // 公司Logo
const companyName = ref('');
const userAvatar = ref(''); // 用户头像

const { user } = useUser();
companyLogo.value = user.value?.bind?.memberimg;
companyName.value = user.value?.bind?.membername;
userAvatar.value = user.value?.headimgurl;
</script>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  padding: 0 20px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(61, 90, 254, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
}

.company-logo {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
}

.company-name {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
}
</style>