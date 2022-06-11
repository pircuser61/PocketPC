import React, {useEffect, useRef, useState} from 'react';
import {TouchableOpacity, View, StyleSheet, Image, Text} from 'react-native';
import {DataProvider, LayoutProvider, RecyclerListView} from 'recyclerlistview';
import HeaderPriemka from '../../components/PriemkaNaSklade/Header';
import LoadingModalComponent from '../../components/SystemComponents/LoadingModalComponent';
import SimpleButton from '../../components/SystemComponents/SimpleButton';
import {alertError, alertMsg, SCREEN_WIDTH} from '../../constants/funcrions';
import useIsMounted from '../../customHooks/UseMountedHook';
import useScanner from '../../customHooks/simpleScanHook';
import request, {requestGS} from '../../functions/pocketRequestN';
import SimpleDlg from '../../components/SystemComponents/SimpleDlg';

interface IQR {
  _GTIN: string;
  _MarkId: string;
  _Serial: string;
}

interface IQRList {
  Mark: {MarkRow: IQR[]};
  SelIndx: number;
  Exists?: boolean;
}

const LI_WITDH = SCREEN_WIDTH - 20;
const LI_HEIGHT = 44;
const ROW_HEGHT = 40;
const layoutProvider = new LayoutProvider(
  _ => 0,
  (_, dim) => {
    dim.width = LI_WITDH;
    dim.height = LI_HEIGHT;
  },
);

