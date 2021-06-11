const initialState = {
  appready: false,
  user: {
    user: {
      $: {
        Error: 'False',
        ErrorCode: '0',
        'base.type': 'learn',
        'city.cod': '1',
        'city.name': 'Санкт-Петербург',
        'creal-base': 'no',
      },
      TokenData: [
        {
          $: {
            UserName: 'Иванов Сергей Алексеевич',
            UserToken: 'XFzM9sKpWAs4RZcIpLDP0yB2l4k',
            UserUID: '22064',
          },
        },
      ],
      PermitList: [
        {
          $: {Permit4Proc: 'maxstore.p'},
          Permit: [
            {
              $: {
                Descr: 'Мобильное приложение для телефона',
                ParentMenu: '',
                ProcName: 'maxstore.p',
                TrigName: '',
                isAvail: '1',
              },
            },
            {
              $: {
                Descr: 'Маршрутные листы',
                ParentMenu: 'm-oper',
                ProcName: 'maxstore.p',
                TrigName: 'view-marsh-list',
                isAvail: '1',
              },
            },
            {
              $: {
                Descr: 'Просмотр Марш.Листов других водителей',
                ParentMenu: 'view-marsh-list',
                ProcName: 'maxstore.p',
                TrigName: 'view-other-drivr',
                isAvail: '1',
              },
            },
          ],
        },
      ],
    },
    deviceName: 'pocket-cast1-m1',
  },
  menuList: {},
  podrazd: {CodOb: '100', GroupID: '0', Id: '909', Name: 'Торговый Зал М1'},
  palletsInWork: [],
  currentPallete: {},
};

//{"CodOb": "100", "GroupID": "0", "Id": "901", "Name": "Торговый Зал М1"}
//  user: {"user":{"$":{"Error":"False","ErrorCode":"0","base.type":"learn","city.cod":"1","city.name":"Санкт-Петербург","creal-base":"no"},"TokenData":[{"$":{"UserName":"Иванов Сергей Алексеевич","UserToken":"XFzM9sKpWAs4RZcIpLDP0yB2l4k","UserUID":"22064"}}],"PermitList":[{"$":{"Permit4Proc":"maxstore.p"},"Permit":[{"$":{"Descr":"Мобильное приложение для телефона","ParentMenu":"","ProcName":"maxstore.p","TrigName":"","isAvail":"1"}},{"$":{"Descr":"Маршрутные листы","ParentMenu":"m-oper","ProcName":"maxstore.p","TrigName":"view-marsh-list","isAvail":"1"}},{"$":{"Descr":"Просмотр Марш.Листов других водителей","ParentMenu":"view-marsh-list","ProcName":"maxstore.p","TrigName":"view-other-drivr","isAvail":"1"}}]}]},"deviceName":"pocket-cast1-m1"},

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
