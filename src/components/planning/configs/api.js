const prefix = '/pp';

const api = {
  getList: (params = null) => ({
    url: `${prefix}/prjSites`,
    params: { ...params }
  }),
  getGoal: (params = null) => ({
    url: `${prefix}/goal`,
    params: { ...params }
  }),
  getBundle: (key, params = null) => {
    let url = '';

    switch (key) {
      case 'file':
        url = '/pp/goal';
        break;
      default:
        break;
    }

    return {
      url,
      params: { ...params }
    };
  },
  deleteSiteList: (params = []) => ({
    url: `${prefix}/dSiteDelList`,
    params: [...params]
  }),
  endSiteList: (params = []) => ({
    url: `${prefix}/uTermList`,
    params: [...params]
  }),
  postGoalList: (params = null) => ({
    url: `${prefix}/goal`,
    params: { ...params }
  }),
  createContract: (params = null) => ({
    url: `${prefix}/contractPlan`,
    params: { ...params }
  }),
  // goal
  updateGoal: (params = []) => ({
    url: `${prefix}/uGoalList`,
    params: [...params]
  })
};

export default api;
