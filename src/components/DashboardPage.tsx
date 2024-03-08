import {StyleSheet, View} from 'react-native';
import React from 'react';
import {common} from '../assets/styles/Common';
import BatchCardView from './common/BatchCardView';
import {getOngoingBatchData, getOpenBatchData} from '../shared/sharedDetails';
import HeaderView from './common/HeaderView';

const DashboardPage = () => {
  const ongoingBatch: any = getOngoingBatchData();
  const openBatch: any = getOpenBatchData();

  return (
    <>
      <HeaderView title="Dashboard" type="drawer" />
      <View style={common.container}>
        <BatchCardView title="Ongoing Batches" data={ongoingBatch} />
        <BatchCardView
          title="Open for Enrollment"
          data={openBatch}
          isOpenEnroll={true}
        />
      </View>
    </>
  );
};

export default DashboardPage;

const styles = StyleSheet.create({});
