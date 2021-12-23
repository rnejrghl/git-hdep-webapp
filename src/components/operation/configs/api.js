const prefix = '/mo';
const commonPrefix = '/common';
const workPrefix = '/wo';

const api = {
  getList: (params = null) => ({
    url: `${prefix}/operations`,
    params: { ...params }
  }),
  getSummary: (params = null) => ({
    url: `${prefix}/operations/summary`,
    params: { ...params }
  }),
  getNoticeList: (params = null) => ({
    url: `${commonPrefix}/noticeList`,
    params: { ...params }
  }),
  createWorKOrders: (params = []) => ({
    url: `${workPrefix}/workOrdeList`,
    params: [...params]
  }),

  // HDEP: 기간별 사이트 발전량
  getSiteProductions: (siteId, params = null) => ({
    url: `${commonPrefix}/sites/${siteId}/productions`,
    params: { ...params }
  }),

  getSitePowerList: (siteId, rescGubn, params = null) => ({
    url: `${commonPrefix}/sites/${siteId}/${rescGubn}/productions`,
    params: { ...params }
  }),

  getSpotPriceGraph: (params = null) => ({
    url: `/db/spotPriceGraph`,
    params: { ...params }
  })
};

export default api;
