const prefix = '/so';

const api = {
  getList: (params = null) => ({
    url: `${prefix}/siteRscGrps`,
    params: { ...params }
  }),
  getGroupList: () => ({
    url: `${prefix}/rscGrps`,
    params: {}
  }),
  getUserList: (params = null) => ({
    url: `${prefix}/rscGrpUser`,
    params: { ...params }
  }),
  getHistroies: (params = null) => ({
    url: `${prefix}/rscGrpUserHis`,
    params: { ...params }
  }),
  updateHistory: (params = null) => ({
    url: `${prefix}/uRscGrpUserHis`,
    params: { ...params }
  })
};

export default api;
