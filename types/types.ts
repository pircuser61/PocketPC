import BottomSheet from 'reanimated-bottom-sheet';

export interface PalletInListCheck {
  Flag?: '#' | '@' | '';
  ID?: string;
  Comment?: string;
  CodShop?: string;
  CodDep?: string;
  UID?: string;
  id: number;
}

export interface CustomModalProps {
  visible: boolean;
  setmodalVisible: (visible: boolean) => void;
  children?: React.ReactNode;
  onShow?: () => void;
}

export interface Podrazd {
  CodOb: string;
  GroupID: string;
  Id: string;
  Name: string;
}

export interface User {
  Error: string;
  ErrorCode: string;
  UserName: string;
  UserToken: string;
  UserUID: string;
  'base.type': string;
  'city.cod': string;
  'city.name': string;
  'creal-base': string;
  deviceName: string;
}

export interface BottomSheetProps {
  heignt?: number;
  customref?: React.RefObject<BottomSheet> | null;
}

export interface ActionButtonObj {
  name: string;
  action?: () => void;
}

export interface Place {
  Floor: string;
  Place: string;
  Rack: string;
  Sector: string;
  _type: string;
}

export interface ProvPalSpecsRowElement {
  NumDoc: string;
  Stat: string;
  Flag: string;
  DocInf: string;
}

//{"NumDoc":"1033","Stat":"-","Flag":"#","DocInf":""}

export interface ProvPalSpecsRow {
  NumDoc: string;
  Stat: string;
  Flag: string;
  DocInf: string;
  Place?: Place;
  id?: number;
}

export interface ProvPalSpecs {
  ProvPalSpecsRow: ProvPalSpecsRow[] | ProvPalSpecsRow;
}

export interface PocketProvSpecsListProps {
  ProvPalSpecs: ProvPalSpecs;
  _Error: string;
  Error: string;
}

export interface BarCodRow {
  Cod: string;
  Quant: string;
  CodLevel: string;
}

export interface PalettRow {
  NumPal: string;
  CodShop: string;
  Qty: string;
}

export interface PalettWothRow {
  PalettRow: PalettRow[] | PalettRow;
}

export interface GoodsRow {
  CodGood?: string | undefined;
  IdNum?: string;
  QtyDoc?: string;
  QtyFact?: string;
  QtyUndo?: string;
  KatName?: string;
  Art?: string;
  DepName?: string;
  Price?: string;
  Flag1?: string;
  QtyLog: string;
  ScanBarCod: string;
  ScanBarQuant: string;
  Flag2?: string;
  Subgroup?: string;
  DisplayMode?: string;
  BarCod: {BarCodRow: BarCodRow[] | BarCodRow};
  Palett: PalettWothRow | Palett[] | Palett;
  Shop: Shop;
}
export interface Shop {
  Error: string;
  ShopRow: ShopRow[] | ShopRow;
}
export interface ShopRow {
  CodShop: string;
  Qty: string;
}

export interface ProvPalGoods {
  GoodsRow: GoodsRow;
}

export interface PocketProvGoodsGetAnswer {
  ProvPalGoods: ProvPalGoods;
  _DTTM: string;
  _Error: string;
  '_row-count': string;
  _time: string;
  Error?: string;
}

export interface BarCod {
  Cod: string;
  Quant: string;
  CodLevel: string;
}

export interface Palett {
  NumPal: string;
  CodShop: string;
  Qty: string;
}

export interface MenuActionProps {
  title: string;
  disabled?: boolean;
  action: () => void;
  needChevrone?: boolean;
  readyMark?: boolean;
  close?: boolean;
  icon?: string;
  loading?: boolean;
}

export interface DepartRow {
  CodDep: string;
  Qty: string;
}

export interface Depart {
  DepartRow: DepartRow | DepartRow[];
}

export interface PocketProvDepsProps {
  Depart: Depart;
  _DTTM: string;
  _Error: string;
  _row_count: string;
  _time: string;
  Error?: string;
}

export interface PocketProvGoodsSetProps {
  City?: string;
  UID?: string;
  Type?: string;
  NumNakl?: string;
  NumDoc?: string;
  IdNum?: string;
  Cmd?: '0' | '1' | '-1' | null;
  Field2?: 'true' | 'false' | '';
  Qty?: string;
}

export interface PalletInfoProps {
  CodDep: string;
  CodFirm: string;
  CodOb: string;
  CodShop: string;
  Comment: string;
  Floor: string;
  NameFirm: string;
  NumPal: string;
  Place: string;
  Rack: string;
  Sector: string;
  ready: boolean;
}

export interface ProvPalGoods {
  GoodsRow: GoodsRow;
}

export type TaskStatus = 'Error' | 'Pending' | 'None';

export interface PocketProvGoodsCreateProps {
  ProvPalGoods: ProvPalGoods;
  _DTTM: string;
  _Error: string;
  _time: string;
  Error?: string;
}

