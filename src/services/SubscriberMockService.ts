import { 
  type SubscriberRecord, 
  type SubscriberAnalytics, 
  type SubscriberParams 
} from "./SubscriberService";

// Mock data for testing
const mockSubscribers: SubscriberRecord[] = Array.from({ length: 1501 }, (_, index) => ({
  id: `SUB-${1000 + index}`,
  idNo: `1000${index.toString().padStart(2, '0')}J`,
  userType: index % 3 === 0 ? "Individual" : index % 3 === 1 ? "Business" : "Government",
  subUserType: index % 4 === 0 ? "Insurance Care Holder" : 
               index % 4 === 1 ? "Medical Professional" : 
               index % 4 === 2 ? "Healthcare Provider" : "General User",
  name: index % 2 === 0 ? "Sherif M. Al-Alami" : 
        index % 2 === 1 ? "Noor Abdullah" : 
        index % 2 === 2 ? "Khalid Saad" : "Ahmed Hassan",
  email: `user${index + 1}@salwa.sa`,
  phoneNumber: `+966${50 + index}${(1000000 + index).toString().slice(-7)}`,
  subscriptionAmount: 100 + (index % 5) * 50,
  subscriptionUpdatedDate: new Date(2024, index % 12, (index % 28) + 1).toLocaleDateString(),
  country: "Saudi Arabia",
  region: index % 3 === 0 ? "Riyadh" : index % 3 === 1 ? "Jeddah" : "Dammam",
  city: index % 3 === 0 ? "Riyadh" : index % 3 === 1 ? "Jeddah" : "Dammam",
  district: index % 4 === 0 ? "Al-Malaz" : 
           index % 4 === 1 ? "Al-Nakheel" : 
           index % 4 === 2 ? "Al-Rawdah" : "Al-Olaya",
  status: index % 4 === 0 ? "Pending Approval" : 
          index % 4 === 1 ? "Active" : 
          index % 4 === 2 ? "Inactive" : "Active",
  joinedDate: new Date(2024, index % 12, (index % 28) + 1).toLocaleDateString(),
}));

const mockAnalytics: SubscriberAnalytics = {
  totalActive: 244,
  totalInactive: 22,
  totalUsers: 266,
  monthlyData: [
    { month: "Jan", active: 45, inactive: 5 },
    { month: "Feb", active: 52, inactive: 3 },
    { month: "Mar", active: 48, inactive: 7 },
    { month: "Apr", active: 61, inactive: 4 },
    { month: "May", active: 55, inactive: 6 },
    { month: "Jun", active: 58, inactive: 2 },
    { month: "Jul", active: 62, inactive: 8 },
    { month: "Aug", active: 59, inactive: 3 },
    { month: "Sep", active: 65, inactive: 5 },
    { month: "Oct", active: 68, inactive: 4 },
    { month: "Nov", active: 71, inactive: 6 },
    { month: "Dec", active: 75, inactive: 3 },
  ],
};

export const getAllSubscribersMock = async (
  params: SubscriberParams = {}
) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const {
    searchText = "",
    pageNumber = 1,
    pageSize = 10,
    status = "Individual",
  } = params;

  let filteredSubscribers = mockSubscribers;

  // Filter by user type (Individual, Business, Government)
  if (status === "Individual" || status === "Business" || status === "Government") {
    filteredSubscribers = filteredSubscribers.filter(sub => sub.userType === status);
  }

  // Filter by search text
  if (searchText) {
    const searchLower = searchText.toLowerCase();
    filteredSubscribers = filteredSubscribers.filter(sub =>
      sub.name.toLowerCase().includes(searchLower) ||
      sub.email.toLowerCase().includes(searchLower) ||
      sub.idNo.toLowerCase().includes(searchLower) ||
      sub.phoneNumber.includes(searchText)
    );
  }

  // Pagination
  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedSubscribers = filteredSubscribers.slice(startIndex, endIndex);

  return {
    records: paginatedSubscribers,
    totalCount: filteredSubscribers.length,
    pageNumber: pageNumber,
    pageSize: pageSize,
    raw: { data: paginatedSubscribers, totalRecords: filteredSubscribers.length },
  };
};

export const getSubscriberAnalyticsMock = async (): Promise<SubscriberAnalytics> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockAnalytics;
};

export const exportSubscribersMock = async (params: SubscriberParams = {}) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Create a simple CSV content
  const { records } = await getAllSubscribersMock({ ...params, pageSize: 1000 });
  const csvContent = [
    "ID No,User Type,Sub User Type,Name,Email,Phone Number,Subscription Amount,Status,Country,Region,City,District",
    ...records.map(sub => 
      `"${sub.idNo}","${sub.userType}","${sub.subUserType}","${sub.name}","${sub.email}","${sub.phoneNumber}","${sub.subscriptionAmount}","${sub.status}","${sub.country}","${sub.region}","${sub.city}","${sub.district}"`
    )
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `subscribers-${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};
