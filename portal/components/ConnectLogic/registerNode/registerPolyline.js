export default function registerPolyline (lf) {
  lf.register('sequenceFlow', ({ PolylineEdge, PolylineEdgeModel }) => {
    class ConnnectionModel extends PolylineEdgeModel {
      constructor (data, graphModel,onDragEnd) {
        super(data, graphModel)
      }
      // getTextStyle() {
      //   const style = super.getTextStyle();
      //   style.color = "#3451F1";
      //   style.fontSize = 30;
      //   style.background.fill = "#F2F131";
      //   return style;
      // }
      // getOutlineStyle() {
      //   const style = super.getOutlineStyle();
      //   style.stroke = "red";
      //   style.hover.stroke = "red";
      //   return style;
      // }
    }
    return {
      view: PolylineEdge,
      model: ConnnectionModel
    }
  })
}