export interface ProvperRow {
  NumProv: string;
  Comment: string;
  CodShop: string;
  TaskId: string;
  TaskStatus: TaskStatus;
  TaskMessage: string;
}

export interface Provper {
  ProvperRow: ProvperRow | ProvperRow[];
}

export interface PocketProvperListProps {
  Provper: Provper;
  _DTTM: string;
  _Error: string;
  _row_count: string;
  _time: string;
  Error?: string;
}

export type AddGoodsInCheckScreenParamsProps = {
  title: string;
  inputtitle: string;
  action: (str: string) => Promise<void>;
  bot?: string;
};

export type PlanogrammaNavProps = {
  PlanogrammaStart: undefined;
  PlanogrammaWorkWithPallet: {planNum: string; canedit: boolean};
  AddOrFindGood: AddGoodsInCheckScreenParamsProps;
};

export type ProverkaNakladnyhNavProps = {
  ProverkaNakadnyhStart: {
    Type: '0' | '1' | '';
  };
  AddGoodsInNakladnayaScreen: AddGoodsInCheckScreenParamsProps;
  AddNakladnyaScreen: {
    NumProv: string;
    createOrNavNakl: (
      NumNakl: string,
      isSecondScreen?: boolean,
    ) => Promise<void>;
  };
  FilterNakladnyhScreen: {
    getList: (filterShop: string, type: '0' | '1' | '') => void;
  };
  WorkWithNakladnaya: {
    NumProv: string;
  };
  GoodsListScreenInProverka: {
    NumProv: string;
    NumNakl: string;
    getCurrNakladnaya: (
      NumNakl: string,
      isSecondScreen?: boolean,
    ) => Promise<void>;
  };
  CreateProverka: {
    addElementToList: (newList: {
      CodShop: string;
      Comment: string;
      NumProv: string;
      Provper: ProvperRow[];
    }) => void;
  };
};

export interface PocketProvperReportProps {
  EmptyPer: string;
  EmptyFact: string;
  HasDiff: string;
  Ok: string;
  _DTTM: string;
  _Error: string;
  _row_count: string;
  _time: string;
  Error?: string;
}

export interface ShopsRow {
  CodShop: string;
  NameShop: string;
}

export interface Shops {
  ShopsRow: ShopsRow[] | ShopsRow;
}

export interface PocketProvperShopsProps {
  Shops: Shops;
  _DTTM: string;
  _Error: string;
  _row_count: string;
  _time: string;
  Error?: string;
}

export interface ProvperSpecsRow {
  NumNakl: string;
  Stat: string;
  DtNakl: string;
  ShopFrom: string;
  Place: string;
  MasterType: string;
  MasterNum: string;
}

export interface PocketProvperSpecsProps {
  ProvperSpecsRow: ProvperSpecsRow;
  _DTTM: string;
  _Error: string;
  _row_count: string;
  _time: string;
  Error?: string;
  Reason?: string;
}

export interface ProvperGoodsRow {
  CodGood: string;
  IdNum: string;
  KatName: string;
  Price: string;
  QtyFact: string;
  QtyNakl: string;
}

export interface NakladnayaSpeckInterface {
  Cmd: 'first' | 'last' | 'prev' | 'next' | 'create' | 'curr';
  NumNakl?: string;
  isSecondScreen?: boolean;
  isFilter: 'true' | 'false';
}

export interface ProvperGoodsRow {
  IdNum: string;
  NumPos: string;
  CodGood: string;
  QtyNakl: string;
  QtyFact: string;
  KatName: string;
  Price: string;
}

export interface ProvperGoods {
  ProvperGoodsRow: ProvperGoodsRow;
}

export interface PocketProvperGoodsListProps {
  WasShipment?: string;
  ProvperGoods: ProvperGoods;
  _DTTM: string;
  _Error: string;
  _row_count: string;
  _time: string;
  Error: string;
}

export interface ProverkaHeaderTitle {
  firstScreen: string;
  secondScreen: string;
  thirdScreen: string;
  fourScreen: string;
}

export interface ProvPalSpecsNew {
  ProvPalSpecsRow: ProvPalSpecsRow;
}

export interface PocketProvSpecsCreateProps {
  ProvPalSpecs: ProvPalSpecsNew;
  _Error: string;
  Error: string;
}

export type GlobalCheckNavProps = {
  GlobalProverka: undefined;
  CreateCheckScreen: undefined;
  WorkWithCheck: {item: PalletInListCheck};
  DocumentCheckScreen: {
    item: ProvPalSpecsRow & {NumNakl: string};
    action: (needAlert?: boolean) => Promise<void>;
    QRDocType: string;
  };
  CreatePalletInCheckScreen: {
    NumNakl: string;
    createDocument: (props: {
      NumDoc: string;
      isNextScreen?: boolean;
    }) => Promise<void>;
  };
  PrintCheckScreen: undefined;
  AddGoodsInCheckScreen: AddGoodsInCheckScreenParamsProps;
};
