import React from "react";
import { Result } from "antd";

const NotFound = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        
        className="text-gray-600"
      />
    </div>
  );
};

export default NotFound;
