import { CONFIG } from "./useFetch";

export const fetchRegistration = async ({ query }: any) => {
  const resonse = await fetch(`${CONFIG.BASE_URL}/registration`, {
    method: "POST",
    headers: CONFIG.headers,
    body: JSON.stringify({
      ID: query.ID,
      Name: query.Name,
      Department: query.Department,
      RoomNo: query.RoomNo,
    }),
  });

  if (!resonse.ok) {
    //@ts-ignore
    throw new Error("Failed to fetch registrations", resonse.statusText);
  }

  const data = await resonse.json();

  return !query.ID ? data : data[0] || null;
};

export const addRegistration = async ({ query }: any) => {
  const response = await fetch(`${CONFIG.BASE_URL}/registration/add`, {
    method: "POST",
    headers: CONFIG.headers,
    body: JSON.stringify({
      Name: query.Name,
      Age: query.Age,
      DateOfBirth: query.DateOfBirth,
      Gender: query.Gender,
      Address: query.Address,
      Phone: query.Phone,
      Department: query.Department,
      RoomNo: query.RoomNo,
      CreatedByUser: query.CreatedByUser,
    }),
  });

  if (!response.ok) {
    //@ts-ignore
    throw new Error("Failed to add registration", response.statusText);
  }

  const data = await response.json();

  return data;
};

export const updateRegistration = async ({ query }: any) => {
  const response = await fetch(`${CONFIG.BASE_URL}/registration/edit`, {
    method: "POST",
    headers: CONFIG.headers,
    body: JSON.stringify({
      ID: query.ID,
      Name: query.Name,
      Age: query.Age,
      DateOfBirth: query.DateOfBirth,
      Gender: query.Gender,
      Address: query.Address,
      Phone: query.Phone,
      Department: query.Department,
      RoomNo: query.RoomNo,
      ModifiedByUser: !query.ModifiedByUser
        ? query.CreatedByUser
        : query.ModifiedByUser,
    }),
  });

  if (!response.ok) {
    //@ts-ignore
    throw new Error("Failed to update registration", response.statusText);
  }

  const data = await response.json();

  return data;
};

export const deleteRegistration = async (ID: string) => {
  const response = await fetch(`${CONFIG.BASE_URL}/registration/delete/${ID}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    //@ts-ignore
    throw new Error("Failed to delete registration", response.statusText);
  }

  return true;
};

export const printRegistration = async ({ query }: any) => {
  const response = await fetch(`${CONFIG.BASE_URL}/registration/print`, {
    method: "POST",
    headers: CONFIG.headers,
    body: JSON.stringify({
      ID: query.ID,
      DoctorID: query.DoctorID,
    }),
  });

  if (!response.ok) {
    //@ts-ignore
    throw new Error("Failed to print registration", response.statusText);
  }

  const data = await response.json();

  return data ?? [];
};
