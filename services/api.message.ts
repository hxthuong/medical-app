import { CONFIG } from "./useFetch";

export const fetchChatList = async ({ query }: any) => {
  const response = await fetch(`${CONFIG.BASE_URL}/message/chat`, {
    method: "POST",
    headers: CONFIG.headers,
    body: JSON.stringify({
      UserID: query.UserID,
    }),
  });

  if (!response.ok) {
    //@ts-ignore
    throw new Error("Failed to fetch chat list", response.statusText);
  }

  const data = await response.json();

  return data;
};

export const fetchChatContent = async ({ query }: any) => {
  const response = await fetch(`${CONFIG.BASE_URL}/message/chat`, {
    method: "POST",
    headers: CONFIG.headers,
    body: JSON.stringify({
      UserID: query.UserID,
      ContactID: query.ContactID,
    }),
  });

  if (!response.ok) {
    //@ts-ignore
    throw new Error("Failed to fetch chat content", response.statusText);
  }

  const data = await response.json();

  return data;
};

export const sendMessage = async ({ query }: any) => {
  const response = await fetch(`${CONFIG.BASE_URL}/message/add`, {
    method: "POST",
    headers: CONFIG.headers,
    body: JSON.stringify({
      Sender: query.Sender,
      Receiver: query.Receiver,
      Message: query.Message,
    }),
  });

  if (!response.ok) {
    //@ts-ignore
    throw new Error("Failed to send message", response.statusText);
  }

  const data = await response.json();

  return data;
};
