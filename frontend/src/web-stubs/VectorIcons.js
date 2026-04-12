import React from 'react';
import { Text } from 'react-native';

const Icon = ({ name, size = 20, color = '#000', style }) => (
  <Text style={[{ fontSize: size, color }, style]}>{name}</Text>
);

export default Icon;
