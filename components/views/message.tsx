import { fetchChatList } from "@/services/api.message";
import { getUserData } from "@/services/api.user";
import useFetch from "@/services/useFetch";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useEffect, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import ChatItem from "../common/ChatItem";

export default function MessageScreen() {
  const [searchText, setSearchText] = useState("");
  const [user, setUser] = useState<any>(null);

  const {
    data: chatList = [],
    loading,
    refetch: loadChatList,
  } = useFetch(() => fetchChatList({ query: { UserID: user.ID } }), !!user);

  useEffect(() => {
    (async () => {
      const data = await getUserData();
      if (data) setUser(data);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* <MaterialIcons
          name="menu"
          size={30}
          color="white"
          onPress={() => navigation.toggleDrawer()}
        /> */}
        <TextInput
          style={styles.searchText}
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Tìm kiếm..."
          placeholderTextColor={"white"}
        />
        <AntDesign name="search1" size={24} color="white" />
      </View>
      <FlatList
        data={chatList}
        keyExtractor={(item) => item.ContactID}
        renderItem={({ item }) => <ChatItem data={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
  },
  header: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: "center",
    backgroundColor: "#3b71ca",
    justifyContent: "space-between",
  },
  searchText: {
    color: "white",
  },
  chatItem: {
    flex: 1,
    flexDirection: "row",
    // marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    padding: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 15,
  },
  username: {
    fontSize: 16,
    fontWeight: 600,
  },
  content: {
    flex: 1,
    width: "100%",
    paddingRight: 40,
  },
  title: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
