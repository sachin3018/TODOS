import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, AsyncStorage, FlatList,Alert,ToastAndroid, Vibration } from 'react-native';
import { Icon, Card, CheckBox,  } from 'react-native-elements'
//import { Icon } from "react-native-vector-icons/"
import { AntDesign } from '@expo/vector-icons';
import CountDown from 'react-native-countdown-component';


export default function Home({ navigation }) {
    const [todos, settodos] = useState([]);
    const [done, setdone] = useState(false)


  const ONE_SECOND_IN_MS = 1000;

  const PATTERN = [
    1 * ONE_SECOND_IN_MS,
    2 * ONE_SECOND_IN_MS,
    3 * ONE_SECOND_IN_MS
  ];

    // const PATTERN_DESC =
    // Platform.OS === "android"
    //   ? "wait 1s, vibrate 2s, wait 3s"
    //   : "wait 1s, vibrate, wait 2s, vibrate, wait 3s";

    const getAllTodos = async() => {
        await AsyncStorage.getAllKeys()
              .then(keys => {
                //console.log(keys)
                return AsyncStorage.multiGet(keys)
                                   .then(results => {
                                       settodos(results.sort(function(a,b){
                                        return new Date(b.date) - new Date(a.date);
                                      }));
                                     
                                   })
                                   .catch(error => {
                                       console.log(error.message)
                                   })
              
             })
            .catch(error  => {
                console.log(error.message)
            })
           // console.log(todos);
    }


    const deleteTodo = (key,task) => {
        Alert.alert(
          "Have you completed the",
          `Your TODO Named as : ${task}`,
          [
              {
                  text : "cancel",
                  onPress : () => { console.log("cancelled")}
              },
              {
                  text : "Delete",
                  onPress : async() => {
                      await AsyncStorage.removeItem(key)
                      .then(() => {
                        ToastAndroid.showWithGravityAndOffset(
                          "Hey! Congratulations You did it ",
                          ToastAndroid.SHORT,
                          ToastAndroid.BOTTOM,
                          25,
                          50
                        );
                          getAllTodos();
                          
                      })
                      .catch(error => {
                          console.log(error)
                      })
                  }
              }
          ]
      )
      //console.log(todos);
      }
    const delteNotDone = async(key) => {
      await AsyncStorage.removeItem(key)
      .then(() => {
        navigation.navigate('ADDTODO');
      })
      .catch(error => {
          console.log(error)
      })
    }
    const timesUp = (key,task) => {
      setdone(true);
      Vibration.vibrate(PATTERN,done)
      Alert.alert(
        "Times-Up",
        `Your TODO Named as : ${task}`,
        [
            {
                text : "Not-Done",
                onPress : () => { 
                  ToastAndroid.showWithGravityAndOffset(
                    "Set one more TODO",
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    50
                  );
                  Vibration.cancel()
                  setdone(false);
                  setTimeout(() => {
                    delteNotDone(key);
                  },1*ONE_SECOND_IN_MS)
                  
                  
                }
            },
            {
                text : "Done",
                onPress : () => {
                  Vibration.cancel();
                  setdone(false);
                  deleteTodo(key,task)
                }
            }
        ]
    )
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          getAllTodos();
        });
    
        return unsubscribe;
      }, [navigation]);

  return todos.length !== 0 ?(
    <View style={styles.container}>
      <View style={{flex : 14}}>
      <FlatList 
        style={{ flex : 3,backgroundColor : "#DAE0E2"}}
        data = {todos}
        keyExtractor={(item) => item[1]}
        renderItem={({item}) => {
          var l = JSON.parse(item[1]);
          var day = parseInt(l.day)*86400;
          var hour = parseInt(l.hour)*3600;
          var min = parseInt(l.min)*60;
          var sec = parseInt(l.sec);
          var total = parseInt(hour+min+sec+day);
          //console.log(total);
          return(
            <Card >
                    <View style={styles.cardView}>
                      <View style={{flex : 1, alignItems : "center"}}>
                        <Text style={styles.todoText}>{l.todo}</Text>
                      </View>
                      <View style={{flex : 1 , flexDirection : "row"}}>
                        {
                          total !== 0 ?
                          <CountDown
                          style = {styles.coutdownTime}
                          until={total}
                          size={10}
                          onFinish={() => timesUp(item[0].toString(),l.todo)}
                          digitStyle={{backgroundColor: '#FFF'}}
                          digitTxtStyle={{color: '#1CC625'}}
                          timeToShow={['D','H', 'M', 'S']}
                          timeLabels={{m: null, s: null}}
                          showSeparator
                        /> :
                        <Text style={styles.noDeadLine}>No DeadLine</Text>
                        }
                        <Icon
                          style={{flex : 1,justifyContent:"space-around",}}
                          raised
                          name='trash'
                          type='font-awesome'
                          color='#FF3031'
                          onPress={() => deleteTodo(item[0].toString(),l.todo)}
                      />
                      </View>
                    </View>
            </Card>
          )
        }}
      />
      
      </View>
      
      <TouchableOpacity 
       style={styles.button} 
       onPress = {() => (navigation.navigate('ADDTODO'))}
       >
      <View >
      
          <Icon
            name="add"
            color ="#000"
            size={45}
            style={{marginVertical : "5%",}}
          />
        
      </View>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  ):(
    <View style={styles.container}>
    <View style={{flex : 14,justifyContent : "center",}}>
        <Text style={{textAlign : "center",fontSize : 20}}>You Haven't Set A TODO Yet</Text>
        <Text style={{textAlign : "center",fontSize : 20,marginTop : 15}}>Add Now</Text>
        <AntDesign
            name="arrowdown"
            color ="#000"
            size={45}
            style={{marginVertical : "5%",alignSelf : "center"}}
          />
    </View>
    
    <TouchableOpacity 
     style={styles.button} 
     onPress = {() => (navigation.navigate('ADDTODO'))}
     >
    <View >
    
        <Icon
          name="add"
          color ="#000"
          size={45}
          style={{marginVertical : "5%",}}
        />
      
    </View>
    </TouchableOpacity>
    <StatusBar style="auto" />
  </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    flexDirection : "column",
    backgroundColor: '#DAE0E2',
  },
  button : {
    borderColor : "#192A56",
    borderWidth : 7,
    backgroundColor : "#74B9FF",
    alignContent : "center",
    flex :  1,
    flexDirection : "row",
    justifyContent : "space-around",
    alignItems : "center",
    marginBottom :"0%",
  },
  cardView : {
    flex : 2,
    justifyContent : "space-around",
    flexWrap : "wrap",
    borderRadius : 5,
    borderWidth : 3,
    marginHorizontal : "0%",
    borderColor : "#4834DF",
    marginVertical : "0%"    ,
    backgroundColor : "#74B9FF"
  },
  todoText : {
    flex : 1,
    textAlignVertical : "center",
    color : "#000",
    fontSize : 25,
  },
  coutdownTime : {
    flex : 1,
    marginRight : "33%",
    marginVertical : "5%",
  },
  noDeadLine : {
    flex : 1,
    textAlignVertical : "center",
    color : "#FF3031",
    fontSize : 20,
    marginLeft : "5%"
  }
});
