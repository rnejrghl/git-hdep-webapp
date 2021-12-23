const prefix = '/mm';
const prefixCommon = '/common';

const api = {
  getUsers: (params = null) => ({
    url: `${prefix}/users`,
    params: { ...params }
  }),
  getUser: userId => ({
    url: `${prefix}/user`,
    params: { userId }
  }),
  createUser: (params = null) => ({
    url: `${prefix}/user`,
    params: { ...params }
  }),
  updateUser: (params = null) => ({
    url: `${prefix}/uUser`,
    params: { ...params }
  }),
  deleteUser: userSeq => ({
    url: `${prefix}/user/${userSeq}`,
    params: {}
  }),
  // gw 관리
  getGWGroupList: (params = null) => ({
    url: `${prefix}/gtwyGroup`,
    params: { ...params }
  }),
  getGWDeviceList: (params = null) => ({
    url: `${prefix}/gtwyDvce`,
    params: { ...params }
  }),
  createGWItem: (params = null) => ({
    url: `${prefix}/gtwyGroup`,
    params: { ...params }
  }),
  updateGWDevice: (params = null) => ({
    url: `${prefix}/uGtwyDvce`,
    params: { ...params }
  }),
  /** 디바이스 관리 */

  getDeviceList: (params = null) => ({
    url: `${prefix}/dvces`,
    params: { ...params }
  }),
  updateDeviceList: (params = []) => ({
    url: `${prefix}/uDvce`,
    params: [...params]
  }),

  // 계산식
  getDeviceFormula: (params = null) => ({
    url: `${prefix}/dvceCalc`,
    params: { ...params }
  }),
  createDeviceFormula: (params = []) => ({
    url: `${prefix}/dvceCalc`,
    params: [...params]
  }),
  deleteDeviceFormula: (dvceId, calcSeq) => ({
    url: `${prefix}/dvceCalc/${dvceId}/${calcSeq}`,
    params: {}
  }),

  // 알람 계산식
  getDeviceAlarmFormula: (params = null) => ({
    url: `${prefix}/dvalCalc`,
    params: { ...params }
  }),
  createDeviceAlarmFormula: (params = []) => ({
    url: `${prefix}/dvalCalc`,
    params: [...params]
  }),
  deleteDeviceAlarmFormula: (alrtCd, calcSeq) => ({
    url: `${prefix}/dvalCalc/${alrtCd}/${calcSeq}`,
    params: {}
  }),
  /** 사이트 관리 */

  getSiteList: (params = null) => ({
    url: `${prefix}/siteGtwy`,
    params: { ...params }
  }),
  getSite: (params = null) => ({
    url: `${prefix}/siteInfo`,
    params: { ...params }
  }),
  createGWGroup: (params = null) => ({
    url: `${prefix}/gtwyGroup`,
    params: { ...params }
  }),

  /** 메뉴 관리 */
  getMenuRoleList: () => ({
    url: `${prefix}/menuRoleMng`,
    params: {}
  }),
  getMenuRole: (params = null) => ({
    url: `${prefix}/authMenuRole`,
    params: { ...params }
  }),
  createMenuRole: (params = null) => ({
    url: `${prefix}/menuRoleMng`,
    params: { ...params }
  }),
  deleteMenuRole: (menuRoleId = null) => ({
    url: `${prefix}/menuRoleMng/${menuRoleId}`,
    params: {}
  }),
  updateMenuRole: (menuRoleId, params = null) => ({
    url: `${prefix}/uAuthMenuRole?menuRoleId=${menuRoleId}`,
    params: [...params]
  }),
  /** 코드 관리 */
  getCodePpsList: () => ({
    url: `${prefix}/codePps`,
    params: {}
  }),
  createCodePp: (params = null) => ({
    url: `${prefixCommon}/codePp`,
    params: { ...params }
  }),
  updateCodePp: (params = null) => ({
    url: `${prefixCommon}/uCodePp`,
    params: { ...params }
  }),
  updateCode: (params = null) => ({
    url: `${prefixCommon}/uCode`,
    params: { ...params }
  }),
  getCodeList: () => ({
    url: `${prefixCommon}/codes`,
    params: {}
  }),
  getCodeItem: (params = null) => ({
    url: `${prefixCommon}/codes`,
    params: { ...params }
  }),

  createCode: (params = null) => ({
    url: `${prefixCommon}/code`,
    params: { ...params }
  }),
  deleteCode: (params = null) => ({
    url: `${prefixCommon}/dCodeDel`,
    params: { ...params }
  }),
  /** 디바이스 알람 관리 */
  getDeviceAlramList: (params = null) => ({
    url: `${prefix}/dvceAlrms`,
    params: { ...params }
  }),
  updateDeviceAlram: (params = null) => ({
    url: `${prefix}/uDvceAlrm`,
    params: { ...params }
  }),
  // 계산식 조회
  getSelectCalc: (params = null) => ({
    url: `${prefix}/dvalCalc`,
    params: { ...params }
  }),
  createCalc: (params = null) => ({
    url: `${prefix}/dvalCalc`,
    params: { ...params }
  }),
  updateCalc: (params = null) => ({
    url: `${prefix}/uDvceAlrmCalc`,
    params: { ...params }
  }),
  deleteCalc: (params = null) => ({
    url: `${prefix}/dvalCalc`,
    params: [...params]
  }),
  /** 조회권한 관리 */
  getInqRoleList: () => ({
    url: `${prefix}/inqRole`,
    params: {}
  }),
  deleteInqRole: inqGrpId => ({
    url: `${prefix}/inqRole/${inqGrpId}`,
    params: {}
  }),
  // getNonSelectedList: (params = null) => ({
  //   url: `${prefix}/prjSite`,
  //   params: { ...params }
  // }),
  // getSelectedList: (params = null) => ({
  //   url: `${prefix}/inrlSite`,
  //   params: { ...params }
  // }),
  getRoleData: (params = null) => ({
    url: `${prefix}/devOpt`,
    params: { ...params }
  }),
  createRoleItem: (params = null) => ({
    url: `${prefix}/inqRole`,
    params: { ...params }
  }),
  updateRoleSiteList: (params = []) => ({
    url: `${prefix}/inrlSite`,
    params: [...params]
  }),
  /** SMS/EMAIL발송 이력 */
  getMailList: (params = null) => ({
    url: `${prefix}/sendHists`,
    params: { ...params }
  }),
  resendMail: (params = null) => ({
    url: `${prefix}/reSendHist`,
    params: { ...params }
  }),
  createNoti: (params = null) => ({
    url: `${prefix}/iNoti`,
    params: { ...params }
  }),
  updateNoti: (params = null) => ({
    url: `${prefix}/uNoti`,
    params: { ...params }
  }),
  deleteNoti: notiId => ({
    url: `${prefix}/dNoti/${notiId}`,
    params: {}
  }),
  /** 다국어 */
  getLangList: () => ({
    url: `${prefixCommon}/langList`,
    params: {}
  }),
  createLang: (params = null) => ({
    url: `${prefixCommon}/langInsert`,
    params: { ...params }
  }),
  updateLang: (params = null) => ({
    url: `${prefixCommon}/langUpdate`,
    params: { ...params }
  })
};

export default api;
