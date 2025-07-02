const NODE_COLOR = '#3D5AFE'
export default function registerDownload(lf) {
  lf.register('download', ({ PolygonNode, PolygonNodeModel, h }) => {
    class Node extends PolygonNode {
      getIconShape () {
        return h(
          'svg',
          {
            x: 0,
            y: 0,
            width: 48,
            height: 48,
            viewBox: '0 0 32 32'
          },
          h(
            'path',
            {
              fill: NODE_COLOR,
              d: 'M16 29.333c-7.364 0-13.333-5.969-13.333-13.333s5.969-13.333 13.333-13.333 13.333 5.969 13.333 13.333-5.969 13.333-13.333 13.333zM14.667 14.667h-5.333v2.667h5.333v5.333h2.667v-5.333h5.333v-2.667h-5.333v-5.333h-2.667v5.333z'
            }
          ),
        )
      }
      getShape () {
        const {model} = this.props
        const {width, height, x, y, points} = model
        const {
          fill,
          fillOpacity,
          strokeWidth,
          stroke,
          strokeOpacity,
        } = model.getNodeStyle()
        const transform = `matrix(1 0 0 1 ${x - width / 2} ${y - height / 2})`
        const pointsPath = points.map(point => point.join(',')).join(' ')
        return h(
          'g',
          {
            transform
          },
          [
            h(
              'polygon',
              {
                points: pointsPath,
                fill,
                stroke,
                strokeWidth,
                strokeOpacity,
                fillOpacity
              }
            ),
            this.getIconShape()
          ]
        )
      }
    }
    class Model extends PolygonNodeModel {
      constructor (data, graphModel) {
        data.text = {
          value: (data.text && data.text.value) || '',
          x: data.x,
          y: data.y + 50
        }
        super(data, graphModel)
        const lenght = 25
        this.points = [
          [lenght, 0],
          [lenght * 2, lenght],
          [lenght, lenght * 2],
          [0, lenght]
        ]
      }
      getNodeStyle() {
        const style = super.getNodeStyle()
        style.stroke = '#fff'
        return style
      }
    }
    return {
      view: Node,
      model: Model
    }
  })
}
