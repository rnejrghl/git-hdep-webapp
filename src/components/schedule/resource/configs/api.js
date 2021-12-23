const prefix = '/so';

const api = {
  getList: (params = null) => ({
    url: `${prefix}/rscGrps`,
    params: { ...params }
  }),
  createGroup: (params = null) => ({
    url: `${prefix}/rscGrp`,
    params: { ...params }
  }),
  deleteGroup: (rscGrpId = null) => ({
    url: `${prefix}/dRscGrp`,
    params: { rscGrpId }
  }),
  modifyGroup: (params = null) => ({
    url: `${prefix}/uRscGrp`,
    params: { ...params }
  })
};

export default api;