const MarkHonest = (props: any /*{navigation, route, user}*/) => {
  const {NumProv, NumPal, IdNum, SpecsType, QtyReqd} = props.route.params;

  console.log(
    'RENDER :' +
      'NumNakl ' +
      NumProv +
      ' ' +
      NumPal +
      ' ' +
      IdNum +
      ' ' +
      SpecsType,
  );

  const isMounted = useIsMounted();
  const [loading, setLoading] = useState(true);
  const [deleteDlg, setDeleteDlg] = useState(false);
  const listRef = useRef<any>();
  useEffect(() => {
    getQRList();
  }, []);
  const selRow = useRef<IQR | null>(null);
  const dpRef = useRef(new DataProvider((r1, r2) => r1 !== r2));

  const parseParam = {arrayAccessFormPaths: ['MarkHonestDoc.Mark.MarkRow']};
  const onScan = async (data: string, type: string) => {
    try {
      const GS = '\u001D';
      switch (type) {
        case 'LABEL-TYPE-DATAMATRIX': {
          if (
            data.slice(0, 2) !== '01' ||
            data.slice(16, 18) !== '21' ||
            data[31] !== GS
          )
            throw `Код маркировки не удовлетворяет условиям!\n\nСканировано: ${data}`;
          break;
        }
        case 'LABEL-TYPE-CODE128':
        case 'LABEL-TYPE-EAN128': {
          if (data.slice(0, 2) !== '00' && data.slice(0, 4) !== '(00)')
            throw `Упаковочный код не удовлетворяет условиям!\n\nСканировано: ${data}`;
          else throw `Упаковочные КМЧЗ не поддерживаются.`;
          break;
        }
        default:
          throw `Неподходящий тип баркода: ${type}\n\nСканировано: ${data}`;
      }
      getQRList({QR: data, NaklNum: NumPal, ParentNum: NumProv});
    } catch (error) {
      if (isMounted.current) alertError(error);
    }
  };
  useScanner(onScan);

  const getQRList = async (cmd?: object) => {
    console.log(cmd);
    try {
      if (!isMounted.current) return;
      setLoading(true);
      const req = {SpecsId: IdNum, DocType: SpecsType};
      if (cmd) Object.assign(req, cmd);
      let result: IQRList;
      if (cmd?.hasOwnProperty('QR'))
        result = await requestGS('MarkHonestDoc', req, parseParam);
      else result = await request('MarkHonestDoc', req, parseParam);

      if (isMounted.current) {
        dpRef.current = dpRef.current.cloneWithRows(result?.Mark.MarkRow ?? []);
        if (result?.SelIndx) {
          selRow.current = result?.Mark.MarkRow[result?.SelIndx];
          listRef?.current?.scrollToIndex(result?.SelIndx, true);
        } else selRow.current = null;

        setLoading(false);
        if (result?.Exists) alertMsg('Код маркировки уже есть в списке!');
      }
    } catch (error) {
      if (isMounted.current) {
        alertError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const rowRender = (_: any, qr: IQR) => {
    return (
      <TouchableOpacity
        style={
          qr._MarkId == selRow.current?._MarkId ? styles.selectedLI : styles.LI
        }
        delayLongPress={500}
        onLongPress={() => {
          selRow.current = qr;
          setDeleteDlg(true);
        }}>
        <Cell>{qr._GTIN} </Cell>
        <Cell>{qr._Serial} </Cell>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        flex: 1,
      }}>
      <HeaderPriemka
        title={'Сканирование кодов маркировки'}
        navigation={props.navigation}
      />

      <View
        style={{
          flex: 1,
          paddingLeft: 10,
          paddingRight: 10,
          borderBottomWidth: 1,
        }}>
        <Text style={styles.label}>
          {'Сканировано: ' + dpRef.current.getSize() + ' из ' + QtyReqd}
        </Text>

        <View style={styles.ListHeader}>
          <Cell>GTIN</Cell>
          <Cell>Serial</Cell>
        </View>
        {dpRef.current.getSize() > 0 ? (
          <RecyclerListView
            ref={listRef}
            layoutProvider={layoutProvider}
            dataProvider={dpRef.current}
            rowRenderer={rowRender}
            optimizeForInsertDeleteAnimations={false}
          />
        ) : (
          <View>
            <Image
              source={require('../../assets/datamatrix.png')}
              style={styles.image}
            />
            <Text style={styles.emptyListText}>Cканируйте код маркировки</Text>
          </View>
        )}
        <LoadingModalComponent modalVisible={loading} />
      </View>
      <SimpleButton
        text="Обновить"
        onPress={getQRList}
        active={!loading}
        containerStyle={styles.updateButton}
      />
      {deleteDlg && (
        /*selRow.current && */ <SimpleDlg
          onCancel={() => setDeleteDlg(false)}
          onSubmit={() => {
            setDeleteDlg(false);
            getQRList({
              deleteMark: selRow.current?._MarkId,
              NaklNum: NumPal,
              ParentNum: NumProv,
            });
          }}>
          <Text style={styles.label}> Удалить код маркировки?</Text>
          <Text style={styles.label}>
            {selRow.current?._GTIN} {selRow.current?._Serial}
          </Text>
        </SimpleDlg>
      )}
    </View>
  );
};

const Cell = ({children}: {children?: React.ReactNode}) => (
  <View style={styles.cell}>
    <Text style={styles.colItem}>{children}</Text>
  </View>
);

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    opacity: 0.6,
    marginTop: 100,
  },
  emptyListText: {
    fontSize: 18,
    marginVertical: 8,
    textAlign: 'center',
    opacity: 0.6,
  },
  updateButton: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  colItem: {fontSize: 16, textAlign: 'center'},
  label: {fontSize: 18, textAlign: 'center', marginTop: 10},

  ListHeader: {
    width: LI_WITDH,
    height: ROW_HEGHT,
    flexDirection: 'row',
    backgroundColor: '#D1D1D1',
    marginTop: 10,
  },
  LI: {
    flexDirection: 'row',
    width: LI_WITDH,
    height: ROW_HEGHT,
    backgroundColor: '#EEEEEE',
  },
  selectedLI: {
    flexDirection: 'row',
    width: LI_WITDH,
    height: ROW_HEGHT,
    backgroundColor: '#DDDDDD',
  },
  cell: {flex: 1, justifyContent: 'center'},
});

export default MarkHonest;
