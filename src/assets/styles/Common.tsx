import {StyleSheet} from 'react-native';
export const common = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
  },
});
export const cardStyle = StyleSheet.create({
  container: {
    borderRadius: 6,
    borderWidth: 0,
    margin: 0,
    marginBottom: 10,
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  row3: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '33.3%',
  },
  j_row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  title: {
    fontSize: 18,
    marginVertical: 10,
    fontWeight: '600',
    color: '#124076',
  },
  headTitle: {
    fontWeight: '600',
    // marginBottom: 5,
    color: '#124076',
  },
  subTitle: {
    marginStart: 5,
  },
  fs18: {
    fontSize: 18,
  },
});
