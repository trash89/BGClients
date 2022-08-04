import { USER } from "./constants";

export const addUserToLocalStorage = (user) => {
  const obj = {
    access_token: user?.access_token,
    id: user?.id,
    email: user?.email,
    isAdmin: user?.isAdmin,
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(USER, JSON.stringify(obj));
  }
};

export const removeUserFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(USER);
  }
};

export const getUserFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    const result = localStorage.getItem(USER);
    const user = result ? JSON.parse(result) : null;
    return user;
  }
  return null;
};
