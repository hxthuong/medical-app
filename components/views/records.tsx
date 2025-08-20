import {
  deleteRegistration,
  fetchRegistration,
} from "@/services/api.registration";
import useFetch from "@/services/useFetch";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { format } from "date-fns";
import { useNavigation } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import AppTable, { Column } from "../common/table";
import DeleteModal from "./modals/delete.modal";
import EditRecordModal from "./modals/edit.record.modal";

export default function RecordsScreen() {
  const [openModal, setOpenModal] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [rowData, setRowData] = useState<any>(null);

  const navigation: any = useNavigation();

  const {
    data,
    loading,
    refetch: loadRegistrations,
  } = useFetch(() => fetchRegistration({ query: { ID: null } }));

  const handleOpenModal = (row: any) => {
    setRowData(row);
    setOpenModal(true);
  };

  const handleOpenModalDelete = (row: any) => {
    setRowData(row);
    setOpenModalDelete(true);
  };

  const handleDelete = async () => {
    if (!rowData) return;

    try {
      const deleteItem = await deleteRegistration(rowData?.ID);

      Alert.alert(
        "Thông báo",
        `Xóa thông tin bệnh nhân ${rowData?.Name} thành công!`,
        [{ text: "OK" }],
        {
          cancelable: true,
        }
      );

      setRowData(null);
      setOpenModalDelete(false);
      loadRegistrations();
    } catch (error) {
      console.log("Xóa thông tin thất bại! Lỗi: " + error);
    }
  };

  const handleOpenDetail = (row: any) => {
    navigation.navigate("recordDetail", { id: row?.ID });
  };

  const columns: Column[] = [
    {
      accessor: "ID",
      label: "STT",
      width: 50,
      align: "center",
      render: (row, index) => (
        <Text style={{ textAlign: "center" }}>{index + 1}</Text>
      ),
    },
    { accessor: "Name", label: "Tên bệnh nhân", width: 150 },
    {
      accessor: "DateOfBirth",
      label: "Ngày sinh",
      width: 110,
      align: "center",
      render: (row) => (
        <Text style={{ textAlign: "center" }}>
          {format(new Date(row.DateOfBirth), "dd/MM/yyyy")}
        </Text>
      ),
    },
    { accessor: "Phone", label: "Số điện thoại", width: 110 },
    { accessor: "Address", label: "Địa chỉ", width: 200 },
    {
      accessor: "actions",
      label: "Hành động",
      width: 100,
      align: "center",
      render: (row) => (
        <View style={styles.actionGroup}>
          <AntDesign
            style={{ paddingLeft: 10 }}
            name="eye"
            size={24}
            color="#007AFF"
            onPress={() => handleOpenDetail(row)}
          />
          <AntDesign
            style={{ paddingLeft: 10 }}
            name="download"
            size={24}
            color="#33cc33"
          />
          <Entypo
            style={{ paddingLeft: 10 }}
            name="edit"
            size={24}
            color="#e4a11b"
            onPress={() => handleOpenModal(row)}
          />

          <FontAwesome
            style={{ paddingLeft: 10 }}
            name="trash"
            size={24}
            color="#fe2c55"
            onPress={() => handleOpenModalDelete(row)}
          />
        </View>
      ),
    },
  ];

  return (
    <>
      <View style={styles.container}>
        <AppTable data={data || []} columns={columns} />
        <Pressable style={styles.btnAdd} onPress={() => handleOpenModal(null)}>
          <AntDesign name="plus" size={24} color="white" />
        </Pressable>
        <EditRecordModal
          title={
            rowData
              ? `Chỉnh sửa thông tin bệnh nhân`
              : "Thêm mới thông tin bệnh nhân"
          }
          modalVisible={openModal}
          setModalVisible={setOpenModal}
          data={rowData}
          callbackFunc={loadRegistrations}
        />
        {/* modal delete */}
        <DeleteModal
          title={rowData?.Name}
          data={rowData}
          modalVisible={openModalDelete}
          setModalVisible={setOpenModalDelete}
          callbackFunc={handleDelete}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10, // thêm padding nếu cần
    backgroundColor: "#fff",
  },
  actionGroup: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: 100,
    backgroundColor: "white",
  },
  btnAdd: {
    position: "absolute", // <- dùng absolute thay cho fixed
    right: 20,
    bottom: 90,
    backgroundColor: "#007AFF",
    borderRadius: 30,
    padding: 10,
    elevation: 5, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
});
