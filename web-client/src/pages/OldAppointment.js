import React, { useState } from 'react';
import Calendar from '../components/Calendar';
import AppointmentModal from '../components/AppointmentModal';
import { Inject, ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, EventsView, Resize, DragAndDrop, ViewDirective, ViewsDirective } from '@syncfusion/ej2-react-schedule';
import { DataManager, WebApiAdaptor } from '@syncfusion/ej2-data';

const OldAppointment = () => {
  // const [appointments, setAppointments] = useState([]);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [selectedSlot, setSelectedSlot] = useState(null);

  // const openModal = (slot) => {
  //   setSelectedSlot(slot);
  //   setIsModalOpen(true);
  // };

  // const closeModal = () => {
  //   setIsModalOpen(false);
  //   setSelectedSlot(null);
  // };

  // const addAppointment = (appointment) => {
  //   setAppointments([...appointments, appointment]);
  //   closeModal();
  // };


    const dataManager = new DataManager({
      url: 'https://services.syncfusion.com/react/production/api/schedule',
      adaptor: new WebApiAdaptor,
      crossDomain: true
    }); 
  return (
    // <div className="Appointment">
    //   <Calendar appointments={appointments} openModal={openModal} />
    //   <AppointmentModal
    //     isOpen={isModalOpen}
    //     onClose={closeModal}
    //     onSave={addAppointment}
    //     slot={selectedSlot}
    //   />
    // </div>
    <ScheduleComponent selectedDate={new Date(2024, 10, 1)} eventSettings={{ dataSource: dataManager }}>
      <ViewsDirective>
        <ViewDirective option='Day' startHour='9:00' endHour='18:00'></ViewDirective>
        <ViewDirective option='Week' startHour='9:00' endHour='18:00'></ViewDirective>
        <ViewDirective option='Month'></ViewDirective>
      </ViewsDirective>
      <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
      
    </ScheduleComponent>
  );
};

export default Appointment;
