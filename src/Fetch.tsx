import React from 'react';
import {Button, StyleSheet, View} from 'react-native';
import Onyx from 'react-native-onyx';
import ONYXKEYS from './keys';
import {pokedex, meteorites, asteroids} from './data';

function Fetch(): JSX.Element {
  const onFetchPokedex = () => {
    Onyx.merge(ONYXKEYS.POKEDEX, pokedex);
  };

  const onFetchSpaceData = () => {
    const date = Date.now();
    for (let i = 0; i <= 100; i++) {
      Onyx.merge(`${ONYXKEYS.COLLECTION.METEORITES}${date}${i}`, meteorites);
      Onyx.merge(`${ONYXKEYS.COLLECTION.ASTEROIDS}${date}${i}`, asteroids);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Fetch Pokedex" onPress={onFetchPokedex} />
      <Button title="Fetch Space data" onPress={onFetchSpaceData} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: 10,
  },
});

export default Fetch;
