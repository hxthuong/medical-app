export interface IModalProps {
  title: string;
  modalVisible: boolean;
  setModalVisible: (v: boolean) => void;
  data: any;
  callbackFunc: any;
}
