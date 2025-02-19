const { google } = require('googleapis');
require('dotenv').config();

// Credenciales desde variables de entorno
const credentials = {
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
};

class GoogleMeetClient {
  constructor() {
    this.auth = null;
    this.calendar = null;
  }

  async initialize() {
    try {
      // Crear el cliente JWT con las credenciales
      this.auth = new google.auth.JWT({
        email: credentials.client_email,
        key: credentials.private_key,
        scopes: [
          'https://www.googleapis.com/auth/calendar',
          'https://www.googleapis.com/auth/calendar.events'
        ]
      });

      // Autorizar el cliente
      await this.auth.authorize();
      
      // Inicializar el servicio de calendario
      this.calendar = google.calendar({ version: 'v3', auth: this.auth });
      
      console.log('Conectado exitosamente a Google Meet API');
      return true;
    } catch (error) {
      console.error('Error al inicializar el cliente de Google Meet:', error);
      throw error;
    }
  }

  async createMeeting({ summary, startTime, duration = 60 }) {
    if (!this.calendar) {
      throw new Error('Cliente no inicializado. Llama a initialize() primero.');
    }

    try {
      const endTime = new Date(new Date(startTime).getTime() + duration * 60000);
      
      const event = {
        summary: summary,
        start: {
          dateTime: new Date(startTime).toISOString(),
          timeZone: 'UTC'
        },
        end: {
          dateTime: endTime.toISOString(),
          timeZone: 'UTC'
        },
        conferenceData: {
          createRequest: {
            requestId: `meet-${Date.now()}`
          }
        }
      };

      const response = await this.calendar.events.insert({
        calendarId: 'primary',
        conferenceDataVersion: 1,
        resource: event
      });

      return {
        meetingLink: response.data.conferenceData.entryPoints[0].uri,
        meetingId: response.data.id,
        startTime: response.data.start.dateTime,
        endTime: response.data.end.dateTime
      };
    } catch (error) {
      console.error('Error al crear la reunión:', error);
      throw error;
    }
  }
}

// Código de ejemplo para usar el cliente
async function main() {
  const meetClient = new GoogleMeetClient();
  
  try {
    await meetClient.initialize();
    
    const meeting = await meetClient.createMeeting({
      summary: "Reunión de prueba",
      startTime: new Date(),
      duration: 60 // minutos
    });
    
    console.log('Reunión creada:', meeting);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();

module.exports = GoogleMeetClient;