import { StyleSheet } from 'react-native'; 
import { DataTable } from 'react-native-paper'; 
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function PrescriptionTable({Prescription, Navigation}){

return ( 
	<DataTable style={styles.container}> 
	<DataTable.Header> 
		<DataTable.Title>Doctor</DataTable.Title> 
        <DataTable.Title>Date</DataTable.Title> 
		<DataTable.Title></DataTable.Title>
      
	</DataTable.Header> 
  {Prescription.map((prescription, index) => (
  <DataTable.Row key={index}>
    <DataTable.Cell>{prescription.Doctor}</DataTable.Cell>
    <DataTable.Cell>{prescription.Date}</DataTable.Cell>
    <DataTable.Cell>
      <AntDesign
        name="arrowright"
        size={hp(3)}
        color="#2F3D7E"
        style={styles.arrow}
        onPress={() =>
          Navigation.navigate('PrescriptionDetail', { prescription : prescription })
        }
      />
    </DataTable.Cell>
  </DataTable.Row>
))}


	</DataTable> 
);

}; 


const styles = StyleSheet.create({ 
container: { 
	paddingHorizontal: wp(0.5),
    paddingVertical: hp(1),
    marginVertical: hp(2),
    backgroundColor:"white"
}, 
arrow:{
right:0,
position:"absolute"
},



});
