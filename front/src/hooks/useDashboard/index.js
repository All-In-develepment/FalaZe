import api from "../../services/api";

const useDashboard = () => {
  const find = async (params) => {
    const { data } = await api.request({
      url: `/dashboard`,
      method: "GET",
      params,
    });
    return data;
  };

  const findTag = async (params) => {
    const { data } = await api.request({
      url: `/dashboard/tag`,
      method: "GET",
      params,
    });

    return data;
  };

  const getNumberTags = async (params) => {
    const { data } = await api.request({
      url: `/report`,
      method: "GET",
      params,
    });

    return data;
  };

  const getAttendants = async (params) => {
    const { data } = await api.request({
      url: `/dashboard/attendants`,
      method: "GET",
      params,
    });
    return data;
  };

  return {
    find,
    findTag,
    getNumberTags,
    getAttendants,
  };
};

export default useDashboard;
