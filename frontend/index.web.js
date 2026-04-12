import { AppRegistry } from 'react-native';
import App from './App';

AppRegistry.registerComponent('BusinessInsightsApp', () => App);

window.addEventListener('load', () => {
  AppRegistry.runApplication('BusinessInsightsApp', {
    rootTag: document.getElementById('root'),
  });
});
