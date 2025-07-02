var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
import { getBpmnId } from './bpmnIds';
import { lfJson2Xml } from './json2xml';
import { lfXml2Json } from './xml2json';
import { ExclusiveGatewayConfig, StartEventConfig, EndEventConfig, ServiceTaskConfig, UserTaskConfig, } from './constant';
var BpmnElements;
(function (BpmnElements) {
    BpmnElements["START"] = "startEvent";
    BpmnElements["SENDTASK"] = "sendTask";
    BpmnElements["END"] = "endEvent";
    BpmnElements["GATEWAY"] = "bpmn:exclusiveGateway";
    BpmnElements["USER"] = "bpmn:userTask";
    BpmnElements["SYSTEM"] = "bpmn:serviceTask";
    BpmnElements["FLOW"] = "sequenceFlow";
})(BpmnElements || (BpmnElements = {}));
var defaultAttrs = ['-name', '-id', 'incoming', 'outgoing', '-sourceRef', '-targetRef',"startEvent","endEvent","sendTask","receiveTask"];
let whiteNode=["startEvent","endEvent","sendTask","receiveTask"]

/**
 * 将普通json转换为xmljson
 * xmljson中properity会以“-”开头
 * 如果没有“-”表示为子节点
 */
function toXmlJson(json) {
    var xmlJson = {};
  // console.log(json)
    Object.entries(json).forEach(function (_a) {
        var _b = __read(_a, 2), key = _b[0], value = _b[1];
      // console.log(key)
        if (typeof value !== 'object') {
            if (key.indexOf('-') === 0) { // 如果本来就是“-”开头的了，那就不处理了。

              if(key!='backgroundColor'){
                xmlJson[key] = value;
              }

            }
            else {
              if(key=="conditionExpression"){
                xmlJson[key] = value;
              }else if(key=='loopCardinality'){
                xmlJson[ key] = value;
              }else if( key.indexOf('#') === 0){
                xmlJson[ key] = value;
              }
              else if(key!='backgroundColor'){
                xmlJson["-" + key] = value;
              }

            }
        }
        else if(Array.isArray(value)){
          // console.log(key,value)
          xmlJson[key]=value
        }
        else {

            xmlJson[key] = toXmlJson(value);
        }
    });
    return xmlJson;
}
/**
 * 将xmlJson转换为普通的json，在内部使用。
 */
function toNormalJson(xmlJson) {
  // console.log('toNormalJson',xmlJson)
    var json = {};
    Object.entries(xmlJson).forEach(function (_a) {
        var _b = __read(_a, 2), key = _b[0], value = _b[1];

        if (typeof value === 'string') {
            if (key.indexOf('-') === 0) { // 如果本来就是“-”开头的了，那就不处理了。
                json[key.substr(1)] = value;
            }
            else {
                json[key] = value;
            }
        }
        else if(Array.isArray(value)){
          // console.log(value,key)
          let array=[]
          value.forEach(item=>{
            array.push(item)
          })
          json[key]=array
        }
        else if (typeof value === 'object') {
          // console.log('object',value)
            json[key] = toNormalJson(value);
        }
        else {
            json[key] = value;
        }
    });
  // console.log(json,88888888888)
    return json;
}

/*
* convertLf2ProcessData提取生成节点属性
* */
function  nodeChange(node,parent,nodeMap) {
  var _a;
  var processNode = {
    '-id': node.id,
  };
  if ((_a = node.text) === null || _a === void 0 ? void 0 : _a.value) {
    processNode['-name'] = node.text.value;
  }

  if (node.properties) {
    var properties = toXmlJson(node.properties);
    // console.log('properties',properties)
    Object.assign(processNode, properties);
  }

  nodeMap.set(node.id, processNode);
  if (!parent[node.type]) {
    parent[node.type] = processNode; // 如果只有一个子元素，json中表示为正常属性
  }
  else if (Array.isArray(parent[node.type])) { // 如果是多个子元素，json中使用数组存储
    parent[node.type].push(processNode);
  }
  else { // 如果是多个子元素，json中使用数组存储
    parent[node.type] = [
      parent[node.type],
      processNode,
    ];
  }

}
/**
 * 设置bpmn process信息
 * 目标格式请参考examples/bpmn.json
 * bpmn因为是默认基于xml格式的，其特点与json存在差异。
 * 1) 如果是xml的属性，json中属性用'-'开头
 * 2）如果只有一个子元素，json中表示为正常属性
 * 3）如果是多个子元素，json中使用数组存储
 */
