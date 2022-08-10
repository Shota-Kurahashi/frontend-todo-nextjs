import React from "react";
import { useQueryUser } from "../hooks/useQueryUser";

export const UserInfo = () => {
  const { data: user, status } = useQueryUser();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return <p>{user?.email}</p>;
};
