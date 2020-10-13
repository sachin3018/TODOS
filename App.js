import React from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Home from './screens/Home';
import { Button } from 'react-native';
import ADDTODO from './screens/ADDTODO';

const stack = createStackNavigator();

const App = () => {
  return(
    <NavigationContainer>
      <stack.Navigator >
        <stack.Screen
          name="Home"
          component={Home}
          options={{
            title : "TODOs",
            headerStyle: {
              backgroundColor: '#74B9FF',
            },
            headerTintColor: '#000',
            headerTitleStyle: {
              fontWeight: '300',
              marginLeft : "5%"
            },
          }}
        />
        <stack.Screen
          name="ADDTODO"
          component={ADDTODO}
          options={{
            title : "Add TODO's",
            headerStyle: {
              backgroundColor: '#74B9FF',
            },
            headerTintColor: '#000',
            headerTitleStyle: {
              fontWeight: '300',
              marginLeft : "5%"
            },
          }}
        />
      </stack.Navigator>
    </NavigationContainer>
  )
}

export default App;