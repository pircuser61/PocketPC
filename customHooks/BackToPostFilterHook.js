import {useFocusEffect} from '@react-navigation/core';
import {observer} from 'mobx-react-lite';
import React from 'react';
import {useState} from 'react';
import {useEffect} from 'react';
import {View, Text} from 'react-native';
import {connect} from 'react-redux';
import {MarkHonestSpecs} from '../functions/MarkHonestSpecs';
import BackToPostavshikStore from '../mobx/BackToPostavshikStore';

const BackToPostFilterHook = ({user}) => {
  const [signal, setSignal] = useState({time: ''});
  let mounted = true;

  // useEffect(() => {
  //   updateList();
  //   return () => {
  //     mounted = false;
  //   };
  // }, [BackToPostavshikStore.Filter]);

  useFocusEffect(
    React.useCallback(() => {
      mounted = true;
      updateList();
      return () => {
        mounted = false;
      };
    }, [BackToPostavshikStore.Filter]),
  );

  function makeact() {
    mounted && console.log('sas');
  }

  const updateList = () => {
    MarkHonestSpecs(
      BackToPostavshikStore.documentNumber,
      BackToPostavshikStore.Filter.value,
      'vozp',
      user.user.TokenData[0].$.UserUID,
      user.user.$['city.cod'],
    )
      .then(r => {
        if (mounted) {
          console.log(r);
          BackToPostavshikStore.specsrow = r.Specs[0].SpecsRow;
        }
      })
      .catch(e => {
        alert(e);
      });
  };

  return {sas: 123, setSignal, updateList};
};

const mapStateToProps = state => {
  return {
    user: state.user,
    podrazd: state.podrazd,
  };
};

export default BackToPostFilterHook;
