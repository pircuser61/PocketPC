export const test_user_redux = {
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
};

export const test_user_mobx = {
  Error: 'False',
  ErrorCode: '0',
  UserName: 'Иванов Сергей Алексеевич',
  UserToken: 'x9qTT8b1voIqmUiWfEQzPaX3rc',
  UserUID: '22064',
  'base.type': 'learn',
  'city.cod': '1',
  'city.name': 'Санкт-Петербург',
  'creal-base': 'no',
  deviceName: 'pocket-cast1-m1',
};

export const test_podrazd = {
  CodOb: '100',
  GroupID: '0',
  Id: '201',
  Name: 'Торговый Зал М1',
};
