import ticketsModel from "../dao/models/tickets.model.js"
import { v4 as uuidv4 } from 'uuid';



class TicketRepository {
  async createTicket(ticketData) {
    try {
   
      
      const createdTicket = await ticketsModel.create(ticketData);
      console.log('Ticket created:', createdTicket);
      return createdTicket;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  }



  async getTicketById(ticketId) {
    try {
      const ticket = await ticketsModel.findById(ticketId);
      if (!ticket) {
        console.error(`Ticket con ID ${ticketId} no encontrado.`);
        return null;
      }
      console.log(`Ticket con ID ${ticketId}:`, ticket);
      return ticket;
    } catch (error) {
      console.error(`Error al obtener el ticket con ID ${ticketId}:`, error);
      throw error;
    }
  }
}

export {TicketRepository}