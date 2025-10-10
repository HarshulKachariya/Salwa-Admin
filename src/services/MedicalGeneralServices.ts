import { errorHandler, successHandler } from "../common/appHandler";
import axiosInstance from "../common/axiosInstance";

interface MedicalGeneralServicesParams {
  searchText?: string;
  pageNumber?: number;
  pageSize?: number;
  orderByColumn?: string;
  orderDirection?: string;
}

interface MedicalGeneralServicesRequest {
  id: number;
  requestNumber: string;
  orderTitle: string;
  contactPersonName: string;
  contactPersonEmail: string;
  numberOfBags: number;
  country: string;
  region: string;
  city: string;
  district: string;
  address: string;
  nationalAddress: string;
  latitude: number;
  longitude: number;
  mediaURL: string;
  orderStatus: number;
  eName: string;
  categoryId: number;
  serviceId: number;
  isAdminApprove: string;
  isTermCondition: boolean;
  otherTermsAndCondition: string;
}

interface MedicalGeneralServicesResponse {
  data: MedicalGeneralServicesRequest[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

class MedicalGeneralServices {
  /**
   * Get all medical general services for admin
   * Uses the API endpoint: /api/MedicalGeneralServices/GetAllMedicalGeneralServicesForAdmin
   */
  static GetAllMedicalGeneralServicesForAdmin = async (
    params: MedicalGeneralServicesParams = {}
  ) => {
    try {
      const {
        searchText = "",
        pageNumber = 1,
        pageSize = 10,
        orderByColumn = "createdDate",
        orderDirection = "DESC",
      } = params;

      // Build query parameters for GET request
      const queryParams = new URLSearchParams({
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
        orderByColumn: orderByColumn,
        orderDirection: orderDirection,
      });

      // Add searchText only if provided
      if (searchText && searchText.trim() !== "") {
        queryParams.append("searchText", searchText.trim());
      }

      // Use GET request with query parameters
      const res = await axiosInstance.get(
        `MedicalGeneralServices/GetAllMedicalGeneralServicesForAdmin?${queryParams.toString()}`
      );

      return {
        success: true,
        data: res.data,
      };
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  /**
   * Get medical general service request by ID
   */
  static GetMedicalGeneralServiceRequestById = async (requestId: number) => {
    try {
      const res = await axiosInstance.get(
        `MedicalGeneralServices/GetMedicalGeneralServiceRequestById/${requestId}`
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  /**
   * Get medical general service by ID
   * Uses the API endpoint: /api/MedicalGeneralServices/GetMedicalGeneralServiceById
   */
  static GetMedicalGeneralServiceById = async (id: number) => {
    try {
      const res = await axiosInstance.get(
        `MedicalGeneralServices/GetMedicalGeneralServiceById?Id=${id}`
      );
      return {
        success: true,
        data: res.data,
      };
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  /**
   * Update medical general service request status
   */
  static UpdateMedicalGeneralServiceRequestStatus = async (data: {
    requestId: number;
    statusId: number;
    reason: string;
  }) => {
    try {
      const res = await axiosInstance.post(
        `MedicalGeneralServices/UpdateMedicalGeneralServiceRequestStatus`,
        data
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  /**
   * Admin approve/reject medical general service request
   * Uses the API endpoint: /api/MedicalGeneralServices/MedicalGeneralServicesAdminApproveReject
   */
  static MedicalGeneralServicesAdminApproveReject = async (data: {
    id: number;
    newStatusId: number;
    requestNumber: string;
    reason: string;
  }) => {
    try {
      const res = await axiosInstance.post(
        `MedicalGeneralServices/MedicalGeneralServicesAdminApproveReject`,
        data
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };
}

export default MedicalGeneralServices;
export type {
  MedicalGeneralServicesParams,
  MedicalGeneralServicesRequest,
  MedicalGeneralServicesResponse,
};
