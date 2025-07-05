class WhatsAppService {
  constructor() {
    this.apiUrl = 'https://api.whatsapp.com/v1/messages';
    this.apiKey = process.env.WHATSAPP_API_KEY;
  }

  async sendConfirmationMessage(phoneNumber, appointmentDetails) {
    try {
      const message = this.createConfirmationMessage(appointmentDetails);
      await this.sendMessage(phoneNumber, message);
      return true;
    } catch (error) {
      console.error('Error sending WhatsApp confirmation:', error);
      return false;
    }
  }

  async sendReminderMessage(phoneNumber, appointmentDetails) {
    try {
      const message = this.createReminderMessage(appointmentDetails);
      await this.sendMessage(phoneNumber, message);
      return true;
    } catch (error) {
      console.error('Error sending WhatsApp reminder:', error);
      return false;
    }
  }

  createConfirmationMessage(appointment) {
    return `Olá! Sua consulta foi agendada para ${appointment.date} às ${appointment.time}. 
    Responda com "1" para confirmar ou "2" para reagendar.`;
  }

  createReminderMessage(appointment) {
    return `Olá! Lembrando da sua consulta amanhã às ${appointment.time}. 
    Responda com "1" para confirmar presença.`;
  }

  async sendMessage(phoneNumber, message) {
    // Implement actual WhatsApp API integration here
    console.log(`Sending WhatsApp message to ${phoneNumber}: ${message}`);
  }
}

export default new WhatsAppService();
