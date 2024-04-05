import EventDispatcher from "../../@shared/event/event-dispatcher";
import CustomerCreatedEvent from "./customer-created.event";
import SendConsoleLogWhenAddressChangeHanlder from "./handler/send-console-log-when-address-change.handler";
import SendConsoleLog1WhenCreatedCustomerHandler from "./handler/send-console-log1-when-created-customer.handler";

describe("CustomerCreatedEvent tests", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendConsoleLog1WhenCreatedCustomerHandler();

    eventDispatcher.register("CustomerCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
    ).toBeDefined();
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length
    ).toBe(1);
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(eventHandler);
  });

  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler1 = new SendConsoleLog1WhenCreatedCustomerHandler();
    const eventHandler2 = new SendConsoleLog1WhenCreatedCustomerHandler();

    const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
    const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

    eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(eventHandler1);
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
    ).toMatchObject(eventHandler2);

    const customerCreatedEvent = new CustomerCreatedEvent({
      id: "1",
      name: "Customer 1",
    });

    eventDispatcher.notify(customerCreatedEvent);

    expect(spyEventHandler1).toHaveBeenCalled();
    expect(spyEventHandler2).toHaveBeenCalled();
  });
});
