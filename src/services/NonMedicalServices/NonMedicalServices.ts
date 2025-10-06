import { errorHandler, successHandler } from "../../common/appHandler";
import axiosInstance from "../../common/axiosInstance";

class NonMedicalServices {
  // Get all business user non medical list
  static GetAllBusinessUserNonMedical = async (params: {
    pageNumber?: number;
    pageSize?: number;
    searchTerm?: string;
  }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.pageNumber)
        queryParams.append("pageNumber", params.pageNumber.toString());
      if (params.pageSize)
        queryParams.append("pageSize", params.pageSize.toString());
      if (params.searchTerm)
        queryParams.append("searchTerm", params.searchTerm);

      const res = await axiosInstance.get(
        `SuperAdmin/GetAllBusinessUserNonMedical?${queryParams.toString()}`
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  // Get all individual user idea partner list
  static GetAllIndividualUserIdeaPartner = async (params: {
    pageNumber?: number;
    pageSize?: number;
    searchTerm?: string;
  }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.pageNumber)
        queryParams.append("pageNumber", params.pageNumber.toString());
      if (params.pageSize)
        queryParams.append("pageSize", params.pageSize.toString());
      if (params.searchTerm)
        queryParams.append("searchTerm", params.searchTerm);

      const res = await axiosInstance.get(
        `SuperAdmin/GetAllIndividualUserIdeaPartner?${queryParams.toString()}`
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  // Get all individual user non medical list
  static GetAllIndividualUserNonMedical = async (params: {
    pageNumber?: number;
    pageSize?: number;
    searchTerm?: string;
  }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.pageNumber)
        queryParams.append("pageNumber", params.pageNumber.toString());
      if (params.pageSize)
        queryParams.append("pageSize", params.pageSize.toString());
      if (params.searchTerm)
        queryParams.append("searchTerm", params.searchTerm);

      const res = await axiosInstance.get(
        `SuperAdmin/GetAllIndividualUserNonMedical?${queryParams.toString()}`
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };
}

export default NonMedicalServices;
