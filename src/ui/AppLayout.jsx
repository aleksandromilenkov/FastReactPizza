import Header from "./Header";
import CartOverview from "../features/cart/CartOverview";
import { Outlet, useLocation, useNavigation } from "react-router-dom";
import Loader from "./Loader";

const AppLayout = () => {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  const location = useLocation();
  return (
    <div className="grid  h-screen  grid-rows-[auto_1fr_auto] ">
      {isLoading && <Loader />}
      <Header />
      <div className="overflow-scroll " style={{ scrollbarWidth: "none" }}>
        <main className="mx-auto max-w-3xl" style={{ msOverflowStyle: null }}>
          <Outlet />
        </main>
      </div>
      {location.pathname !== "/cart" && <CartOverview />}
    </div>
  );
};

export default AppLayout;
