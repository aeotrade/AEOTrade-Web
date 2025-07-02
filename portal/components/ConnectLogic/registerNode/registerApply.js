/*
*  申请节点
* */
export default function registerEnd (lf) {
  lf.register('start', ({ CircleNode, CircleNodeModel, h }) => {
    class ApplyNodeModel extends CircleNodeModel {
      constructor(data, graphModel) {
        super(data, graphModel);
        console.log(graphModel,111)
        data.text = {
          value: (data.text && data.text.value) || '',
          x: data.x,
          y: data.y
        }
        this.text.draggable = false; // 不允许文本被拖动
        this.text.editable = false; // 不允许文本被编辑
        this.properties = {
          backgroundColor:this.text.value?'#FFEBB5':'#FFFFFF'
        }
      }
      getConnectedTargetRules() {
        const rules = super.getConnectedTargetRules();
        const geteWayOnlyAsTarget = {
          message: '开始节点只能连出，不能连入！',
          validate: (source, target) => {
            let isValid = true;
            if (target) {
              isValid = false;
            }
            return isValid;
          },
        };
        // @ts-ignore
        rules.push(geteWayOnlyAsTarget);
        return rules;
      }
      getNodeStyle() {
        const style = super.getNodeStyle();
        const properties = this.getProperties();
        return getShapeStyleFuction(style, properties);
      }
    }
    return {
      view: CircleNode,
      model: ApplyNodeModel
    }
  })
}


const getShapeStyleFuction = (style, properties) => {
  if (properties.backgroundColor) {
    style.fill = properties.backgroundColor
  }
  if (properties.gradientColor && style.fill !== properties.gradientColor) {
    style.fillGradient = properties.gradientColor
  }
  if (properties.borderColor) {
    style.stroke = properties.borderColor
  }
  if (properties.borderWidth) {
    style.strokeWidth = properties.borderWidth
  }
  if (properties.borderStyle) {
    if (properties.borderStyle === 'solid') {
      style.strokeDashArray = '0'
      // nodeResize里的bug导致的,array小写了
      style.strokeDasharray = '0'
    }
    if (properties.borderStyle === 'dashed') {
      style.strokeDashArray = '3 3'
      style.strokeDasharray = '3 3'
    }
    if (properties.borderStyle === 'dotted') {
      style.strokeDashArray = '1 1'
      style.strokeDasharray = '1 1'
    }
    if (properties.borderStyle === 'hidden') {
      style.stroke = style.fill
    }
  }
  return style
}

