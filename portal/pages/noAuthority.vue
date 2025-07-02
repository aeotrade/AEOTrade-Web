<script setup>
    function back() {
        cookies.setItem('wbin', '0-0-0')
        window.location.href = '/workbench'
    }
</script>

<template>
    <div class="tips-container">
<!--        <img width="400" src="../assets/img/noAuthority.png">-->
        <svg-icon icon-class="noAuthority" style="width: 400px;height: 357px"></svg-icon>
        <div class="words">
            您目前没有此功能权限，请联系管理员开通！
        </div>
        <a @click="back">返回工作台</a>
    </div>
</template>



<style scoped lang="scss">
    .tips-container {
        width: 100%;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .words {
        margin: 20px 0 48px 0;
        color: rgba(16, 16, 16, 100);
        font-size: 18px;
        font-weight: bold;
    }

    a {
        width: 130px;
        height: 30px;
        line-height: 30px;
        background-color: rgba(var(--el-color-primary-rgb), 100);
        color: rgba(255, 255, 255, 100);
        font-size: 14px;
        border-radius: 4px;
        cursor: pointer;
        text-align: center;
    }
</style>
