/**
 * This work is licensed under Creative Commons GNU LGPL License.
 * License:
 * Version: 0.9
 * Author:  Stefan Goessner/2006
 * Web:     http://goessner.net/
 */
let whiteNode=["startEvent","endEvent","sendTask","receiveTask"]
function addIndSpace(ind, deep) {
    for (var i = 0; i < deep; i++) {
        ind += '  ';
    }
    return ind;
}
function toXml(v, name, ind, deep,type) {
    var xml = "";
    if (v instanceof Array) {
        for (var i = 0, n = v.length; i < n; i++) {
            xml += addIndSpace(ind, deep) + toXml(v[i], name, ind, deep + 1);
        }
    }
    else if (typeof (v) == "object") {
        var hasChild = false;
        xml += addIndSpace(ind, deep) + "<" + name;
        for (var m in v) {
            if (m.charAt(0) == "-" && m !=='-#text'){
              xml += " " + m.substr(1) + "=\"" + v[m] + "\"";

            }


            else if(m.charAt(0) == "_" && m !=='__prefix'){

              xml += " " + m.substr(1) + "=\"" + v[m] + "\"";
            }
            // else if(m.charAt(0) == "#" && m =='#text'){
            //   // xml += " " + m.substr(1) + "=\"" + v[m] + "\"";
            //   console.log('mmmmmmmmmmmmmmmmmmmmmmmmmmmmmm',xml)
            // }

            else
                hasChild = true;
        }
        xml += hasChild ? ">" : " />";
        if (hasChild) {
          if(v)

            if(v['incoming']&&v['outgoing']){
              // console.log( Object.keys(v))
              let array=Object.keys(v)
              array.splice(array.indexOf('outgoing'),1)
              array.splice(array.indexOf('incoming')+1,0,'outgoing')
              let obj=[];
              array.forEach(some=>{
                obj[some]=v[some]
              })
              v=obj
            }
            if(v.multiInstanceLoopCharacteristics||v.nodeSize){
              // console.log('multiInstanceLoopCharacteristicsvvvvvvvvvvvvvvv',v)
              // console.log('multiInstanceLoopCharacteristicsvvvvvvvvvvvvvvv',Object.keys(v))
              // console.log('multiInstanceLoopCharacteristicsxml' +
              //   '',xml)
              let obj={};
              if(v['incoming']){
                obj['incoming']=v['incoming']
              }
              if(v['outgoing']){
                obj['outgoing']=v['outgoing']
              }
              if(v["multiInstanceLoopCharacteristics"]){
                obj['multiInstanceLoopCharacteristics']=v['multiInstanceLoopCharacteristics']
              }
              Object.keys(v).forEach((itemKey)=>{
                if(!obj[itemKey]){
                  obj[itemKey]=v[itemKey]
                }

              })

              v=obj

            }
            for (var m in v) {
                if (m == "#text"){
                  xml += v[m];
                }

               else if (m == "-#text"){
                  xml += v[m];
                }
                else if (m == "#cdata")
                    xml += "<![CDATA[" + v[m] + "]]>";
                else if(m=='flowable:property'){
                  // console.log(v['flowable:property'])
                  let data=v['flowable:property']
                  Object.keys(data).forEach((flowable,index)=>{
                    if(data[flowable]['-name']=="connector_task_para"){
                      console.log('data[flowable][\'-name\']data[flowable][\'-name\']data[flowable][\'-name\']data[flowable][\'-name\']',data[flowable]['-name'])
                      if(data[flowable]['-value']){
                        xml +=addIndSpace(ind, deep+1)+`<flowable:property name="${data[flowable]['-name']||''}" value="${data[flowable]['-value'].replaceAll('"',"&#34;")||''}" />`
                      }
                    }else {
                      xml +=addIndSpace(ind, deep+1)+`<flowable:property name="${data[flowable]['-name']||''}" value="${data[flowable]['-value']||''}" />`

                    }

                  })
                  // if(v['flowable:property']&&v['flowable:property'].length){
                  //   console.log(v['flowable:property'])
                  // }
                  // xml += toXml(v[m], m, ind, deep + 1,'flowable:properties');
                }else if(m=='multiInstanceLoopCharacteristics'){
                 /* console.log('multiInstanceLoopCharacteristics',v)
                  v={incoming:1,outgoing:1,multiInstanceLoopCharacteristics:{"-isSequential":1,"-loopCardinality":2}}*/
/*
                  if(v.incoming){
                    xml +=addIndSpace(ind, deep+1)+`<incoming>${v.incoming}</incoming>`;
                    delete  v.incoming
                  }
                  if(v.outgoing){
                    xml +=addIndSpace(ind, deep+1)+`<incoming>${v.outgoing}</incoming>`;
                    delete  v.outgoing
                  }*/
                  xml +=addIndSpace(ind, deep+1)+`<multiInstanceLoopCharacteristics isSequential="${v['multiInstanceLoopCharacteristics']['-isSequential']||""}"> <loopCardinality xsi:type="tFormalExpression">${v['multiInstanceLoopCharacteristics']['loopCardinality']["#text"]||''}</loopCardinality></multiInstanceLoopCharacteristics>`
                  console.log('multiInstanceLoopCharacteristics',xml)

                }
                else if(m=='nodeSize'){
                  xml +=""
                }
                // else if (m.charAt(0) != "_"){
                //   console.log(v,m)
                //   // xml += toXml(v[m], m, ind, deep + 1);
                // }
                else if (m.charAt(0) != "-"){
                  xml += toXml(v[m], m, ind, deep + 1);
                }

            }
            xml += addIndSpace(ind, deep) + "</" + name + ">";
        }
        else {
            xml += addIndSpace(ind, deep);
        }
    }
    else {
        if(name.charAt(0) != "_"){
          xml += addIndSpace(ind, deep) + "<" + name + ">" + v + "</" + name + ">";
        }

      // console.log(xml)
    }
    return xml;
}
;
function lfJson2Xml(o) {
    var xmlStr = "";
    for (var m in o) {
        xmlStr += toXml(o[m], m, "\t\n", 0);
    }
    return '<?xml version="1.0" encoding="UTF-8" standalone="no"?>'+xmlStr;
}
export { lfJson2Xml };
