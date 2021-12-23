const prefix = '/wo';

const api = {
  getList: (params = null) => ({
    url: `${prefix}/workOrders`,
    params: { ...params }
  }),
  updateEndDateList: (params = null) => ({
    url: `${prefix}/uCmplReqDt`,
    params: { ...params }
  }),
  postNoticeSend: (params = null) => ({
    url: `${prefix}/reNotiSend`,
    params: { ...params }
  }),
  createWorkOrder: (params = null) => ({
    url: `${prefix}/workOrder`,
    params: { ...params }
  }),
  deleteWorkOrder: (params = null) => ({
    url: `${prefix}/dWorkOrder`,
    params: { ...params }
  }),
  completeWorkOrder: (params = null) => ({
    url: `${prefix}/uWorkOrderCmpl`,
    params: { ...params }
  }),
  checkWorkOrder: (params = null) => ({
    url: `${prefix}/uWorkOrderCnfm`,
    params: { ...params }
  }),
  rejectWorkOrder: (params = null) => ({
    url: `${prefix}/rWorkOrder`,
    params: { ...params }
  }),
  getWorkOrderDetail: (params = null) => ({
    url: `${prefix}/workOrder`,
    params: { ...params }
  }),
  createWorkOrderResult: (params = null) => ({
    url: `${prefix}/wkodHdtl`,
    params: { ...params }
  }),
  updateWorkOrderResult: (params = null) => ({
    url: `${prefix}/uWorkOrder`,
    params: { ...params }
  })
};

export default api;
