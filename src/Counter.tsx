import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {withOnyx} from 'react-native-onyx';
import ONYXKEYS from './keys';

function Counter(props: {counter: number}): JSX.Element {
  return (
    <View style={styles.container}>
      <Text>Counter: {props.counter ?? '-'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default withOnyx({
  counter: {
    key: ONYXKEYS.COUNTER,
  },
})(Counter);
