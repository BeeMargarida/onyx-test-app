import React, {useEffect, useMemo, useState} from 'react';
import {Button, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import lodashGet from 'lodash/get';
import Onyx, {withOnyx} from 'react-native-onyx';
import ONYXKEYS from './keys';
import {updates, clear} from './lib/updates';
import {pokedex, meteorites, asteroids} from './data';

function Main(props: {
  session: {login: string};
  pokedex: {pokemon: Array<unknown>};
  randomNumber: {number: number};
  allMeteorites: {[key: string]: Array<unknown>};
  allAsteroids: {[key: string]: Array<unknown>};
}): JSX.Element {
  const [isLeader, setIsLeader] = useState(
    Onyx.isClientTheLeader ? Onyx.isClientTheLeader() : false,
  );

  const isAuthenticated = useMemo(
    () => Boolean(lodashGet(props.session, 'login', null)),
    [props.session],
  );

  useEffect(() => {
    if (!Onyx.subscribeToClientChange) {
      return;
    }

    Onyx.subscribeToClientChange(() => {
      setIsLeader(Onyx.isClientTheLeader());
    });
  }, []);

  const onLogIn = () => {
    clear();
    Onyx.merge(ONYXKEYS.SESSION, {login: 'test@test.com'});
    Onyx.merge(ONYXKEYS.RANDOM_NUMBER, {number: Date.now()});
  };

  const onLogOut = () => {
    Onyx.clear([]);
  };

  const onFetchPokedex = () => {
    Onyx.merge(ONYXKEYS.POKEDEX, pokedex);
  };

  const onFetchSpaceData = (small?: boolean) => {
    const date = Date.now();

    for (let i = 0; i <= (small ? 10 : 100); i++) {
      Onyx.merge(`${ONYXKEYS.COLLECTION.METEORITES}${date}${i}`, meteorites);
      Onyx.merge(`${ONYXKEYS.COLLECTION.ASTEROIDS}${date}${i}`, asteroids);
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        {isAuthenticated ? (
          <View style={styles.container}>
            <Text>{props.session.login}</Text>
            <Button title="Log Out" testID="log-out" onPress={onLogOut} />
            <View style={styles.containerButtons}>
              <Button
                title="Fetch Pokedex"
                testID="fetch-pokedex-data"
                onPress={onFetchPokedex}
              />
              <Button
                title="Fetch Space data"
                testID="fetch-space-data"
                onPress={() => onFetchSpaceData(false)}
              />
              <Button
                title="Fetch (small) Space data"
                testID="fetch-small-space-data"
                onPress={() => onFetchSpaceData(true)}
              />
            </View>
          </View>
        ) : (
          <Button title="Log In" testID="log-in" onPress={onLogIn} />
        )}
        <Text aria-label="leader">{isLeader ? 'leader' : 'non-leader'}</Text>
        <Text aria-label="data-number">{props.randomNumber?.number}</Text>
        <Text aria-label="data-pokedex">{props.pokedex?.pokemon.length}</Text>
        <Text aria-label="data-meteorites" numberOfLines={10}>
          {Object.entries(props.allMeteorites ?? {})
            .map(([key, value]) =>
              value ? `${key}-${value?.length}` : undefined,
            )
            .filter(v => !!v)
            .join(',')}
        </Text>
        <Text aria-label="data-asteroids" numberOfLines={10}>
          {Object.entries(props.allAsteroids ?? {})
            .map(([key, value]) =>
              value ? `${key}-${value?.length}` : undefined,
            )
            .filter(v => !!v)
            .join(',')}
        </Text>
        <Text aria-label="data-updates" key={updates.length} numberOfLines={10}>
          {JSON.stringify(updates)}
        </Text>
        <Button title="Clear updates" onPress={clear} />
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
    maxWidth: '100%',
  },
  containerButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: 20,
  },
});

export default withOnyx({
  session: {
    key: ONYXKEYS.SESSION,
  },
  pokedex: {
    key: ONYXKEYS.POKEDEX,
  },
  randomNumber: {
    key: ONYXKEYS.RANDOM_NUMBER,
  },
  allMeteorites: {
    key: ONYXKEYS.COLLECTION.METEORITES,
  },
  allAsteroids: {
    key: ONYXKEYS.COLLECTION.ASTEROIDS,
  },
})(Main);
