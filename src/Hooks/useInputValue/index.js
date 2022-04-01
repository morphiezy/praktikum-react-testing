import { useState } from "react";

export const useInputValue = (initialValue) => {
  const [value, setValue] = useState(initialValue);
  const changeValue =  (value) => setValue(value)
 
  return [
    value,
    changeValue
  ]
};
