const nextStatus = { new: 'brewing', brewing: 'ready', ready: 'served' }

/** Початковий стан черги з вкладених замовлень, як їх повертає loadOrders(). */
export function createInitialState(orders) {
  const orderById = {}
  const orderIds = []
  const customerById = {}
  const customerIds = []

  for (const order of orders) {
    orderIds.push(order.id)
    orderById[order.id] = {
      id: order.id,
      number: order.number,
      status: order.status,
      customerId: order.customer.id,
      items: order.items,
    }

    if (!customerById[order.customer.id]) {
      customerIds.push(order.customer.id)
      customerById[order.customer.id] = {
        id: order.customer.id,
        name: order.customer.name,
      }
    }
  }

  return {
    orders: {
      byId: orderById,
      ids: orderIds,
    },
    customers: {
      byId: customerById,
      ids: customerIds,
    },
    lastNumber: Math.max(0, ...orders.map((order) => order.number)),
  }
}

export function queueReducer(state, action) {
  switch (action.type) {
    case 'order_placed': {
      const number = state.lastNumber + 1
      const { customer } = action.order
      const order = {
        id: action.order.id,
        number,
        status: 'new',
        customerId: customer.id,
        items: action.order.items.map((item) => ({ ...item, done: false })),
      }

      const customers = state.customers.byId[customer.id]
        ? state.customers
        : {
            byId: {
              ...state.customers.byId,
              [customer.id]: { id: customer.id, name: customer.name },
            },
            ids: [...state.customers.ids, customer.id],
          }

      return {
        ...state,
        orders: {
          byId: {
            ...state.orders.byId,
            [order.id]: order,
          },
          ids: [...state.orders.ids, order.id],
        },
        customers,
        lastNumber: number,
      }
    }

    case 'item_toggled': {
      const order = state.orders.byId[action.orderId]
      if (!order) return state
      const updatedOrder = {
        ...order,
        items: order.items.map((item) =>
          item.id === action.itemId ? { ...item, done: !item.done } : item,
        ),
      }
      return {
        ...state,
        orders: {
          ...state.orders,
          byId: {
            ...state.orders.byId,
            [action.orderId]: updatedOrder,
          },
        },
      }
    }

    case 'order_advanced': {
      const order = state.orders.byId[action.orderId]
      if (!order || !nextStatus[order.status]) return state
      return {
        ...state,
        orders: {
          ...state.orders,
          byId: {
            ...state.orders.byId,
            [action.orderId]: {
              ...order,
              status: nextStatus[order.status],
            },
          },
        },
      }
    }

    case 'order_cancelled': {
      if (!state.orders.byId[action.orderId]) return state
      const byId = { ...state.orders.byId }
      delete byId[action.orderId]
      return {
        ...state,
        orders: {
          byId,
          ids: state.orders.ids.filter((id) => id !== action.orderId),
        },
      }
    }

    case 'customer_renamed': {
      const customer = state.customers.byId[action.customerId]
      if (!customer) return state
      return {
        ...state,
        customers: {
          ...state.customers,
          byId: {
            ...state.customers.byId,
            [action.customerId]: {
              ...customer,
              name: action.name,
            },
          },
        },
      }
    }

    default:
      throw new Error(`Unknown action: ${action.type}`)
  }
}

/**
 * Замовлення однієї колонки (status) у порядку надходження, кожне разом із
 * гостем і напоями.
 */
export function selectColumn(state, status) {
  return state.orders.ids
    .filter((id) => state.orders.byId[id].status === status)
    .map((id) => selectOrder(state, id))
}

/** Замовлення за id разом із гостем і напоями; undefined, якщо його немає. */
export function selectOrder(state, id) {
  const order = state.orders.byId[id]
  if (!order) return undefined
  const { customerId, ...rest } = order
  return {
    ...rest,
    customer: state.customers.byId[customerId],
  }
}
