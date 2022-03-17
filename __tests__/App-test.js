/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

jest.doMock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'android',
  select: config => config.android,
}));

it('renders correctly', () => {
  console.log(true);

  renderer.create(<App />);
});
