import { create } from 'zustand'

export const useMediConnectStore = create((set) => ({
  selectedAppointmentMonth: "",  
  setSelectedAppointmentMonth:(Month)=> set({selectedAppointmentMonth: Month}),
}))