function convertLf2ProcessData(bpmnProcessData, data,sub) {
    var nodeMap = new Map();
  console.log(data)
  // 拆分节点
  let subProcessNode=[],newNodesWithOutSubProcessNode=[];
  data.nodes.forEach(item=>{
    if(item.type==="subProcess"){ // 找到subProcess的数组
      subProcessNode.push(item)
    }else { // 找到不带subProcess数组
      newNodesWithOutSubProcessNode.push(item)
    }
  })


  console.log('subProcessNode',subProcessNode)
  console.log('newNodesWithOutSubProcessNode',newNodesWithOutSubProcessNode)
    if(subProcessNode.length){

      var len = newNodesWithOutSubProcessNode.length-1;

      for (let i=len;i>0;i--){
        subProcessNode.forEach(subNode=>{
          if(subNode.children.includes(newNodesWithOutSubProcessNode[i].id)){
            /*if(!subNode['sub-'+newNodesWithOutSubProcessNode[i].type]){
              subNode['sub-'+newNodesWithOutSubProcessNode[i].type]=newNodesWithOutSubProcessNode[i]


            }else if (Array.isArray(subNode['sub-'+newNodesWithOutSubProcessNode[i].type])) { // 如果是多个子元素，json中使用数组存储
              subNode['sub-'+newNodesWithOutSubProcessNode[i].type].push(newNodesWithOutSubProcessNode[i]);

            } else { // 如果是多个子元素，json中使用数组存储
              subNode['sub-'+newNodesWithOutSubProcessNode[i].type] = [
                subNode['sub-'+newNodesWithOutSubProcessNode[i].type],
                newNodesWithOutSubProcessNode[i],
              ];
            }
            nodeMap.set('sub-'+newNodesWithOutSubProcessNode[i].id, newNodesWithOutSubProcessNode[i]);*/
            nodeChange(newNodesWithOutSubProcessNode[i],subNode,nodeMap)
            newNodesWithOutSubProcessNode.splice(i,1);
          }
        })
      }


    }

  console.log(newNodesWithOutSubProcessNode,subProcessNode,88888888888888)
    let newData=[...newNodesWithOutSubProcessNode,...subProcessNode]
  console.log(newData)
  // return
  newData.forEach(function (node) {
        var _a;
        var processNode = {
            '-id': node.id,
        };
        if ((_a = node.text) === null || _a === void 0 ? void 0 : _a.value) {
          processNode['-name'] = node.text.value;
        }

        // processNode['-name'] = node.properties.name;
        Object.keys(node).forEach(key=>{
          if(whiteNode.includes(key)){
            processNode[key]=node[key]
          }
        })
        if (node.properties) {
            var properties = toXmlJson(node.properties);
          // console.log('properties',properties)
            Object.assign(processNode, properties);
        }

        nodeMap.set(node.id, processNode);
        if (!bpmnProcessData[node.type]) {
            bpmnProcessData[node.type] = processNode; // 如果只有一个子元素，json中表示为正常属性
        }
        else if (Array.isArray(bpmnProcessData[node.type])) { // 如果是多个子元素，json中使用数组存储
            bpmnProcessData[node.type].push(processNode);
        }
        else { // 如果是多个子元素，js
          // on中使用数组存储
            bpmnProcessData[node.type] = [
                bpmnProcessData[node.type],
                processNode,
            ];
        }


    });
  console.log('bpmnProcessData1',bpmnProcessData)
    var sequenceFlow = data.edges.map(function (edge) {
        var _a, _b;
        var targetNode = nodeMap.get(edge.targetNodeId);
        // @see https://github.com/didi/LogicFlow/issues/325
        // 需要保证incomming在outgoing之前
        if (!targetNode['incoming']) {
            targetNode['incoming'] = edge.id;
        }
        else if (Array.isArray(targetNode['incoming'])) {
            targetNode['incoming'].push(edge.id);
        }
        else {
            targetNode['incoming'] = [
                targetNode['incoming'],
                edge.id,
            ];
        }
        var sourceNode = nodeMap.get(edge.sourceNodeId);
        // if(!sourceNode){
        //   sourceNode= nodeMap.get('sub-'+edge.sourceNodeId);
        // }
      if (!sourceNode['outgoing']) {
        sourceNode['outgoing'] = edge.id;
      }
      else if (Array.isArray(sourceNode['outgoing'])) {
        sourceNode['outgoing'].push(edge.id);
      }
      else { // 字符串转数组
        sourceNode['outgoing'] = [
          sourceNode['outgoing'],
          edge.id,
        ];
      }

      var edgeConfig = {
        '-id': edge.id,
        '-sourceRef': edge.sourceNodeId,
        '-targetRef': edge.targetNodeId,
      };
      if ((_a = edge.text) === null || _a === void 0 ? void 0 : _a.value) {
        edgeConfig['-name'] = (_b = edge.text) === null || _b === void 0 ? void 0 : _b.value;
      }
      if (edge.properties) {
        var properties = toXmlJson(edge.properties);
        Object.assign(edgeConfig, properties);
      }
      return edgeConfig;

    });

    // sequenceFlow.forEach(i=>{
    //   subProcessNode.forEach(s=>{
    //     Object.keys(s).forEach(m=>{
    //       if(whiteNode.includes(m)){
    //         let str=s[m].toString()
    //         if(s[m]['-id']==i['-targetRef']||s[m]['-id']==i['-sourceRef']){
    //           subProcessSequenceFlow.push(i)
    //         }
    //       }
    //     })
    //   })
    //
    //
    // })
  let newsequenceFlow=[]
  console.log('subProcessSequenceFlowbpmnProcessData',bpmnProcessData)
  Object.keys(bpmnProcessData).forEach(item=>{
    if(item==="subProcess"){ // 找到subProcess的数组
      // console.log(bpmnProcessData[item])
      let subProcessSequenceFlow=[]
      Object.keys(bpmnProcessData[item]).forEach(m=>{
        if(whiteNode.includes(m)){

          sequenceFlow.forEach((a,index)=>{
            let str=JSON.stringify(bpmnProcessData[item][m])
            // console.log(m,a['-targetRef'],a['-sourceRef'])

            if(str.indexOf(a['-targetRef'])>=0||str.indexOf(a['-sourceRef'])>=0){
              // console.log('************************************************************999999999999999999999')
              if(!subProcessSequenceFlow.includes(a)){
                subProcessSequenceFlow.push(a)
              }

            }
          })
          bpmnProcessData[item][BpmnElements.FLOW]=subProcessSequenceFlow
          let newarray=[]
          if(subProcessSequenceFlow.length){
            newarray =sequenceFlow.filter(v => !subProcessSequenceFlow.find((item) => item['-id'] === v['-id']))

          }else {
            newarray=sequenceFlow
          }
          newsequenceFlow=newarray
          // console.log("subProcessSequenceFlow",subProcessSequenceFlow)
          // console.log("subProcessSequenceFlownewarray",newarray)

        }
      })

    }
  })


  // console.log('************************************************************88888888888888',newsequenceFlow)
  // console.log('************************************************************00000000000000000000',sequenceFlow)
  //
    bpmnProcessData[BpmnElements.FLOW] = newsequenceFlow.length?newsequenceFlow:sequenceFlow;

  console.log('bpmnProcessData',bpmnProcessData)
}
/**
 * adapterOut 设置bpmn diagram信息
 */
