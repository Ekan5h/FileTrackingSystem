import React, {useState} from 'react';
import { Text, View, Dimensions } from 'react-native';
import { Button, TextInput } from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from "@expo/vector-icons";
import DropdownAlert from 'react-native-dropdownalert';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default function SetName({navigation}, prop) {
    const [name, setName] = useState('');
    const [dropDown, setDropDown] = useState(null);
    
    return (
        <>
        <View style={{
          justifyContent:'center',
          alignItems:'center',
          height:"100%"
        }}>
            <View style={{width:"80%"}}>
                <Text style={{
                    fontSize:0.0419664269*windowHeight,
                    fontWeight:"bold",
                    marginBottom:0.0599520384*windowHeight
                }}>
                    Set your name
                </Text>
            </View>
            <TextInput 
            mode="outlined"
            label="Enter Name"
            autoCompleteType="name"
            textContentType="name"
            onChangeText={
                (t)=>{
                    setName(t);
                }
            }
            style={{
                width:"80%",
                fontSize:20
            }}/>

            <Button
                mode="contained"
                style={{
                    marginTop:0.035971223*windowHeight,
                    paddingLeft:(20/440)*windowWidth,
                    paddingRight:(20/440)*windowWidth
                }}
                onPress={
                    () => {
                        if(name.length == 0){
                            dropDown.alertWithType('error','Please enter a name','');
                            return 0;
                        }
                        let formData = new FormData();
                        formData.append('name', name);
                        fetch('http://192.168.1.2:5000/setName',{
                            method:'POST',
                            body:formData,
                            headers:{
                            'content-type':'multipart/form-data'
                            }
                        }).then(
                            async ()=>{
                                await AsyncStorage.removeItem('@profile');
                                await AsyncStorage.setItem('@name', name);
                                navigation.reset({
                                  index: 0,
                                  routes: [{ name: 'Landing' }],
                                });
                            }
                        ).catch(
                            (e)=>{
                                dropDown.alertWithType('error','Network Error','Could not reach the server!')
                            }
                        )
                    }
                }
            >
                <Ionicons name="checkmark" size={30} color="white" />
            </Button>
        </View>
        <DropdownAlert ref={(r)=>setDropDown(r)}/>
        </>
    );
}