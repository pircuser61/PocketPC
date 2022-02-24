import {test_podrazd, test_user_redux} from '../test_data/test_values';

const initialState = {
  appready: false,
  user: false,
  podrazd: {
    CodOb: '',
    GroupID: '',
    Id: '',
    Name: '',
  },
  menuList: {},
  palletsInWork: [],
  currentPallete: {},
};

export const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SETUSER':
      return {...state, user: action.payload};
    case 'SETAPPREADY':
      return {...state, appready: action.payload};
    case 'SETMENULIST':
      return {...state, menuList: action.payload};
    case 'SETPODRAZD':
      return {...state, podrazd: action.payload};
    case 'SETPALLETSLISTINPRIEMMESTNYH':
      return {...state, palletsInWork: action.payload};
    case 'RESETAPP':
      return {...initialState};
    case 'SETSAS':
      return {...state, sas: action.payload};
    default:
      return state;
  }
};

export const setUser = user => ({type: 'SETUSER', payload: user});
export const setAppReady = () => ({type: 'SETAPPREADY', payload: true});
export const setMenuList = list => ({type: 'SETMENULIST', payload: list});
export const setsas = list => ({type: 'SETSAS', payload: list});
export const setPodrazd = podrazd => ({type: 'SETPODRAZD', payload: podrazd});
export const resetApp = () => ({type: 'RESETAPP'});
export const setPalletsListInPriemMestnyh = list => ({
  type: 'SETPALLETSLISTINPRIEMMESTNYH',
  payload: list,
});

export const setPalletsListInPriemMestnyhTHUNK = list => (
  dispatch,
  getState,
) => {
  dispatch(setPalletsListInPriemMestnyh(list));
};

export const setUserThunk = user => dispatch => {
  dispatch(setUser(user));
};

export const setPodrazdThunk = podrazd => dispatch => {
  dispatch(setPodrazd(podrazd));
};

export const exitToAuthThunk = () => dispatch => {
  dispatch(resetApp());
};
