import { createApp, h } from 'vue'
import ExclusiveGateway from './ExclusiveGateway.vue'
import Connect from "~/components/ConnectLogic/registerNode/Connect2.vue";

export default function registerConnect (lf) {
  lf.register('exclusiveGateway', ({ HtmlNode, HtmlNodeModel }) => {
    class ConnectNode extends HtmlNode {
      setHtml(rootEl) {
        const { properties} = this.props.model;
        const el = document.createElement('div');
        rootEl.innerHTML = '';
        rootEl.appendChild(el);
        const Profile = {
          render() {
            return h(ExclusiveGateway, {
              backgroundColor: properties.backgroundColor || '#fff',
              bgColor: properties.backgroundColor || '#fff'
            })
          }
        }
        createApp(Profile).mount(el)
      }
    }
    class ConnectNodeModel extends HtmlNodeModel {
      initNodeData(data) {
        if (data.text) {
          data.text.editable = false
        }
        this.text.editable = false; // 不允许文本被编辑
        super.initNodeData(data)
        const width = 80
        const height =80
        this.width = width
        this.height = height
        this.anchorsOffset = [
          [width / 2, 0],
          [0, height / 2],
          [-width / 2, 0],
          [0, -height/2],
        ]
      }
    }
    return {
      view: ConnectNode,
      model: ConnectNodeModel
    }
  })
}
