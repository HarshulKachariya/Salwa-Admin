import { errorHandler, successHandler } from "../../common/appHandler";
import axiosInstance from "../../common/axiosInstance";

class CommonServices {
  static CommonApi = async (data: any) => {
    try {
      // Get current language from localStorage or default to 'en'
      const currentLanguage = localStorage.getItem('i18nextLng') || 'en';
      const languageParam = currentLanguage.toUpperCase(); // Convert to EN or AR
      
      // Add language parameter to the data
      const dataWithLanguage = {
        ...data,
        Language: languageParam
      };
      
      const res = await axiosInstance.post(`Account/Common`, dataWithLanguage);
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };
}

export default CommonServices;
