
<script setup>
import LogicFlow from '@logicflow/core'
// 将 xml 转换模块拆开出来
import { BpmnXmlAdapter,BpmnAdapter} from '@/bpmn-adapter';
import '@logicflow/core/dist/style/index.css'
// import '@logicflow/extension/lib/style/index.css'
import { nodeList,whiteNode } from './config'
// import { Snapshot, MiniMap ,Group} from '@logicflow/extension'
import { Group } from '@logicflow/extension/es/materials/group';
import { MiniMap } from '@logicflow/extension/es/components/mini-map';
import { Snapshot } from '@logicflow/extension/es/tools/snapshot';

import { lfJson2Xml } from '@/bpmn-adapter/json2xml';
import { lfXml2Json } from '@/bpmn-adapter/xml2json';
import {delContract as delContractApi, getConnectorDetail, getMyConnector, getUserCompanyNameByid} from "~/api/connect";

import {
  registerStart,
  // registerUser,
  registerEnd,
  // registerPush,
  // registerDownload,
  registerPolyline,
  registerTask,
  // registerConnect,
  // registerUserText,
  // registerApprover,
  // registerApply,
  // registerFinsh,
  // registerJugement,
  registerSend,
  registerReceive,
  registerSubProcess,
  registerParallelGateway,
  registerExclusiveGateway
} from './registerNode'
const route = useRoute();
const extensionElements={
  member_id:'',//协作组织企业id
  member_connector_id:'',//连接器id
  member_connector_task_id:'',//连接器实例id
  main_activity:'',//主活动
  event_action_id:'',//触发事件id
  connector_task_para:{},
  alias_id:''
}
const lf=ref(null)
const lfContainer=ref(null)
const CommonProperty=ref(null)
const emit = defineEmits(['submit'])

