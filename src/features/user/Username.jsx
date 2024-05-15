import React from "react";
import { useSelector } from "react-redux";

const Username = () => {
  const userStore = useSelector((store) => store.user);
  return (
    <div className="font-sm hidden font-semibold md:block">
      {userStore.username || ""}
    </div>
  );
};

export default Username;
