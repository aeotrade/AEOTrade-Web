/*
*  结束节点
* */
export default function registerEnd (lf) {
  lf.register('end', ({ CircleNode, CircleNodeModel, h }) => {
    class FinshNodeModel extends CircleNodeModel {
      constructor(data, graphModel) {
        data.text = {
          value: (data.text && data.text.value) || '',
          x: data.x,
          y: data.y
        }
        super(data, graphModel);
        this.text.draggable = false; // 不允许文本被拖动
        this.text.editable = false; // 不允许文本被编辑
        this.properties = {
          backgroundColor:'#FFFFFF'
        }
      }
      getNodeStyle() {
        const style = super.getNodeStyle();
        const properties = this.getProperties();
        return getShapeStyleFuction(style, properties);
      }
      getConnectedSourceRules() {
        const rules = super.getConnectedSourceRules();
        const geteWayOnlyAsTarget = {
          message: '结束节点只能连入，不能连出！',
          validate: (source) => {
            let isValid = true;
            if (source) {
              isValid = false;
            }
            return isValid;
          },
        };
        // @ts-ignore
        rules.push(geteWayOnlyAsTarget);
        return rules;
      }
    }
    return {
      view: CircleNode,
      model: FinshNodeModel
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
    style.stroke = "#989891"
  }else {
    style.stroke = "#989891"
  }
  style.stroke = "#989891"
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
