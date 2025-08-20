import { CONFIG } from "./useFetch";

export const fetchService = async ({ query }: any) => {
  const response = await fetch(`${CONFIG.BASE_URL}/service`, {
    method: "POST",
    headers: CONFIG.headers,
    body: JSON.stringify({
      ID: query.ID,
      ServiceName: query.ServiceName,
    }),
  });

  if (!response.ok) {
    //@ts-ignore
    throw new Error("Failed to fetch service", response.statusText);
  }

  const data = await response.json();

  return !data ? null : !query.ID ? data : data[0];
};

export const addService = async ({ query }: any) => {
  const response = await fetch(`${CONFIG.BASE_URL}/service/add`, {
    method: "POST",
    headers: CONFIG.headers,
    body: JSON.stringify({
      ServiceName: query.ServiceName,
      Price: query.Price,
      CreatedByUser: query.CreatedByUser,
    }),
  });

  if (!response.ok) {
    //@ts-ignore
    throw new Error("Failed to add service", response.statusText);
  }

  const data = await response.json();

  return data || null;
};

export const updateService = async ({ query }: any) => {
  const response = await fetch(`${CONFIG.BASE_URL}/service/edit`, {
    method: "PUT",
    headers: CONFIG.headers,
    body: JSON.stringify({
      ID: query.ID,
      ServiceName: query.ServiceName,
      Price: query.Price,
      ModifiedByUser: query.ModifiedByUser,
    }),
  });

  if (!response.ok) {
    //@ts-ignore
    throw new Error("Failed to update service", response.statusText);
  }

  return true;
};

export const deleteService = async (ID: string) => {
  const response = await fetch(`${CONFIG.BASE_URL}/serive/${ID}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    //@ts-ignore
    throw new Error("Failed to delere service", response.statusText);
  }

  return true;
};
