<script setup>
  const props=defineProps({
    lf: Object,
    nodeList: Array
  })
  const $_dragNode=(item)=>{
    props.lf.dnd.startDrag({
      id:"Active_"+Math.random().toString(36).substr(3),
      type: item.type,
      properties:{
        name:"未命名"

      }
    })
  }
</script>
<template>
  <div class="node-panel">
    <div class="node-item"
      v-for="item in props.nodeList"
      :key="item.text"
      @mousedown="$_dragNode(item)">
    <div class="node-item-icon" :class="item.class">
      <div v-if="item.type === 'user' || item.type === 'time'" class="shape"></div>
    </div>
    <span class="node-label">{{item.text}}</span>
    </div>
  </div>
</template>
<style>
.node-panel {
  position: absolute;
  top: 55px;
  left: 20px;
  width: 70px;
  padding: 20px 5px;
  background-color: white;
  box-shadow: 0 0 10px 1px rgb(228, 224, 219);
  border-radius: 6px;
  text-align: center;
  z-index: 101;
  user-select: none;
}
.node-panel>* {
  pointer-events: all;
}
.node-item {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  /*justify-content: center;*/
}
.node-item-icon {
  width: 30px;
  height: 30px;

  background-size: cover;
}
.node-label {
  font-size: 12px;
  margin-top: 5px;
  user-select: none;
}
.node-start{
  background: url('../background/start.png') no-repeat;
  background-size: cover;
}
.node-text{
  border: 1px solid black;
}
.node-user{
  background: url('../background/user.png') no-repeat;
  background-size: cover;
}
.node-time{
  background: url('../background/time.png') no-repeat;
  background-size: cover;
}
.node-push{
  background: url('../background/push.png') no-repeat;
  background-size: cover;
}
.node-download{
  background: url('../background/download.png') no-repeat;
  background-size: cover;
}
.node-click{
  background: url('../background/click.png') no-repeat;
  background-size: cover;
}
.node-end{
  background: url('../background/end.png') no-repeat;
  background-size: cover;
}
/*.node-connect{*/
/*  !*background: url('../background/connent.png') no-repeat;*!*/
/*  background-size: cover;*/
/*  width: 56px !important;*/
/*}*/
.node-connect1{
  background: url('../background/connect1.svg') no-repeat;
  background-size: 100%;
  width: 56px !important;
}
.node-connect2{
  background: url('../background/connect2.svg') no-repeat;
  background-size: 100%;
  width: 56px !important;
}
.node-apply{
  width: 24px;
  height: 24px;
  border-radius: 24px;
  border: 2px solid #3d5afe;
}
.node-group{
  width: 42px;
  height: 15px;
  /*border-radius: 2px;*/
  border: 1px solid #3d5afe;
}
.node-approver{
  width: 40px;
  height: 30px;
  border-radius: 4px;
  border: 2px solid rgb(60, 179, 113);
}
.node-jugement{
  width: 25px;
  height: 25px;
  border: 1px solid #3d5afe;
  transform: rotate(45deg);

}
.node-finish{
  width: 30px;
  height: 30px;

  border-radius: 15px;
  border: 1px solid #989891;
}
.bpmn-start {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAAH6ji2bAAAABGdBTUEAALGPC/xhBQAAAnBJREFUOBGdVL1rU1EcPfdGBddmaZLiEhdx1MHZQXApraCzQ7GKLgoRBxMfcRELuihWKcXFRcEWF8HBf0DdDCKYRZpnl7p0svLe9Zzbd29eQhTbC8nv+9zf130AT63jvooOGS8Vf9Nt5zxba7sXQwODfkWpkbjTQfCGUd9gIp3uuPP8bZ946g56dYQvnBg+b1HB8VIQmMFrazKcKSvFW2dQTxJnJdQ77urmXWOMBCmXM2Rke4S7UAW+/8ywwFoewmBps2tu7mbTdp8VMOkIRAkKfrVawalJTtIliclFbaOBqa0M2xImHeVIfd/nKAfVq/LGnPss5Kh00VEdSzfwnBXPUpmykNss4lUI9C1ga+8PNrBD5YeqRY2Zz8PhjooIbfJXjowvQJBqkmEkVnktWhwu2SM7SMx7Cj0N9IC0oQXRo8xwAGzQms+xrB/nNSUWVveI48ayrFGyC2+E2C+aWrZHXvOuz+CiV6iycWe1Rd1Q6+QUG07nb5SbPrL4426d+9E1axKjY3AoRrlEeSQo2Eu0T6BWAAr6COhTcWjRaYfKG5csnvytvUr/WY4rrPMB53Uo7jZRjXaG6/CFfNMaXEu75nG47X+oepU7PKJvvzGDY1YLSKHJrK7vFUwXKkaxwhCW3u+sDFMVrIju54RYYbFKpALZAo7sB6wcKyyrd+aBMryMT2gPyD6GsQoRFkGHr14TthZni9ck0z+Pnmee460mHXbRAypKNy3nuMdrWgVKj8YVV8E7PSzp1BZ9SJnJAsXdryw/h5ctboUVi4AFiCd+lQaYMw5z3LGTBKjLQOeUF35k89f58Vv/tGh+l+PE/wG0rgfIUbZK5AAAAABJRU5ErkJggg==) center center no-repeat;
  cursor: grab;
}
.bpmn-end {
  width: 24px;
  height: 24px;
  background: url('../background/end.svg') no-repeat;
  cursor: grab;
}
.parallelGateway {
  width: 24px;
  height: 24px;
  background: url('../background/parallelGateway.svg') no-repeat;
  cursor: grab;
}
.exclusiveGateway {
  width: 24px;
  height: 24px;
  background: url('../background/exclusiveGateway.svg') no-repeat;
  cursor: grab;
}
.bpmn-user {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAEFVwZaAAAABGdBTUEAALGPC/xhBQAAAqlJREFUOBF9VM9rE0EUfrMJNUKLihGbpLGtaCOIR8VjQMGDePCgCCIiCNqzCAp2MyYUCXhUtF5E0D+g1t48qAd7CCLqQUQKEWkStcEfVGlLdp/fm3aW2QQdyLzf33zz5m2IsAZ9XhDpyaaIZkTS4ASzK41TFao88GuJ3hsr2pAbipHxuSYyKRugagICGANkfFnNh3HeE2N0b3nN2cgnpcictw5veJIzxmDamSlxxQZicq/mflxhbaH8BLRbuRwNtZp0JAhoplVRUdzmCe/vO27wFuuA3S5qXruGdboy5/PRGFsbFGKo/haRtQHIrM83bVeTrOgNhZReWaYGnE4aUQgTJNvijJFF4jQ8BxJE5xfKatZWmZcTQ+BVgh7s8SgPlCkcec4mGTmieTP4xd7PcpIEg1TX6gdeLW8rTVMVLVvb7ctXoH0Cydl2QOPJBG21STE5OsnbweVYzAnD3A7PVILuY0yiiyDwSm2g441r6rMSgp6iK42yqroI2QoXeJVeA+YeZSa47gZdXaZWQKTrG93rukk/l2Al6Kzh5AZEl7dDQy+JjgFahQjRopSxPbrbvK7GRe9ePWBo1wcU7sYrFZtavXALwGw/7Dnc50urrHJuTPSoO2IMV3gUQGNg87IbSOIY9BpiT9HV7FCZ94nPXb3MSnwHn/FFFE1vG6DTby+r31KAkUktB3Qf6ikUPWxW1BkXSPQeMHHiW0+HAd2GelJsZz1OJegCxqzl+CLVHa/IibuHeJ1HAKzhuDR+ymNaRFM+4jU6UWKXorRmbyqkq/D76FffevwdCp+jN3UAN/C9JRVTDuOxC/oh+EdMnqIOrlYteKSfadVRGLJFJPSB/ti/6K8f0CNymg/iH2gO/f0DwE0yjAFO6l8JaR5j0VPwPwfaYHqOqrCI319WzwhwzNW/aQAAAABJRU5ErkJggg==) center center no-repeat;
  cursor: grab;
}
.bpmn-exclusiveGateway {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAAHeEJUAAAAABGdBTUEAALGPC/xhBQAAAvVJREFUOBGNVEFrE0EU/mY3bQoiFlOkaUJrQUQoWMGePLX24EH0IIoHKQiCV0G8iE1covgLiqA/QTzVm1JPogc9tIJYFaQtlhQxqYjSpunu+L7JvmUTU3AgmTfvffPNN++9WSA1DO182f6xwILzD5btfAoQmwL5KJEwiQyVbSVZ0IgRyV6PTpIJ81E5ZvqfHQR0HUOBHW4L5Et2kQ6Zf7iAOhTFAA8s0pEP7AXO1uAA52SbqGk6h/6J45LaLhO64ByfcUzM39V7ZiAdS2yCePPEIQYvTUHqM/n7dgQNfBKWPjpF4ISk8q3J4nB11qw6X8l+FsF3EhlkEMfrjIer3wJTLwS2aCNcj4DbGxXTw00JmAuO+Ni6bBxVUCvS5d9aa04+so4pHW5jLTywuXAL7jJ+D06sl82Sgl2JuVBQn498zkc2bGKxULHjCnSMadBKYDYYHAtsby1EQ5lNGrQd4Y3v4Zo0XdGEmDno46yCM9Tk+RiJmUYHS/aXHPNTcjxcbTFna000PFJHIVZ5lFRqRpJWk9/+QtlOUYJj9HG5pVFEU7zqIYDVsw2s+AJaD8wTd2umgSCCyUxgGsS1Y6TBwXQQTFuZaHcd8gAGioE90hlsY+wMcs30RduYtxanjMGal8H5dMW67dmT1JFtYUEe8LiQLRsPZ6IIc7A4J5tqco3T0pnv/4u0kyzrYUq7gASuEyI8VXKvB9Odytv6jS/PNaZBln0nioJG/AVQRZvApOdhjj3Jt8QC8Im09SafwdBdvIpztpxWxpeKCC+EsFdS8DCyuCn2munFpL7ctHKp+Xc5cMybeIyMAN33SPL3ZR9QV1XVwLyzHm6Iv0/yeUuUb7PPlZC4D4HZkeu6dpF4v9j9MreGtMbxMMRLIcjJic9yHi7WQ3yVKzZVWUr5UrViJvn1FfUlwe/KYVfYyWRLSGNu16hR01U9IacajXPei0wx/5BqgInvJN+MMNtNme7ReU9SBbgntovn0kKHpFg7UogZvaZiOue/q1SBo9ktHzQAAAAASUVORK5CYII=) center center no-repeat;
  cursor: grab;
}
</style>
