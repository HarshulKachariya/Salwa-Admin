import { apiRequest } from "./httpClient";

const SUPER_ADMIN_BASE_URL = "https://apisalwa.rushkarprojects.in/api/SuperAdmin";

export interface FullProfileResponse {
  profile?: any;
  pendingItems?: unknown[];
  [key: string]: unknown;
}

export const getFullProfileWithPending = async (id: string | number) => {
  if (id === undefined || id === null || id === "") {
    throw new Error("id is required");
  }

  return apiRequest<FullProfileResponse>(
    `${SUPER_ADMIN_BASE_URL}/GetFullProfileWithPending/${id}`,
    { method: "GET" }
  );
};