import React, { useState } from "react";
import InPutForm from "./InPutForm";

function EmailInput({ onEmailChange , setErrors}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  

  const validateEmail = (value) => {
    const emailRegex = /^(([^<>()[\],;:\s@"]+(\.[^<>()[\],;:\s@"]+)*)|(".+"))@(([^<>()[\],;:\s@"]+\.)+[^<>()[\],;:\s@"]{2,})$/i;
    return emailRegex.test(value);
  };

  const handleBlur = () => {
    if(!validateEmail(email)) {
      setError("Email không hợp lệ")
      setErrors(true);
    }else {
      setError(false);
      setErrors(false);
    }
  }

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setError(false);
    return onEmailChange(e);
  };

  return (
    <div>
      <InPutForm
        label="Email"
        type="email"
        name="email"
        placeholder="Enter your email"
        value={email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={error}
        required
      />
    </div>
  );
}

export default EmailInput;
