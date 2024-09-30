import { StyleSheet } from 'react-native'; 
import { DataTable } from 'react-native-paper'; 
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
export default function MedicationTable({Medication}){ 
return ( 
	<DataTable style={styles.container}> 
	<DataTable.Header> 
		<DataTable.Title>Medicine</DataTable.Title> 
        <DataTable.Title>Strength</DataTable.Title> 
		<DataTable.Title>Dosage</DataTable.Title>
        <DataTable.Title>Frequency</DataTable.Title> 
		<DataTable.Title>Duration</DataTable.Title> 
	</DataTable.Header> 
    {Medication.map((Medication, Index) => (
        <DataTable.Row key={Index}>
          <DataTable.Cell>{Medication.Medicine}</DataTable.Cell>
          <DataTable.Cell>{Medication.Strength}</DataTable.Cell>
          <DataTable.Cell>{Medication.Dosage}</DataTable.Cell>
          <DataTable.Cell>{Medication.Frequency}</DataTable.Cell>
          <DataTable.Cell>{Medication.Duration}</DataTable.Cell>
        </DataTable.Row>
      ))}
    

	</DataTable> 
); 
}; 


const styles = StyleSheet.create({ 
container: { 
	paddingHorizontal: wp(0.5),
    paddingVertical: hp(1),
    backgroundColor: '#e1e5f5',
    marginVertical: hp(2),
    borderRadius: 15
}, 


});
