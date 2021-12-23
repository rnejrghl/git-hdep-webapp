const prefix = {
  planning: '/pp',
  common: '/common',
  sign: '/cm',
  lookup: '/_/lookup'
};

const api = {
  login: (userId, password) => ({
    url: `${prefix.sign}/signin`,
    params: {
      userId,
      password
    }
  }),
  deleteFile: fileSeq => ({
    url: `${prefix.common}/fileDelete`,
    params: { fileSeq }
  }),
  getLanguages: (params = null) => ({
    url: `${prefix.common}/langList`,
    params: { ...params }
  }),
  changePassword: (params = null) => ({
    url: `${prefix.common}/newPassword`,
    params: { ...params }
  }),
  // siteDetail
  getSiteDetail: siteId => ({
    url: `${prefix.common}/cmnSiteOpeStas`,
    params: {
      siteId
    }
  }),
  getSiteDetailAlarms: params => ({
    url: `${prefix.common}/cmnAlarmList`,
    params: params
  }),
  getSiteDetailKpiList: params => ({
    url: `${prefix.common}/cmnKpiList`,
    params: params
  }),
  getSiteDetailRawList: params => ({
    url: `${prefix.common}/cmnRawList`,
    params: params
  }),
  getSiteDetailRawTagList: siteId => ({
    url: `${prefix.common}/cmnRawTagList`,
    params: {
      siteId
    }
  }),
  getSiteDetailWorkOrders: params => ({
    url: `${prefix.common}/cmnWorkOrderList`,
    params: params
  }),
  getSiteDetailFailAlarm: params => ({
    url: `${prefix.common}/cmnFailAlarmList`,
    params: params
  }),
  getSiteDetailOperation: siteId => ({
    url: `${prefix.common}/cmnOperList`,
    params: {
      siteId
    }
  }),
  getSiteDetailControlHistory: (params = null) => ({
    url: `${prefix.common}/essControlHistoryList`,
    params: { ...params }
  }),

  /* ESS CONTROL */
  createEssControl: (params = null) => ({
    url: `${prefix.common}/essControlInsert`,
    params: { ...params }
  }),

  updateEssControl: (params = null) => ({
    url: `${prefix.common}/essControlUpdate`,
    params: { ...params }
  }),

  getEssControlList: siteId => ({
    url: `${prefix.common}/essControlList`,
    params: {
      siteId
    }
  }),

  getRegister: (activeKey, params = null) => {
    let url = '';
    switch (activeKey) {
      case 'contract':
        url = `${prefix.planning}/contractPlan`;
        break;
      case 'approve':
        url = `${prefix.planning}/expn`;
        break;
      case 'grid':
        url = `${prefix.planning}/grid`;
        break;
      case 'inspection':
        url = `${prefix.planning}/inspMng`;
        break;
      case 'finish':
        url = `${prefix.planning}/term`;
        break;
      default:
        break;
    }
    return {
      url,
      params: { ...params }
    };
  },
  // contract
  createContract: (params = null) => ({
    url: `${prefix.planning}/contractPlan`,
    params: { ...params }
  }),
  updateContract: (params = null) => ({
    url: `${prefix.planning}/uContractPlan`,
    params: { ...params }
  }),
  deleteContract: (siteId = null) => ({
    url: `${prefix.planning}/contract/${siteId}`,
    params: {}
  }),
  updateApprove: (params = null) => ({
    url: `${prefix.planning}/uExpn`,
    params: { ...params }
  }),
  updateGrid: (params = null) => ({
    url: `${prefix.planning}/uGrid`,
    params: { ...params }
  }),
  updateInspection: (params = null) => ({
    url: `${prefix.planning}/uInspMng`,
    params: { ...params }
  }),
  updateTerm: (params = null) => ({
    url: `${prefix.planning}/uTerm`,
    params: { ...params }
  }),

  requestOtp: (params = null) => ({
    url: `${prefix.lookup}/requestOtp`,
    params: { ...params }
  }),
  checkOtp: (params = null) => ({
    url: `${prefix.lookup}/checkOtp`,
    params: { ...params }
  }),
  checkUserId: (params = null) => ({
    url: `${prefix.lookup}/checkUserId`,
    params: { ...params }
  }),
  updatePassword: (resetToken, params = null) => ({
    url: `${prefix.lookup}/updatePassword/${resetToken}`,
    params: { ...params }
  })
};

export default api;
