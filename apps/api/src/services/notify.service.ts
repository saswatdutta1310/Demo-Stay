export class NotifyService {
  static async sendBookingConfirmation(email: string, bookingCode: string) {
    console.log(`📧 [Email Notification Simulated] Confirmation sent to ${email} for booking ${bookingCode}`);
  }

  static async sendWhatsAppAlert(phone: string, text: string) {
    console.log(`📱 [WhatsApp Notification Simulated] Alert sent to ${phone}: ${text}`);
  }
}
