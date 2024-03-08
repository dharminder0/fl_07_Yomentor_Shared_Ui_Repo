import React from 'react';
import {View, StyleSheet, Dimensions, Text} from 'react-native';
import {Input, Button} from 'react-native-elements';
import {useForm, Controller} from 'react-hook-form';
import {saveAsyncData, userData} from '../shared/sharedDetails';
import {useNavigation} from '@react-navigation/native';

const {height} = Dimensions.get('window');
const LoginPage = () => {
  const {control, handleSubmit} = useForm();
  const useData: any = userData();
  const navigation: any = useNavigation();

  const onSubmit = (data: any) => {
    useData.map((item: any) => {
      if (item.password === data.password && item.phone === data.phoneNumber) {
        console.log(item);
        saveAsyncData('userData', JSON.stringify(item));
        navigation.navigate('Startup');
      }
    });
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        render={({field: {onChange, value}}) => (
          <Input
            placeholder="Phone Number"
            leftIcon={{type: 'Ionicons', name: 'phone'}}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="phoneNumber"
        defaultValue=""
      />
      <Controller
        control={control}
        render={({field: {onChange, value}}) => (
          <Input
            placeholder="Password"
            leftIcon={{type: 'Ionicons', name: 'lock'}}
            secureTextEntry
            onChangeText={onChange}
            value={value}
          />
        )}
        name="password"
        defaultValue=""
      />
      <Button
        title="Login"
        onPress={handleSubmit(onSubmit)}
        containerStyle={{width: '100%'}} // Make button full width
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height - 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});

export default LoginPage;
