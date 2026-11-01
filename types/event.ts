export type EventItem = {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnail: string; // can be empty
  location: string;
  eventDate: string; // ISO string, JSON turns a Date into text
  createdAt: string;
};
