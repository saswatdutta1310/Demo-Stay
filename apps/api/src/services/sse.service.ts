import { Response } from "express";

export type SSEEvent = {
  type: "booking.created" | "payment.updated" | "booking.cancelled" | "keepalive";
  data: unknown;
  timestamp: string;
};

export class SSEStreamService {
  private static clients: Response[] = [];

  static addClient(res: Response) {
    this.clients.push(res);
  }

  static removeClient(res: Response) {
    this.clients = this.clients.filter((client) => client !== res);
  }

  static broadcast(event: Omit<SSEEvent, "timestamp">) {
    const payload: SSEEvent = {
      ...event,
      timestamp: new Date().toISOString()
    };
    const data = `data: ${JSON.stringify(payload)}\n\n`;
    this.clients.forEach((client) => {
      try {
        client.write(data);
      } catch {
        // failed writes handled on connection close
      }
    });
  }

  static getClientCount(): number {
    return this.clients.length;
  }
}
