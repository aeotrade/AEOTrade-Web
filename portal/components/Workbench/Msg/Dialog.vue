<script setup>

const emit = defineEmits(['close', 'update:visible'])
const props = defineProps({
  visible: Boolean,
  msgDetails:{}
});

function close() {
  emit('update:visible', false)
}

</script>

<template>
  <el-dialog
      class="msg-center-dialog"
      v-model="props.visible"
      :show-close="true"
      :before-close="close"
      :append-to-body="true"
      :close-on-click-modal="false"
      :title="props.msgDetails.messageTitle"
      width="750px">
    <div class="content-wrap" v-html="props.msgDetails.messageDetails"></div>
  </el-dialog>
</template>

<style lang="scss" scoped>
.content-wrap{
  padding-bottom: 20px;
}

</style>

<style>
.msg-center-dialog {
  padding: 0;
}

.msg-center-dialog div.el-dialog__header {
  padding: 20px;
}

.msg-center-dialog div.el-dialog__body {
  padding: 0 20px;
}
</style>
