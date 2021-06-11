import {autorun, makeAutoObservable} from 'mobx';
import {configure} from 'mobx';

configure({
  enforceActions: 'never',
});

class NakladNayaStore {
  constructor() {
    makeAutoObservable(this);
  }
  loading = false;
  nakladnayaInfo = {IdNum: '', ListOb: [], answer: false, numNakl: ''};
  cityList = [];
  choosenCities = [];
  newListForEveryItem = [];

  resetStore = () => {
    this.loading = false;
    this.nakladnayaInfo = {IdNum: '', ListOb: [], answer: false, numNakl: ''};
    this.cityList = [];
    this.choosenCities = [];
    this.newListForEveryItem = [];
  };
}

export default NakladNayaStoreExport = new NakladNayaStore();
