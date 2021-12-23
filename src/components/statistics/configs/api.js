const prefix = {
  common: '/common',
  statistics: '/st'
};
const api = {
  getSiteId: (params = null) => ({
    url: `${prefix.common}/searchSite`,
    params: { ...params }
  }),

  // 발전량 분석 테이블용
  getGenStatList: params => ({
    url: `${prefix.statistics}/genStatList`,
    params: { ...params }
  })
};

export default api;
