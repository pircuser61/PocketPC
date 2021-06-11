import {autorun, makeAutoObservable, when} from 'mobx';
import {configure} from 'mobx';

const FullInfoAboutItem = {
  ArtName: '',
  QtyThisDbsood: '',
  CodGood: '',
  KatName: '',
  QtyOtherZnp: '',
  QtyPal: '',
  QtyReqd: '',
};

configure({
  enforceActions: 'never',
});

class PerepalechivanieStore {
  constructor() {
    makeAutoObservable(this);
    when(() => {
      //console.log(JSON.stringify(this.palletsList));
      //console.log(Array.isArray(this.checkQtyMergeList));
    });
  }

  parrentId = '';
  loadingNumZadanya = false;
  loadingPalletFrom = false;
  palletsList = [];
  numZadanya = '';
  numpalFrom = '';
  itemsList = [];
  skipCheck = false;
  itemInfo = FullInfoAboutItem;
  choseQtyList = [];
  checkQtyMergeList = [];

  exitFromWorkWithItemNeworEdit = () => {
    this.itemInfo = FullInfoAboutItem;
    this.choseQtyList = [];
  };

  resetStore = () => {
    this.parrentId = '';
    this.loadingNumZadanya = false;
    this.loadingPalletFrom = false;
    this.palletsList = [];
    this.numZadanya = '';
    this.numpalFrom = '';
    this.itemsList = [];
    this.skipCheck = false;
    this.itemInfo = FullInfoAboutItem;
    this.choseQtyList = [];
    this.checkQtyMergeList = [];
  };
}

export default PerepalechivanieStore = new PerepalechivanieStore();
