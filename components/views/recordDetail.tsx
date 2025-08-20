import { fetchRegistration } from "@/services/api.registration";
import useFetch from "@/services/useFetch";
import { AntDesign, Entypo, FontAwesome, Fontisto } from "@expo/vector-icons";
import { format } from "date-fns";
import { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const services = [
  {
    ID: "68542561-3B9B-443B-A4DF-525F81FFC71F",
    ServiceName: "Thay băng vết thương vô trùng (bao gồm cắt chỉ)/ 1 lần",
    Price: 200000,
    UsageCount: 1,
    RequestDate: "2025-07-23T00:00:00.000Z",
    Status: "overdue",
    RegistrationID: "E89A51FB-AF70-47D7-B3E2-6E0E2FB74DD4",
    DoctorID: "E4FCA143-65B5-4CB0-9434-69E75AEC74CE",
    DoctorName: "Trần Văn D",
    RequestTime: "1970-01-01T16:00:00.000Z",
    Notes: "test ghi chú",
  },
  {
    ID: "2C6E105B-92F0-41E9-B4AD-6C1F2BCC12F4",
    ServiceName:
      "Thay băng vết thương nhiễm trùng, loét ép (bao gồm cắt chỉ)/ 1 lần",
    Price: 250000,
    UsageCount: 1,
    RequestDate: "2025-07-22T00:00:00.000Z",
    Status: "register",
    RegistrationID: "E89A51FB-AF70-47D7-B3E2-6E0E2FB74DD4",
    DoctorID: "E4FCA143-65B5-4CB0-9434-69E75AEC74CE",
    DoctorName: "Trần Văn D",
    RequestTime: "1970-01-01T20:00:00.000Z",
    Notes: "test 2",
  },
];

const ServiceItem = ({ item, isLast }: any) => {
  return (
    <View style={[styles.serviceItem, { borderBottomWidth: isLast ? 0 : 1 }]}>
      {/* content */}
      <View>
        <Text style={styles.serviceTitle}>{item.ServiceName}</Text>
        <View style={styles.serviceGroup}>
          <Text>Số lần: {item.UsageCount}</Text>
          <Text>Đơn giá: {item.Price.toLocaleString("de-DE")} VNĐ</Text>
        </View>
        <View style={styles.serviceGroup}>
          <Text>Ngày: {format(new Date(item.RequestDate), "dd/MM/yyyy")}</Text>
          {item.Status === "overdue" ? (
            <Text style={{ color: "red" }}>
              <AntDesign name="clockcircle" size={16} color="red" />{" "}
              <Text>Đã quá hạn</Text>
            </Text>
          ) : item.Status === "scheduled" ? (
            <Text style={{ color: "#ff9900" }}>
              <AntDesign name="clockcircle" size={16} color="#ff9900" />{" "}
              <Text>Đã đến hạn</Text>
            </Text>
          ) : (
            <Text style={{ color: "#33cc33" }}>
              <AntDesign name="checkcircle" size={16} color="#33cc33" />{" "}
              <Text>Đã đăng ký</Text>
            </Text>
          )}
        </View>
      </View>
      {/* footer */}
      <View style={styles.serviceFooter}>
        <Entypo
          style={{ paddingLeft: 10 }}
          name="edit"
          size={24}
          color="#e4a11b"
          // onPress={() => handleOpenModal(row)}
        />

        <FontAwesome
          style={{ paddingLeft: 10 }}
          name="trash"
          size={24}
          color="#fe2c55"
          // onPress={() => handleOpenModalDelete(row)}
        />
      </View>
    </View>
  );
};

export default function RecordDetailScreen({ route }: any) {
  const { id } = route.params;
  const [collapsedInfo, setCollapsedInfo] = useState(false);
  const [collapsedService, setCollapsedService] = useState(false);

  const screenWidth = Dimensions.get("window").width;

  const { data } = useFetch(() => fetchRegistration({ query: { ID: id } }));

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.header}
          onPress={() => setCollapsedInfo(!collapsedInfo)}
        >
          <Text style={styles.headerTitle}>Thông tin bệnh nhân</Text>
        </TouchableOpacity>
        {!collapsedInfo && (
          <View style={styles.content}>
            <View style={styles.infoTitle}>
              <Text style={[styles.textMedium, { fontWeight: 600 }]}>
                {data?.Name}
              </Text>
              <Text style={styles.textMedium}>({data?.Age} tuổi)</Text>
              <Text style={styles.textMedium}>
                {data?.Gender === true ? (
                  <Fontisto name="male" size={24} color="#3b71ca" />
                ) : (
                  <Fontisto name="female" size={24} color="#ff8080" />
                )}
              </Text>
            </View>
            <View>
              <Text style={styles.text}>
                Ngày sinh:{" "}
                {!data ? "" : format(new Date(data?.DateOfBirth), "dd/MM/yyyy")}
              </Text>
              <Text style={styles.text}>SĐT: {data?.Phone}</Text>
              <Text style={styles.text}>Địa chỉ: {data?.Address}</Text>
              <Text style={styles.text}>
                Khoa - Phòng: {data?.Department} - {data?.RoomNo}
              </Text>
            </View>
          </View>
        )}
      </View>
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.header}
          onPress={() => setCollapsedService(!collapsedService)}
        >
          <Text style={styles.headerTitle}>Danh sách dịch vụ</Text>
        </TouchableOpacity>
        {/* {!collapsedService && (
          <Carousel
            loop
            width={screenWidth}
            height={collapsedInfo ? 496 : 312}
            data={services}
            renderItem={({ item, index }) => (
              <ServiceItem
                key={item.ID}
                item={item}
                isLast={index === services.length - 1}
              />
            )}
          />
          
          
        )} */}
        {/* // <View style={[styles.content, { height: collapsedInfo ? 496 : 312 }]}>
          //   <FlatList
          //     data={services}
          //     keyExtractor={(item) => `${item.ID}`}
          //     renderItem={({ item, index }) => (
          //       <ServiceItem
          //         key={item.ID}
          //         item={item}
          //         isLast={index === services.length - 1}
          //       />
          //     )}
          //   />
          // </View> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6f2ff",
  },
  card: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {},
  headerTitle: {
    fontSize: 18,
    fontWeight: 600,
  },
  content: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  infoTitle: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    marginVertical: 5,
    fontSize: 16,
  },
  textMedium: {
    fontSize: 20,
    paddingRight: 10,
  },
  serviceItem: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 15,
    paddingBottom: 15,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 600,
  },
  serviceGroup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 15,
  },
  serviceFooter: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
});
