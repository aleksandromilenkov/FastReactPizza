import React, { useEffect, useState } from "react";
import Button from "../../ui/Button";
import { useFetcher } from "react-router-dom";
import { updateOrder } from "../../services/apiRestaurant";
import {
  fetchAddress,
  getError,
  getStatus,
  getUserAddress,
  getUserPosition,
  updateAddress,
} from "../user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import store from "../../store";

const UpdateOrder = ({ order }) => {
  const [withPriority, setWithPriority] = useState(false);
  const userAddress = useSelector(getUserAddress);
  const userPosition = useSelector(getUserPosition);
  const isLoadingAddress = useSelector(getStatus);
  const errorAddress = useSelector(getError);
  const dispatch = useDispatch();
  const fetcher = useFetcher();
  return (
    <fetcher.Form method="PATCH">
      <h5 className="mb-4 mt-4 text-lg">Update Form</h5>
      <div className="relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
        <label className="sm:basis-40">Address</label>
        <div className="grow">
          <input
            type="text"
            name="address"
            className="input w-full"
            defaultValue={userAddress}
            disabled={isLoadingAddress === "loading"}
            required
          />
          {isLoadingAddress === "error" && (
            <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
              {errorAddress}
            </p>
          )}
        </div>
        {!userPosition.latitude && !userPosition.longitude && (
          <span className="absolute right-1 z-10">
            <Button
              type={"small"}
              onClick={(e) => {
                e.preventDefault();
                dispatch(fetchAddress());
              }}
              disabled={isLoadingAddress === "loading"}
            >
              Get Position
            </Button>
          </span>
        )}
      </div>
      <div className="mb-12 flex items-center gap-5">
        <input
          className="h-6 w-6 accent-yellow-400 
          focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
          type="checkbox"
          name="priority"
          id="priority"
          value={withPriority}
          onChange={(e) => setWithPriority(e.target.checked)}
        />
        <label htmlFor="priority">Want to give your order priority?</label>
      </div>
      <Button type="primary">UPDATE</Button>
    </fetcher.Form>
  );
};

export default UpdateOrder;

export const action = async ({ request, params }) => {
  const { orderId } = params;
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  console.log(data);
  const isPrioritySelected = Object.keys(data).includes("priority");
  console.log(isPrioritySelected);
  const isDataPriority = isPrioritySelected && data.priority === "true";
  console.log(isDataPriority);
  const updatedOrderProps = {
    priority: isDataPriority,
  };
  await updateOrder(orderId, updatedOrderProps);
  store.dispatch(updateAddress(data.address));
  return null;
};
