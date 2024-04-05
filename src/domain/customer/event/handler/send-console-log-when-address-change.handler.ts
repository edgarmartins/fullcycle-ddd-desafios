import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerUpdatedEvent from "../customer-updated.event";

export default class SendConsoleLogWhenAddressChangeHandler
  implements EventHandlerInterface<CustomerUpdatedEvent>
{
  handle(event: CustomerUpdatedEvent): void {
    console.log(
      `Endereço do cliente: ${event.eventData.customer.id}, ${
        event.eventData.customer.name
      } alterado para: ${event.eventData.customer.Address.toString()}`
    );
  }
}
