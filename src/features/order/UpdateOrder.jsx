import React, { useEffect } from "react";
import Button from "../../ui/Button";
import { useFetcher } from "react-router-dom";
import { updateOrder } from "../../services/apiRestaurant";

const UpdateOrder = ({ order }) => {
  const fetcher = useFetcher();
  return (
    <fetcher.Form method="PATCH" className="text-right">
      <Button type={"primary"}>MAKE PRIORITY</Button>;
    </fetcher.Form>
  );
};

export default UpdateOrder;

export const action = async ({ request, params }) => {
  const { orderId } = params;
  const data = { priority: true };
  await updateOrder(orderId, data);
  return null;
};
