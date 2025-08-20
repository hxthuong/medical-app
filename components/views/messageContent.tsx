import { fetchChatContent, sendMessage } from "@/services/api.message";
import { getUserData } from "@/services/api.user";
import useFetch from "@/services/useFetch";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useHeaderHeight } from "@react-navigation/elements";
import { format } from "date-fns";
import { useNavigation } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Avatar from "../common/avatar";

function groupChatByDate(data: any[]) {
  const groups: Record<string, any[]> = {};

  if (data && data.length > 0) {
    data.forEach((chat) => {
      const date = format(new Date(chat.CreateOnTime), "yyyy-MM-dd");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(chat);
    });
  }

  return Object.keys(groups)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    .map((dateKey) => ({
      title: format(new Date(dateKey), "dd/MM/yyyy"),
      data: groups[dateKey],
    }));
}

const ChatDetailScreen = ({ route }: any) => {
  const { id, contact, avatar, online } = route.params;
  const [text, setText] = useState("");
  const [user, setUser] = useState<any>(null);
  // State giữ tin nhắn hiển thị
  // const [messages, setMessages] = useState<any[]>([]);

  const currentUser = user?.ID ?? null;
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();
  const listRef = useRef<SectionList>(null);

  const {
    data,
    loading,
    refetch: loadMessages,
  } = useFetch(() =>
    fetchChatContent({ query: { UserID: currentUser, ContactID: id } })
  );
  const sections = groupChatByDate(data);

  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      const userData = await getUserData();
      if (userData) {
        setUser(userData);
      }
    })();
  });

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

  // Khi sections thay đổi => cuộn xuống cuối
  const scrollToBottom = () => {
    if (!sections.length) return;

    const index = sections.length - 1 || 0;

    (listRef.current as any)?.scrollToLocation({
      sectionIndex: index,
      itemIndex: sections[index]?.data.length - 1 || 0,
      animated: true,
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <AntDesign name="loading1" size={40} color="#afc5e9" />
        </Animated.View>
      </View>
    );
  }

  // Khi API load xong thì đồng bộ vào state

  const handleSend = async () => {
    try {
      const newMessage = await sendMessage({
        query: {
          Sender: currentUser,
          Receiver: id,
          Message: text,
        },
      });

      // setMessages((prev) => [...prev, newMessage]);

      loadMessages();
    } catch (err) {
      console.error("Gửi tin nhắn thất bại", err);
    }

    setText("");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={headerHeight + 15}
    >
      {/* Header */}
      <View style={styles.header}>
        <AntDesign
          style={{ marginRight: 15 }}
          name="arrowleft"
          size={24}
          color="black"
          onPress={() => navigation.goBack()}
        />
        <View style={styles.groupAvatar}>
          <Avatar src={avatar} />
          <FontAwesome
            style={styles.online}
            name="circle"
            size={18}
            color={online ? "#00ff00" : "#ccc"}
          />
        </View>
        <Text style={styles.contactName}>{contact}</Text>
      </View>

      {/* Nội dung */}
      <SectionList
        ref={listRef}
        style={{ flex: 1 }}
        sections={sections}
        keyExtractor={(item) => item.ID}
        onContentSizeChange={scrollToBottom}
        onScrollToIndexFailed={() => {
          setTimeout(scrollToBottom, 300);
        }}
        renderSectionHeader={({ section: { title } }) => (
          <View style={{ alignItems: "center", marginVertical: 8 }}>
            <Text style={styles.messageDate}>{title}</Text>
          </View>
        )}
        renderItem={({ item }) => {
          const isSelf = item.SenderID === currentUser;
          return (
            <View
              style={[
                styles.messageContainer,
                isSelf ? styles.messageSelf : styles.messageOther,
              ]}
            >
              {!isSelf && (
                <Avatar
                  src={
                    item.SenderID === id
                      ? item.SenderAvatar
                      : item.ReceiverAvatar
                  }
                />
              )}
              <View
                style={[
                  styles.bubble,
                  isSelf ? styles.bubbleSelf : styles.bubbleOther,
                ]}
              >
                <Text style={isSelf ? styles.textSelf : styles.textOther}>
                  {item.MessageText}
                </Text>
                <Text
                  style={[
                    styles.timeText,
                    { color: isSelf ? "white" : "black" },
                  ]}
                >
                  {format(new Date(item.CreateOnTime), "HH:mm")}
                </Text>
              </View>
              {/* {isSelf && (
                <Avatar
                  src={
                    item.SenderID === currentUser
                      ? item.SenderAvatar
                      : item.ReceiverAvatar
                  }
                />
              )} */}
            </View>
          );
        }}
      />

      {/* Ô nhập tin nhắn */}
      <View style={styles.inputGroup}>
        <TextInput
          value={text}
          onChangeText={setText}
          style={styles.input}
          placeholder="Tin nhắn"
        />
        <Ionicons
          style={[styles.btnSend, { display: !text.trim() ? "none" : "flex" }]}
          name="paper-plane"
          size={30}
          color="#007AFF"
          onPress={handleSend}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    padding: 10,
    alignItems: "center",
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
  contactName: {
    fontSize: 16,
    fontWeight: "600",
  },
  messageContainer: {
    flexDirection: "row",
    marginVertical: 6,
    paddingHorizontal: 10,
    alignItems: "flex-start",
  },
  messageDate: {
    fontSize: 12,
    color: "white",
    backgroundColor: "#ccc",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  messageSelf: { justifyContent: "flex-end" },
  messageOther: { justifyContent: "flex-start" },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  bubble: {
    maxWidth: "70%",
    padding: 12,
    borderRadius: 16,
  },
  bubbleSelf: {
    backgroundColor: "#0b93f6",
    borderTopRightRadius: 0,
  },
  bubbleOther: {
    backgroundColor: "#e5e5ea",
    borderTopLeftRadius: 0,
  },
  textSelf: { color: "#fff", fontSize: 16 },
  textOther: { color: "#000", fontSize: 16 },
  timeText: {
    marginTop: 4,
    fontSize: 10,
    color: "#666",
    textAlign: "right",
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    marginBottom: 35,
  },
  input: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 10,
    // borderWidth: 1,
    // borderColor: "#ccc",
    borderRadius: 4,
  },
  btnSend: {
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChatDetailScreen;
