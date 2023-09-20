import axios from "axios";

export const getPix = async () => {
  const url = "https://sandbox.asaas.com/api/v3/payments/id/pixQrCode";

  try {
    const response = await axios.get(url, {
      headers: {
        Accept: "application/json"
      }
    });

    console.log(response.data);
  } catch (error) {
    console.error("error:" + error);
  }
};
