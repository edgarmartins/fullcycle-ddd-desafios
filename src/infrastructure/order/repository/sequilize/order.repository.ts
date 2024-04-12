import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    const order = await OrderModel.findOne({
      where: { id: entity.id },
      include: ["items"],
    });

    await OrderModel.update(
      {
        total: entity.total(),
      },
      {
        where: { id: entity.id },
      }
    );

    await OrderItemModel.destroy({ where: { order_id: entity.id } });

    for (const item of entity.items) {
      await OrderItemModel.create({
        id: item.id,
        name: item.name,
        price: item.price,
        product_id: item.productId,
        quantity: item.quantity,
        order_id: entity.id,
      });
    }
  }

  async find(id: string): Promise<Order> {
    let orderModel;

    try {
      orderModel = await OrderModel.findOne({
        where: {
          id,
          rejectOnEmpty: true,
        },
      });
    } catch (error) {
      throw new Error("Order not found");
    }

    const items: OrderItem[] = orderModel.items.map((order) => {
      return new OrderItem(
        order.id,
        order.name,
        order.price,
        order.product_id,
        order.quantity
      );
    });

    return new Order(id, orderModel.customer_id, items);
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll();

    const orders = orderModels.map((orderModel) => {
      const items: OrderItem[] = orderModel.items.map((order) => {
        return new OrderItem(
          order.id,
          order.name,
          order.price,
          order.product_id,
          order.quantity
        );
      });

      return new Order(orderModel.id, orderModel.customer_id, items);
    });

    return orders;
  }
}
