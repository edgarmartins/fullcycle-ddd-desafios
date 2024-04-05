import EventDispatcher from "../../@shared/event/event-dispatcher";
import CustomerFactory from "../factory/customer.factory";
import Address from "../value-object/address";
import CustomerUpdatedEvent from "./customer-updated.event";
import SendConsoleLogWhenAddressChangeHandler from "./handler/send-console-log-when-address-change.handler";

describe("CustomerUpdatedEvent tests", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendConsoleLogWhenAddressChangeHandler();

    eventDispatcher.register("CustomerUpdatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerUpdatedEvent"]
    ).toBeDefined();
    expect(
      eventDispatcher.getEventHandlers["CustomerUpdatedEvent"].length
    ).toBe(1);
    expect(
      eventDispatcher.getEventHandlers["CustomerUpdatedEvent"][0]
    ).toMatchObject(eventHandler);
  });

  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendConsoleLogWhenAddressChangeHandler();

    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("CustomerUpdatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerUpdatedEvent"][0]
    ).toMatchObject(eventHandler);

    const customer = CustomerFactory.create("Customer 1");
    customer.changeAddress(new Address("Street", 1, "11111111", "City"));

    const customerUpdatedEvent = new CustomerUpdatedEvent({
      customer,
    });

    eventDispatcher.notify(customerUpdatedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });
});
