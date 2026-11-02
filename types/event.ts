export type EventItem = {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnail: string; // can be empty
  location: string;
  eventDate: string; // ISO string, JSON turns a Date into text
  eventTime: string; // "HH:mm", 24 hour
  capacity: number;
  joinedCount: number;
  createdAt: string;
};
