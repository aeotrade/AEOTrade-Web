// import { TextNode, TextNodeModel  } from "@logicflow/core";
//
// class UserTextView extends TextNode {}
//
// class UserTextModel extends TextNodeModel {}




export default function registerUserText(lf) {
  lf.register('UserText', ({ TextNode, TextNodeModel,h}) => {
    class UserTextView extends TextNode {

    }
    class UserTextModel extends TextNodeModel {
      getAnchorStyle(anchorInfo) {
        const style = super.getAnchorStyle(anchorInfo);
        if (anchorInfo.type === 'left') {

          style.hover.fill = 'transparent'
          style.hover.stroke = 'transpanrent'
          style.className = 'lf-hide-default'
        } else {

        }
        return style;
      }
      getDefaultAnchor() {
        const { width, height, x, y, id } = this;
        return [
          {
            x: x ,
            y: y - height / 2,
            type: 'bottom',
            id: `${id}_0`
          },
          {
            x: x + width / 2,
            y,
            type: 'right',
            id: `${id}_1`
          },
          {
            x: x - width / 2,
            y,
            type: 'left',
            id: `${id}_2`
          },
          {
            x: x,
            y: y + height / 2,
            type: 'top',
            id: `${id}_3`
          },
        ]
      }
      getNodeStyle() {
        const style = super.getNodeStyle();
        const properties = this.getProperties();
        console.log(123);
        style.width = 100
        style.height = 50
        return getShapeStyleFuction(style, properties);
      }

      getTextStyle() {
        const style = super.getTextStyle();
        const properties = this.getProperties();
        style.fontSize = 24
        style.color = '#333'
        style.opacity = 0.5
        if (properties.backgroundColor) {
          style.backgroundStyle = {
            fill: properties.backgroundColor,
          };
        }
        return getTextStyleFunction(style, properties);
      }

      setAttributes() {
        super.setAttributes();
        if (!this.text.value) {
          this.text.value = "合约结束";
        }
      }
      constructor (data, graphModel) {
        data.text = {
          value: (data.text && data.text.value) || '',
          x: data.x,
          y: data.y + 5
        }
        super(data, graphModel)
      }
      initNodeData(data) {
        super.initNodeData(data)
        const lenght = 25
        this.points = [
          [lenght, 0],
          [lenght * 2, lenght],
          [lenght, lenght * 2],
          [0, lenght]
        ]
      }
    }
    return  {
      type: "UserText",
      view: UserTextView,
      model: UserTextModel
    };
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

const getTextStyleFunction = (style = {}, properties) => {
  if (properties.fontColor) {
    style.color = properties.fontColor
  }
  if (properties.fontSize) {
    style.fontSize = properties.fontSize
  }
  if (properties.fontFamily) {
    style.fontFamily = properties.fontFamily
  }
  if (properties.lineHeight) {
    style.lineHeight = properties.lineHeight
  }
  if (properties.textAlign) {
    style.textAlign = properties.textAlign
  }
  if (properties.fontWeight) {
    style.fontWeight = properties.fontWeight
  }
  if (properties.textDecoration) {
    style.textDecoration = properties.textDecoration
  }
  if (properties.fontStyle) {
    style.fontStyle = properties.fontStyle
  }
  return style
}
