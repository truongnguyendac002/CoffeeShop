import React, { useState } from "react";
import InPutForm from "./InPutForm"; 


const PasswordInput = ({
  label,
  name,
  placeholder = "",
  onChange,
  setErrors
}) => {
  
  const [error, setError] = useState('');
  const [data, setData] = useState('');
  
  const validatePassword = (password) => {
    const regex = /^(?=.*[!@#$%^&*(),.?":{}|<>_\-+=/\\'`~])(?=.{8,})/
    return regex.test(password);
  };

  const handleBlur = () => {
    if(!validatePassword(data)) {
      setError("Mật khẩu phải có ít nhất 8 ký tự , 1 ký tự đặc biệt ")
      setErrors(true)
    }else {
      setError(false);
      setErrors(false);
    }
  }
  const handleChange = (e) => {
    const {value} = e.target;

    setData(value);
    setError(false);
    setErrors(false);
  
    return onChange(e); 
  };


  return (
    <div className="relative">
      <InPutForm
        label={label}
        type={"password"} 
        placeholder={placeholder}
        name={name}
        value={data}
        onBlur={handleBlur}
        onChange={handleChange}
        error={error}
        required
        showEye={true}
      />
    </div>
  );
};

export default PasswordInput;
