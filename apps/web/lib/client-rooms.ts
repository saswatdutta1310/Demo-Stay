import { Room } from "@hotel-demo/shared";
import gayatreeRooms from "../../../clients/gayatree-stay/rooms.json";

export function getClientRooms(): Room[] {
  return gayatreeRooms as unknown as Room[];
}
