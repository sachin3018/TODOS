import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, AsyncStorage, FlatList,Alert,ToastAndroid } from 'react-native';
import { Icon, Card, CheckBox } from 'react-native-elements'



export default function App() {

  const [todo, settodo] = useState("");
  const [todos, settodos] = useState([]);
  const display = () => {
    console.log(todo)
  }

  const saveTodo = async () => {
    if(todo != ""){
      var currentTodo = {todo : todo}
      settodo("")
      try {
        await AsyncStorage.setItem(Date.now().toString(), JSON.stringify(currentTodo))
              .then(() => {
                ToastAndroid.showWithGravityAndOffset(
                  "TODO added",
                  ToastAndroid.LONG,
                  ToastAndroid.BOTTOM,
                  25,
                  50
                );
                getAllTodos();
              })
              .catch(error => {
                ToastAndroid.showWithGravityAndOffset(
                  "Not Added",
                  ToastAndroid.LONG,
                  ToastAndroid.BOTTOM,
                  25,
                  50
                );
              })
        
      } catch (error) {
        ToastAndroid.showWithGravityAndOffset(
          "Something Went Wrong",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      }
    }
    
  }

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
                      ToastAndroid.LONG,
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

  useEffect(() => {
    getAllTodos();
  },[])

  return (
    <View style={styles.container}>
      <View style={styles.inputAndButton}>
        <TextInput
          placeholder="Enter your TODO's"
          style={styles.input}
          keyboardType = "default"
          autoCapitalize = "none"
          autoComplete = {false}
          maxLength = {32}
          onChangeText = {(todo) => settodo(todo)}
          value={todo}
          clearButtonMode = "always"
        />
        <TouchableOpacity style={styles.buttonHighLight} onPress={() => saveTodo()}>
          <Text style={styles.button} 
          >ADD TODOS</Text>
        </TouchableOpacity>
      </View>
      <View style={{flex : 10}}>
      <FlatList 
        style={{ flex : 3}}
        data = {todos}
        renderItem={({item}) => {
          var l = JSON.parse(item[1]);
          return(
            <Card >
                    <View style={styles.cardView}>
                      <Text style={styles.todoText}>{l.todo}</Text>
                      
                      <Icon
                         style={{flex : 1}}
                         raised
                         name='trash'
                         type='font-awesome'
                         color='#f50'
                         onPress={() => deleteTodo(item[0].toString(),l.todo)}
                    />
                    </View>
            </Card>
          )
        }}
      />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    flexDirection : "column",
    backgroundColor: '#DAE0E2',
    
    
  },
  inputAndButton : {
    flex : 1,
    flexDirection : "row",
    marginTop : "10%"
  },
  input : {
    flex : 4,
    height : 50,
    marginLeft : 15,
    marginRight : 10,
    borderWidth : 2,
    borderBottomColor : "#000",
    textAlign : "center",
    borderRadius : 10 ,
    backgroundColor : "#fff"   
  },
  buttonHighLight : {
    flex : 2,
    height : 50,
    marginRight : 15,
    backgroundColor : "#74B9FF",
    justifyContent : "center",
    borderRadius : 10,
    borderColor : "#000",
    borderWidth : 2
  },
  button : {
    textAlignVertical : "center",
    textAlign : "center",
    fontSize : 15,
    fontWeight : "200"
  },
  cardView : {
    flex : 2,
    flexDirection : "row",
    justifyContent : "space-between",
    flexWrap : "wrap"
  },
  todoText : {
    flex : 1,
    textAlignVertical : "center",
    marginLeft : 15,
    color : "#4834DF",
    fontSize : 20,
    fontWeight : "700"
  },
});
