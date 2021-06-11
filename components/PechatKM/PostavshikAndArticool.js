import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const PostavshikAndArticool = ({first, second, height}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 0.25,
        borderBottomColor: 'grey',
        height: height ? 40 : null,
      }}>
      <View style={{width: '50%', borderEndWidth: 0.25}}>
        <Text style={styles.text}>{first}</Text>
      </View>
      <View style={{width: '50%'}}>
        <Text style={styles.text}>{second}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    marginHorizontal: 16,
    marginVertical: 8,
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center',
  },
});
export default PostavshikAndArticool;
