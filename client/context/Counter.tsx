import React, { createContext, useState } from "react";
export const CounterContext = createContext<{
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
} | null>(null);

export const CounterProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [count, setCount] = useState(0);
  return (
    <CounterContext.Provider value={{ count, setCount }}>
      {children}
    </CounterContext.Provider>
  );
};
