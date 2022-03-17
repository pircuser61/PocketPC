import React, {useEffect, useRef} from 'react';
import {StyleSheet, Text, View} from 'react-native';

const MountedHook = () => {
  const mounted = useRef(true);

  useEffect(() => {
    //console.log('Монт');
    mounted.current = true;

    return () => {
      //console.log('Размонт');

      mounted.current = false;
      //console.log(mounted.current);
    };
  }, []);

  return {mounted: mounted.current};
};

export default MountedHook;

const styles = StyleSheet.create({});
