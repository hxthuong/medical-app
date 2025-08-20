import AsyncStorage from "@react-native-async-storage/async-storage";
import { CONFIG } from "./useFetch";

//data in storage
export const paramsData = (data: any) => {
  return {
    ID: data?.ID,
    Username: data?.Username,
    DisplayName: data?.DisplayName,
    Avatar: data?.Avatar,
    Online: data?.Online,
  };
};

// export const paramsFormData = (data: any) => {
//   const formData = new FormData();

//   formData.append("ID", data?.ID);
//   formData.append("Username", data?.Username);
//   formData.append("DisplayName", data?.DisplayName);
//   formData.append("Password", data?.Password);
//   formData.append("Role", data?.Role);
//   formData.append("Active", data?.Active);
//   formData.append("Avatar", data?.Avatar);
//   formData.append("Gender", data?.Gender);
//   formData.append("Online", data?.Online);
//   formData.append("ModifiedByUser", data?.ModifiedByUser);

//   return formData;
// };

export const getUserData = async () => {
  const json = await AsyncStorage.getItem("userLogin");
  return json != null ? JSON.parse(json) : null;
};

export const saveUserData = async (profile: any) => {
  await AsyncStorage.setItem("userLogin", JSON.stringify(profile));
};

export const removeUserData = async () => {
  await AsyncStorage.removeItem("userLogin");
};

//api
export const fetchUsers = async ({ query }: any) => {
  const response = await fetch(`${CONFIG.BASE_URL}/user`, {
    method: "POST",
    headers: CONFIG.headers,
    body: JSON.stringify({
      ID: query.ID,
      Keyword: query.Keyword,
      Role: query.Role,
      Active: query.Active,
    }),
  });

  if (!response.ok) {
    //@ts-ignore
    throw new Error("Failed to fetch users", response.statusText);
  }

  const data = await response.json();

  return !query.ID ? data : data[0] || null;
};

export const getUser = async ({ query }: any) => {
  const response = await fetch(`${CONFIG.BASE_URL}/user/get`, {
    method: "POST",
    headers: CONFIG.headers,
    body: JSON.stringify({
      Username: query.Username,
      Password: query.Password,
    }),
  });

  if (!response.ok) {
    //@ts-ignore
    throw new Error("Failed to get user", response.statusText);
  }

  const data = await response.json();

  return data;
};

export const registerUser = async ({ query }: any) => {
  const response = await fetch(`${CONFIG.BASE_URL}/user/register`, {
    method: "POST",
    headers: CONFIG.headers,
    body: JSON.stringify({
      Username: query.Username,
      DisplayName: query.DisplayName,
      Password: query.Password,
      Gender: query.Gender,
      CreatedByUser: query.CreatedByUser,
    }),
  });

  if (!response.ok) {
    //@ts-ignore
    throw new Error("Failed to register user", response.statusText);
  }

  const data = await response.json();

  return data;
};

export const updateUser = async ({ query }: any) => {
  const response = await fetch(`${CONFIG.BASE_URL}/user/edit`, {
    method: "POST",
    headers: CONFIG.headers,
    body: JSON.stringify({
      ID: query.ID,
      Username: query.Username,
      DisplayName: query.DisplayName,
      Password: query.Password,
      Role: query.Role,
      Active: query.Active,
      Avatar: query.Avatar,
      Gender: query.Gender,
      Online: query.Online,
      ModifiedByUser: query.ModifiedByUser ?? query.CreatedByUser,
    }),
  });

  if (!response.ok) {
    //@ts-ignore
    throw new Error("Failed to update user", response.statusText);
  }

  const data = await response.json();

  return data;
};

export const updateProfile = async ({ formData }: any) => {
  const response = await fetch(`${CONFIG.BASE_URL}/user/edit`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    //@ts-ignore
    throw new Error("Failed to update profile", response.statusText);
  }

  const data = await response.json();

  return data;
};
