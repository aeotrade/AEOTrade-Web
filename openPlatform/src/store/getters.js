const getters = {
  'sidebar': state => state.app.sidebar,
  'device': state => state.app.device,
  'avatar': state => state.user.avatar,
  'name': state => state.user.name,
  'visitedViews': state => state.tagsView.visitedViews,
  'moduleRoutes': state => state.permission.moduleRoutes,
  'onProgressCount': state => state.app.collectList.filter(item => item.task_status === '1').length
};

export default getters;
