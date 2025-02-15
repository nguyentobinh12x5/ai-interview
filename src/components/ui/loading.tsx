import { LoaderCircle } from "lucide-react";
import React from "react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center">
      <LoaderCircle className="animate-spin" />
    </div>
  );
};

export default Loading;
