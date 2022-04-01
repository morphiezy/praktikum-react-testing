import { useState } from "react";

export const useInputValue = initialValue => {
  const [value, setValue] = useState(initialValue);
  const updateValue = (value) => setValue(value);
   return {
     value,
     updateValue
  };
};