function convertLf2DiagramData(bpmnDiagramData, data) {


    bpmnDiagramData['bpmndi:BPMNEdge'] = data.edges.map(function (edge) {
        var _a;
        var edgeId = edge.id;
        var pointsList=[]
        if(edge.startPoint&&edge.endPoint&&edge.pointsList.length<=2){
          pointsList=[{"-x":edge.startPoint.x,"-y":edge.startPoint.y},{"-x":edge.endPoint.x,"-y":edge.endPoint.y}]
          console.log("pointsListpointsListpointsList",pointsList)
        }else {
          pointsList = edge.pointsList.map(function (_a) {
            var x = _a.x, y = _a.y;
            return ({ '-x': x, '-y': y });
          });
        }
        // var pointsList = edge.pointsList.map(function (_a) {
        //     var x = _a.x, y = _a.y;
        //     return ({ '-x': x, '-y': y });
        // });
        var diagramData = {
            '-id': edgeId + "_di",
            '-bpmnElement': edgeId,
            'omgdi:waypoint': pointsList,
        };
        if ((_a = edge.text) === null || _a === void 0 ? void 0 : _a.value) {
            diagramData['bpmndi:BPMNLabel'] = {
                'omgdc:Bounds': {
                    '-x': edge.text.x - (edge.text.value.length * 10) / 2,
                    '-y': edge.text.y - 7,
                    '-width': edge.text.value.length * 10,
                    '-height': 14,
                },
            };
        }
        return diagramData;
    });
    bpmnDiagramData['bpmndi:BPMNShape'] = data.nodes.map(function (node) {
        var _a;
        var nodeId = node.id;
        var width = 100;
        var height = 80;
        var x = node.x, y = node.y;


        // bpmn坐标是基于左上角，LogicFlow基于中心点，此处处理一下。
        var shapeConfig = BpmnAdapter.shapeConfigMap.get(node.type);
        if (shapeConfig) {
            width = shapeConfig.width;
            height = shapeConfig.height;

        }
      if(node.type=="subProcess"){
        console.log("subProcesssubProcesssubProcesssubProcesssubProcesssubProcess",node)
        width = node.properties&&node.properties.nodeSize&&node.properties.nodeSize.width||1440;
        height = node.properties&&node.properties.nodeSize&&node.properties.nodeSize.height||320;
        delete node.properties.nodeSize
      }
      if (node.type === 'startEvent'||node.type === 'endEvent'){
         x -= width / 2;
         y -= height / 2;
      }
        var diagramData = {
            '-id': nodeId + "_di",
            '-bpmnElement': nodeId,
            'omgdc:Bounds': {
                '-x': x,
                '-y': y,
                '-width': width,
                '-height': height,
            },
        };
      if(node.type=="subProcess"){

        diagramData["-isExpanded"]=true
        // console.log(diagramData)
      }
        if ((_a = node.text) === null || _a === void 0 ? void 0 : _a.value) {
            diagramData['bpmndi:BPMNLabel'] = {
                'omgdc:Bounds': {
                    '-x': node.text.x - (node.text.value.length * 10) / 2,
                    '-y': node.text.y - 7,
                    '-width': node.text.value.length * 10,
                    '-height': 14,
                },
            };
        }
      console.log('diagramDatadiagramDatadiagramDatadiagramData',diagramData)
        return diagramData;
    });
}
/**
 * 将bpmn数据转换为LogicFlow内部能识别数据
 */
