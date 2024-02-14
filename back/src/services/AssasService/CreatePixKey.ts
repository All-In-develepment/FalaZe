// import axios from "axios";
// import Setting from "../../models/Setting";
// import { verifySandbox } from "./VerifySandbox";

// export const createPixKey = async () => {
//   try {
//     const api = verifySandbox();

//     const { value: access_token } = await Setting.findOne({
//       where: { key: "asaas" }
//     });

//     const url = `${api}/pix/addressKeys`;
//     const headers = {
//       headers: {
//         accept: "application/json",
//         access_token
//       }
//     };

//     const data = {
//       type: "EVP"
//     };

//     const response = await axios.post(url, data, headers);

//     return response;
//   } catch (error) {
//     console.error("error: ola" + error);
//   }
// };
