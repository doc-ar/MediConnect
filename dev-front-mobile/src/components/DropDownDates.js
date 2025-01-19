import { StyleSheet, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SelectList } from 'react-native-dropdown-select-list';
import { FontAwesome } from '@expo/vector-icons';
import { useMediConnectStore } from '../Store/Store';

export default function DropDownDates({ Data }) {
  const setSelectedAppointmentMonth = useMediConnectStore(state => state.setSelectedAppointmentMonth);
  const selectedAppointmentMonth = useMediConnectStore(state => state.selectedAppointmentMonth);
  console.log(Data);
  const defaultOption = Data.find((item) => item === selectedAppointmentMonth)
    ? { key: `${selectedAppointmentMonth}-${Data.indexOf(selectedAppointmentMonth)}`, value: selectedAppointmentMonth }
    : { key: `${Data[0]}-0`, value: Data[0] };

    const handleSelection = (item) => {
      const selectedMonth = item.split('-')[0];
      setSelectedAppointmentMonth(selectedMonth); 
    };
  return (
    <View style={styles.container}>
      <SelectList
        setSelected={handleSelection}
        data={Data}
        arrowicon={<FontAwesome name="chevron-down" size={12} color={'black'} />}
        boxStyles={styles.boxStyles}
        defaultOption={defaultOption} 
        dropdownStyles={styles.dropdownStyles}
        search={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1,
    marginTop: hp(2),
  },
  boxStyles: {
    borderRadius: 20,
    marginLeft: wp(60),
    width: wp(35),
  },
  dropdownStyles: {
    borderRadius: 20,
    marginLeft: wp(65),
    width: wp(30),
    position: 'absolute',
    zIndex: 2,
    marginTop: hp(6),
    backgroundColor:"white"
  },
});
