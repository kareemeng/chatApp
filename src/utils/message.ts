import moment from "moment";

//formatted message type
export type Message ={
    handle: string,
    messageText: string,
    time? : string
}

export function formatMessage(userName: string, text: string): Message {
  return {
    handle: userName,
    messageText: text,
    time: moment().format("h:mm a")
  };
}

