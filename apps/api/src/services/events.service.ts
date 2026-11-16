type PaymentEvent = {
  bookingCode: string;
  guestName: string;
  roomName: string;
  amount: number;
  timestamp: string;
};

export class EventsService {
  private static events: PaymentEvent[] = [];

  static pushPaymentEvent(event: PaymentEvent) {
    this.events.unshift(event);
    if (this.events.length > 50) this.events.pop();
  }

  static getRecentEvents(): PaymentEvent[] {
    return this.events;
  }
}
