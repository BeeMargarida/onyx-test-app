import Onyx from 'react-native-onyx';
import ONYXKEYS from '../keys';

let updates: {type: string}[] = [];

Onyx.connect({
  key: ONYXKEYS.SESSION,
  callback: () => {
    updates.push({type: 'session'});
  },
});

Onyx.connect({
  key: ONYXKEYS.RANDOM_NUMBER,
  callback: () => {
    updates.push({type: 'randomNumber'});
  },
});

Onyx.connect({
  key: ONYXKEYS.POKEDEX,
  callback: () => {
    updates.push({type: 'pokedex'});
  },
});

const clear = () => {
  updates = [];
  console.log('updates', updates);
};

export {updates, clear};
