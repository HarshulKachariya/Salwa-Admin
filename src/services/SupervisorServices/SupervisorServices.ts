import { errorHandler, successHandler } from "../../common/appHandler";
import axiosInstance from "../../common/axiosInstance";

class SupervisorServices {
  static UpsertSuperAdmin = async (data: any) => {
    try {
      // Get current language from localStorage or default to 'en'
      const currentLanguage = localStorage.getItem('i18nextLng') || 'en';
      const languageParam = currentLanguage.toUpperCase(); // Convert to EN or AR
      
      // Add language parameter to the data
      const dataWithLanguage = {
        ...data,
        Language: languageParam
      };
      
      const res = await axiosInstance.post(`SuperAdmin/UpsertSuperAdmin`, dataWithLanguage);
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  static UpdateSuperAdmin = async (id: any, data: any, status: any) => {
    try {
      const res = await axiosInstance.patch(
        `SuperAdmin/UpdateSuperAdminStatus?employeeId=${id}&statusId=${status}`,
        data
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };
  static GetSuperAdminById = async (id: any) => {
    try {
      const res = await axiosInstance.get(
        `SuperAdmin/GetSuperAdminById?employeeId=${id}`
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };
}

export default SupervisorServices;
