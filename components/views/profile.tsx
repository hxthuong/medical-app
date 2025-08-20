import { useUser } from "@/context/UserContext";
import { useImagePicker } from "@/hooks/useImagePicker";
import {
  fetchUsers,
  getUserData,
  paramsData,
  saveUserData,
  updateProfile,
  updateUser,
} from "@/services/api.user";
import useFetch from "@/services/useFetch";
import AntDesign from "@expo/vector-icons/AntDesign";
import Fontisto from "@expo/vector-icons/Fontisto";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Avatar from "../common/avatar";

const showNotification = (message: string) => {
  Alert.alert("Thông báo", message, [{ text: "OK" }], {
    cancelable: true,
  });
};

export default function ProfileScreen() {
  const { user, setUser } = useUser();
  const [displayName, setDisplayName] = useState("");
  const [avatar, setAvatar] = useState<any>(null);
  const [edit, setEdit] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [renewPassword, setRenewPassword] = useState("");
  const { pickImage } = useImagePicker();
  const oldPassRef = useRef<TextInput>(null);
  const newPassRef = useRef<TextInput>(null);
  const renewPassRef = useRef<TextInput>(null);

  const {
    data,
    loading,
    refetch: loadUser,
  } = useFetch(() => fetchUsers({ query: { ID: user.ID } }), !!user);

  useEffect(() => {
    (async () => {
      const userData = await getUserData();
      if (userData) setUser(userData);
    })();
  }, []);

  useEffect(() => {
    if (data) setDisplayName(data?.DisplayName);
  }, [data]);

  const pickerAvatar = async () => {
    if (!edit) return;
    const image = await pickImage();
    if (image) setAvatar(image);
  };

  const handleEdit = () => {
    const formData = new FormData();

    // trì hoãn 500ms trước khi gửi request
    setTimeout(async () => {
      try {
        if (avatar && !avatar.uri) {
          console.log("Avatar chưa sẵn sàng!");
          return;
        }

        if (avatar) {
          const uri =
            Platform.OS === "android"
              ? avatar.uri
              : avatar.uri.replace("file://", "");

          formData.append("file", {
            uri: uri, // bắt buộc, đường dẫn file
            name: avatar.fileName || "avatar.jpg", // tên file
            type: avatar.mimeType || "image/jpeg", // loại file
          } as any);
        }

        formData.append("ID", data?.ID);
        formData.append("Username", data?.Username);
        formData.append("DisplayName", displayName || data?.DisplayName);
        formData.append("Password", data?.Password);
        formData.append("Role", data?.Role);
        formData.append("Active", data?.Active);
        formData.append("Avatar", data?.Avatar);
        formData.append("Gender", data?.Gender);
        formData.append("Online", data?.Online);
        formData.append("ModifiedByUser", data?.ModifiedByUser);

        const editUser = await updateProfile({ formData: formData });

        await saveUserData(paramsData(editUser));

        setUser((prev: any) => ({ ...prev, ...paramsData(editUser) }));

        loadUser();

        setEdit(false);
      } catch (error) {
        console.log("Chỉnh sửa profile thất bại, lỗi: " + error);
      }
    }, 500); // 500ms delay
  };

  const handleChangePassword = async () => {
    if (!data) return;

    if (!oldPassword) {
      showNotification("Vui lòng nhập mật khẩu hiện tại");
      oldPassRef?.current?.focus();
      return;
    }

    if (!newPassword) {
      showNotification("Vui lòng nhập mật khẩu mới");
      newPassRef?.current?.focus();
      return;
    }

    if (!renewPassword) {
      showNotification("Vui lòng nhập lại mật khẩu");
      renewPassRef?.current?.focus();
      return;
    }

    if (data.Password !== oldPassword) {
      showNotification("Mật khẩu cũ không đúng");
      oldPassRef?.current?.focus();
      return;
    }

    if (oldPassword === newPassword) {
      showNotification("Mật khẩu mới không được trùng mật khẩu hiện tại");
      newPassRef?.current?.focus();
      return;
    }

    if (newPassword !== renewPassword) {
      showNotification("Mật khẩu nhập lại không trùng khớp");
      renewPassRef?.current?.focus();
      return;
    }

    try {
      const dataEdit = { ...data, Password: newPassword };
      const editUser = await updateUser({ query: dataEdit });
      showNotification("Đổi mật khẩu thành công!");
    } catch (error) {
      showNotification("Đổi mật khẩu thất bại!");
    }

    setVisibleModal(false);
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          style={{ alignItems: "flex-end", marginRight: 15, marginTop: 15 }}
          onPress={() => setVisibleModal(true)}
        >
          <Text style={{ color: "#007AFF", fontWeight: 600 }}>
            Đổi mật khẩu
          </Text>
        </TouchableOpacity>
        <View style={styles.infoGroup}>
          <View style={styles.avatarGroup}>
            <Pressable
              onPressIn={() => setShowOverlay(true)}
              onPressOut={() => setShowOverlay(false)}
              onPress={pickerAvatar}
            >
              <Avatar
                src={avatar?.uri || data?.Avatar}
                width={140}
                height={140}
              />
              {showOverlay && edit && (
                <>
                  <View style={styles.overlay}></View>
                  <AntDesign
                    style={styles.iconAdd}
                    name="camerao"
                    size={24}
                    color="white"
                  />
                </>
              )}
            </Pressable>
            {/* <View style={styles.overlay}></View> */}
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tài khoản: </Text>
            <Text style={styles.normalText}>{data?.Username}</Text>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tên hiển thị: </Text>
            {edit ? (
              <TextInput
                style={styles.input}
                value={displayName}
                onChangeText={setDisplayName}
              />
            ) : (
              <Text style={styles.normalText}>{data?.DisplayName}</Text>
            )}
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Giới tính: </Text>
            {data?.Gender === true ? (
              <Fontisto name="male" size={24} color="#3b71ca" />
            ) : (
              <Fontisto name="female" size={24} color="#ff8080" />
            )}
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Vai trò: </Text>
            <Text style={styles.normalText}>
              {data?.Role === "admin"
                ? "Admin"
                : data?.Role === "doctor"
                ? "Bác sĩ"
                : data?.Role === "staff"
                ? "Hành chính"
                : "Nhân viên"}
            </Text>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Trạng thái: </Text>
            <Text
              style={{
                fontSize: 16,
                color: data?.Active === true ? "#2eb82e" : "black",
              }}
            >
              {data?.Active === true ? "Hoạt động" : "Vô hiệu"}
            </Text>
          </View>
          {!edit ? (
            <Pressable
              style={[styles.btnSave, styles.btn]}
              onPress={() => setEdit(true)}
            >
              <Text style={styles.btnText}>Chỉnh sửa</Text>
            </Pressable>
          ) : (
            <Pressable
              style={[styles.btnSave, styles.btn]}
              onPress={handleEdit}
            >
              <Text style={styles.btnText}>Lưu</Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* modal đổi mật khẩu */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={visibleModal}
        onRequestClose={() => {
          setVisibleModal(!visibleModal);
        }}
      >
        <TouchableWithoutFeedback onPress={() => setVisibleModal(false)}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextInput
                style={styles.modalInput}
                ref={oldPassRef}
                value={oldPassword}
                secureTextEntry={true}
                onChangeText={setOldPassword}
                placeholder="Mật khẩu hiện tại"
              />
              <TextInput
                style={styles.modalInput}
                ref={newPassRef}
                value={newPassword}
                secureTextEntry={true}
                onChangeText={setNewPassword}
                placeholder="Mật khẩu mới"
              />
              <TextInput
                style={styles.modalInput}
                ref={renewPassRef}
                value={renewPassword}
                secureTextEntry={true}
                onChangeText={setRenewPassword}
                placeholder="Nhập lại mật khẩu mới"
              />
              <Pressable style={styles.btn} onPress={handleChangePassword}>
                <Text style={styles.btnText}>Lưu chỉnh sửa</Text>
              </Pressable>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  infoGroup: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  avatarGroup: {
    position: "relative",
  },
  overlay: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "black",
    opacity: 0.5,
  },
  iconAdd: {
    position: "absolute",
    top: 60,
    left: 60,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: 15,
    height: 40,
  },
  label: {
    width: 100,
    fontWeight: 600,
    marginRight: 15,
    fontSize: 16,
  },
  normalText: {
    fontSize: 16,
  },
  input: {
    flex: 1,
    padding: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: "white",
    fontSize: 16,
  },
  btnSave: {
    marginTop: 15,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    // alignItems: "center",
  },
  modalView: {
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  modalInput: {
    // flex: 1,
    padding: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: "white",
    fontSize: 16,
    width: "100%",
    marginBottom: 15,
  },
  btn: {
    borderRadius: 4,
    backgroundColor: "#2196F3",
    padding: 10,
  },
  btnText: {
    color: "white",
    fontSize: 16,
  },
});
