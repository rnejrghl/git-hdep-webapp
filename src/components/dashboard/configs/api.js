const prefix = '/db';

const api = {
  getAssetList: (params = null) => ({
    url: `${prefix}/assetOverview`,
    params: { ...params }
  }),
  getSiteList: (params = null) => ({
    url: `${prefix}/siteOpeStas`,
    params: { ...params }
  }),
  onCreateGroup: (params = null) => ({
    url: `${prefix}/rscGrp`,
    params: { ...params }
  }),
  onDeleteGroup: (rscGrpId = null) => ({
    url: `${prefix}/dRscGrp`,
    params: { rscGrpId }
  }),
  onModifyGroup: (params = null) => ({
    url: `${prefix}/uRscGrp`,
    params: { ...params }
  }),
  getAlarmList: (params = null) => ({
    url: `${prefix}/alarmOverview`,
    params: { ...params }
  }),
  // assets
  getRegion: (params = null) => ({
    url: `${prefix}/regnSiteCnt`,
    params: { ...params }
  }),
  getRegionSites: (params = null) => ({
    url: `${prefix}/regnSiteList`,
    params: { ...params }
  }),
  getSearchSite: (params = null) => ({
    url: '/mo/operations/summary',
    params: { ...params }
  }),
  getSpotPriceGraph: (params = null) => ({
    url: `${prefix}/spotPriceGraph`,
    params: { ...params }
  })
};

export default api;
