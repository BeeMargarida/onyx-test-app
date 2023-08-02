import Onyx from 'react-native-onyx';
import ONYXKEYS from '../keys';

let updates: string[] = [];

Onyx.connect({
  key: ONYXKEYS.SESSION,
  callback: () => {
    updates.push('session');
  },
});

Onyx.connect({
  key: ONYXKEYS.RANDOM_NUMBER,
  callback: () => {
    updates.push('randomNumber');
  },
});

Onyx.connect({
  key: ONYXKEYS.POKEDEX,
  callback: () => {
    updates.push('pokedex');
  },
});

Onyx.connect({
  key: ONYXKEYS.COLLECTION.ASTEROIDS,
  callback: () => {
    updates.push('asteroids');
  },
});

const clear = () => {
  updates = [];
  console.log('updates', updates);
};

export {updates, clear};
