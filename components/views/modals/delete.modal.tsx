import { FontAwesome } from "@expo/vector-icons";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

interface IDeleteProps {
  title: string;
  modalVisible: boolean;
  setModalVisible: (v: boolean) => void;
  data: any;
  deleteFunc: any;
}

const DeleteModal = (props: IDeleteProps) => {
  const { title, modalVisible, setModalVisible, data, deleteFunc } = props;

  return (
    <Modal animationType="slide" transparent={true} visible={modalVisible}>
      <View style={styles.modal}>
        <View style={styles.container}>
          <View style={styles.content}>
            <FontAwesome name="trash" size={50} color="red" />
            <Text style={styles.text}>
              Bạn xác nhận muốn xóa {title}{" "}
              <Text style={{ color: "red" }}>{data?.Name}</Text> {"?"}
            </Text>
          </View>
          <View style={styles.groupBtn}>
            <Pressable
              style={({ pressed }) => [
                styles.btn,
                pressed ? styles.btnCancelHover : styles.btnCancel,
              ]}
              onPress={() => {
                setModalVisible(false);
              }}
            >
              {({ pressed }) => (
                <Text
                  style={[
                    styles.text,
                    { color: pressed ? "white" : "#a6a6a6" },
                  ]}
                >
                  Hủy bỏ
                </Text>
              )}
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.btn,
                pressed ? styles.btnDeleteHover : styles.btnDelete,
              ]}
              onPress={deleteFunc}
            >
              {({ pressed }) => (
                <Text
                  style={[styles.text, { color: pressed ? "red" : "white" }]}
                >
                  Xác nhận
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: 500,
  },
  groupBtn: {
    flexDirection: "row",
    justifyContent: "center",
  },
  btn: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 10,
    minWidth: 100,
  },
  btnDelete: {
    backgroundColor: "red",
    borderColor: "red",
  },
  btnDeleteHover: {
    backgroundColor: "white",
    borderColor: "red",
  },
  btnCancel: {
    borderColor: "#a6a6a6",
  },
  btnCancelHover: {
    backgroundColor: "#a6a6a6",
  },
});

export default DeleteModal;