// let isGroup='node'
const props=defineProps({
  xmldata: {
    type: Object,
    default: {}
  },
  type:{
    type:String,
    default(){
      return 'read'
    }
  },
  tableData:{
    type:Array,
    default(){
      return []
    }
  },
  showyellow:{
    type:Boolean,
    default:false
  },
  orgAlias:{
    type:Array,
    default(){
      return []
    }
  },
  organizationId:''
})
const staticData=reactive({
  showAddPanel: false,
  showTools:true,
  addPanelStyle: {
    top: 0,
    left: 0
  },
  clickNodeData: null,
  addClickNode: null,
  clickNode: null,
  dialogVisible: false,
  graphData: null,
  dataVisible: false,
  moveData: {},
  nodeList,
  isGroup:'node',
  lock:false,
  nodeData:{},  //存放所有的白名单节点
  jsonData:null, //xml 转换的json
  nodeId:null,
  exclusiveGatewayArray:[],
  edgeDeleteId:'',
  receiveTaskList:[],
  loading:true,
  connectorListNotOpen:[],
  connectorListNotOpenAlert:false,
  connectorListNotOpenResult:null,
  connectorListNotOpenResultOrg:[]
})
const init=()=>{
  lf.value = new LogicFlow({
    background: {
      backgroundColor: '#FFF',
    },
    grid: {
      size: 22,
      visible: true,
      type: 'dot',
      config: {
        color: '#ababab',
        thickness: 1,
      }
    },
    keyboard: {
      enabled: true
    },
    edgeTextDraggable: false,
    hoverOutline: false,
    plugins: [
      Snapshot, MiniMap ,Group,
      BpmnXmlAdapter
    ],
    container: lfContainer.value,
    graph: {
      autoFit: true
    },
    stopMoveGraph: false,
    stopScrollGraph: false,
    // adjustNodePosition:false,
    isSilentMode:props.type==='read',
    nodeTextEdit:false,
    edgeTextEdit:false
  })

  lf.value.setTheme({
    circle: {
      stroke: '#FF6347',
      strokeWidth: 2,
      outlineColor: '#FF6347',
    },
    rect: {
      outlineColor: '#88f',
      strokeWidth: 2,
      radius: 8,
      stroke: '#3CB371'
    },
    polygon: {
      strokeWidth: 2,
      stroke: '#1890ff',
    },
    polyline: {
      stroke: '#7581ff',
      hoverStroke: '#7581ff',
      selectedStroke: '#7581ff',
      outlineColor: '#88f',
      strokeWidth: 2,
    },
    anchorLine: {
      strokeWidth: 2,
      strokeDasharray: '3,2',
    },
    nodeText: {
      color: '#000',
      fontSize:18,
      display:'none'
    },
    edgeText: {
      color: '#333',
      fontSize:24,
      background: {
        fill: '#f7f9ff'
      }
    },
  })
  lf.value.zoom(0.5)
  registerNode()
}
const registerNode=()=>{
  registerStart(lf.value)
  registerTask(lf.value)
  registerReceive(lf.value)
  registerSend(lf.value)
  registerEnd(lf.value)
  registerPolyline(lf.value)
  registerSubProcess(lf.value)
  registerParallelGateway(lf.value)
  registerExclusiveGateway(lf.value)
  render() // 渲染数据
}
const render=()=>{
  LfEvent()
  lf.value.render(props.xmldata.xml)
  if(props.type !== 'create'){
    if(props.xmldata.xml){
      lf.value.render(props.xmldata.xml)
      let array=lf.value.getGraphRawData()
      let nodes=array.nodes
      lf.value.focusOn({
        id: nodes[2]["id"]||nodes[1]["id"]
      })
      showBackgroundColor()
    }else {
      lf.value.render()
    }
  }else {
    if(props.xmldata.xml){
      changeXmlByData(props.xmldata.xml)
    }else {
      lf.value.render()
    }
  }


}
const initLock=()=>{
  setTimeout(()=>{
    staticData.lock=false;
  },1000)
};
const LfEvent=()=>{
  lf.value.on('edge:click', ({data}) => {
    if(staticData.lock){
      return;
    }
    staticData.lock=true;
    initLock()
    console.log(data)
    if(staticData.nodeId.value==data.id){
      return;
    }
    staticData.nodeId=data.id;
    let edgeProperties={}
    edgeProperties.text=data.text&&data.text.value?data.text.value:''
    edgeProperties.id=data.id
    edgeProperties.conditionExpression=data.properties&&data.properties.conditionExpression?data.properties.conditionExpression:''
    staticData.clickNodeData={edgeProperties}
    staticData.isGroup="edge"
    staticData.dialogVisible = true
  })
  lf.value.on('node:click', ({data}) => {
    console.log("node:click",data)
    // 监听node 节点点击事件  回调函数参数为当前节点信息
    if(staticData.lock){
      return;
    }

    staticData.lock=true;
    initLock()
    if(staticData.nodeId==data.id){
      return;
    }
    staticData.nodeId=data.id
    if(!whiteNode.includes(data.type) ){
      return;
    }
    console.log(props.type )
    if(props.type !=='create'){
      return
    }
    let obj={}
    let extensionElements=data.properties.extensionElements&&data.properties.extensionElements['flowable:properties']&&data.properties.extensionElements['flowable:properties']['flowable:property']
      console.log('extensionElements',extensionElements)
    if(extensionElements&&Array.isArray(extensionElements)){
      extensionElements.forEach(vkey=>{

        obj[vkey['-name']]=vkey['-value']?vkey['-value']:'';
      })
    }
    console.log(obj)
    let clickNodeDataObj={
      id:data.id,
      type:data.type,
      extensionElements:obj,
      name:data.text&&data.text.value ||data.properties.name
    }

    if(data.type=="subProcess"){
      staticData.isGroup="subProcess";
      if(data.properties.multiInstanceLoopCharacteristics){
        clickNodeDataObj.groupData={}
        clickNodeDataObj.groupData.loopCardinality=data.properties.multiInstanceLoopCharacteristics.loopCardinality["#text"]||""
        clickNodeDataObj.groupData.isSequential=data.properties.multiInstanceLoopCharacteristics.isSequential
      }else {
        clickNodeDataObj.groupData={loopCardinality:'',"isSequential":"true"}
      }
    }else {
      staticData.isGroup="node"
    }
    staticData.clickNodeData=clickNodeDataObj
    staticData.dialogVisible = true
    nextTick(()=>{
      CommonProperty.value.init()
    })


  })
  lf.value.on('node:drop,edge:adjust', (data) => {
    if(staticData.lock){
      return;
    }
    staticData.lock=true;
    initLock()
    changeData()
    console.log('node:drop')
    emit("submit",{xml:props.xmldata.xml})
  })
  lf.value.on('edge:delete', ({data}) => {
    console.log('edge:delete',staticData.exclusiveGatewayArray,data)
    if(staticData.edgeDeleteId ==data.id){
      return;
    }
    staticData.edgeDeleteId =data.id
    if(data.type="polyline"){
      staticData.exclusiveGatewayArray.forEach((item)=>{
        if(item.line){
          let children= item.line.filter(child=>{
            return child.id!=data.id
          })
          item.line=children
          if(item.line.length==2){
            let lineElse=item.line.filter((line)=>{return !line.value&&line.value!="else"})
            if(lineElse.length){
              lineElse[0].value="else"
              const edgeModel = lf.value.getEdgeModelById(lineElse[0].id);
              edgeModel.updateText("else");
              lf.value.setProperties(item.id, {
                default: lineElse[0].id,
              });
            }
          }
        }
      });
    }
    changeData()
    emit("submit",{xml:props.xmldata.xml})
  })
  lf.value.on('node:dnd-add', ({data}) => {
    if(staticData.lock){
      return;
    }
    if(data.type=="exclusiveGateway"){
      staticData.exclusiveGatewayArray.push({id:data.id})
    }
    staticData.lock=true;
    initLock()
    changeData()
    emit("submit",{xml:props.xmldata.xml})
  })
  lf.value.on('node:delete', ({data}) => {
    if(staticData.lock){
      return;
    }
    if(data.type=="exclusiveGateway"){
      staticData.exclusiveGatewayArray= staticData.exclusiveGatewayArray.filter((item)=>{return item.id!=data.id});
    }
    staticData.lock=true;
    initLock()
    changeData()
    emit("submit",{xml:props.xmldata.xml})
  })
  lf.value.on('edge:add', ({data}) => {
    if(staticData.lock){
      return;
    }
    staticData.lock=true;
    initLock()
    if(data.type="polyline"){
      lf.value.changeEdgeId(data.id, 'Flow_'+data.id.substring(0,8))
      let id=data.id
      data.id='Flow_'+data.id.substring(0,8)
      console.log(JSON.stringify(staticData.exclusiveGatewayArray),data.sourceNodeId)
      let widthLine=staticData.exclusiveGatewayArray.filter((item)=>{return item.id==data.sourceNodeId})
      if(widthLine&&widthLine.length){
        staticData.exclusiveGatewayArray.forEach((item)=>{
          if(data.sourceNodeId==item.id){
            if(item.line&&item.line.length){
              let lineElse=item.line.filter((line)=>{return line.value=="else"})
              if(lineElse.length){
                if(item.line){
                  item.line.push({id:data.id,value:data.text&&data.text.value||""})
                }else{
                  item.line=[{id:data.id,value:data.text&&data.text.value||""}]
                }
              }else{
                if(item.line){
                  item.line.push({id:data.id,value:"else"})
                }else{
                  item.line=[{id:data.id,value:"else"}]
                }
                const edgeModel = this.lf.getEdgeModelById(id);
                edgeModel.updateText("else");
                lf.value.setProperties(data.sourceNodeId, {
                  default: data.id,
                });
              }
            }else{
              item.line=[{id:data.id,value:data.text&&data.text.value||""}]
            }

          }
        })
      }
    }
    changeData()
    emit("submit",{xml:props.xmldata.xml})
  })
  lf.value.on('blank:click', () => {
    hideAddPanel()
  })
}

