/**
 * @author: lilijie
 * @des:
 * @date: 2022/12/1 11:44
 */
import { GroupNode } from '@logicflow/extension/es/materials/group';

export default function registerSubProcess(lf) {
  lf.register('subProcess', ({ RectNode, HtmlNodeModel }) => {
    class MyGroup extends GroupNode.view {
    }
    class MyGroupModel extends GroupNode.model {
      initNodeData(data) {
        super.initNodeData(data);
        this.isRestrict = true;
        this.resizable = true;
        this.width = 1440;
        this.height = 320;
      }
      getNodeStyle() {
        const style = super.getNodeStyle();
        style.strokeWidth = 1;
        style.stroke = "#3d5afe";
        style.strokeWidth = 1;
        style.strokeDasharray = "3 3";
        if (this.isSelected) {
          style.stroke = "rgb(124, 15, 255)";
        }
        return style;
      }
    }
    return{
      model: MyGroupModel,
      view: MyGroup
    }
  })
}
