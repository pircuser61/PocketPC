import {ProvPalSpecsRow} from './types';

export interface BarCodRow {
  Cod: string;
  Quant: string;
  CodLevel: string;
}

export interface BarCod {
  BarCodRow: BarCodRow[] | BarCodRow;
}

export interface ShopRow {
  CodShop: string;
  Qty: string;
}

export interface PlanRow {
  NumPlan: string;
  Qty: string;
  Place: {
    CodDep: string;
    NumStel: string;
    NumSec: string;
    NumPl: string;
  };
}

export interface Shop {
  ShopRow: ShopRow[] | ShopRow;
}

export interface Plan {
  PlanRow: PlanRow[] | PlanRow;
}

export interface GoodsRow {
  CodGood: string;
  IdNum: string;
  QtyDoc: string;
  QtyFact: string;
  QtyUndo: string;
  ScanBarCod: string;
  ScanBarQuant: string;
  DisplayMode: string;
  KatName: string;
  Art: string;
  DepName: string;
  Price: string;
  Flag1: string;
  Field2: string;
  Subgroup: string;
  BarCod: BarCod;
  Palett: Palett;
  Shop: Shop;
  Plan: Plan;
  PalletsList: PalettRow[];
  BcdList: BarCodRow[];
  ShopsList: ShopRow[];
  PlanogramPlaceList: PlanRow[];
}

export interface PalettRow {
  NumPal: string;
  CodShop: string;
  Qty: string;
}

export interface Palett {
  PalettRow: PalettRow[] | PalettRow;
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

export interface PocketProvGoodsDeleteProps {
  ProvPalGoods: ProvPalGoods;
  _DTTM: string;
  _Error: string;
  '_row-count': string;
  _time: string;
  Error: string;
}

export interface PocketProvGoodsCreateProps {
  ProvPalGoods: ProvPalGoods;
  _DTTM: string;
  _Error: string;
  _time: string;
  Error?: string;
}

export interface BottomMenuCheckBarProps {
  goodInfo: GoodsRow | null;
  navigateToCreate: () => void;
  createDeleteAlert: () => void;
  swipeFilter: () => void;
  filter: 'true' | 'false';
  item: ProvPalSpecsRow & {
    NumNakl: string;
  };
  getCurr: () => void;
  getPrev: () => void;
  getNext: () => void;
  relativePosition: {
    first?: {idNum?: string; CodGood?: string};
    last?: {idNum?: string; CodGood?: string};
  };
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

export interface PocketProvperGoodsCreateProps {
  ProvperGoods: ProvperGoods;
  _DTTM: string;
  _Error: string;
  _row_count: string;
  _time: string;
  Error: string;
}
