import { useUser } from "@/context/UserContext";
import {
  fetchUsers,
  getUserData,
  removeUserData,
  updateUser,
} from "@/services/api.user";
import { MaterialIcons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import "react-native-gesture-handler";
import Avatar from "../common/avatar";
import AppHeader from "../common/header";
import AboutScreen from "../views/about";
import CalendarScreen from "../views/calendar";
import HomeScreen from "../views/home";
import MessageScreen from "../views/message";
import ChatDetailScreen from "../views/messageContent";
import ProfileScreen from "../views/profile";
import RecordDetailScreen from "../views/recordDetail";
import RecordsScreen from "../views/records";

type RootStackParamList = {
  message: undefined;
  messageContent: { id: string; contact: string };
  record: undefined;
  recordDetail: { id: string };
};

const DrawIcon = ({ focused, icon }: any) => {
  if (focused) {
    return (
      <ImageBackground>
        <AntDesign name={icon} size={24} color="#007AFF" />
      </ImageBackground>
    );
  }

  return (
    <View>
      <AntDesign name={icon} size={24} color="black" />
    </View>
  );
};

type CustomDrawerProps = DrawerContentComponentProps & {
  onLogout?: () => void;
};
const CustomDrawerContent = ({ onLogout, ...props }: CustomDrawerProps) => {
  const { user, setUser } = useUser();

  const handleLogout = async () => {
    const getUser = await fetchUsers({ query: { ID: user?.ID } });

    if (!getUser) return;

    const dataUpdate = { ...getUser, Online: true };
    const update = await updateUser({ query: dataUpdate });
    await removeUserData(); // Xóa dữ liệu user
    onLogout?.(); // báo RootLayout quay về LoginScreen
  };

  const goToProfile = () => {
    props.navigation.navigate("profile"); // chuyển đến ProfileScreen
  };

  useEffect(() => {
    (async () => {
      const userData = await getUserData();
      if (userData) setUser(userData);
    })();
  }, []);

  return (
    <>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.drawerContainer}
      >
        <View>
          {/* Header */}
          <View style={styles.drawerHeader}>
            <Image
              source={require("../../assets/images/logo.jpg")}
              style={styles.logoHeader}
            />
            <Text style={styles.textHeader}>Bệnh viện Trung ương Huế</Text>
          </View>

          {/* Item list */}
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      {/* Footer */}
      <View style={styles.drawerFooter}>
        <TouchableOpacity style={styles.account} onPress={goToProfile}>
          <Avatar src={user?.Avatar} />
          <Text style={styles.accountName}>{user?.DisplayName}</Text>
        </TouchableOpacity>
        <MaterialIcons
          name="logout"
          size={24}
          color="black"
          onPress={handleLogout}
        />
      </View>
    </>
  );
};

const HomeLayout = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator initialRouteName="home">
      <Stack.Screen
        name="home"
        options={{ header: () => <AppHeader title="Trang chủ" /> }}
        component={HomeScreen}
      />
      {/* <Stack.Screen
        name="preview-detail"
        options={{ title: "Chi tiết review" }}
        component={DetailScreen}
      /> */}
    </Stack.Navigator>
  );
};

const MessageLayout = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    <Stack.Navigator
      // initialRouteName="message"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="message" component={MessageScreen} />
      <Stack.Screen
        name="messageContent"
        // options={({ route }) => ({
        //   title: route.params?.contact || "Chat Detail",
        // })}
        component={ChatDetailScreen}
      />
    </Stack.Navigator>
  );
};

const RecordLayout = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="record" component={RecordsScreen} />
      <Stack.Screen name="recordDetail" component={RecordDetailScreen} />
    </Stack.Navigator>
  );
};

const ROUTES = [
  {
    name: "home1",
    title: "Trang chủ",
    icon: "home",
    component: HomeLayout,
  },
  {
    name: "records",
    title: "Hồ sơ bệnh án",
    icon: "profile",
    component: RecordLayout,
  },
  {
    name: "calendar",
    title: "Lịch",
    icon: "calendar",
    component: CalendarScreen,
  },
  {
    name: "message1",
    title: "Tin nhắn",
    icon: "message1",
    component: MessageLayout,
  },
  {
    name: "about",
    title: "Giới thiệu",
    icon: "infocirlceo",
    component: AboutScreen,
  },
  {
    name: "profile",
    title: "Tài khoản",
    icon: "user",
    component: ProfileScreen,
    visible: false,
  },
];

const AppNavigation = ({ onLogout }: { onLogout: () => void }) => {
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomDrawerContent onLogout={onLogout} {...props} />
      )}
      initialRouteName="records"
    >
      {ROUTES.map((route, index) => (
        <Drawer.Screen
          key={index}
          name={route.name}
          options={{
            title: route.title,
            header: () =>
              route.name === "home1" ? (
                <></>
              ) : (
                <AppHeader title={route.title} />
              ),
            drawerIcon: ({ focused }) => (
              <DrawIcon focused={focused} icon={route.icon} />
            ),
            drawerItemStyle: { height: route.visible === false ? 0 : "auto" },
          }}
          component={route.component}
        />
      ))}
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    justifyContent: "space-between", // header + items ở trên, footer ở dưới
    marginTop: -50,
  },
  drawerHeader: {
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  logoHeader: {
    width: 120,
    height: 120,
    borderRadius: 25,
    marginBottom: 10,
  },
  textHeader: {
    fontSize: 16,
    fontWeight: "bold",
  },
  drawerFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingVertical: 10,
    paddingRight: 10,
    marginBottom: 30,
  },
  account: {
    flexDirection: "row",
    alignItems: "center",
  },
  accountName: {
    fontWeight: 800,
  },
});

export default AppNavigation;
