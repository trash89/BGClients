import { USER } from "./constants";

export const addUserToLocalStorage = (user) => {
  const obj = {
    access_token: user?.access_token,
    refresh_token: user?.refresh_token,
    id: user?.id,
    email: user?.email,
    isAdmin: user?.isAdmin,
  };
  localStorage.setItem(USER, JSON.stringify(obj));
};

export const removeUserFromLocalStorage = () => {
  localStorage.removeItem(USER);
};

export const getUserFromLocalStorage = () => {
  const result = localStorage.getItem(USER);
  const user = result ? JSON.parse(result) : null;
  return user;
};
