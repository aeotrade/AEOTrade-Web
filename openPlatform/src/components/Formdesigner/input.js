const label = '选择账号';
const name = 'select';
let i = 1;
const uniqueId = ()=>`uni${i++}`;
export default {
  icon: 'icon-select',
  label,
  name,
  rule() {
    return {
      type: name,
      field: uniqueId(),
      title: label,
      info: '',
      $required: false,
      props: {},
    };
  },
  props() {
    return [
      //生成对应组件的`options`配置规则
      ];
  }
};
