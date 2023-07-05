import api from "../../services/api";

const useQueues = () => {
  const findAll = async () => {
    const { data } = await api.get("/queue");
    return data;
  };
  const findAllUsers = async () => {
    const { data } = await api.get("/queue/users");
    return data;
  };

  return { findAll, findAllUsers };
};

export default useQueues;