function convertBpmn2LfData(bpmnData) {
    var nodes = [];
    var edges = [];
    var definitions = bpmnData['definitions'];
    var process={}
    var diagram={}
    if (definitions) {
        var process_1 = definitions['process'];
        // 针对subprocess节点做转换，分离出组里面的所有节点
        Object.keys(process_1).forEach(function (key) {
          if(key=='subProcess'){
            let subProcess=process_1[key]
            let BPMNShape=definitions['bpmndi:BPMNDiagram']["bpmndi:BPMNPlane"]["bpmndi:BPMNShape"]
            let findeBPMNShape=  BPMNShape.filter((i)=>{return i["-bpmnElement"]==process_1[key]['-id']});
            console.log("findeBPMNShapefindeBPMNShape",findeBPMNShape)
            if(findeBPMNShape){
              process_1[key].nodeSize={"-width": findeBPMNShape[0]["omgdc:Bounds"]["-width"], "-height":  findeBPMNShape[0]["omgdc:Bounds"]["-height"]}
            }
            Object.keys(subProcess).forEach(subNode=>{
              if (whiteNode.includes(subNode)) {
                console.log(subNode,'***************')
                if(!definitions['process'][subNode]){
                  definitions['process'][subNode] = subProcess[subNode]; // 如果只有一个子元素，json中表示为正常属性
                  if(subProcess.children){
                    subProcess.children.push(subProcess[subNode]['-id'])
                  }else {
                    subProcess.children=[subProcess[subNode]['-id']]
                  }

                } else if (Array.isArray(definitions['process'][subNode])) { // 如果是多个子元素，json中使用数组存储
                  if(Array.isArray(subProcess[subNode])){

                    let ids=[]
                    subProcess[subNode].forEach(xitem=>{
                      ids.push(xitem['-id'])
                    })

                    definitions['process'][subNode].push(...subProcess[subNode]);


                    if(subProcess.children){
                      subProcess.children.push(...ids)
                    }else {
                      subProcess.children=ids
                    }
                  }else {
                    definitions['process'][subNode].push(subProcess[subNode]);
                    // subProcess.children.push(subProcess[subNode]['-id'])
                    if(subProcess.children){
                      subProcess.children.push(subProcess[subNode]['-id'])
                    }else {
                      subProcess.children=[subProcess[subNode]['-id']]
                    }
                  }

                }else { // 如果是多个子元素，json中使用数组存储

                  if(Array.isArray(subProcess[subNode])){
                    definitions['process'][subNode] = [
                      definitions['process'][subNode],
                      ...subProcess[subNode]
                    ];

                    let ids=[]
                    subProcess[subNode].forEach(xitem=>{
                      ids.push(xitem['-id'])
                    })
                    // subProcess.children.push(...ids)
                    if(subProcess.children){
                      subProcess.children.push(...ids)
                    }else {
                      subProcess.children=ids
                    }
                  }else {
                    definitions['process'][subNode] = [
                      definitions['process'][subNode],
                      subProcess[subNode]
                    ];
                    // subProcess.children.push(subProcess[subNode]['-id'])
                    if(subProcess.children){
                      subProcess.children.push(subProcess[subNode]['-id'])
                    }else {
                      subProcess.children=[subProcess[subNode]['-id']]
                    }
                  }

                }
              }else if(subNode=="sequenceFlow"){
                definitions['process'][subNode].push( ...subProcess[subNode])
                delete subProcess[subNode]
              }
            })
          }

        })

      console.log("转换子流程过后的数据",process_1)

        Object.keys(process_1).forEach(function (key) {

            if (key.indexOf('-') <0) {
                var value = process_1[key];
              // console.log(key, BpmnElements.FLOW)
                if (key === BpmnElements.FLOW) {
                    var bpmnEdges = definitions['bpmndi:BPMNDiagram']['bpmndi:BPMNPlane']['bpmndi:BPMNEdge'];
                  // console.log(bpmnEdges)
                    edges = getLfEdges(value, bpmnEdges);
                }
                else {

                    var shapes = definitions['bpmndi:BPMNDiagram']['bpmndi:BPMNPlane']['bpmndi:BPMNShape'];
                    nodes = nodes.concat(getLfNodes(value, shapes, key));
                }
            }else {
              // console.log(key)
              process[key]= process_1[key]
            }
        });
        let diagram_1=definitions['bpmndi:BPMNDiagram']
        Object.keys(diagram_1).forEach(function (key) {
          if (key.indexOf('-') >=0) {
            diagram[key]= diagram_1[key]
          }
        });
    }

  console.log('分离',{
    nodes: nodes,
    edges: edges

  })
    // 处理分离出来的节点，和组subprocess产生关联
    nodes.forEach((item)=>{
      if(item.type=="subProcess"){
        if(item.properties){
          let properties=item.properties
          Object.keys(properties).forEach(sub=>{
            if(whiteNode.includes(sub)){
              console.log(properties[sub]['id']||properties[sub]['-id'])
              let children=[]
              if(Array.isArray(properties[sub])){
                if(item.children ){
                  let ids=[]
                  properties[sub].forEach(i=>{
                    ids.push(i.id||i['-id'])
                  })
                  item.children = item.children.concat(ids)
                }else{
                  item.children = properties[sub].filter(item=>{return item.id||item['-id']})
                }

              }else {
                if (item.children){
                  item.children.push(properties[sub]['id']||properties[sub]['-id'])

                }else {
                  item.children=[properties[sub]['id']||properties[sub]['-id']]
                }

              }
              // if(!item.children){
              //   item.children=[properties[sub]['id']||properties[sub]['-id']]
              // }else {
              //   item.children.push(properties[sub]['id']||properties[sub]['-id'])
              // }

            }
          })
        }
      }
    })

    sessionStorage.setItem('nodes',JSON.stringify({ process:process, diagram:diagram}))
    return {
        nodes: nodes,
        edges: edges

    };
}
function getLfNodes(value, shapes, key) {
    var nodes = [];
  // console.log(value)
    if (Array.isArray(value)) { // 数组

        value.forEach(function (val) {
            var shapeValue;
            if (Array.isArray(shapes)) {
                shapeValue = shapes.find(function (shape) { return shape['-bpmnElement'] === val['-id']; });
            }
            else {
                shapeValue = shapes;
            }
            var node = getNodeConfig(shapeValue, key, val);
            nodes.push(node);
        });
    }
    else {
        var shapeValue = void 0;
        if (Array.isArray(shapes)) {
            shapeValue = shapes.find(function (shape) { return shape['-bpmnElement'] === value['-id']; });
        }
        else {
            shapeValue = shapes;
        }
        var node = getNodeConfig(shapeValue, key, value);
        nodes.push(node);
    }
    return nodes;
}
function getNodeConfig(shapeValue, type, processValue) {
    var x = Number(shapeValue['omgdc:Bounds']['-x']);
    var y = Number(shapeValue['omgdc:Bounds']['-y']);
    var name = processValue['-name'];
    var shapeConfig = BpmnAdapter.shapeConfigMap.get(type);
    if (shapeConfig) {
        x += shapeConfig.width / 2;
        y += shapeConfig.height / 2;
    }
    var properties;
    var children;
  // console.log(processValue)
    // 判断是否存在额外的属性，将额外的属性放到properties中
    Object.entries(processValue).forEach(function (_a) {
        var _b = __read(_a, 2), key = _b[0], value = _b[1];
        if (defaultAttrs.indexOf(key) === -1) {
          if(type=="subProcess"){
            console.log(processValue)
            if(key=="children"){
              children=value
            }else {
              if (!properties){
                properties = {};
                properties[key] = value;
              }else {
                properties[key] = value;
              }

            }
          }else {
            console.log('properties',type,key,value)

            if (!properties){
              properties = {};
              properties[key] = value;
            }else {
              properties[key] = value;
            }

          }
        }
    });
    if (properties) {
        properties = toNormalJson(properties);
    }
  console.log('toNormalJson(properties)',properties)
    var text;
    if (name) {
        text = {
            x: x,
            y: y,
            value: name,
        };
        // 自定义文本位置
        if (shapeValue['bpmndi:BPMNLabel'] && shapeValue['bpmndi:BPMNLabel']['omgdc:Bounds']) {
            var textBounds = shapeValue['bpmndi:BPMNLabel']['omgdc:Bounds'];
            text.x = Number(textBounds['-x']) + Number(textBounds['-width']) / 2;
            text.y = Number(textBounds['-y']) + Number(textBounds['-height']) / 2;
        }
    }
    var nodeConfig = {
        id: shapeValue['-bpmnElement'],
        type: type,
        x: x,
        y: y,
        properties: properties,
    };
    if(children){
      nodeConfig.children = children;
    }
    if (text) {
        nodeConfig.text = text;
    }
    return nodeConfig;
}
function getLfEdges(value, bpmnEdges) {
    var edges = [];
    if (Array.isArray(value)) {
        value.forEach(function (val) {
            var edgeValue;
            if (Array.isArray(bpmnEdges)) {
                edgeValue = bpmnEdges.find(function (edge) { return edge['-bpmnElement'] === val['-id']; });
            }
            else {
                edgeValue = bpmnEdges;
            }
            edges.push(getEdgeConfig(edgeValue, val));
        });
    }
    else {
        var edgeValue = void 0;
        if (Array.isArray(bpmnEdges)) {
            edgeValue = bpmnEdges.find(function (edge) { return edge['-bpmnElement'] === value['-id']; });
        }
        else {
            edgeValue = bpmnEdges;
        }
        edges.push(getEdgeConfig(edgeValue, value));
    }
    return edges;
}
function getEdgeConfig(edgeValue, processValue) {
    var text;
    var textVal = processValue['-name'];
    if (textVal) {
        var textBounds = edgeValue['bpmndi:BPMNLabel']['omgdc:Bounds'];
        // 如果边文本换行，则其偏移量应该是最长一行的位置
        var textLength_1 = 0;
        textVal.split('\n').forEach(function (textSpan) {
            if (textLength_1 < textSpan.length) {
                textLength_1 = textSpan.length;
            }
        });
        text = {
            value: textVal,
            x: Number(textBounds['-x']) + (textLength_1 * 10) / 2,
            y: Number(textBounds['-y']) + 7,
        };
    }
    var properties;
    // 判断是否存在额外的属性，将额外的属性放到properties中
    Object.entries(processValue).forEach(function (_a) {
        var _b = __read(_a, 2), key = _b[0], value = _b[1];
        if (defaultAttrs.indexOf(key) === -1) {
            if (!properties)
                properties = {};
            properties[key] = value;
        }
    });
    if (properties) {
        properties = toNormalJson(properties);
    }
    var edge = {
        id: processValue['-id'],
        type: BpmnElements.FLOW,
        pointsList: edgeValue['omgdi:waypoint'].map(function (point) { return ({
            x: Number(point['-x']),
            y: Number(point['-y']),
        }); }),
        sourceNodeId: processValue['-sourceRef'],
        targetNodeId: processValue['-targetRef'],
        properties: properties,
    };
    if (text) {
        edge.text = text;

    }
    return edge;
}
var BpmnAdapter = {
    pluginName: 'bpmn-adapter',
    install: function (lf) {
        lf.adapterIn = this.adapterIn;
        lf.adapterOut = this.adapterOut;
    },
    shapeConfigMap: new Map(),
    setCustomShape: function (key, val) {
        this.shapeConfigMap.set(key, val);
    },
    adapterOut: function (data) {
      // console.log('adapterOut',data)
        let nodesProperty= JSON.parse(sessionStorage.getItem('nodes'))
        var bpmnProcessData =nodesProperty.process;
        convertLf2ProcessData(bpmnProcessData, data);
        var bpmnDiagramData = {
            '-id': 'BPMNPlane_1',
            '-bpmnElement': bpmnProcessData['-id'],
        };
        convertLf2DiagramData(bpmnDiagramData, data);
        var bpmnData = {
          'process': bpmnProcessData,
          // 'bpmndi:BPMNDiagram': {
          //     '-id': 'BPMNDiagram_1',
          //     'bpmndi:BPMNPlane': bpmnDiagramData,
          // },
          "bpmndi:BPMNPlane":bpmnDiagramData,
            // 'definitions': {
            //     // '-id': "Definitions_" + getBpmnId(),
            //     '-xmlns': 'http://www.omg.org/spec/BPMN/20100524/MODEL',
            //     '-xmlns:bpmndi': 'http://www.omg.org/spec/BPMN/20100524/DI',
            //     '-xmlns:flowable': 'http://camunda.org/schema/1.0/bpmn',
            //     '-xmlns:omgdc': 'http://www.omg.org/spec/DD/20100524/DC',
            //     '-xmlns:omgdi': 'http://www.omg.org/spec/DD/20100524/DI',
            //     '-xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
            //     '-targetNamespace': 'http://www.aeotrade.com/processdef',
            //     '-typeLanguage': 'http://www.w3.org/2001/XMLSchema',
            //
            //
            //
            //     //
            //     //
            //     // '-xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
            //     //
            //     // '-exporter': 'Camunda Modeler',
            //     // '-exporterVersion': '7.3.0',
            //
            //
            //     // '-xmlns:dc': 'http://www.omg.org/spec/DD/20100524/DC',
            //     // '-xmlns:di': 'http://www.omg.org/spec/DD/20100524/DI',
            //     'process': bpmnProcessData,
            //     'bpmndi:BPMNDiagram': {
            //         '-id': 'BPMNDiagram_1',
            //         'bpmndi:BPMNPlane': bpmnDiagramData,
            //     },
            //     // "bpmndi:BPMNPlane":bpmnDiagramData
            // },
        };
      console.log('bpmnData',bpmnData)
        return bpmnData;
    },
    adapterIn: function (bpmnData) {
        if (bpmnData) {
          console.log('adapterIn',bpmnData)
          sessionStorage.setItem('adapterIn',JSON.stringify(bpmnData))
            return convertBpmn2LfData(bpmnData);
        }
    },
};
BpmnAdapter.shapeConfigMap.set(BpmnElements.START, {
    width: StartEventConfig.width,
    height: StartEventConfig.height,
});
BpmnAdapter.shapeConfigMap.set(BpmnElements.END, {
    width: EndEventConfig.width,
    height: EndEventConfig.height,
});
BpmnAdapter.shapeConfigMap.set(BpmnElements.GATEWAY, {
    width: ExclusiveGatewayConfig.width,
    height: ExclusiveGatewayConfig.height,
});
BpmnAdapter.shapeConfigMap.set(BpmnElements.SYSTEM, {
    width: ServiceTaskConfig.width,
    height: ServiceTaskConfig.height,
});
BpmnAdapter.shapeConfigMap.set(BpmnElements.USER, {
    width: UserTaskConfig.width,
    height: UserTaskConfig.height,
});
var BpmnXmlAdapter = {
    pluginName: 'bpmnXmlAdapter',
    install: function (lf) {
        lf.adapterIn = this.adapterXmlIn;
        // lf.adapterOut = this.adapterXmlOut;
    },
    adapterXmlIn: function (bpmnData) {
        var json = lfXml2Json(bpmnData);
      // console.log('resultjson',json)
        let result=BpmnAdapter.adapterIn(json)
      // console.log('result',result)
        return result;
    },
    adapterXmlOut: function (data) {
      // console.log('outData-0',data)
        var outData = BpmnAdapter.adapterOut(data);

        return lfJson2Xml(outData);
    },
};
export { BpmnAdapter, BpmnXmlAdapter, };
export default BpmnAdapter;
