<script setup>

</script>

<template>
    <client-only>
        <Member-Navbar />
        <Member-AppMain />
    </client-only>

</template>

<style scoped lang="scss">
:deep() {
    .el-table th {
        &.el-table__cell {
            background-color: #F7F8FA;
            color: #424242;
            font-weight: bold;
            border-top: 1px solid #EBEEF5;
        }
    }

    .el-dialog__header .el-dialog__title {
        color: rgba(16, 16, 16, 1);
        font-size: 16px;
        font-weight: bold;
    }



}

.firm-setting-btn {
    width: 120px;
    height: 30px;
    margin-top: 20px;
    line-height: 30px;
    border-radius: 46px;
    font-size: 14px;
    text-align: center;
    border: 1px solid rgba(221, 221, 221, 1);
    cursor: pointer;
}

.firm-setting-btn:nth-child(1) {
    margin-right: 30px;
}

.firm-setting-color-gray {
    border: 1px solid rgba(var(--el-color-primary-rgb), 0.3);
    background-color: #fff;
    color: var(--el-color-primary);
}

.firm-setting-color-gray:hover {
    background-color: rgba(var(--el-color-primary-rgb), 0.2);
}

.firm-setting-color-blue {
    background-color: var(--el-color-primary);
    color: #fff;
}

.firm-setting-color-blue:hover {
    background-color: rgba(var(--el-color-primary-rgb), 0.8);
}
</style>
