import {
  getUser,
  paramsData,
  registerUser,
  saveUserData,
  updateUser,
} from "@/services/api.user";
import useFetch from "@/services/useFetch";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  Button,
  ImageBackground,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { RadioButton } from "react-native-paper";
import background from "../../assets/images/background.jpg";

type LoginProps = {
  onLogin: () => void;
};

export default function LoginScreen({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [gender, setGender] = useState("male");
  const [visible, setVisible] = useState(false);
  const [register, setRegister] = useState(false);

  const navigation: any = useNavigation();

  const {
    data,
    loading,
    refetch: loadUser,
  } = useFetch(() =>
    getUser({ query: { Username: username, Password: password } })
  );

  const handleSubmit = async () => {
    try {
      const login = await getUser({
        query: { Username: username, Password: password },
      });

      const dataUpdate = { ...login, Online: true };

      const update = await updateUser({ query: dataUpdate });

      if (update) {
        await saveUserData(paramsData(update));
        onLogin();
      }

      loadUser();
    } catch (err) {
      console.error("Đăng nhập thất bại", err);
    }

    setUsername("");
    setPassword("");
  };

  const handleRegister = async () => {
    try {
      const newUser = {
        Username: username,
        Password: password,
        DisplayName: displayName,
        Gender: gender === "male" ? true : false,
        CreatedByUser: null,
      };

      const add = await registerUser(newUser);

      if (add) {
        await saveUserData(paramsData(add));
        onLogin();
      }

      loadUser();
    } catch (err) {
      console.error("Đăng ký thất bại", err);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ImageBackground source={background} style={styles.container}>
        <View style={styles.form}>
          <View>
            <Text style={styles.header}>
              {register ? "Đăng ký" : "Đăng nhập"}
            </Text>
          </View>
          <TextInput
            style={styles.input}
            onChangeText={setUsername}
            value={username}
            placeholder="Nhập tên tài khoản"
          />
          <View>
            <TextInput
              placeholder="Nhập mật khẩu"
              secureTextEntry={!visible}
              style={[styles.input, styles.inputPassword]}
              onChangeText={setPassword}
              value={password}
            />
            <TouchableOpacity
              onPress={() => {
                setVisible(!visible);
                Keyboard.dismiss();
              }}
              style={styles.icon}
            >
              <Feather
                name={visible ? "eye-off" : "eye"}
                size={20}
                color="gray"
              />
            </TouchableOpacity>
          </View>
          {register && (
            <>
              <TextInput
                style={styles.input}
                onChangeText={setUsername}
                value={username}
                placeholder="Nhập tên hiển thị"
              />
              <RadioButton.Group value={gender} onValueChange={setGender}>
                <View style={[styles.radioGroup, { marginBottom: 10 }]}>
                  <View style={styles.radioGroup}>
                    <RadioButton value="male" />
                    <Text>Nam</Text>
                  </View>
                  <View style={[styles.radioGroup, { marginLeft: 10 }]}>
                    <RadioButton value="female" />
                    <Text>Nữ</Text>
                  </View>
                </View>
              </RadioButton.Group>

              <Button onPress={handleRegister} title="Đăng ký" />
            </>
          )}

          {!register && (
            <>
              <Button onPress={handleSubmit} title="Đăng nhập" />
              <View style={styles.registerGroup}>
                <Text>Chưa có tài khoản?</Text>
                <Text
                  style={styles.btnRegister}
                  onPress={() => setRegister(true)}
                >
                  Đăng ký ngay
                </Text>
              </View>
            </>
          )}
        </View>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  form: {
    width: 300,
    backgroundColor: "white",
    opacity: 0.8,
    borderRadius: 8,
    padding: 15,
  },
  header: {
    fontSize: 30,
    fontWeight: "600",
    textAlign: "center",
    paddingBottom: 15,
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
  },
  inputPassword: {
    paddingRight: 40,
    position: "relative",
    width: "100%",
  },
  icon: {
    position: "absolute",
    right: 12,
    top: 10,
  },
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  registerGroup: {
    // flex: 1,
    flexDirection: "row",
    marginVertical: 15,
  },
  btnRegister: {
    marginLeft: 8,
    color: "#3b71ca",
    fontWeight: 600,
  },
});
