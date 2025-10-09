import { errorHandler, successHandler } from "../common/appHandler";
import axiosInstance from "../common/axiosInstance";

interface MedicalRealEstateServiceParams {
  pageNumber?: number;
  pageSize?: number;
  orderByColumn?: string;
  orderDirection?: string;
}

interface MedicalRealEstateServiceRequest {
  requestId: number;
  categoryId: number;
  serviceId: number;
  propertyCategory: string;
  transactionAction: string;
  governmentRegistrationLandNumber: string;
  type: string;
  ownerName: string;
  unifiedNationalNumber: string;
  propertyType: string;
  period: string;
  rentValue: number;
  internetFiberOptic: boolean;
  electricityService: boolean;
  sewageService: boolean;
  waterService: boolean;
  telephoneInternetService: boolean;
  landSizeSqMeter: number;
  numberOfStreets: number;
  buildingConstructionLicense: boolean;
  landSoilTestsCompleted: boolean;
  locationId: number;
  mediaFilePath: string;
  mediaFilesArray: any;
  isTermCondition: boolean;
  serviceType: string;
  statusId: number;
  createdBy: number;
  createdDate: string;
  updatedBy: number;
  updatedDate: string;
  deletedBy: number | null;
  deletedDate: string | null;
  isActive: boolean;
  country: string;
  region: string;
  city: string;
  district: string;
  nationalAddress: string;
  address: string;
  latitude: string;
  longitude: string;
  isAdminApprove: boolean | null;
  businessName: string | null;
}

interface MedicalRealEstateServiceResponse {
  data: MedicalRealEstateServiceRequest[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

class MedicalRealEstateService {
  /**
   * Get all medical real estate services
   * Uses the API endpoint: /api/MedicalEquipmentAndFacilities/GetAllMedicalRealEstateServices
   */
  static GetAllMedicalRealEstateServices = async (
    params: MedicalRealEstateServiceParams = {}
  ) => {
    try {
      const {
        pageNumber = 1,
        pageSize = 10,
        orderByColumn = "CreatedDate",
        orderDirection = "DESC",
      } = params;

      // Build query parameters for GET request
      const queryParams = new URLSearchParams({
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
        orderByColumn: orderByColumn,
        orderDirection: orderDirection,
      });

      // Use GET request with query parameters
      const res = await axiosInstance.get(
        `MedicalEquipmentAndFacilities/GetAllMedicalRealEstateServices?${queryParams.toString()}`
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
   * Get medical real estate service request by ID
   */
  static GetMedicalRealEstateServiceRequestById = async (requestId: number) => {
    try {
      const res = await axiosInstance.get(
        `MedicalEquipmentAndFacilities/GetMedicalRealEstateServiceRequestById/${requestId}`
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  /**
   * Update medical real estate service request status
   */
  static UpdateMedicalRealEstateServiceRequestStatus = async (data: {
    requestId: number;
    status: string;
    notes?: string;
    userId: number;
  }) => {
    try {
      const res = await axiosInstance.post(
        `MedicalEquipmentAndFacilities/UpdateMedicalRealEstateServiceRequestStatus`,
        data
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  /**
   * Update status using the new UpdateStatus endpoint
   */
  static UpdateStatus = async (data: {
    requestId: number;
    statusId: number;
    reason: string;
  }) => {
    try {
      const res = await axiosInstance.post(
        `MedicalEquipmentAndFacilities/UpdateStatus`,
        data
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  /**
   * Admin approve/reject medical real estate service request
   * Uses the API endpoint: /api/MedicalEquipmentAndFacilities/MedicalRealEstateServicesAdminApproveReject
   */
  static MedicalRealEstateServicesAdminApproveReject = async (data: {
    requestId: number;
    newStatusId: number;
    requestNumber: string;
    reason: string;
  }) => {
    try {
      const res = await axiosInstance.post(
        `MedicalEquipmentAndFacilities/MedicalRealEstateServicesAdminApproveReject`,
        data
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  /**
   * Get medical real estate service request by request number
   */
  static GetMedicalRealEstateServiceRequestByRequestNumber = async (
    requestNumber: string
  ) => {
    try {
      const res = await axiosInstance.get(
        `MedicalEquipmentAndFacilities/GetMedicalRealEstateServiceRequestByRequestNumber?requestNumber=${requestNumber}`
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };
}

export default MedicalRealEstateService;
export type {
  MedicalRealEstateServiceParams,
  MedicalRealEstateServiceRequest,
  MedicalRealEstateServiceResponse,
};
