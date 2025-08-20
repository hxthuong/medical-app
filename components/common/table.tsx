import React, { useMemo, useState } from "react";
import {
  DimensionValue,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { DataTable } from "react-native-paper";

export interface Column {
  accessor: string;
  label: string;
  width?: DimensionValue;
  align?: "left" | "center" | "right";
  render?: (row: any, index: number) => React.ReactNode;
}

interface TableProps {
  data: any[];
  columns: Column[];
  rowsPerPage?: number;
  hasSearch?: boolean;
}

export default function AppTable({
  data,
  columns,
  rowsPerPage = 5,
  hasSearch = true,
}: TableProps) {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    return data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [data, search]);

  const from = page * rowsPerPage;
  const to = Math.min(from + rowsPerPage, filteredData.length);
  const pageData = filteredData.slice(from, to);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <View style={styles.wrapper}>
      {hasSearch && (
        <TextInput
          placeholder="Tìm kiếm..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      )}

      <ScrollView horizontal>
        <View>
          {/* Header */}
          <DataTable.Header style={styles.header}>
            {columns.map((col, index) => (
              <DataTable.Title
                key={index}
                style={[
                  styles.cell,
                  {
                    width: col.width || undefined,
                    justifyContent:
                      !col.align || col.align === "left"
                        ? "flex-start"
                        : col.align === "center"
                        ? "center"
                        : "flex-end",
                  },
                ]}
              >
                <Text style={styles.cellHeader}>{col.label}</Text>
              </DataTable.Title>
            ))}
          </DataTable.Header>

          {/* Rows */}
          {pageData.map((row, rowIndex) => (
            <DataTable.Row key={rowIndex}>
              {columns.map((col, colIndex) => (
                <DataTable.Cell
                  key={colIndex}
                  style={[
                    styles.cell,
                    {
                      width: col.width || undefined,
                      justifyContent:
                        !col.align || col.align === "left"
                          ? "flex-start"
                          : col.align === "center"
                          ? "center"
                          : "flex-end",
                    },
                  ]}
                >
                  {col.render ? (
                    col.render(row, rowIndex)
                  ) : (
                    <Text style={{ textAlign: col.align || "left" }}>
                      {String(row[col.accessor] ?? "")}
                    </Text>
                  )}
                </DataTable.Cell>
              ))}
            </DataTable.Row>
          ))}
        </View>
      </ScrollView>

      {/* Pagination */}
      <View style={styles.paginationContainer}>
        <DataTable.Pagination
          page={page}
          numberOfPages={totalPages}
          onPageChange={setPage}
          numberOfItemsPerPage={rowsPerPage}
          showFastPaginationControls
          selectPageDropdownLabel="Số dòng mỗi trang"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 10,
    paddingBottom: 60, // Để tránh trùng pagination khi fixed
  },
  searchInput: {
    marginBottom: 10,
    padding: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
  },
  header: {
    backgroundColor: "#e6f0ff",
  },
  cell: {
    paddingHorizontal: 4,
    flex: 1,
    alignItems: "center",
  },
  cellHeader: {
    fontWeight: "bold",
    color: "black",
    fontSize: 14,
  },
  paginationContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    paddingVertical: 8,
  },
});
