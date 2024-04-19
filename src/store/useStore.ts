import { create } from "zustand";

const useStore = create((set) => ({
  isModalVisible: false,
  isPopupModal: false,
  isConfirmModal: false,
  isAlertModal: false,
  setModalVisible: (value: any) => set({ isModalVisible: value }),
  setIsPopupModal: (value: any) => set({ isPopupModal: value }),
  setIsConfirmModal: (value: any) => set({ isConfirmModal: value }),
  setIsAlertModal: (value: any) => set({ isAlertModal: value }),
}));

export default useStore;
