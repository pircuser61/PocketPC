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
  skipCheck = false;

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
    this.skipCheck = false;
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
        this.specsrow = r.Specs[0].SpecsRow ?? [];
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
