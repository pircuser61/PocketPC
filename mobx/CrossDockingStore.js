import {autorun, makeAutoObservable} from 'mobx';
import {configure} from 'mobx';

configure({
  enforceActions: 'never',
});

class CrossDockingStore {
  constructor() {
    makeAutoObservable(this);
  }
  loading = false;

  resetStore = () => {
    console.log('Чистка стора CrossDockingStore');
    this.loading = false;
  };
}

export default CrossDockingStoreExport = new CrossDockingStore();
