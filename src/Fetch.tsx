import React from 'react';
import {Button} from 'react-native';
import Onyx from 'react-native-onyx';
import ONYXKEYS from './keys';

function Fetch(): JSX.Element {
  const onFetch = () => {
    Onyx.merge(ONYXKEYS.DATA, 'HELLO');
  };
  return <Button title="Fetch" onPress={onFetch} />;
}

export default Fetch;
