import AsyncStorage from '@react-native-async-storage/async-storage';
export const userData = () => {
  const userData: any = [
    {
      name: 'Teacher',
      phone: '11111',
      password: '11111',
      role: 'Teacher',
    },
    {
      name: 'Student',
      phone: '22222',
      password: '22222',
      role: 'Student',
    },
    {
      name: 'Parent',
      phone: '33333',
      password: '33333',
      role: 'Parent',
    },
  ];
  return userData;
};

export const saveAsyncData = async (key: string, userData: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(userData));
    console.log('User data saved successfully.');
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

export const getUserData = async (key: string) => {
  try {
    const result: any = await AsyncStorage.getItem(key);
    return JSON.parse(result);
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return null;
  }
};

export const clearUserData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log('User data cleared successfully.');
  } catch (error) {
    console.error('Error clearing user data:', error);
  }
};

export const getOngoingBatchData = () => {
  const ongoingBatch: any = [
    {
      id: 1,
      name: 'Class 3 Mathematics',
      teacherid: 1,
      classid: 3,
      className: 'Class 3',
      subjectid: 7,
      subjectName: 'Mathematics',
      status: 1,
      days: 'M/W/F',
      createdate: '2024-03-06 12:14:52.950',
      updatedate: '2024-03-06 12:14:52.950',
      startdate: '2024-04-01',
      tuitiontime: '15:00:00',
      rate: 300,
      expectedstudentcount: 5,
      isdeleted: 0,
      classDescription:
        'Applied mathematics. Theoretical mechanics. Complex variables. No matter what math discipline is your passion, we have advanced classes and seminars that address it.',
    },
    {
      id: 2,
      name: 'Class 3 English',
      teacherid: 1,
      classid: 3,
      className: 'Class 3',
      subjectid: 8,
      subjectName: 'English',
      status: 1,
      days: 'T/TH/SA',
      createdate: '2024-03-06 12:15:46.103',
      updatedate: '2024-03-06 12:15:46.103',
      startdate: '2024-04-01',
      tuitiontime: '16:00:00',
      rate: 300,
      expectedstudentcount: 5,
      isdeleted: 0,
      classDescription:
        'Everyday English focuses on: listening, speaking, as well as grammar correction, vocabulary and pronunciation. It aims to improve students skills in the areas of speaking and listening in order to communicate more effectively using English in both formal and informal settings',
    },
  ];
  return ongoingBatch;
};
export const getOpenBatchData = () => {
  const openBatch: any = [
    {
      id: 1,
      name: 'Class 3 Mathematics',
      teacherid: 1,
      classid: 3,
      className: 'Class 3',
      subjectid: 7,
      subjectName: 'Mathematics',
      status: 1,
      days: 'T/TH/SA',
      createdate: '2024-03-06 12:14:52.950',
      updatedate: '2024-03-06 12:14:52.950',
      startdate: '2024-04-01',
      tuitiontime: '15:00:00',
      rate: 300,
      expectedstudentcount: '5/10',
      isdeleted: 0,
    },
    {
      id: 2,
      name: 'Class 3 English',
      teacherid: 1,
      classid: 3,
      className: 'Class 3',
      subjectid: 8,
      subjectName: 'English',
      status: 1,
      days: 'M/T/F',
      createdate: '2024-03-06 12:15:46.103',
      updatedate: '2024-03-06 12:15:46.103',
      startdate: '2024-04-01',
      tuitiontime: '16:00:00',
      rate: 300,
      expectedstudentcount: '4/10',
      isdeleted: 0,
    },
  ];
  return openBatch;
};

export const getStudentData = () => {
  const studentData: any = [
    {
      id: 1,
      name: 'Dhruv Gupta',
      address: '123 Main Road Indirapuram',
      phone: '1234567890',
      className: 'Class 3',
      batchDetails: ['Mathematics'],
    },
    {
      id: 2,
      name: 'Gayas Khan',
      address: '456 Saya Gold Apartment Delhi',
      phone: '9876543210',
      className: 'Class 3',
      batchDetails: ['Mathematics'],
    },
    {
      id: 3,
      name: 'Kiran Sharma',
      address: '456 Graphix Tower Sector 62 Delhi',
      phone: '9876543213',
      className: 'Class 3',
      batchDetails: ['Mathematics'],
    },
  ];
  return studentData;
};
