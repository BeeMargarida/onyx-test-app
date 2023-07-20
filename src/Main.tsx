import React from 'react';
import {Button, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import Onyx, {withOnyx} from 'react-native-onyx';
import ONYXKEYS from './keys';
import Fetch from './Fetch';

function Main(props: {
  counter: number;
  session: {login: string};
  pokedex: {pokemon: Array<unknown>};
  allMeteorites: {[key: string]: Array<unknown>};
  allAsteroids: {[key: string]: Array<unknown>};
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
        <Text aria-label="data-pokedex">{props.pokedex?.pokemon.length}</Text>
        <Text aria-label="data-meteorites">
          {Object.entries(props.allMeteorites ?? {})
            .map(([key, value]) =>
              value ? `${key}-${value?.length}` : undefined,
            )
            .filter(v => !!v)
            .join(',')}
        </Text>
        <Text aria-label="data-asteroids">
          {Object.entries(props.allAsteroids ?? {})
            .map(([key, value]) =>
              value ? `${key}-${value?.length}` : undefined,
            )
            .filter(v => !!v)
            .join(',')}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 20,
  },
});

export default withOnyx({
  session: {
    key: ONYXKEYS.SESSION,
  },
  counter: {
    key: ONYXKEYS.COUNTER,
  },
  pokedex: {
    key: ONYXKEYS.POKEDEX,
  },
  allMeteorites: {
    key: ONYXKEYS.COLLECTION.METEORITES,
  },
  allAsteroids: {
    key: ONYXKEYS.COLLECTION.ASTEROIDS,
  },
})(Main);
