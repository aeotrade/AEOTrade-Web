import { createApp, h } from 'vue'
import Connect from './Connect2.vue'

export default function registerReceive (lf) {
  lf.register('receiveTask', ({ HtmlNode, HtmlNodeModel }) => {
    class ConnectNode extends HtmlNode {
      setHtml(rootEl) {
        const { properties,text } = this.props.model;
        const el = document.createElement('div');
        rootEl.innerHTML = '';
        rootEl.appendChild(el);
        const Profile = {
          render() {
            return h(Connect, {
              name: text && text.value || '未命名',
              backgroundColor: properties.backgroundColor || '#fff',
              onBtnClick: (type) => {
                console.log('select-button', type)
              }
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
        super.initNodeData(data)
        const width = 400
        const height = 140
        this.width = width
        this.height = height
        this.text.editable = false; // 不允许文本被编辑
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