const changeXmlByData=(xmlData)=>{
  staticData.loading=true
  let jsonData=lfXml2Json(xmlData)
  let orgAlias=props.orgAlias
  let process=jsonData.definitions.process
  let keyIndex0Id=""
  let promiseArray=[]
  Object.keys(process).forEach(async function (key) {
    if (key.indexOf('-') <0) {
      if(whiteNode.includes(key)){
        if(!keyIndex0Id){
          if(Array.isArray(process[key])){
            keyIndex0Id=process[key][0]
          }else {
            keyIndex0Id=process[key]
          }
        }
        if(key==="subProcess"){
          for (const subkey of Object.keys(process[key])) {
            if (subkey.indexOf('-') <0){
              if(whiteNode.includes(subkey)){
                let p=new Promise(async(resolve)=>{
                  let nodeproperty;
                  if(Array.isArray(process[key][subkey])){
                    nodeproperty= process[key][subkey]
                  }else {
                    nodeproperty=[process[key][subkey]]
                  }
                  let connector_ids=null
                  if(!nodeproperty){
                    resolve()
                  }
                  if(subkey==='receiveTask'){
                    console.log(nodeproperty)
                    staticData.receiveTaskList.push(...nodeproperty)
                  }
                  await changeIng(nodeproperty,connector_ids,orgAlias).then(()=>{
                    resolve()
                  })
                })
                promiseArray.push(p)
              }
            }
          }
        }else {
          let p=new Promise(async(resolve)=>{
            let nodeproperty;
            if(Array.isArray(process[key])){
              nodeproperty= process[key]
            }else {
              nodeproperty=[process[key]]
            }
            if(key==='receiveTask'){
              staticData.receiveTaskList.push(...nodeproperty)
            }
            let connector_ids=null
            if(!nodeproperty){
              resolve()
            }
            await changeIng(nodeproperty,connector_ids,orgAlias).then(()=>{
              resolve()
            })
          })
          promiseArray.push(p)
        }

      }else {
        if(key=="exclusiveGateway"){
          staticData.exclusiveGatewayArray.push({id:process[key]['-id']})
        }
        if(key=="sequenceFlow"){
          process[key].forEach(item=>{
            if(staticData.exclusiveGatewayArray.indexOf(item["-sourceRef"])){
              staticData.exclusiveGatewayArray.forEach(exclusiveGateway=>{
                if(exclusiveGateway.id==item["-sourceRef"]){
                  if(exclusiveGateway.line){
                    if(exclusiveGateway.line.indexOf(item["-id"])<0){
                      let  findElse=exclusiveGateway.line.filter(i=>{return i.value=="else"})
                      if(findElse.length ){
                        exclusiveGateway.line.push({id:item["-id"]})
                      }else {
                        exclusiveGateway.line.push({id:item["-id"],value:'else'})
                      }
                    }
                  }else{
                    exclusiveGateway.line=[{id:item["-id"]}]
                  }
                }
              })
            }
          })

        }
      }
    }

  });
  Promise.all(promiseArray).then(()=>{

    staticData.jsonData=jsonData
    let xml=lfJson2Xml(jsonData);
    emit("submit",{xml:xml})
    lf.value.render(xml)
    staticData.loading=false
    LfEvent()
    if(props.type !== 'create'){
      showBackgroundColor()
    }else {
      lf.value.focusOn({
        id: keyIndex0Id["-id"]
      })
      lf.value.selectElementById(keyIndex0Id["-id"], true);
      staticData.nodeId=keyIndex0Id["-id"];
      let dataObj=lf.value.getNodeModelById(keyIndex0Id["-id"])
      if(!whiteNode.includes(dataObj.type) ){
        return;
      }
      if(props.type !=='create'){
        return
      }
      let obj={}
      let extensionElements=dataObj.properties.extensionElements&&dataObj.properties.extensionElements['flowable:properties']&&dataObj.properties.extensionElements['flowable:properties']['flowable:property']
      if(extensionElements&&Array.isArray(extensionElements)){
        extensionElements.forEach(vkey=>{
          obj[vkey['-name']]=vkey['-value']||'';
        })
      }
      let clickNodeData={
        id:dataObj.id,
        type:dataObj.type,
        extensionElements:obj,
        name:dataObj.text&&dataObj.text.value ||''
      }

      if(dataObj.type=="subProcess"){
        staticData.isGroup="subProcess";
        if(dataObj.properties&&dataObj.properties.multiInstanceLoopCharacteristics){
          clickNodeData=  dataObj.properties.multiInstanceLoopCharacteristics
        }else {
          clickNodeData.groupData={loopCardinality:'',"isSequential":"true"}
        }
      }else {
        staticData.isGroup="node"
      }
      staticData.clickNodeData=clickNodeData
      staticData.dialogVisible = true
      console.log(staticData.clickNodeData,staticData.dialogVisible,staticData.isGroup)
      nextTick(()=>{
        CommonProperty.value.init()
      })
      if(staticData.connectorListNotOpen.length>0){
        staticData.connectorListNotOpenAlert=true;
        const resultData=staticData.connectorListNotOpen.reduce((acc, currentValue) => {
          const org_name = currentValue.org.aliasName;
          if (!acc[org_name]) {
            acc[org_name] = [];
          }
          console.log(JSON.stringify(acc[org_name]).indexOf(currentValue.connector_name))
          if(JSON.stringify(acc[org_name]).indexOf(currentValue.connector_name)<0){
            acc[org_name].push(currentValue);
          }
          return acc;
        }, {});
        Object.keys(resultData).forEach(((key,index)=>{
          if(key===props.orgAlias[0].aliasName){
            staticData.connectorListNotOpenResultCurrent=resultData[key];
          }else {
            staticData.connectorListNotOpenResultOrg.push(resultData[key])
          }
        }))
        staticData.connectorListNotOpenResult=resultData;
      }
    }
  })
}
const  changeIng= async( nodeproperty,connector_ids,orgAlias)=>{
  for (const nodepropertys of nodeproperty) {
    await changeParams(nodepropertys,connector_ids,orgAlias)
  }
}
const changeParams=async(n,connector_ids,orgAlias)=>{
  let nodepropertys=n.extensionElements&&n.extensionElements['flowable:properties']['flowable:property']
  return   new Promise(async (r)=>{
    let alias_id=''
    let org_id=''
    let org=''
    for (const v of Object.keys(nodepropertys)) {
      if( nodepropertys[v]['-name']==='connector_id'){
        connector_ids=nodepropertys[v]
      }
      if( nodepropertys[v]['-name']=='alias_id'){
        if(!nodepropertys[v]['-value']){
          alias_id=''
          nodepropertys[v]['-value']=orgAlias&&orgAlias.length?orgAlias[0].aliasId:''
        }else {
          alias_id=nodepropertys[v]['-value']
        }
      }
      if( nodepropertys[v]['-name']=='member_id'){
        if(!nodepropertys[v]['-value']){
          if(alias_id){
            let orgAliasIndex=orgAlias.findIndex((s)=>{return s.aliasId==alias_id})
            nodepropertys[v]['-value']=orgAlias[orgAliasIndex].collaborationOrgId
            org_id= nodepropertys[v]['-value']
            let orgDetail= await  getUserCompanyNameByid({ids:orgAlias[orgAliasIndex].collaborationOrgId});
            org=Object.assign({},orgAlias[orgAliasIndex],orgDetail.result[0]) ;

          }else {
            nodepropertys[v]['-value']=orgAlias&&orgAlias.length?orgAlias[0].collaborationOrgId:''
            org_id= nodepropertys[v]['-value']
            let orgDetail= await  getUserCompanyNameByid({ids:orgAlias[0].collaborationOrgId});
            org=Object.assign({},orgAlias[0],orgDetail.result[0]) ;
          }
        }
      }

      if(nodepropertys[v]['-name']=='connector_task_para'){
        if(nodepropertys[v]['-value']){
          nodepropertys[v]['-value'].replaceAll('"',"&#34;")
        }
      }
    }
    // r()
    if(connector_ids&&connector_ids['-value']){
      const res= await  getMyConnector({connector_id:connector_ids['-value'],org_id:org_id})
      Object.keys(nodepropertys).forEach(vchild=>{
        if(nodepropertys[vchild]['-name']=='member_connector_id'){
          if(!nodepropertys[vchild]['-value']){
            nodepropertys[vchild]['-value']=res.data[0]?res.data[0].org_connector_id:'';
          }
        }
      })
      if(res.data.length<=0){
        let connectorDetails=  await getConnectorDetail(connector_ids['-value'])
        staticData.connectorListNotOpen.push(Object.assign({},connectorDetails.data,{org:org}) )
      }
      r()
    }else {
      r()
    }
  })
}
const showBackgroundColor=()=>{
  if (props.showyellow){
    lf.value.fitView(50,50);
    const data = lf.value.getGraphRawData()
    let arr =  data.nodes.filter(item=>props.tableData.some(data=>data.activityId == item.id))
    arr.forEach(item=>{
      lf.value.setProperties(item.id, {
        backgroundColor:'#ffff00B3'
      });
    })
  }
}
const changeData=()=>{
  props.xmldata.xml=getData()
}
const getData=()=>{
  const data = lf.value.getGraphRawData()
  let bpmnAdapterOutJSON=BpmnAdapter.adapterOut(data)
  let  process=bpmnAdapterOutJSON.process
  let demoJson=JSON.parse( sessionStorage.getItem('adapterIn'))
  demoJson.definitions['bpmndi:BPMNDiagram']['bpmndi:BPMNPlane']['bpmndi:BPMNEdge']=bpmnAdapterOutJSON['bpmndi:BPMNPlane']['bpmndi:BPMNEdge']||[]
  demoJson.definitions['bpmndi:BPMNDiagram']['bpmndi:BPMNPlane']['bpmndi:BPMNShape']=bpmnAdapterOutJSON['bpmndi:BPMNPlane']['bpmndi:BPMNShape']||[]
  Object.keys(  demoJson.definitions.process).forEach(key=>{
    if(key.indexOf('-') <0) {
      delete demoJson.definitions.process[key]
    }
  })
  Object.keys( process).forEach(key=>{
    if(key.indexOf('-') <0) {
      demoJson.definitions.process[key]=process[key]
    }
  })
  let result= lfJson2Xml(demoJson)
  return result
}
const formChange=(data)=>{
  if(data.extensionElements&&staticData.isGroup=='node'){
    let extensionElements= data.extensionElements
    let obj=[]
    Object.keys(extensionElements).forEach((key,index)=>{
      if(key=='connector_task_para'){
        console.log(JSON.stringify(extensionElements[key]))
        obj.push({'-name':key,'-value':JSON.stringify(extensionElements[key]).replaceAll('"',"&#34;")})

      }else {
        obj.push({'-name':key,'-value':extensionElements[key]})
      }
    })
    let  getGraphData = lf.value.getGraphData()
    let nodes=getGraphData.nodes
    let findNode= nodes.filter(v=>{return v.id==data.id})
    if(!findNode[0]['properties']['extensionElements']){
      findNode[0]['properties']['extensionElements']={"flowable:properties":{'flowable:property':obj}}
    }else {
      findNode[0]['properties']['extensionElements']['flowable:properties']['flowable:property']=obj
    }
    lf.value.setProperties(data.id, {extensionElements:findNode[0]['properties']['extensionElements'],name:data.name});
  }else if(staticData.isGroup=="subProcess"){
    lf.value.setProperties(data.id, {multiInstanceLoopCharacteristics:{isSequential:data.groupData.isSequential,loopCardinality:{"#text":data.groupData.loopCardinality,"-xsi:type":"tFormalExpression"}}});
  }else {
    const edgeModel = lf.value.getEdgeModelById(data.edgeProperties.id);
    if(data.edgeProperties.text){
      edgeModel.updateText(data.edgeProperties.text);
    }
    if(data.edgeProperties.conditionExpression){
      edgeModel.setProperties({
        conditionExpression:data.edgeProperties.conditionExpression
      })
    }

  }
  props.xmldata.xml=getData()
  window.setTimeout(()=>{
    nextTick(()=>{
      lf.value.render(getData())
      ElMessage.success('保存成功')
      lf.value.selectElementById(data.id, true);
      emit("submit",{xml:props.xmldata.xml})
      if(data.type=== "receiveTask"){
        let index=  staticData.receiveTaskList.findIndex((item)=>{return item['-id']===data.id})
        if(index>=0){
          staticData.receiveTaskList[index].checked=true
        }
      }
    })
  },1)

}
const closeDialog=()=>{

}
const hideAddPanel=()=>{
  staticData.showAddPanel = false
  staticData.addPanelStyle.top = 0
  staticData.addPanelStyle.left = 0
  staticData.addClickNode = null
}
const  checkReceiveTask=()=>{
  try {
    staticData.receiveTaskList.forEach(item=>{
      if(!item.checked){
        if(item['extensionElements']&&item['extensionElements']['flowable:properties']&&item['extensionElements']['flowable:properties']['flowable:property']){
          let JsonArray=item['extensionElements']['flowable:properties']['flowable:property'];
          let keywords=['alias_id',"member_id","event_action_id","connector_id","member_connector_id"]
          JsonArray.forEach(jsonItem=>{
            if(keywords.indexOf(jsonItem['-name'])>=0){
              if(!jsonItem['-value']){
                throw item
              }
            }else if(jsonItem['-name']==="connector_task_para"&& !jsonItem['-value']){
              throw item
            }
          })
        }else {
          throw item
        }
      }
    })
    return true
  }catch (e) {
    ElMessage.error(`${e['-name']}信息不完整，请检查后保存！`)
    return false
  }
}
const loadingControl=()=>{
  staticData.loading=false
}
const link_a=(id)=>{
  window.open('/connect/shop/connectSystemDetail?titleShow=true&index='+id)
}
const deleteContract=()=>{
  ElMessageBox.confirm("确定删除当前的合约?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  }).then((res) => {

    staticData.loading=true
    delContractApi(route.query.id).then((res) => {
      if (res.code == "0000") {
        location.href='/workbench/connect/myContract?titleShow=true'
        setTimeout(()=>{
          staticData.loading=false
          ElMessage.success("删除成功");
        },2000)
      }
    })
  });
}
defineExpose({
  checkReceiveTask
})
onMounted(()=>{
  nextTick(()=>{
    init()
  })
})
</script>

