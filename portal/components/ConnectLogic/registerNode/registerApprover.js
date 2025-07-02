/*
*  审批节点
* */
export default function registerEnd (lf) {
  lf.register('bpmn:approver', ({ RectNode, RectNodeModel, h }) => {
    class ApproverNode extends RectNode {
      static extendKey = 'UserTaskNode';
      getLabelShape() {
        const {
          x,
          y,
          width,
          height,
          properties,
        } = this.props.model;
        const { labelColor, approveTypeLabel } = properties
        return h(
          'text',
          {
            fill: labelColor,
            fontSize: 12,
            x: x - width / 2 + 5,
            y: y - height / 2 + 15,
            width: 50,
            height: 25
          },
          approveTypeLabel,
        );
      }
      getShape() {
        const {
          x,
          y,
          width,
          height,
          radius,
        } = this.props.model;
        const style = this.props.model.getNodeStyle();
        return h(
          'g',
          {
          },
          [
            h(
              'rect',
              {
                ...style,
                x: x - width / 2,
                y: y - height / 2,
                rx: radius,
                ry: radius,
                width,
                height,
              },
            ),
            this.getLabelShape(),
          ],
        );
      }
    }
    class ApproverModel extends RectNodeModel {
      constructor(data, graphModel) {
        data.text = {
          value: (data.text && data.text.value) || '',
          x: data.x,
          y: data.y
        }
        super(data, graphModel);
        this.properties = {
          backgroundColor:this.text.value?'#FFF000':'#FFFFFF'
        }
      }
      getNodeStyle() {
        const style = super.getNodeStyle();
        const properties = this.getProperties();

        return getShapeStyleFuction(style, properties);
      }
    }
    return {
      view: ApproverNode,
      model: ApproverModel
    }
  })
}


const getShapeStyleFuction = (style, properties) => {
  if (properties.backgroundColor  ) {
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
