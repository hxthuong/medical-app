import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View } from "react-native";

const AppHeader = ({ title }: any) => {
  const navigation: any = useNavigation();

  return (
    <View style={styles.container}>
      <MaterialIcons
        name="menu"
        size={30}
        color="white"
        onPress={() => navigation.toggleDrawer()}
      />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    padding: 10,
    alignItems: "center",
    backgroundColor: "#3b71ca",
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: 600,
    color: "white",
  },
});

export default AppHeader;