<template>
  <div class="logic-flow-view" >
    <ConnectLogicLFComponentsControl
      class="demo-control"
      v-if="props.type != 'create'"
      :lf="lf"
    ></ConnectLogicLFComponentsControl>
    <ConnectLogicLFComponentsNodePanel v-if="lf&&staticData.showTools&&props.type=='create'" :lf="lf" :nodeList="nodeList"></ConnectLogicLFComponentsNodePanel>
    <div id="LF-view" ref="lfContainer"></div>
    <ConnectLogicPropertySettingCommonProperty
        ref="CommonProperty"
        v-if="staticData.dialogVisible&&staticData.clickNodeData"
        :node-data="staticData.clickNodeData"
        :orgAlias="props.orgAlias"
        :isGroup="staticData.isGroup"
        :organizationId="props.organizationId"
        :lf="lf"
        @formChange="formChange"
        @closeDialog="closeDialog"
        @loadingControl="loadingControl"
        @setPropertiesFinish="closeDialog"></ConnectLogicPropertySettingCommonProperty>
  </div>

  <el-dialog v-model="staticData.connectorListNotOpenAlert" title="提示" width="390" center>
   <p>
     您或者您的协作组织尚有连接器未开通，请先开通后再重新创建合约。 </p>
    <p>您需要开通的连接器:<span @click="link_a(item.connector_id)" class="link_a"  v-for="item in staticData.connectorListNotOpenResultCurrent">{{item.connector_name}}</span></p>
    <div v-for="item in staticData.connectorListNotOpenResultOrg">
      <p v-for="sitem in item">【{{sitem.org.memberName}}】需开通连接器:<span class="link_span">{{sitem.connector_name}}</span></p>

     请联系您的协作组织开通对应连接器!
    </div>
    <p>
      <el-button type="primary" @click="staticData.connectorListNotOpenAlert=false"  style="width: 350px;height: 30px;margin-top: 30px">继续编辑合约</el-button>

    </p>
    <p>
      <el-button @click="deleteContract" type="primary"  style="width: 350px;height: 30px;margin-top: 10px;background-color: #fff;color: #2B58CD">删除合约，待连接器开通后重新创建合约</el-button>
    </p>
  </el-dialog>
  <Loading v-if="staticData.loading&&props.type!='read'"></Loading>
</template>


<style scoped>
.logic-flow-view {
  height: 100vh;
  position: relative;
}
.link_a{
  margin-left: 5px;
  color: #3D5AFE;
  text-decoration: underline;
  cursor: pointer;
}
.link_span{
  margin-left: 5px;
}
#LF-view{
  width: 100%;
  height: 100%;
  outline: none;
  /*margin-left: 50px;*/
}

.demo-control{
  position: absolute;
  top: 50px;
  right: 50px;
  z-index: 2;
}
</style>
