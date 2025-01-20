import { Dispatch } from "react";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const getDaysInMonth = (year: number, month: number) => {
  const days = [];
  const date = new Date(year, month, 1);

  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return days;
};

export const checkForValidDate = (date: Date | null) => {
  if (!date) return false
  return !isNaN(date.getDate())
}

/* This function is a factory function that returns a function that updates the state of a component in an immutable way.
Careful though: it's using spread operator to merge the previous state with the new state, so it's not suitable for deeply nested states. */

export const immutableStateUpdateFactory = <TState,>(setState: Dispatch<React.SetStateAction<TState>>) => (
  newState: Partial<TState>
) => {
  setState((prevState) => ({ ...prevState, ...newState }));
};