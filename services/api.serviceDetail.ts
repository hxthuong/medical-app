import { CONFIG } from "./useFetch";

export const fetchServiceDetail = async ({ query }: any) => {
  const response = await fetch(`${CONFIG.BASE_URL}/serviceDetail/`, {
    method: "POST",
    headers: CONFIG.headers,
    body: JSON.stringify({
      RegistrationID: query.RegistrationID,
      ServiceID: query.ServiceID,
    }),
  });

  if (!response.ok) {
    //@ts-ignore
    throw new Error("Failed to fetch service detail", response.statusText);
  }

  const data = await response.json();

  return !data
    ? null
    : query.RegistrationID && query.ServiceID
    ? data[0]
    : data;
};

export const addServiceDetail = async ({ query }: any) => {
  const response = await fetch(`${CONFIG.BASE_URL}/serviceDetail/add`, {
    method: "POST",
    headers: CONFIG.headers,
    body: JSON.stringify({
      RegistrationID: query.RegistrationID,
      ServiceID: query.ServiceID,
      UsageCount: query.UsageCount,
      RequestDate: query.RequestDate,
      DoctorID: query.DoctorID,
      RequestTime: query.RequestTime,
      Notes: query.Notes,
    }),
  });

  if (!response.ok) {
    //@ts-ignore
    throw new Error("Failed to add service detail", response.statusText);
  }

  const data = await response.json();

  return data;
};

export const updateServiceDetail = async ({ query }: any) => {
  const response = await fetch(`${CONFIG.BASE_URL}/serviceDetail/edit`, {
    method: "PUT",
    headers: CONFIG.headers,
    body: JSON.stringify({
      RegistrationID: query.RegistrationID,
      ServiceID: query.ServiceID,
      UsageCount: query.UsageCount,
      RequestDate: query.RequestDate,
      Status: query.Status,
      DoctorID: query.DoctorID,
      RequestTime: query.RequestTime,
      Notes: query.Notes,
    }),
  });

  if (!response.ok) {
    //@ts-ignore
    throw new Error("Failed to update service detail", response.statusText);
  }

  const data = await response.json();

  return data;
};

export const deleteServiceDetail = async ({ query }: any) => {
  const response = await fetch(`${CONFIG.BASE_URL}/serviceDetail/delete`, {
    method: "DELETE",
    headers: CONFIG.headers,
    body: JSON.stringify({
      RegistrationID: query.RegistrationID,
      ServiceID: query.ServiceID,
    }),
  });

  if (!response.ok) {
    //@ts-ignore
    throw new Error("Failed to delete service detail", response.statusText);
  }

  return true;
};
