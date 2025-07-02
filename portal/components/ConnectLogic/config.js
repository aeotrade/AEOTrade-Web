export const nodeList = [
  {
    type: 'startEvent',
    text: '开始',
    class: 'node-apply',
  },
  {
    type: 'receiveTask',
    text: '触发事件',
    class: 'node-connect2'
  },
  {
    type: 'sendTask',
    text: '执行动作',
    class: 'node-connect1'
  },

  {
    type: 'subProcess',
    text: '子流程',
    class: 'node-group'
  },
  {
    type: 'parallelGateway',
    text: '并行网关',
    class: 'parallelGateway'
  },{
    type: 'exclusiveGateway',
    text: '分支网关',
    class: 'exclusiveGateway'
  },
  {
    type: 'endEvent',
    text: '结束',
    class: 'bpmn-end'
  }
];

export const BpmnNode = [
  {
    type: 'bpmn:startEvent',
    text: '开始',
    class: 'bpmn-start'
  },
  {
    type: 'bpmn:endEvent',
    text: '结束',
    class: 'bpmn-end'
  },
  {
    type: 'bpmn:exclusiveGateway',
    text: '网关',
    class: 'bpmn-exclusiveGateway'
  },
  {
    type: 'bpmn:userTask',
    text: '用户',
    class: 'bpmn-user'
  },
]
// 允许点击的node白名单
export const whiteNode=['sendTask','receiveTask','subProcess']
//根据名称找到自定义属性里面的某个属性值
export function findPropertyByName(array,name) {
  if(!array||!array.length){
    return ''
  }
  let result=array.filter(v=>{return v.name=='name'})
  return result[0].value()
}
