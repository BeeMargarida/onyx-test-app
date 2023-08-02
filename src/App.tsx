import React, {useMemo} from 'react';
import {SafeAreaView, Text} from 'react-native';
import {withOnyx} from 'react-native-onyx';
import lodashGet from 'lodash/get';
import Main from './Main';
import {RandomNumberProvider} from './lib/providers';
import ONYXKEYS from './keys';

function App(props: {session: {login: string}}): JSX.Element {
  const isAuthenticated = useMemo(
    () => Boolean(lodashGet(props.session, 'login', null)),
    [props.session],
  );

  return (
    <SafeAreaView>
      <RandomNumberProvider>
        {isAuthenticated && (
          <Text aria-label="logged-in">You are logged in</Text>
        )}
        <Main />
      </RandomNumberProvider>
    </SafeAreaView>
  );
}

export default withOnyx({
  session: {
    key: ONYXKEYS.SESSION,
  },
})(App);
