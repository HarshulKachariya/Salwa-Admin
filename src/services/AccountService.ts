import { apiRequest } from "./httpClient";

const ACCOUNT_BASE_URL = "https://apisalwa.rushkarprojects.in/api/Account";

export interface UserWisePointsAndClassParams {
  searchText?: string;
  pageNumber?: number;
  pageSize?: number;
  orderByColumn?: string;
  orderDirection?: string;
}

export interface UserWisePointsAndClassRecord {
  id: number;
  businessName: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  category: string;
  points: number;
  createdDate: string;
  updatedDate: string;
  userId: number;
  userTypeId: number;
  isUpgradeFlag: number;
}

export interface UserWisePointsAndClassResponse {
  code: number;
  message: string;
  totalRecords: number;
  data: UserWisePointsAndClassRecord[];
}

const buildQuery = (params: Record<string, string | number | undefined>) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query.set(key, String(value));
    }
  });
  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
};

const extractList = (
  payload: UserWisePointsAndClassResponse | UserWisePointsAndClassRecord[] | unknown
): UserWisePointsAndClassRecord[] => {
  if (Array.isArray(payload)) {
    return payload as UserWisePointsAndClassRecord[];
  }
  if (payload && typeof payload === "object") {
    const typed = payload as UserWisePointsAndClassResponse;
    if (Array.isArray(typed.data)) {
      return typed.data;
    }
  }
  return [];
};

export const getAllUserWisePointsAndClass = async (
  params: UserWisePointsAndClassParams = {}
) => {
  const {
    searchText = "",
    pageNumber = 1,
    pageSize = 10,
    orderByColumn = "CreatedDate",
    orderDirection = "DESC",
  } = params;

  const query = buildQuery({
    searchText,
    pageNumber,
    pageSize,
    orderByColumn,
    orderDirection,
  });

  const response = await apiRequest<UserWisePointsAndClassResponse>(
    `${ACCOUNT_BASE_URL}/GetAllUserWisePointsAndClass${query}`, { 
    method: "GET" 
  });

  const records = extractList(response);

  return {
    records,
    totalCount: response.totalRecords ?? records.length,
    pageNumber: pageNumber,
    pageSize: pageSize,
    raw: response,
  };
};

export const getUserWisePointsAndClassById = (userId: string) =>
  apiRequest<UserWisePointsAndClassRecord | { data?: UserWisePointsAndClassRecord }>(
    `${ACCOUNT_BASE_URL}/GetUserWisePointsAndClassById${buildQuery({ userId })}`,
    { method: "GET" }
  );

export const updateUserPoints = (
  userId: string,
  points: number,
  action: "add" | "subtract" = "add"
) =>
  apiRequest<{ message?: string; status?: number }>(
    `${ACCOUNT_BASE_URL}/UpdateUserPoints`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, points, action }),
    }
  );

export const updateUserClass = (userId: string, newClass: string) =>
  apiRequest<{ message?: string; status?: number }>(
    `${ACCOUNT_BASE_URL}/UpdateUserClass`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, newClass }),
    }
  );

export interface GraphOrStatusDetailsResponse {
  statusSummary: Array<{
    TotalHospital: number;
    TotalCity: number;
    TotalIdNumber: number;
  }>;
  monthlyGraph: Array<{
    Month: string;
    MonthNumber: number;
    TotalHospital: number;
    TotalCity: number;
    TotalIdNumber: number;
  }>;
}

export const getUserWisePointsAndClassGraphOrStatusDetails = async () => {
  const response = await apiRequest<GraphOrStatusDetailsResponse>(
    `${ACCOUNT_BASE_URL}/GetUserWisePointsAndClassGraphOrStatusDetails`,
    { method: "GET" }
  );

  return response;
};
