import axios from "axios";
import Setting from "../../models/Setting";

export const createPixKey = async () => {
  // try {
  const { value: access_token } = await Setting.findOne({
    where: { key: "asaas" }
  });

  const url = "https://sandbox.asaas.com/api/v3/pix/addressKeys";
  const headers = {
    headers: {
      accept: "application/json",
      access_token
    }
  };

  const data = {
    type: "EVP"
  };

  // const response = await axios.post(url, data, headers);

  axios
    .post(url, data, headers)
    .then(response => response.data.json())
    .then(json => console.log(json))
    .catch(error => {
      console.error("Erro:", error);
    });
  // return response;
  // } catch (error) {
  //   console.error("error: ola" + error);
  // }
};
