import { useState, useCallback } from "react";

export const useInputValue = initialValue => {
  const [value, setValue] = useState(initialValue);
  const updateValue = (value) => setValue(value);
  const updateByProps = useCallback(()=>setValue(initialValue),[initialValue])

   return {
     value,
     updateValue,
     updateByProps
  };
};