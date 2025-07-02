/*
* 名称：svg渲染组件
* 描述：svg渲染组件
* 创建日期：2019年10月31日15:18:20
* 创建人：李黎杰
*/
import Vue from 'vue';
import SvgIcon from '@/components/SvgIcon';// svg component

// register globally
Vue.component('svg-icon', SvgIcon);

const req = require.context('./svg', false, /\.svg$/);

const requireAll = requireContext => requireContext.keys().map(requireContext);

requireAll(req);
