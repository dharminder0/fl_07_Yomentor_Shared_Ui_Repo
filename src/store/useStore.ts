import { create } from "zustand";

const useStore = create((set) => ({
  isModalVisible: false,
  isPopupModal: false,
  setModalVisible: (value: any) => set({ isModalVisible: value }),
  setIsPopupModal: (value: any) => set({ isPopupModal: value }),
}));

export default useStore;
