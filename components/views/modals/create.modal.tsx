import AntDesign from "@expo/vector-icons/AntDesign";
import { useState } from "react";
import { Alert, Button, Modal, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

interface IProps {
  modalVisible: boolean;
  setModalVisible: (v: boolean) => void;
  addNew: any;
}

const CreateModal = (props: IProps) => {
  const { modalVisible, setModalVisible, addNew } = props;
  const [title, setTitle] = useState("");
  const [star, setStar] = useState("");

  const randomId = (max: number, min: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const handleSubmit = () => {
    if (!title) {
      Alert.alert("Thông tin không hợp lệ", "Nội dung không được để trống!");
      return;
    }

    if (!star) {
      Alert.alert("Thông tin không hợp lệ", "Rating không được để trống!");
      return;
    }

    // addNew({
    //     id: randomId(2, 10000),
    //     title: title,
    //     star: Number(star) || 0,
    // });

    setModalVisible(false);
    setStar("");
    setTitle("");
  };

  return (
    <Modal animationType="slide" transparent={true} visible={modalVisible}>
      <View style={styles.container}>
        <View>
          {/* header */}
          <View style={styles.header}>
            <Text style={{ fontSize: 24, fontWeight: "600" }}>
              Create a review
            </Text>
            <AntDesign
              name="close"
              size={24}
              color="black"
              onPress={() => {
                setModalVisible(false);
                setStar("");
                setTitle("");
              }}
            />
          </View>
          {/* body */}
          <View>
            <View style={styles.groupInput}>
              <Text style={styles.text}>Nội dung</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
              />
            </View>
            <View style={styles.groupInput}>
              <Text style={styles.text}>Rating</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={star}
                onChangeText={setStar}
              />
            </View>
          </View>
          {/* footer */}
          <View style={{ marginTop: 5 }}>
            <Button title="Add" onPress={handleSubmit} />
          </View>
          {/* <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => setModalVisible(!modalVisible)}
                    >
                        <Text style={styles.textStyle}>Hide Modal</Text>
                    </Pressable> */}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 20,
  },
  groupInput: {
    marginBottom: 15,
  },
  text: {
    fontSize: 20,
    fontWeight: "400",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginVertical: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});

export default CreateModal;
