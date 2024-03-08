import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {cardStyle} from '../../assets/styles/Common';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {DrawerActions, useNavigation} from '@react-navigation/native';

const HeaderView = ({title = '', type = 'back'}) => {
  const navigation: any = useNavigation();
  const openDrawerScreen = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };
  return (
    <View
      style={[
        cardStyle.row,
        {
          backgroundColor: '#124076',
          alignItems: 'center',
          paddingHorizontal: 17,
          marginBottom: 12,
        },
      ]}>
      {type === 'back' && (
        <MaterialCommunityIcons
          name="arrow-left"
          size={23}
          color={'#fff'}
          onPress={() => navigation.goBack()}
        />
      )}
      {type === 'drawer' && (
        <MaterialCommunityIcons
          name="menu"
          size={23}
          color={'#fff'}
          onPress={openDrawerScreen}
        />
      )}
      <Text
        style={{
          color: '#fff',
          fontSize: 17,
          marginVertical: 10,
          fontWeight: '600',
          textAlign: 'center',
          width: '88%',
        }}>
        {title}
      </Text>
    </View>
  );
};

export default HeaderView;

const styles = StyleSheet.create({});
