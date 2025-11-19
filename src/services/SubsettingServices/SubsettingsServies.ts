import { apiRequest } from "../httpClient";

const ALL_SUBSCRIPTION_BASE_URL = "https://apisalwa.rushkarprojects.in/api/AllSubscription";

//for individual tab
export const getAllIndividualSubscriptions = async () => {
  return apiRequest(
    `${ALL_SUBSCRIPTION_BASE_URL}/GetAllIndividualSubscriptions`,
    { method: "GET" }
  );
};

export const updateIndividualSubscriptions = async (data: any) => {
  return apiRequest(
    `${ALL_SUBSCRIPTION_BASE_URL}/UpdateIndividualSubscriptions`,
    {
      method: "POST",
      body: JSON.stringify(data)
    }
  );
};


//for business tab
export const getBusinessSubscriptions = async (categoryId: number, subTypeId: number) => {
  return apiRequest(
    `${ALL_SUBSCRIPTION_BASE_URL}/GetBusinessSubscriptions?categoryId=${categoryId}&subTypeId=${subTypeId}`,
    { method: "GET" }
  );
};

export const updateBusinessSubscriptions = async (data: any) => {
  return apiRequest(
    `${ALL_SUBSCRIPTION_BASE_URL}/UpdateBusinessSubscriptions`,
    {
      method: "POST",
      body: JSON.stringify(data)
    }
  );
};

