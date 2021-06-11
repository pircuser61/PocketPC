import {autorun, makeAutoObservable, when} from 'mobx';
import {configure} from 'mobx';
import {alertActions} from '../constants/funcrions';

const palletInfoModel = {
  CodDep: '',
  CodFirm: '',
  CodOb: '',
  CodShop: '',
  Comment: '',
  Floor: '',
  NameFirm: '',
  NumPal: '',
  Place: '',
  Rack: '',
  Sector: '',
  ready: false,
};

configure({
  enforceActions: 'never',
});

class RelocaPalletsteStore {
  constructor() {
    makeAutoObservable(this);
    when(() => {
      //console.log(this.changeLocation);
    });
  }

  palletNumber = '';
  loadingPalletInfo = false;
  fullPalletInfo = palletInfoModel;
  changeLocation = {Sector: '', Rack: '', Floor: '', Place: ''};

  clearFullPalletInfo = () => {
    this.fullPalletInfo = palletInfoModel;
  };

  resetStore = () => {
    this.palletNumber = '';
    this.loadingPalletInfo = false;
    this.fullPalletInfo = palletInfoModel;
  };
}

export default RelocaPalletsteStore = new RelocaPalletsteStore();
