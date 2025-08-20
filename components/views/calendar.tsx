import { printRegistration } from "@/services/api.registration";
import { getUserData } from "@/services/api.user";
import useFetch from "@/services/useFetch";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";

LocaleConfig.defaultLocale = "vi";

type AgendaItem = {
  name: string;
  time: string;
  patient: string;
  doctor?: string;
};

// const schedules = [
//   {
//     RegistrationID: "E89A51FB-AF70-47D7-B3E2-6E0E2FB74DD4",
//     Name: "Nguyễn Văn A",
//     Age: 27,
//     Gender: true,
//     Address: "456 CDE",
//     Phone: "654544",
//     Department: "Khoa 2",
//     RoomNo: "3",
//     ServiceID: "2C6E105B-92F0-41E9-B4AD-6C1F2BCC12F4",
//     ServiceName:
//       "Thay băng vết thương nhiễm trùng, loét ép (bao gồm cắt chỉ)/ 1 lần",
//     Price: 250000,
//     UsageCount: 1,
//     RequestDate: "2025-07-22T00:00:00.000Z",
//     DoctorID: "E4FCA143-65B5-4CB0-9434-69E75AEC74CE",
//     RequestTime: "1970-01-01T20:00:00.000Z",
//   },
//   {
//     RegistrationID: "E89A51FB-AF70-47D7-B3E2-6E0E2FB74DD4",
//     Name: "Nguyễn Văn A",
//     Age: 27,
//     Gender: true,
//     Address: "456 CDE",
//     Phone: "654544",
//     Department: "Khoa 2",
//     RoomNo: "3",
//     ServiceID: "68542561-3B9B-443B-A4DF-525F81FFC71F",
//     ServiceName: "Thay băng vết thương vô trùng (bao gồm cắt chỉ)/ 1 lần",
//     Price: 200000,
//     UsageCount: 1,
//     RequestDate: "2025-07-22T00:00:00.000Z",
//     DoctorID: "E4FCA143-65B5-4CB0-9434-69E75AEC74CE",
//     RequestTime: "1970-01-01T16:00:00.000Z",
//   },
// ];

export default function CalendarScreen() {
  const [user, setUser] = useState<any>(null);
  const today = format(new Date(), "yyyy-MM-dd");
  const [selectedDate, setSelectedDate] = useState<string | null>(
    today ?? null
  );

  const {
    data: registrations,
    loading,
    refetch: reloadSchedule,
  } = useFetch(
    () => printRegistration({ query: { DoctorID: user?.ID } }),
    user ? true : false
  );

  const schedules: any[] = registrations ?? [];

  useEffect(() => {
    (async () => {
      const getUser = await getUserData();

      if (getUser) setUser(getUser);
    })();
  }, []);

  const items: { [date: string]: AgendaItem[] } = schedules.reduce(
    (acc, item) => {
      const date = item.RequestDate.split("T")[0]; // Lấy phần ngày
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push({
        name: item.ServiceName,
        time: item.RequestTime.split("T")[1]?.replace(":00.000Z", ""),
        patient: item.Name,
      });

      // Sắp xếp theo thời gian (chuỗi "HH:mm" so sánh trực tiếp được)
      acc[date].sort((a: AgendaItem, b: AgendaItem) =>
        a.time > b.time ? 1 : a.time < b.time ? -1 : 0
      );

      return acc;
    },
    {} as { [date: string]: AgendaItem[] }
  );

  // Tạo object để đánh dấu các ngày có sự kiện
  const markedDates = Object.keys(items).reduce((acc, date) => {
    acc[date] = { marked: true, dotColor: date !== today ? "red" : "#007AFF" };
    return acc;
  }, {} as { [key: string]: any });

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={(day: any) => setSelectedDate(day.dateString)}
        markedDates={{
          ...markedDates,
          ...(selectedDate
            ? {
                [selectedDate]: {
                  selected: true,
                  marked: !markedDates[selectedDate ?? ""] ? false : true,
                  dotColor: selectedDate === today ? "red" : "#007AFF",
                },
              }
            : {}),
        }}
      />

      {selectedDate && items[selectedDate] ? (
        <View style={styles.scheduleGroup}>
          <FlatList
            data={items[selectedDate]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <AntDesign name="clockcircleo" size={24} color="#007AFF" />
                <Text style={{ marginLeft: 15, fontSize: 16 }}>
                  <Text style={{ fontWeight: 600 }}>{item.time}</Text>:{" "}
                  {item.patient} - {item.name}
                </Text>
              </View>
            )}
          />
        </View>
      ) : (
        <View style={styles.noSchedule}>
          <FontAwesome name="calendar" size={24} color="#007AFF" />
          <Text style={styles.noDataText}>Không có lịch nào</Text>
        </View>
      )}
      {/* <Calendar
        // Customize the appearance of the calendar
        style={{
          borderWidth: 1,
          borderColor: "gray",
          height: 350,
        }}
        // Specify the current date
        current={"2025-08-15"}
        // Callback that gets called when the user selects a day
        onDayPress={(day) => {
          console.log("selected day", day);
        }}
        // Mark specific dates as marked
        markedDates={{
          "2025-08-01": { selected: true, marked: true, selectedColor: "#007AFF" },
          "2025-08-02": { marked: true },
          "2025-08-03": { selected: true, marked: true, selectedColor: "#007AFF" },
        }}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6f2ff",
  },
  scheduleGroup: {
    margin: 10,
    padding: 15,
    backgroundColor: "white",
    borderRadius: 8,
  },
  item: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 5,
  },
  noSchedule: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    fontSize: 16,
    fontWeight: 600,
    marginLeft: 15,
  },
  // item: {
  //   backgroundColor: "white",
  //   padding: 20,
  //   borderBottomWidth: 1,
  //   borderBottomColor: "#eee",
  // },
  // header: {
  //   backgroundColor: "#f7f7f7",
  //   padding: 10,
  // },
  // headerText: {
  //   fontWeight: "bold",
  // },
});

LocaleConfig.locales["vi"] = {
  monthNames: [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ],
  dayNames: ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"],
  dayNamesShort: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
  today: "Hôm nay",
};
