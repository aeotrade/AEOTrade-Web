<template>
  <div class="property-dialog">
    <CommonProperty
      :nodeData="nodeData"
      :lf="lf"
      :type:null
      @onClose="handleClose"/>
  </div>
</template>
<script>
import CommonProperty from './CommonProperty'
import User from './User.vue'

export default {
  name: 'PropertyDialog',
  components: {
    CommonProperty,
    User
  },
  props: {
    nodeData: Object,
    lf: Object,
    type:null
  },
  data () {
    return {}
  },
  methods: {
    handleClose () {
      this.$emit('setPropertiesFinish')
    }
  }
}
</script>
<style>
.property-dialog{
  padding: 20px;
}
</style>
