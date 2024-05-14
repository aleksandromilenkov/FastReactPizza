import React from "react";

const Loader = () => {
  return (
    <div className="absolute inset-0 left-1 flex items-center justify-center bg-slate-200/20 backdrop-blur-sm">
      <div className="loader" />
    </div>
  );
};

export default Loader;
