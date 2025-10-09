import { errorHandler, successHandler } from "../common/appHandler";
import axiosInstance from "../common/axiosInstance";

interface IndividualMedicalWarehouseParams {
  searchText?: string;
  pageNumber?: number;
  pageSize?: number;
  orderByColumn?: string;
  orderDirection?: string;
}

interface UpdateStatusParams {
  requestId: number;
  newStatusId: number;
  requestNumber: string;
  reason: string;
}

class IndividualMedicalWarehouseService {
  /**
   * Get all individual medical warehouse data with pagination and search
   * Uses the exact API endpoint: /api/IndividualMedicalWarehouses/IndividualMedicalWarehousesGet
   */
  static IndividualMedicalWarehousesGet = async (
    params: IndividualMedicalWarehouseParams = {}
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
        `IndividualMedicalWarehouses/IndividualMedicalWarehousesGet?${queryParams.toString()}`
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  /**
   * Update warehouse status
   */
  static UpdateWarehouseStatus = async (params: UpdateStatusParams) => {
    try {
      const res = await axiosInstance.put(
        "IndividualMedicalWarehouses/UpdateStatus",
        params
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  /**
   * Get warehouse details by request ID
   */
  static GetWarehouseById = async (requestId: number) => {
    try {
      const res = await axiosInstance.get(
        `IndividualMedicalWarehouses/IndividualMedicalWarehousesGetById/${requestId}`
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  /**
   * Get warehouse details by request number
   */
  static GetWarehouseByRequestNumber = async (requestNumber: string) => {
    try {
      const res = await axiosInstance.get(
        `IndividualMedicalWarehouses/GetByRequestNumber/${requestNumber}`
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };
}

export default IndividualMedicalWarehouseService;
export type { IndividualMedicalWarehouseParams, UpdateStatusParams };
