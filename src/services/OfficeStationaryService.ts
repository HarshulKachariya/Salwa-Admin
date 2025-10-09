import { errorHandler, successHandler } from "../common/appHandler";
import axiosInstance from "../common/axiosInstance";

interface OfficeStationaryParams {
  searchText?: string;
  pageNumber?: number;
  pageSize?: number;
  orderByColumn?: string;
  orderDirection?: string;
}

interface CreateOrderParams {
  CategoryId: string;
  ServiceId: string;
  Action: string;
  OrderType?: string;
  UserId?: string;
  OrderDate?: string;
  Status?: string;
  ItemName?: string;
  ItemQuantity?: number;
  Weight?: number;
}

interface UpdateHealthMarketPlaceStatusParams {
  requestId: number | string;
  newStatusId: number;
  userId: number;
  requestNumber: string;
  reason: string;
}

export interface DoctorUniformRecord {
  requestId: number;
  requestNumber: string;
  orderTitle: string;
  uniformType: string;
  gender: string;
  size: string;
  color: string;
  quantity: number;
  contactPersonName: string;
  contactPersonEmail: string;
  country: string;
  region: string;
  city: string;
  address: string;
  statusId: number;
  statusName: string;
  createdDate: string;
  updatedDate: string;
  media?: string;
  otherDetails?: string;
  rentPeriod?: number;
  rentValue?: number;
  discountType?: number;
  discountValue?: number;
  serviceType?: string;
  postOfficeBox?: string;
  businessName?: string;
  district?: string;
  fdaApproved?: boolean;
  isFridge?: boolean;
  fireDepartmentLic?: string;
  termAndCondition?: string;
  postValidityTime?: number;
}

class OfficeStationaryService {
  /**
   * Get all office stationary data with pagination and search
   * Uses the exact API endpoint: /api/officestationary/OfficeStationarySectorGetAll
   */
  static OfficeStationarySectorGetAll = async (
    params: OfficeStationaryParams = {}
  ) => {
    try {
      const {
        searchText = "",
        pageNumber = 1,
        pageSize = 10,
        orderByColumn = "RequestId",
        orderDirection = "DESC",
      } = params;

      // Build query parameters for GET request
      const queryParams = new URLSearchParams({
        searchText: searchText,
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
        orderByColumn: orderByColumn,
        orderDirection: orderDirection,
      });

      // Use GET request with query parameters
      const res = await axiosInstance.get(
        `OfficeStationary/OfficeStationarySectorGetAll?${queryParams.toString()}`
      );
      return {
        success: true,
        data: res.data,
      };
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  static OfficeStationarySectorGetByRequestNumber = async (
    requestNumber: string
  ) => {
    try {
      // Use GET request with query parameters
      const res = await axiosInstance.get(
        `OfficeStationary/OfficeStationarySectorGetByRequestNumber/${requestNumber}`
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  static UpdateOfficeStationaryStatus = async (
    data: UpdateHealthMarketPlaceStatusParams
  ) => {
    try {
      // Use POST request with data in body
      const res = await axiosInstance.post(
        `OfficeStationary/UpdateOfficeStationaryStatus`,
        data
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  /**
   * Get all health marketplace services data with pagination and search
   * Uses the exact API endpoint: /api/OfficeStationary/HealthMarketPlaceServicesGetAll
   */
  static HealthMarketPlaceServicesGetAll = async (
    params: OfficeStationaryParams = {}
  ) => {
    try {
      const {
        searchText = "searchText",
        pageNumber = 1,
        pageSize = 10,
        orderByColumn = "RequestId",
        orderDirection = "ASC",
      } = params;

      // Build query parameters for GET request
      const queryParams = new URLSearchParams({
        searchText: searchText,
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
        orderByColumn: orderByColumn,
        orderDirection: orderDirection,
      });

      // Use GET request with query parameters
      const res = await axiosInstance.get(
        `OfficeStationary/HealthMarketPlaceServicesGetAll?${queryParams.toString()}`
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
   * Update the status of a health marketplace service
   * Uses the exact API endpoint: /api/OfficeStationary/UpdateHealthMarketPlaceServicesStatus
   */
  static UpdateHealthMarketPlaceServicesStatus = async (
    data: UpdateHealthMarketPlaceStatusParams
  ) => {
    try {
      const res = await axiosInstance.post(
        `OfficeStationary/UpdateHealthMarketPlaceServicesStatus`,
        data
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  /**
   * Get health marketplace service by request number
   * Uses the exact API endpoint: /api/OfficeStationary/GetHealthMarketPlaceServiceByRequestNumber
   */
  static GetHealthMarketPlaceServiceByRequestNumber = async (
    requestNumber: string
  ) => {
    try {
      const res = await axiosInstance.get(
        `OfficeStationary/GetHealthMarketPlaceServiceByRequestNumber?requestNumber=${requestNumber}`
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  /**
   * Get all doctor uniform clothing records
   * Uses the exact API endpoint: /api/OfficeStationary/GetDoctorUniformClothingGetAll
   */
  static GetDoctorUniformClothingGetAll = async (
    params: OfficeStationaryParams = {}
  ) => {
    try {
      const {
        searchText = "",
        pageNumber = 1,
        pageSize = 10,
        orderByColumn = "RequestId",
        orderDirection = "DESC",
      } = params;

      // Build query parameters for GET request
      const queryParams = new URLSearchParams({
        searchText: searchText,
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
        orderByColumn: orderByColumn,
        orderDirection: orderDirection,
      });

      // Use GET request with query parameters
      const res = await axiosInstance.get(
        `OfficeStationary/GetDoctorUniformClothingGetAll?${queryParams.toString()}`
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
   * Update doctor uniform clothing status
   * Uses the exact API endpoint: /api/OfficeStationary/DoctorUniformClothingAdminApproveReject
   */
  static UpdateDoctorUniformClothingStatus = async (
    data: UpdateHealthMarketPlaceStatusParams
  ) => {
    try {
      const res = await axiosInstance.post(
        `OfficeStationary/DoctorUniformClothingAdminApproveReject`,
        data
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  /**
   * Get doctor uniform clothing by ID
   * Uses the exact API endpoint: /api/OfficeStationary/GetDoctorUniformClothingGetById
   */
  static GetDoctorUniformClothingById = async (requestId: number) => {
    try {
      const res = await axiosInstance.get(
        `OfficeStationary/GetDoctorUniformClothingGetById/${requestId}`
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };
}

export default OfficeStationaryService;
export type {
  OfficeStationaryParams,
  CreateOrderParams,
  UpdateHealthMarketPlaceStatusParams,
};
