import React, {FC} from 'react';
import {RefreshControl, StyleSheet, Text, View} from 'react-native';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
import {
  data_provider,
  SCREEN_WIDTH,
  ViewTypes,
} from '../../constants/funcrions';

interface Props {
  itemHeight: number;
  data: any[];
  customref?: React.RefObject<any>;
  refreshing: boolean;
  onScroll?: any;
  _rowRenderer: (type: any, data: any) => React.ReactElement;
  onRefresh?: () => void;
  Header?: FC;
}

const RecycleList = (props: Props) => {
  const _layoutProvider = new LayoutProvider(
    index => {
      return ViewTypes.FULL;
    },
    (type, dim) => {
      switch (type) {
        case ViewTypes.FULL:
          dim.width = SCREEN_WIDTH;
          dim.height = props.itemHeight;
          break;
        default:
          dim.width = 0;
          dim.height = 0;
      }
    },
  );
  _layoutProvider.shouldRefreshWithAnchoring = false;

  const dataProvider = data_provider(props.data);

  if (props.data.length === 0) {
    return null;
  }

  const {Header} = props;

  return (
    <>
      {Header && <Header />}
      <RecyclerListView
        onRecreate={e => console.log(e)}
        onScroll={props.onScroll}
        optimizeForInsertDeleteAnimations={true}
        ref={props.customref}
        layoutProvider={_layoutProvider}
        dataProvider={dataProvider}
        rowRenderer={props._rowRenderer}
        scrollViewProps={{
          refreshing: props.refreshing,
          refreshControl: props.data.length > 0 && (
            <RefreshControl
              refreshing={props.refreshing}
              onRefresh={props.onRefresh}
            />
          ),
        }}
      />
    </>
  );
};

export default RecycleList;

const styles = StyleSheet.create({});
