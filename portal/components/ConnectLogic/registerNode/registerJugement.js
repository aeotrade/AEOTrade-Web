/*
*  判断节点
* */
export default function registerEnd (lf) {
  lf.register('jugement', ({ PolygonNode, PolygonNodeModel, h }) => {
    class JugementModel extends PolygonNodeModel {
      constructor(data, graphModel) {
        super(data, graphModel);
        data.text = {
          value: (data.text && data.text.value) || '',
          x: data.x,
          y: data.y
        }
        this.points= [
          [35, 0],
          [70, 35],
          [35, 70],
          [0, 35],
        ];
        this.properties = {
          backgroundColor:this.text.value?'#FFEBB5':'#FFFFFF'
        }

      }
      getNodeStyle() {
        const style = super.getNodeStyle();
        style.strokeWidth = 1;
        style.stroke = "#3d5afe";
        style.strokeWidth = 1;
        if (this.isSelected) {
          style.stroke = "rgb(124, 15, 255)";
        }
        const properties = this.getProperties();
        return getShapeStyleFuction(style, properties);
      }
    }
    return {
      view: PolygonNode,
      model: JugementModel
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


