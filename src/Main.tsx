import React from 'react';
import {Button, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import Onyx, {withOnyx} from 'react-native-onyx';
import ONYXKEYS from './keys';
import Fetch from './Fetch';

function Main(props: {
  counter: number;
  session: {login: string};
  data: string;
}): JSX.Element {
  const onLogIn = () => {
    Onyx.merge(ONYXKEYS.SESSION, {login: 'test@test.com'});
  };

  const onLogOut = () => {
    Onyx.clear([]);
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        {props.session?.login ? (
          <View>
            <Text>{props.session.login}</Text>
            <Button title="Log Out" onPress={onLogOut} />
            <Fetch />
          </View>
        ) : (
          <Button title="Log In" onPress={onLogIn} />
        )}
        <Text aria-label="data">{props.data}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
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
  data: {
    key: ONYXKEYS.DATA,
  },
})(Main);
