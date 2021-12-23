import { fetch as type } from '@/store/types';

const initialState = {
  item: {},
  page: {},
  list: [],
  multipleList: {}
};

const fetch = (state = initialState, action) => {
  switch (action.type) {
    case type.SET_ITEM:
      return {
        ...state,
        item: action.payload
      };
    case type.SET_PAGE:
      return {
        ...state,
        page: action.payload
      };
    case type.SET_LIST:
      return {
        ...state,
        list: action.payload
      };
    case type.SET_MULTIPLE_LIST:
      return {
        ...state,
        multipleList: {
          ...state.multipleList,
          ...action.payload
        }
      };
    // reset
    case type.RESET_ITEM:
      return {
        ...state,
        item: {}
      };
    case type.RESET_LIST:
      return {
        ...state,
        list: []
      };
    case type.RESET_MULTIPLE_LIST:
      return {
        ...state,
        multipleList: {}
      };
    case type.RESET_ALL:
      return initialState;
    case type.RESET_PAGE:
      return {
        ...state,
        page: {}
      };
    default:
      return state;
  }
  // switch (action.type) {
  //   case type.LOADING_START:
  //     return {
  //       ...state,
  //       isLoading: action.payload.isLoading,
  //     };
  //   case type.LOADING_END:
  //     return {
  //       ...state,
  //       isLoading: action.payload.isLoading,
  //     };
  //   case type.SET_ITEM:
  //     return {
  //       ...state,
  //       item: action.payload.item
  //     }
  //   case type.LIST:
  //     return {
  //       ...state,
  //       list: action.payload.list,
  //     };
  //   case type.MULTIPLE_LIST:
  //     return {
  //       ...state,
  //       multipleList: { ...state.multipleList, ...action.payload.item },
  //     };
  //   case type.RESET_MULTIPLE_LIST:
  //     return {
  //       ...state,
  //       multipleList: {},
  //     };
  //   case type.UPDATE:
  //     return {
  //       ...state,
  //       item: action.payload.item,
  //     };
  //   default:
  //     return state;
  // }
};

export default fetch;
