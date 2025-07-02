<template>
  <button
          type="button"
          :disable="loading"
          @click="handleClick"
          :class="[
      type ? 'hm-button-' + type : '',
      'aeotrade_button',
      {
        'is-disabled': btnDisable && type!=='text',
        'is-loading': btnDisable,
      }
    ]"
  >
    <svg-icon icon-class="btnloading" v-if="btnDisable && type!=='text'" class="loading"/>
    <svg-icon :icon-class="icon" v-if="icon"/>
    <slot></slot>
  </button>
</template>

<script>
  export default {
    name: "Btn",
    data(){
      return{
        disableString: false,
        loading: false
      };
    },
    props:{
      type:{
        type:String,
        default:'normal'
      },
      disable:{
        type:Boolean,
        default: false
      },
      icon:{
        type: String,
        default: ''
      }
    },
    computed:{
      btnDisable(){
        return this.$store.state.app.btnDisable;
      }
    },
    methods: {
      handleClick(evt) {
        if(this.loading===true || this.btnDisable ===true){return false;}
        this.$emit('click', evt);
        // 防止多次点击
        this.loading = true
        setTimeout(() => {
          this.loading = false
        },1500)
      }
    }
  };
</script>

<style lang="scss" scoped>


.aeotrade_button{
  min-width: 80px;
  height: 30px;
  line-height: 28px;
  cursor: pointer;
  text-align: center;
  background-color: #fff;
  font-size: 14px;
  padding: 0 10px;
  border-radius: 6px;
  outline: none;
  color: var(--aeo-primary-color);
  &.hm-button-text{
    border: none;
    background-color: transparent;
    color: #0086b3;
    width: auto;
    min-width: auto;
    &:hover{
      background-color: transparent;
      color: #0086b3;
    }
  }
  &.hm-button-normal{
    border: 1px solid var(--aeo-primary-color);
    &:hover{
      border: 1px solid var(--aeo-primary-color);
      background: var(--aeo-primary-color);
      color: #fff;
    }
  }
  &.hm-button-black {
    margin-top: 20px;
    color: #333;
    border: 1px solid #333;
    &:hover {
      background-color: #2f2d2d;
      color: #ffffff;
    }
  }
  &.hm-button-gray {
    color: #fff;
    letter-spacing: 2px;
    min-width: 80px;
    width: 80px!important;
    border: 1px solid #dcdee3;
    background-color: #dcdee3;
    height: 20px!important;
    line-height: 19px!important;
    margin-left: 15px;
    border-radius: 10px;
    &:hover {
      background-color: #2f2d2d;
    }
  }
  &.hm-button-primary{
    color: #fff;
    background-color: #3D5AFE;
    border:1px solid #3D5AFE;
    border-radius: 6px;
    &:hover{
       background-color: var(--aeo-primary-color-2);
     }
  }
  &.hm-button-white{
    color: #3D5AFE;
    background-color: #fff;
    border:1px solid #3D5AFE;
    border-radius: 6px;
    &:hover{
       background-color: var(--aeo-primary-color-8);
     }
  }
  &.hm-button-disabled{
    border: 1px solid #ccc;
    color: #ccc;
    cursor:not-allowed;
  }

  &.hm-button-waining{
    width: 110px;
    height: 32px;
    line-height: 32px;
    background-color: #f96348;
    box-shadow: 0px 3px 10px 0px
    rgba(249, 99, 72, 0.2);
    border: none;
    color: #fff;
    &.waining:hover{
      background-color: #f96348;
      color: #333;
    }
  }
  &.is-disabled{
    background-color: #fff;
    color: #666;
    border: 1px solid #dfdfdf;
    &:hover{
      background-color: #fff;
      color: #666;
      border: 1px solid #dfdfdf;
    }
  }
  &.hm-button-success{
    border: 1px solid green;
    color: green;
  }
  .loading{
    -webkit-animation:rote .8s linear infinite;
  }
  @-webkit-keyframes rote{

    0%{-webkit-transform:rotate(0deg);}

    25%{-webkit-transform:rotate(90deg);}

    50%{-webkit-transform:rotate(180deg);}

    75%{-webkit-transform:rotate(270deg);}

    100%{-webkit-transform:rotate(360deg);}

  }
  svg{
    margin-right: 5px;
    margin-left: -5px;
  }
}

</style>
