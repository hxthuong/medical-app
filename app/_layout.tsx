import AntDesign from "@expo/vector-icons/AntDesign";
import { useFonts } from "expo-font";
import "react-native-reanimated";

import AppNavigation from "@/components/navigation/navigation";
import LoginScreen from "@/components/views/login";
import { UserProvider } from "@/context/UserContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getUserData } from "@/services/api.user";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [login, setLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000, // thời gian xoay 1 vòng
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [rotateAnim]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  useEffect(() => {
    (async () => {
      try {
        const userData = await getUserData();

        setLogin(!userData ? false : true);
      } catch (error) {
        console.log("Error login:" + error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (!loaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <AntDesign name="loading1" size={40} color="#afc5e9" />
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!login ? (
        <LoginScreen onLogin={() => setLogin(true)} />
      ) : (
        <UserProvider>
          <AppNavigation onLogout={() => setLogin(false)} />
        </UserProvider>
      )}
    </View>
    // <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
    //   <Drawer.Navigator>
    //     <Drawer.Screen
    //       name="home"
    //       options={{
    //         title: "Trang chủ",
    //         header: () => <AppHeader title="Trang chủ" />,
    //       }}
    //       component={HomeScreen}
    //     />
    //     {/* <Drawer.Screen
    //       name="about"
    //       options={{ title: "Thông tin", header: () => <AppHeader /> }}
    //       component={AboutScreen}
    //     /> */}
    //   </Drawer.Navigator>
    //   {/* <Stack>
    //     <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    //     <Stack.Screen name="+not-found" />
    //   </Stack>
    //   <StatusBar style="auto" /> */}
    // </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    backgroundColor: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
