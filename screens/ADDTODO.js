import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, AsyncStorage, FlatList,Alert,ToastAndroid } from 'react-native';
import { Icon, Card, CheckBox, Input } from 'react-native-elements'


export default function ADDTODO({ navigation }) {
    const [todo, settodo] = useState("");
    const [hours, sethours] = useState("")
    const [minute, setminute] = useState("")
    const [second, setsecond] = useState("")
    const [day, setday] = useState("")
    const saveTodo = async () => {
        if(todo != ""){
          var currentTodo = {
            todo : todo,
            hour : hours === "" ?parseInt("0"):parseInt(hours),
            min : minute === "" ?parseInt("0"):parseInt(minute),
            sec : second === "" ?parseInt("0"):parseInt(second),
            day : day === "" ?parseInt("0"):parseInt(day)
          }
          settodo("")
          try {
            await AsyncStorage.setItem(Date.now().toString(), JSON.stringify(currentTodo))
                  .then((data) => {
                        navigation.goBack();
                    
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
        else{
          ToastAndroid.showWithGravityAndOffset(
            "Set TODO to achive your Goal",
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
          );
        }
        
      }






  return (
    <View style={styles.container}>
      <View style={{flex : 14}}>
        <View style={{flex : 4}}>
        </View>
        <View style={styles.inputContainer}>
        <TextInput
            style={styles.todo}
            placeholder='Enter Your TODO'
            keyboardType = "default"
            autoCapitalize = "none"
            autoComplete = {false}
            maxLength = {32}
            onChangeText = {(todo) => settodo(todo)}
            value={todo}
            clearButtonMode = "always"
            />
        </View>
        <View style={styles.inputContainer}>
          <View style={{flex : 7,flexDirection : "row",marginHorizontal : "25%"}}>
          <TextInput
              style={{flex : 1}}
              placeholder='DD'
              keyboardType = "number-pad"
              autoCapitalize = "none"
              autoComplete = {false}
              maxLength = {32}
              onChangeText = {(day) => {setday(day)}}
              value={day}
              clearButtonMode = "always"
              />
              <Text style={{flex : 1, textAlignVertical : "center",marginLeft : "2%"}}>:</Text>
            <TextInput
              style={{flex : 1}}
              placeholder='HH'
              keyboardType = "number-pad"
              autoCapitalize = "none"
              autoComplete = {false}
              maxLength = {32}
              onChangeText = {(hour) => {
                if(hour <= 24){
                  sethours(hour);
                }else{
                  ToastAndroid.showWithGravityAndOffset(
                    "hour can't be more then 24 ! try day also",
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    50
                  );
                }
              }}
              value={hours}
              clearButtonMode = "always"
              />
              <Text style={{flex : 1, textAlignVertical : "center",marginLeft : "2%"}}>:</Text>
              <TextInput
              style={{flex : 1}}
              placeholder='MM'
              keyboardType = "number-pad"
              autoCapitalize = "none"
              autoComplete = {false}
              maxLength = {32}
              onChangeText = {(min) => {
                if(min >= 0  && min <= 60){
                  setminute(min)
                }else{
                  ToastAndroid.showWithGravityAndOffset(
                    "Minute can't be more then 60 ! try hour also",
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    50
                  );
                }
              }}
              value={minute}
              clearButtonMode = "always"
              />
             <Text style={{flex : 1, textAlignVertical : "center",marginLeft : "2%"}}>:</Text>
              <TextInput
              style={{flex : 1}}
              placeholder='SS'
              keyboardType = "number-pad"
              autoCapitalize = "none"
              autoComplete = {false}
              maxLength = {32}
              onChangeText = {(sec) => {
                if(sec >= 0 && sec <= 60){
                  setsecond(sec)
                }else{
                  ToastAndroid.showWithGravityAndOffset(
                    "Second can't be more then 60 ! try Minute also",
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    50
                  );
                }
              }}
              value={second}
              clearButtonMode = "always"
              />
          </View>
        </View>
        <View style={{flex : 4}}>
        </View>
      </View>
      <TouchableOpacity 
       style={styles.button} 
       onPress={() => saveTodo()}
       >
      <View >
      
          <Icon
            name="save"
            color ="#000"
            size={35}
            style={{marginVertical : "5%",}}
          />
        
      </View>
      </TouchableOpacity>
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
  button : {
    borderColor : "#192A56",
    borderWidth : 5,
    backgroundColor : "#74B9FF",
    alignContent : "center",
    flex :  1,
    flexDirection : "row",
    justifyContent : "space-around",
    alignItems : "center",
    marginBottom :"0%",
  },
  inputContainer : {
    marginHorizontal : "5%",
    marginTop : "10%",
    marginBottom : "5%" ,
    borderRadius : 8,
    flex : 4,
    justifyContent : "center",
    backgroundColor : "#fff"
  },
  todo : {
    fontSize : 20,
    textAlign : "center"
  }
});
