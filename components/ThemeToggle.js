import React, { useContext } from 'react';
import { Button } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return <Button title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`} onPress={toggleTheme} />;
};

export default ThemeToggle;
