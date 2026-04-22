
export const SHIPMENT_KEYS = {
  all: ["shipments"],
  lists: () => [...SHIPMENT_KEYS.all, "list"],
  list: (params: any) => [...SHIPMENT_KEYS.lists(), params],
};
