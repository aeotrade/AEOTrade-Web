<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    let dom=document.querySelector('#loading');
    if(dom){
      dom.remove();
    }
  },

  methods:{
    refresh(){
      if(!this.getQueryVariable('refresh')){
        let url=location.href
        url+='?refresh=1'
        location.replace(url)
      }

    },
    getQueryVariable(variable) {
      var query = window.location.search.substring(1);
      var vars = query.split("&");
      for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
      }
      return '';
    }
  }
};
</script>
<style>
  *{
    margin: 0;padding: 0;
  }
</style>
