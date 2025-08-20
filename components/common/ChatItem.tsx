import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link } from "@react-navigation/native";
import { StyleSheet, Text, View } from "react-native";
import Avatar from "./avatar";

const ChatItem = ({ data }: any) => {
  return (
    <Link
      screen="message-content"
      params={{
        id: data.ContactID,
        contact: data.ContactName,
        avatar: data.ContactAvatar,
        online: data.ContactOnline,
      }}
      style={styles.chatItem}
      key={data.ContactID}
    >
      <View style={styles.groupAvatar}>
        <Avatar src={data.ContactAvatar} />
        <FontAwesome
          style={styles.online}
          name="circle"
          size={18}
          color={data.ContactOnline ? "#00ff00" : "#ccc"}
        />
      </View>
      <View style={styles.content}>
        <View style={styles.title}>
          <Text style={styles.username}>{data.ContactName}</Text>
          {data.LastTime && (
            <Text style={{ color: "#8c8c8c" }}>{data.LastTime}</Text>
          )}
        </View>
        {data.LastMessage && (
          <Text
            style={{ color: "#8c8c8c" }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {data.LastMessage}
          </Text>
        )}
      </View>
    </Link>
  );
};

const styles = StyleSheet.create({
  chatItem: {
    flex: 1,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    padding: 10,
  },
  groupAvatar: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  online: {
    position: "absolute",
    right: 15,
    bottom: -2,
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

export default ChatItem;
