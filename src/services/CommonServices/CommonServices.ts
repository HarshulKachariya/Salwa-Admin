import { errorHandler, successHandler } from "../../common/appHandler";
import axiosInstance from "../../common/axiosInstance";

class CommonServices {
  static CommonApi = async (data: any) => {
    try {
      const res = await axiosInstance.post(`Account/Common`, data);
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };
}

export default CommonServices;
