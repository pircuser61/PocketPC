import {autorun, makeAutoObservable, when} from 'mobx';
import {configure} from 'mobx';
import {alertActions} from '../constants/funcrions';
import {MarkHonestSpecs} from '../functions/MarkHonestSpecs';

const itemInfoModel = {
  data: {
    $: {
      CodGood: '',
      GoodQty: '',
      MarkQty: '',
      Name: '',
      SpecsId: '',
      WoMarkQty: '',
    },
    id: '',
  },
};

const AnswerBack = {
  SpecsType: ['pr2'],
  MarkType: ['2'],
  WoMarkLimit: ['0'],
  Specs: [
    {
      SpecsRow: [
        {
          $: {
            CodGood: '1000577837',
            GoodQty: '1',
            MarkQty: '0',
            Name: 'скатерть 180х150см, арт.01шс55-1к-050303',
            SpecsId: '5679608791',
            WoMarkQty: '1',
          },
        },
        {
          $: {
            CodGood: '1001187038',
            GoodQty: '2',
            MarkQty: '0',
            Name: 'полотенце вафельное 65х130см оливковое, арт.ПВ-65',
            SpecsId: '5679608802',
            WoMarkQty: '2',
          },
        },
        {
          $: {
            CodGood: '1000577837',
            GoodQty: '1',
            MarkQty: '0',
            Name: 'скатерть 180х150см, арт.01шс55-1к-050303',
            SpecsId: '5679608791',
            WoMarkQty: '1',
          },
        },
        {
          $: {
            CodGood: '1001187038',
            GoodQty: '2',
            MarkQty: '0',
            Name: 'полотенце вафельное 65х130см оливковое, арт.ПВ-65',
            SpecsId: '5679608802',
            WoMarkQty: '2',
          },
        },
        {
          $: {
            CodGood: '1000577837',
            GoodQty: '1',
            MarkQty: '0',
            Name: 'скатерть 180х150см, арт.01шс55-1к-050303',
            SpecsId: '5679608791',
            WoMarkQty: '1',
          },
        },
        {
          $: {
            CodGood: '1001187038',
            GoodQty: '2',
            MarkQty: '0',
            Name: 'полотенце вафельное 65х130см оливковое, арт.ПВ-65',
            SpecsId: '5679608802',
            WoMarkQty: '2',
          },
        },
        {
          $: {
            CodGood: '1000577837',
            GoodQty: '1',
            MarkQty: '0',
            Name: 'скатерть 180х150см, арт.01шс55-1к-050303',
            SpecsId: '5679608791',
            WoMarkQty: '1',
          },
        },
        {
          $: {
            CodGood: '1001187038',
            GoodQty: '2',
            MarkQty: '0',
            Name: 'полотенце вафельное 65х130см оливковое, арт.ПВ-65',
            SpecsId: '5679608802',
            WoMarkQty: '2',
          },
        },
        {
          $: {
            CodGood: '1000577837',
            GoodQty: '1',
            MarkQty: '0',
            Name: 'скатерть 180х150см, арт.01шс55-1к-050303',
            SpecsId: '5679608791',
            WoMarkQty: '1',
          },
        },
        {
          $: {
            CodGood: '1001187038',
            GoodQty: '2',
            MarkQty: '0',
            Name: 'полотенце вафельное 65х130см оливковое, арт.ПВ-65',
            SpecsId: '5679608802',
            WoMarkQty: '2',
          },
        },
        {
          $: {
            CodGood: '1000577837',
            GoodQty: '1',
            MarkQty: '0',
            Name: 'скатерть 180х150см, арт.01шс55-1к-050303',
            SpecsId: '5679608791',
            WoMarkQty: '1',
          },
        },
        {
          $: {
            CodGood: '1001187038',
            GoodQty: '2',
            MarkQty: '0',
            Name: 'полотенце вафельное 65х130см оливковое, арт.ПВ-65',
            SpecsId: '5679608802',
            WoMarkQty: '2',
          },
        },
        {
          $: {
            CodGood: '1000577837',
            GoodQty: '1',
            MarkQty: '0',
            Name: 'скатерть 180х150см, арт.01шс55-1к-050303',
            SpecsId: '5679608791',
            WoMarkQty: '1',
          },
        },
        {
          $: {
            CodGood: '1001187038',
            GoodQty: '2',
            MarkQty: '0',
            Name: 'полотенце вафельное 65х130см оливковое, арт.ПВ-65',
            SpecsId: '5679608802',
            WoMarkQty: '2',
          },
        },
        {
          $: {
            CodGood: '1000577837',
            GoodQty: '1',
            MarkQty: '0',
            Name: 'скатерть 180х150см, арт.01шс55-1к-050303',
            SpecsId: '5679608791',
            WoMarkQty: '1',
          },
        },
        {
          $: {
            CodGood: '1001187038',
            GoodQty: '2',
            MarkQty: '0',
            Name: 'полотенце вафельное 65х130см оливковое, арт.ПВ-65',
            SpecsId: '5679608802',
            WoMarkQty: '2',
          },
        },
        {
          $: {
            CodGood: '1000577837',
            GoodQty: '1',
            MarkQty: '0',
            Name: 'скатерть 180х150см, арт.01шс55-1к-050303',
            SpecsId: '5679608791',
            WoMarkQty: '1',
          },
        },
        {
          $: {
            CodGood: '1001187038',
            GoodQty: '2',
            MarkQty: '0',
            Name: 'полотенце вафельное 65х130см оливковое, арт.ПВ-65',
            SpecsId: '5679608802',
            WoMarkQty: '2',
          },
        },
      ],
    },
  ],
};

configure({
  enforceActions: 'never',
});

class BackToPostavshikStore {
  constructor() {
    makeAutoObservable(this);
    when(() => {
      //console.log(this.Filter);
    });
  }

  documentNumber = '';
  specsrow = [];
  Filter = {value: '3', name: 'Все товары'};
  itemInfo = itemInfoModel;
  loadingListOfSpecs = false;

  setDocumentNumber = data => {
    this.documentNumber = data;
  };

  setFilter = key => {
    switch (key) {
      case '1':
        this.Filter = {value: '1', name: 'Требуется КМ'};
        break;
      case '2':
        this.Filter = {value: '2', name: 'C расхождениями'};
        break;
      default:
        this.Filter = {value: '3', name: 'Все товары'};
        break;
    }
  };

  resetStore = () => {
    this.documentNumber = '';
    this.specsrow = [];
    this.Filter = {value: '3', name: 'Все товары'};
    this.itemInfo = itemInfoModel;
    this.loadingListOfSpecs = false;
  };

  getSpecsList = (
    user = '',
    city = '',
    action = () => {},
    onError = () => {},
  ) => {
    this.loadingListOfSpecs = true;
    MarkHonestSpecs(this.documentNumber, this.Filter.value, 'vozp', user, city)
      .then(r => {
        this.specsrow = r.Specs[0].SpecsRow;
        action();
        this.loadingListOfSpecs = false;
      })
      .catch(e => {
        onError();
        alertActions(e);
        this.loadingListOfSpecs = false;
      });
  };

  getSpecPosition = () => {};
}

export default BackToPostavshikStoreExport = new BackToPostavshikStore();
//81342511
