import React, {useRef} from 'react';
import {Button, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import Onyx, {withOnyx} from 'react-native-onyx';
import ONYXKEYS from './keys';
import Counter from './Counter';

function Main(props: {counter: number; session: {login: string}}): JSX.Element {
  const interval = useRef<NodeJS.Timer>();

  const onLogIn = () => {
    Onyx.merge(ONYXKEYS.SESSION, {login: 'test@test.com'});
    interval.current = setInterval(() => {
      Onyx.merge(ONYXKEYS.COUNTER, props.counter + 1);
    }, 1000);
  };

  const onLogOut = () => {
    clearInterval(interval.current);
    Onyx.clear([]);
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        {props.session?.login ? (
          <View>
            <Text>{props.session.login}</Text>
            <Button title="Log Out" onPress={onLogOut} />
            <Counter />
          </View>
        ) : (
          <Button title="Log In" onPress={onLogIn} />
        )}
      </View>
    </SafeAreaView>
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
  session: {
    key: ONYXKEYS.SESSION,
  },
  counter: {
    key: ONYXKEYS.COUNTER,
  },
})(Main);
