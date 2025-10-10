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

// Status enums for doctor uniform clothing
export type DoctorUniformStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "InProgress"
  | "Completed"
  | "Cancelled"
  | "Published";

export type DoctorUniformStatusId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const DOCTOR_UNIFORM_STATUS_MAP: Record<
  DoctorUniformStatusId,
  DoctorUniformStatus
> = {
  1: "Pending",
  2: "Approved",
  3: "Rejected",
  4: "InProgress",
  5: "Completed",
  6: "Cancelled",
  7: "Published",
};

export const DOCTOR_UNIFORM_STATUS_ID_MAP: Record<
  DoctorUniformStatus,
  DoctorUniformStatusId
> = {
  Pending: 1,
  Approved: 2,
  Rejected: 3,
  InProgress: 4,
  Completed: 5,
  Cancelled: 6,
  Published: 7,
};

export interface DoctorUniformRecord {
  // CamelCase properties
  requestId: number;
  requestNumber: string;
  orderTitle: string;
  uniformType: number;
  uniformTypeName: string;
  gender: number;
  genderName: string;
  size: string;
  color: string;
  quantity?: number;
  totalQuantity: number;
  contactPersonName: string;
  contactPersonEmail: string;
  country: string;
  region: string;
  city: string;
  district: string;
  address: string;
  nationalAddress: string;
  statusId: number;
  statusName: string;
  createdDate?: string;
  updatedDate?: string;
  media?: string;
  otherDetails?: string;
  rentPeriod?: number;
  rentValue?: number;
  discountType?: number;
  discountValue?: number;
  serviceType?: string;
  postOfficeBox?: string;
  businessName?: string;
  fdaApproved?: boolean;
  isFridge?: boolean;
  fireDepartmentLic?: string;
  termAndCondition?: string;
  postValidityTime: number;
  postValidityTimeName: string;
  productTypeAndColor: string;
  latitude: string;
  longitude: string;
  locationId: number;
  categoryId: number;
  serviceId: number;
  isActive: number;
  isComfirmation?: boolean;
  isTermsandConditon?: boolean;
  rowNum: number;

  // PascalCase properties (for API response compatibility)
  RequestId?: number;
  RequestNumber?: string;
  OrderTitle?: string;
  UniformType?: number;
  UniformTypeName?: string;
  Gender?: number;
  GenderName?: string;
  Size?: string;
  Color?: string;
  Quantity?: number;
  TotalQuantity?: number;
  ContactPersonName?: string;
  ContactPersonEmail?: string;
  Country?: string;
  Region?: string;
  City?: string;
  District?: string;
  Address?: string;
  NationalAddress?: string;
  StatusId?: number;
  StatusName?: string;
  CreatedDate?: string;
  UpdatedDate?: string;
  Media?: string;
  OtherDetails?: string;
  RentPeriod?: number;
  RentValue?: number;
  DiscountType?: number;
  DiscountValue?: number;
  ServiceType?: string;
  PostOfficeBox?: string;
  BusinessName?: string;
  FdaApproved?: boolean;
  IsFridge?: boolean;
  FireDepartmentLic?: string;
  TermAndCondition?: string;
  PostValidityTime?: number;
  PostValidityTimeName?: string;
  ProductTypeAndColor?: string;
  Latitude?: string;
  Longitude?: string;
  LocationId?: number;
  CategoryId?: number;
  ServiceId?: number;
  IsActive?: number;
  IsComfirmation?: boolean;
  IsTermsandConditon?: boolean;
  RowNum?: number;
}

export interface FoodSectorService {
  requestId: number;
  categoryId: number;
  serviceId: number;
  requestNumber: string;
  contactPersonName: string;
  contactPersonEmail: string;
  choosePostTimeValidityTime: string;
  locationId: number;
  otherDetails: string;
  orderTitle: string | null;
  confirmedFlag: boolean;
  sterilizationEquipmentFlag: boolean;
  isTermCondition: boolean;
  serviceType: string;
  isAdminApprove: boolean | null;
  statusId: number;
  isActive: boolean;
  country?: string;
  region?: string;
  city?: string;
  district?: string;
  items: FoodSectorItem[];
}

export interface FoodSectorItem {
  id: number;
  requestNumber: string;
  requestId: number;
  name: string;
  quantity: number;
  isActive: boolean;
}

export interface FoodSectorApiResponse {
  status: number;
  code: string | null;
  message: string;
  data: FoodSectorService[];
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
   * Uses the exact API endpoint: /api/OfficeStationary/UpdateDoctorUniformClothingStatus
   */
  static UpdateDoctorUniformClothingStatus = async (data: {
    RequestId: number;
    NewStatusId: number;
    RequestNumber: string;
    Reason: string;
  }) => {
    try {
      const res = await axiosInstance.post(
        `OfficeStationary/UpdateDoctorUniformClothingStatus`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
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

  /**
   * Get doctor uniform clothing by request number
   * Uses the exact API endpoint: /api/OfficeStationary/GetDoctorUniformClothingGetByRequestNumber
   */
  static GetDoctorUniformClothingByRequestNumber = async (requestNumber: string) => {
    try {
      const res = await axiosInstance.get(
        `OfficeStationary/GetDoctorUniformClothingGetByRequestNumber?requestNumber=${requestNumber}`
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  /**
   * Get all food sector services
   * Uses the exact API endpoint: /api/OfficeStationary/GetAllFoodSectorServices
   */
  static GetAllFoodSectorServices = async (
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
        SearchText: searchText,
        PageNumber: pageNumber.toString(),
        PageSize: pageSize.toString(),
        OrderByColumn: orderByColumn,
        OrderDirection: orderDirection,
      });

      // Use GET request with query parameters
      const res = await axiosInstance.get(
        `OfficeStationary/GetAllFoodSectorServices?${queryParams.toString()}`
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
   * Get food sector services by request ID
   * Uses the exact API endpoint: /api/OfficeStationary/GetFoodSectorServicesByRequestId
   */
  static GetFoodSectorServicesByRequestId = async (requestId: number) => {
    try {
      const res = await axiosInstance.get(
        `OfficeStationary/GetFoodSectorServicesByRequestId?RequestId=${requestId}`
      );
      // Return the response directly since your API already has the proper structure
      return {
        success: true,
        data: res.data,
      };
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  /**
   * Approve or reject food sector services by admin
   * Uses the exact API endpoint: /api/OfficeStationary/FoodSectorServicesAdminApproveReject
   */
  static FoodSectorServicesAdminApproveReject = async (data: {
    requestId: number;
    newStatusId: number;
    requestNumber: string;
    reason: string;
  }) => {
    try {
      const res = await axiosInstance.post(
        `OfficeStationary/FoodSectorServicesAdminApproveReject`,
        data
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
