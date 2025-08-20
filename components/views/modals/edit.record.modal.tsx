import {
  addRegistration,
  updateRegistration,
} from "@/services/api.registration";
import { getUserData } from "@/services/api.user";
import AntDesign from "@expo/vector-icons/AntDesign";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Alert, Button, Modal, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { RadioButton } from "react-native-paper";

interface IEditProps {
  title: string;
  modalVisible: boolean;
  setModalVisible: (v: boolean) => void;
  data: any;
  editFunc: any;
}

const EditRecordModal = (props: IEditProps) => {
  const { title, modalVisible, setModalVisible, data, editFunc } = props;
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(
    format(new Date(), "dd/MM/yyyy")
  );
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [department, setDepartment] = useState("");
  const [roomNo, setRoomNo] = useState("");
  const [gender, setGender] = useState("male");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setName(data?.Name || "");
    setDateOfBirth(format(data?.DateOfBirth || new Date(), "dd/MM/yyyy"));
    setPhone(data?.Phone || "");
    setAddress(data?.Address || "");
    setDepartment(data?.Department || "");
    setRoomNo(data?.RoomNo || "");
    setGender(data?.Gender === false ? "female" : "male");
  }, [data]);

  useEffect(() => {
    (async () => {
      const getUser = await getUserData();

      if (getUser) setUser(getUser);
    })();
  });

  const resetData = () => {
    setName("");
    setDateOfBirth(format(new Date(), "dd/MM/yyyy"));
    setPhone("");
    setAddress("");
    setDepartment("");
    setRoomNo("");
    setGender("male");
    setUser(null);
  };

  const handleAdd = async () => {
    try {
      const date = dateOfBirth.split("/").reverse().join("-") || "";
      const query = {
        Name: name || "",
        DateOfBirth: date || "",
        Gender: gender === "male" ? true : false,
        Address: address || "",
        Phone: phone || "",
        Department: department || "",
        RoomNo: roomNo || "",
        CreatedByUser: user?.ID || null,
      };

      const addItem = await addRegistration({ query: query });

      if (addItem) {
        Alert.alert(
          "Thông báo",
          `Thêm mới thông tin bệnh nhân ${name} thành công!`,
          [{ text: "OK" }],
          {
            cancelable: true,
          }
        );

        resetData();
        setModalVisible(false);
        editFunc();
      }
    } catch (error) {
      console.log("Thêm mới thông tin thất bại, lỗi: " + error);
    }
  };

  const handleEdit = async () => {
    try {
      const date = new Date(dateOfBirth.split("/").reverse().join("-")) || "";

      const query = {
        ID: data?.ID,
        Name: name || "",
        DateOfBirth: date || "",
        Gender: gender === "male" ? true : false,
        Address: address || "",
        Phone: phone || "",
        Department: department || "",
        RoomNo: roomNo || "",
        ModifiedByUser: user?.ID || null,
      };

      const editItem = await updateRegistration({ query: query });

      Alert.alert(
        "Thông báo",
        `Cập nhật thông tin bệnh nhân ${name} thành công!`,
        [{ text: "OK" }],
        {
          cancelable: true,
        }
      );
      resetData();
      setModalVisible(false);
      editFunc();
    } catch (error) {
      console.log("Cập nhật thông tin thất bại, lỗi: " + error);
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={modalVisible}>
      <View style={styles.container}>
        {/* header */}
        <View style={styles.header}>
          <Text style={{ fontSize: 18, fontWeight: 600 }}>{title}</Text>
          <AntDesign
            name="close"
            size={24}
            color="black"
            onPress={() => {
              setModalVisible(false);
            }}
          />
        </View>
        {/* body */}
        <View>
          <View style={styles.groupInput}>
            <Text style={styles.label}>Tên bệnh nhân</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={styles.groupInput}>
            <Text style={styles.label}>Ngày sinh</Text>
            <TextInput
              style={styles.input}
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
            />
          </View>
          <View style={styles.groupInput}>
            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
            />
          </View>
          <View style={styles.groupInput}>
            <Text style={styles.label}>Địa chỉ</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={[styles.groupInput, { flex: 4 }]}>
              <Text style={styles.label}>Khoa</Text>
              <TextInput
                style={styles.input}
                value={department}
                onChangeText={setDepartment}
              />
            </View>
            <View style={[styles.groupInput, { flex: 2, marginLeft: 15 }]}>
              <Text style={styles.label}>Phòng số</Text>
              <TextInput
                style={styles.input}
                value={roomNo}
                onChangeText={setRoomNo}
              />
            </View>
          </View>
          <RadioButton.Group
            onValueChange={(newValue) => setGender(newValue)}
            value={gender}
          >
            <Text style={styles.label}>Giới tính</Text>
            <View style={[styles.radioInput]}>
              <View style={styles.radioInput}>
                <RadioButton value="male" color="#007AFF" />
                <Text>Nam</Text>
              </View>
              <View style={[styles.radioInput, { marginLeft: 15 }]}>
                <RadioButton value="female" color="#007AFF" />
                <Text>Nữ</Text>
              </View>
            </View>
          </RadioButton.Group>
        </View>
        {/* footer */}
        <View style={{ marginTop: 5 }}>
          <Button
            title={data ? "Lưu chỉnh sửa" : "Thêm mới"}
            onPress={data ? handleEdit : handleAdd}
          />
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
  groupInput: {},
  radioInput: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: 500,
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

export default EditRecordModal;
