import { useState } from "react";
import {
  Form,
  redirect,
  useActionData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import Button from "../../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, getCart, getTotalCartPrice } from "../cart/cartSlice";
import EmptyCart from "../cart/EmptyCart";
import store from "../../store";
import { formatCurrency } from "../../utils/helpers";
import {
  fetchAddress,
  getError,
  getStatus,
  getUserAddress,
  getUserPosition,
} from "../user/userSlice";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

const fakeCart = [
  {
    pizzaId: 12,
    name: "Mediterranean",
    quantity: 2,
    unitPrice: 16,
    totalPrice: 32,
  },
  {
    pizzaId: 6,
    name: "Vegetale",
    quantity: 1,
    unitPrice: 13,
    totalPrice: 13,
  },
  {
    pizzaId: 11,
    name: "Spinach and Mushroom",
    quantity: 1,
    unitPrice: 15,
    totalPrice: 15,
  },
];

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const cart = useSelector(getCart);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const formErrors = useActionData();
  const userName = useSelector((store) => store.user.username);
  const totalCartPrice = useSelector(getTotalCartPrice);
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalPrice = totalCartPrice + priorityPrice;
  const userAddress = useSelector(getUserAddress);
  const userPosition = useSelector(getUserPosition);
  const isLoadingAddress = useSelector(getStatus);
  const errorAddress = useSelector(getError);
  const dispatch = useDispatch();
  if (!cart.length) return <EmptyCart />;
  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">Ready to order? Let's go!</h2>

      {/* its not necessary to speciy the action if the action is the current url because react already know the path that you are*/}
      {/* <Form method="POST" action="/order/new"> */}
      <Form method="POST" action="/order/new">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input
            type="text"
            className="input grow"
            name="customer"
            required
            defaultValue={userName}
          />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input type="tel" className="input w-full" name="phone" required />
            {formErrors?.phone && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

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
          <label htmlFor="priority">Want to yo give your order priority?</label>
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            type="hidden"
            className="font-medium"
            name="cart"
            value={JSON.stringify(cart)}
          />
          <input
            type="hidden"
            className="font-medium"
            name="position"
            value={
              userPosition.latitude && userPosition.longitude
                ? `${userPosition.latitude},${userPosition.longitude}`
                : ""
            }
          />
          <Button type="primary">
            {isSubmitting
              ? "Placing order..."
              : `Order now  from ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

// when we submit the form, this action function will be triggered
export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  console.log(data);
  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === "true",
  };
  console.log(order);
  const errors = {};
  console.log(errors);
  console.log(order.phone);
  if (!isValidPhone(+order.phone))
    errors.phone =
      "Please give us your correct phone number. We might need to contact you.";
  console.log(errors);
  if (Object.keys(errors).length > 0) {
    return errors;
  }
  //if everything is correct then create the order and redirect
  const newOrder = await createOrder(order);

  // Do NOT over use this approach direclty calling dispatch on store
  // but in this case we can not use useDispatch() hook in non-component function
  store.dispatch(clearCart());
  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
