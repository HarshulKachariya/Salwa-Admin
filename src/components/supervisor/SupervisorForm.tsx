import { type FC, useState, useEffect } from "react";
import { useToast } from "../ToastProvider";
import type { SuperAdminRecord } from "../../services/superAdminService";
import SupervisorServices from "../../services/SupervisorServices/SupervisorServices";
import CommonServices from "../../services/CommonServices/CommonServices";

interface SupervisorFormProps {
  mode: "add" | "view" | "edit";
  record?: SuperAdminRecord;
  onCancel: () => void;
  onSuccess?: () => void;
}

const SupervisorForm: FC<SupervisorFormProps> = ({
  mode,
  record,
  onCancel,
  onSuccess,
}) => {
  const { showToast } = useToast();

  const [commonData, setCommonData] = useState([]);

  // Helper function to format date for HTML date input (YYYY-MM-DD)
  const formatDateForInput = (dateString: string | undefined): string => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";

      // Format as YYYY-MM-DD for HTML date input
      return date.toISOString().split("T")[0];
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  // Helper function to format date for API (YYYY-MM-DD)
  const formatDateForAPI = (dateString: string): string => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";

      // Format as YYYY-MM-DD for API
      return date.toISOString().split("T")[0];
    } catch (error) {
      console.error("Error formatting date for API:", error);
      return "";
    }
  };

  // Form state management
  const [formData, setFormData] = useState({
    employeeId: record?.employeeId || 0,
    firstName: record?.firstName || "",
    middleName: record?.middleName || "",
    lastName: record?.lastName || "",
    idNumber: record?.idNumber || "",
    idExpiryDate: formatDateForInput(record?.idExpiryDate),
    dateOfBirth: formatDateForInput(record?.dateOfBirth),
    graduationCertificate: record?.graduationCertificate || "",
    acquiredLanguages: record?.acquiredLanguages || "",
    telephone: record?.telephone || "",
    officialEmail: record?.officialEmail || "",
    type: record?.type || 0,
    country: record?.country || "",
    region: record?.region || "",
    city: record?.city || "",
    nationalAddress: record?.nationalAddress || "",
    address: record?.address || "",
    latitude: record?.latitude || "",
    longitude: record?.longitude || "",
    bankName: record?.bankName || "",
    ibanNumber: record?.ibanNumber || "",
    password: record?.password || "",
    otp: record?.otp || 0,
    isPasswordset: record?.isPasswordset || 0,
    isOtpVerify: record?.isOtpVerify || 0,
    isMobileNoVerify: record?.isMobileNoVerify || true,
    createdBy: record?.createdBy || 0,
    updatedBy: record?.updatedBy || 0,
    isActive: record?.isActive || false,
    statusId: record?.statusId || 0,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isReadOnly = mode === "view";
  const isAdd = mode === "add";

  useEffect(() => {
    const fetchCommonData = async () => {
      const response = await CommonServices.CommonApi({
        parameter: "",
        spName: "USP_GetSuperAdminTypeDropdown",
        language: "",
      });
      if (response?.success && "data" in response && response.data) {
        const commonData = response.data;
        setCommonData(JSON.parse(commonData));
      }
    };
    fetchCommonData();
  }, []);

  // Fetch complete record data when component mounts (for edit/view modes)
  useEffect(() => {
    const fetchRecordData = async () => {
      if (record?.employeeId && (mode === "edit" || mode === "view")) {
        setLoading(true);
        try {
          const response = await SupervisorServices.GetSuperAdminById(
            record.employeeId
          );
          console.log("Fetched record data:", response);

          if (response?.success && "data" in response && response.data) {
            const recordData = response.data;
            setFormData({
              employeeId: recordData.employeeId || 0,
              firstName: recordData.firstName || "",
              middleName: recordData.middleName || "",
              lastName: recordData.lastName || "",
              idNumber: recordData.idNumber || "",
              idExpiryDate: formatDateForInput(recordData.idExpiryDate),
              dateOfBirth: formatDateForInput(recordData.dateOfBirth),
              graduationCertificate: recordData.graduationCertificate || "",
              acquiredLanguages: recordData.acquiredLanguages || "",
              telephone: recordData.telephone || "",
              officialEmail: recordData.officialEmail || "",
              type: recordData.type || 0,
              country: recordData.country || "",
              region: recordData.region || "",
              city: recordData.city || "",
              nationalAddress: recordData.nationalAddress || "",
              address: recordData.address || "",
              latitude: recordData.latitude || "",
              longitude: recordData.longitude || "",
              bankName: recordData.bankName || "",
              ibanNumber: recordData.ibanNumber || "",
              password: recordData.password || "",
              otp: recordData.otp || 0,
              isPasswordset: recordData.isPasswordset || 0,
              isOtpVerify: recordData.isOtpVerify || 0,
              isMobileNoVerify: recordData.isMobileNoVerify || true,
              createdBy: recordData.createdBy || 0,
              updatedBy: recordData.updatedBy || 0,
              isActive: recordData.isActive || false,
              statusId: recordData.statusId || 0,
            });
          } else {
            showToast("Failed to fetch supervisor details", "error");
          }
        } catch (error) {
          console.error("Error fetching record data:", error);
          showToast("Failed to fetch supervisor details", "error");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchRecordData();
  }, [record?.employeeId, mode, showToast]);

  const getTitle = () => {
    switch (mode) {
      case "add":
        return "Add New Supervisor";
      case "view":
        return "View Supervisor Details";
      case "edit":
        return "Edit Supervisor";
      default:
        return "Supervisor Form";
    }
  };

  const getDescription = () => {
    switch (mode) {
      case "add":
        return "Fill in the details below to add a new supervisor";
      case "view":
        return "View supervisor information and details";
      case "edit":
        return "Update supervisor information and details";
      default:
        return "Supervisor information";
    }
  };

  // Form validation
  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Required text fields
    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.idNumber.trim()) errors.idNumber = "ID Number is required";
    if (!formData.telephone.trim()) errors.telephone = "Telephone is required";
    if (!formData.officialEmail.trim())
      errors.officialEmail = "Email is required";
    if (!formData.country.trim()) errors.country = "Country is required";
    if (!formData.region.trim()) errors.region = "Region is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.bankName.trim()) errors.bankName = "Bank name is required";
    if (!formData.ibanNumber.trim())
      errors.ibanNumber = "IBAN number is required";
    if (!formData.graduationCertificate.trim())
      errors.graduationCertificate = "graduation Certificate  is required";
    if (!formData.acquiredLanguages.trim())
      errors.acquiredLanguages = "acquired Languages  is required";
    if (!formData.type) errors.type = "type is required";

    // Email validation
    if (
      formData.officialEmail &&
      !/\S+@\S+\.\S+/.test(formData.officialEmail)
    ) {
      errors.officialEmail = "Please enter a valid email address";
    }

    // Telephone validation (should be numeric and have proper length)
    if (formData.telephone && !/^[\d\s\-\+\(\)]+$/.test(formData.telephone)) {
      errors.telephone = "Please enter a valid phone number";
    }
    if (
      formData.telephone &&
      formData.telephone.replace(/\D/g, "").length < 7
    ) {
      errors.telephone = "Phone number must be at least 7 digits";
    }

    // ID Number validation (should be alphanumeric)
    if (formData.idNumber && !/^[A-Za-z0-9]+$/.test(formData.idNumber)) {
      errors.idNumber = "ID Number should contain only letters and numbers";
    }

    // IBAN validation (basic format check)
    if (
      formData.ibanNumber &&
      !/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(
        formData.ibanNumber.replace(/\s/g, "")
      )
    ) {
      errors.ibanNumber = "Please enter a valid IBAN number";
    }

    // Date validationsif
    if (!formData.idExpiryDate) {
      errors.idExpiryDate = "ID expiry date is required";
    }
    if (!formData.dateOfBirth) {
      errors.dateOfBirth = "Date of birth is required";
    }
    if (
      formData.idExpiryDate &&
      new Date(formData.idExpiryDate) <= new Date()
    ) {
      errors.idExpiryDate = "ID expiry date must be in the future";
    }

    if (formData.dateOfBirth && new Date(formData.dateOfBirth) >= new Date()) {
      errors.dateOfBirth = "Date of birth must be in the past";
    }

    // Age validation (must be at least 18 years old)
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      if (age < 18) {
        errors.dateOfBirth = "Must be at least 18 years old";
      }
    }

    // Name length validations
    if (formData.firstName && formData.firstName.trim().length < 2) {
      errors.firstName = "First name must be at least 2 characters";
    }
    if (formData.lastName && formData.lastName.trim().length < 2) {
      errors.lastName = "Last name must be at least 2 characters";
    }

    // Address length validation
    if (formData.address && formData.address.trim().length < 10) {
      errors.address = "Address must be at least 10 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Prepare form data for API submission with properly formatted dates
  const prepareFormDataForAPI = () => {
    return {
      ...formData,
      idExpiryDate: formatDateForAPI(formData.idExpiryDate),
      dateOfBirth: formatDateForAPI(formData.dateOfBirth),
    };
  };

  // Form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      let response: any;
      const apiFormData = prepareFormDataForAPI();

      if (isAdd) {
        // Add new supervisor
        response = await SupervisorServices.UpsertSuperAdmin(apiFormData);
        console.log("Add response:", response);
        if (response?.success) {
          showToast("Supervisor added successfully!", "success");
          onSuccess?.();
        } else {
          showToast(
            response?.data?.message || "Failed to add supervisor",
            "error"
          );
        }
      } else {
        // Update existing supervisor
        response = await SupervisorServices.UpdateSuperAdmin(
          apiFormData.employeeId,
          apiFormData,
          apiFormData.statusId
        );
        console.log("Update response:", response);
        if (response?.success) {
          showToast("Supervisor updated successfully!", "success");
          onSuccess?.();
        } else {
          showToast(
            response?.data?.message || "Failed to update supervisor",
            "error"
          );
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
      const message =
        error instanceof Error
          ? error.message
          : `Failed to ${isAdd ? "add" : "update"} supervisor`;
      showToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Input change handler with real-time validation
  const handleInputChange = (
    field: string,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear existing error for this field
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Real-time validation for specific fields
    const stringValue = String(value).trim();
    let error = "";

    switch (field) {
      case "firstName":
        if (stringValue && stringValue.length < 2) {
          error = "First name must be at least 2 characters";
        }
        break;
      case "lastName":
        if (stringValue && stringValue.length < 2) {
          error = "Last name must be at least 2 characters";
        }
        break;
      case "officialEmail":
        if (stringValue && !/\S+@\S+\.\S+/.test(stringValue)) {
          error = "Please enter a valid email address";
        }
        break;
      case "telephone":
        if (stringValue && !/^[\d\s\-\+\(\)]+$/.test(stringValue)) {
          error = "Please enter a valid phone number";
        } else if (stringValue && stringValue.replace(/\D/g, "").length < 7) {
          error = "Phone number must be at least 7 digits";
        }
        break;
      case "idNumber":
        if (stringValue && !/^[A-Za-z0-9]+$/.test(stringValue)) {
          error = "ID Number should contain only letters and numbers";
        }
        break;
      case "ibanNumber":
        if (
          stringValue &&
          !/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(stringValue.replace(/\s/g, ""))
        ) {
          error = "Please enter a valid IBAN number";
        }
        break;
      case "address":
        if (stringValue && stringValue.length < 10) {
          error = "Address must be at least 10 characters";
        }
        break;
      case "idExpiryDate":
        if (stringValue && new Date(stringValue) <= new Date()) {
          error = "ID expiry date must be in the future";
        }
        break;
      case "dateOfBirth":
        if (stringValue) {
          const birthDate = new Date(stringValue);
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();

          if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
          ) {
            age--;
          }

          if (age < 18) {
            error = "Must be at least 18 years old";
          } else if (birthDate >= today) {
            error = "Date of birth must be in the past";
          }
        }
        break;
    }

    // Set error if validation failed
    if (error) {
      setFormErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden main-content-scroll px-2 ">
      <div className="w-full">
        <div className="bg-white rounded-[32px] p-8 shadow-sm h-full mb-3">
          <div className="mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {getTitle()}
                </h2>
                <p className="text-sm text-gray-500">{getDescription()}</p>
              </div>
              <button
                type="button"
                onClick={onCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading supervisor details...</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-8">
                {/* General Information Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    General Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="relative input-filed-block">
                      <input
                        type="text"
                        id="first_name"
                        value={formData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 peer
                        placeholder-transparent disabled:cursor-not-allowed disabled:bg-[#F4F5F9] disabled:text-[#A0A3BD] ${formErrors.firstName
                            ? "border-red-500"
                            : "border-gray-300"
                          } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""
                          }`}
                        placeholder="First Name *"
                        readOnly={isReadOnly}
                      />
                      <label
                        htmlFor="first_name"
                        className={`
                        label-filed absolute left-3 top-2 text-[#A0A3BD] text-base transition-all duration-200
                        peer-placeholder-shown:top-2 peer-placeholder-shown:left-3 peer-placeholder-shown:text-base cursor-text
                        peer-focus:-top-3 peer-focus:left-3 peer-focus:text-[13px] peer-focus:text-[#070B68]
                        bg-white px-1  ${formData.firstName && formData.firstName.trim() !== "" ? "!-top-3 !left-3 !text-[13px]" : ""} 
                        `}
                      >
                        First Name *
                      </label>
                      {formErrors.firstName && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.firstName}
                        </p>
                      )}
                    </div>

                    <div className="relative input-filed-block">
                      <input
                        id="middle_name"
                        type="text"
                        value={formData.middleName}
                        onChange={(e) =>
                          handleInputChange("middleName", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 peer
                         placeholder-transparent disabled:cursor-not-allowed disabled:bg-[#F4F5F9] disabled:text-[#A0A3BD] ${isReadOnly
                            ? "bg-gray-100 cursor-not-allowed"
                            : "border-gray-300"
                          }`}
                        placeholder="Middle Name"
                        readOnly={isReadOnly}
                      />
                      <label
                        htmlFor="middle_name"
                        className={`
                        label-filed absolute left-3 top-2 text-[#A0A3BD] text-base transition-all duration-200
                        peer-placeholder-shown:top-2 peer-placeholder-shown:left-3 peer-placeholder-shown:text-base cursor-text
                        peer-focus:-top-3 peer-focus:left-3 peer-focus:text-[13px] peer-focus:text-[#070B68]
                        bg-white px-1  ${formData.middleName && formData.middleName.trim() !== "" ? "!-top-3 !left-3 !text-[13px]" : ""} 
                        `}
                      >
                        Middle Name
                      </label>
                    </div>

                    <div className="relative input-filed-block">
                      <input
                        type="text"
                        id="last_name"
                        value={formData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 peer
                        placeholder-transparent disabled:cursor-not-allowed disabled:bg-[#F4F5F9] disabled:text-[#A0A3BD] ${formErrors.lastName
                            ? "border-red-500"
                            : "border-gray-300"
                          } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""
                          }`}
                        placeholder="Last Name *"
                        readOnly={isReadOnly}
                      />
                      <label
                        htmlFor="last_name"
                        className={`
                        label-filed absolute left-3 top-2 text-[#A0A3BD] text-base transition-all duration-200
                        peer-placeholder-shown:top-2 peer-placeholder-shown:left-3 peer-placeholder-shown:text-base cursor-text
                        peer-focus:-top-3 peer-focus:left-3 peer-focus:text-[13px] peer-focus:text-[#070B68]
                        bg-white px-1  ${formData.lastName && formData.lastName.trim() !== "" ? "!-top-3 !left-3 !text-[13px]" : ""} 
                        `}
                      >Last Name *</label>
                      {formErrors.lastName && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.lastName}
                        </p>
                      )}
                    </div>

                    <div className="relative input-filed-block">
                      <input
                        type="text"
                        id="id_number"
                        value={formData.idNumber}
                        onChange={(e) =>
                          handleInputChange("idNumber", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 peer
                        placeholder-transparent disabled:cursor-not-allowed disabled:bg-[#F4F5F9] disabled:text-[#A0A3BD] ${formErrors.idNumber
                            ? "border-red-500"
                            : "border-gray-300"
                          } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""
                          }`}
                        placeholder="ID Number / IQAMA Number *"
                        readOnly={isReadOnly}
                      />
                      <label
                        htmlFor="id_number"
                        className={`
                        label-filed absolute left-3 top-2 text-[#A0A3BD] text-base transition-all duration-200
                        peer-placeholder-shown:top-2 peer-placeholder-shown:left-3 peer-placeholder-shown:text-base cursor-text
                        peer-focus:-top-3 peer-focus:left-3 peer-focus:text-[13px] peer-focus:text-[#070B68]
                        bg-white px-1  ${formData.idNumber && formData.idNumber.trim() !== "" ? "!-top-3 !left-3 !text-[13px]" : ""} 
                        `}
                      >ID Number / IQAMA Number *</label>
                      {formErrors.idNumber && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.idNumber}
                        </p>
                      )}
                    </div>

                    <div className="relative input-filed-block">
                      <input
                        type="date"
                        id="id_expiry_date"
                        value={formData.idExpiryDate}
                        onChange={(e) =>
                          handleInputChange("idExpiryDate", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 peer
                        placeholder-transparent disabled:cursor-not-allowed disabled:bg-[#F4F5F9] disabled:text-[#A0A3BD] ${formErrors.idExpiryDate
                            ? "border-red-500"
                            : "border-gray-300"
                          } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""
                          }`}
                        placeholder="ID Expiry Date"
                        readOnly={isReadOnly}
                      />
                      <label
                        htmlFor="id_expiry_date"
                        className={`
                        label-filed absolute left-3 top-2 text-[#A0A3BD] text-base transition-all duration-200
                        peer-placeholder-shown:top-2 peer-placeholder-shown:left-3 peer-placeholder-shown:text-base cursor-text
                        peer-focus:-top-3 peer-focus:left-3 peer-focus:text-[13px] peer-focus:text-[#070B68]
                        bg-white px-1  ${formData.idExpiryDate && formData.idExpiryDate.trim() !== "" ? "!-top-3 !left-3 !text-[13px]" : ""} 
                        `}
                      >ID Expiry Date</label>
                      {formErrors.idExpiryDate && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.idExpiryDate}
                        </p>
                      )}
                    </div>

                    <div className="relative input-filed-block">
                      <input
                        type="date"
                        id="date_of_birth"
                        value={formData.dateOfBirth}
                        onChange={(e) =>
                          handleInputChange("dateOfBirth", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 peer
                        placeholder-transparent disabled:cursor-not-allowed disabled:bg-[#F4F5F9] disabled:text-[#A0A3BD] ${formErrors.dateOfBirth
                            ? "border-red-500"
                            : "border-gray-300"
                          } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""
                          }`}
                        placeholder="Date of Birth"
                        readOnly={isReadOnly}
                      />
                      <label
                        htmlFor="date_of_birth"
                        className={`
                        label-filed absolute left-3 top-2 text-[#A0A3BD] text-base transition-all duration-200
                        peer-placeholder-shown:top-2 peer-placeholder-shown:left-3 peer-placeholder-shown:text-base cursor-text
                        peer-focus:-top-3 peer-focus:left-3 peer-focus:text-[13px] peer-focus:text-[#070B68]
                        bg-white px-1  ${formData.dateOfBirth && formData.dateOfBirth.trim() !== "" ? "!-top-3 !left-3 !text-[13px]" : ""} 
                        `}
                      >Date of Birth</label>
                      {formErrors.dateOfBirth && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.dateOfBirth}
                        </p>
                      )}
                    </div>

                    <div className="relative input-filed-block">
                      <input
                        type="text"
                        id="graduation_certificate"
                        value={formData.graduationCertificate}
                        onChange={(e) =>
                          handleInputChange(
                            "graduationCertificate",
                            e.target.value
                          )
                        }
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 peer
                        placeholder-transparent disabled:cursor-not-allowed disabled:bg-[#F4F5F9] disabled:text-[#A0A3BD] ${formErrors.graduationCertificate
                            ? "border-red-500"
                            : "border-gray-300"
                          } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""
                          }`}
                        placeholder="Graduation Certificate"
                        readOnly={isReadOnly}
                      />
                      <label
                        htmlFor="graduation_certificate"
                        className={`
                        label-filed absolute left-3 top-2 text-[#A0A3BD] text-base transition-all duration-200
                        peer-placeholder-shown:top-2 peer-placeholder-shown:left-3 peer-placeholder-shown:text-base cursor-text
                        peer-focus:-top-3 peer-focus:left-3 peer-focus:text-[13px] peer-focus:text-[#070B68]
                        bg-white px-1  ${formData.graduationCertificate && formData.graduationCertificate.trim() !== "" ? "!-top-3 !left-3 !text-[13px]" : ""} 
                        `}
                      >Graduation Certificate</label>
                      {formErrors.graduationCertificate && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.graduationCertificate}
                        </p>
                      )}
                    </div>

                    <div className="relative input-filed-block">
                      <input
                        type="text"
                        id="acquired_languages"
                        value={formData.acquiredLanguages}
                        onChange={(e) =>
                          handleInputChange("acquiredLanguages", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.acquiredLanguages
                          ? "border-red-500"
                          : "border-gray-300"
                          } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""
                          }`}
                        placeholder="Acquired Languages"
                        readOnly={isReadOnly}
                      />
                      <label
                        htmlFor="acquired_languages"
                        className={`
                        label-filed absolute left-3 top-2 text-[#A0A3BD] text-base transition-all duration-200
                        peer-placeholder-shown:top-2 peer-placeholder-shown:left-3 peer-placeholder-shown:text-base cursor-text
                        peer-focus:-top-3 peer-focus:left-3 peer-focus:text-[13px] peer-focus:text-[#070B68]
                        bg-white px-1  ${formData.acquiredLanguages && formData.acquiredLanguages.trim() !== "" ? "!-top-3 !left-3 !text-[13px]" : ""} 
                        `}
                      >Acquired Languages</label>
                      {formErrors.acquiredLanguages && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.acquiredLanguages}
                        </p>
                      )}
                    </div>

                    <div>
                      <div className="flex relative input-filed-block">
                        <select
                          className={`px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isReadOnly
                            ? "bg-gray-100 cursor-not-allowed"
                            : "border-gray-300"
                            }`}
                          disabled={isReadOnly}
                        >
                          <option>+966</option>
                          <option>+1</option>
                          <option>+44</option>
                        </select>
                        <input
                          type="tel"
                          id="telephone"
                          value={formData.telephone}
                          onChange={(e) =>
                            handleInputChange("telephone", e.target.value)
                          }
                          className={`flex-1 px-3 py-2 border border-l-0 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 peer
                        placeholder-transparent disabled:cursor-not-allowed disabled:bg-[#F4F5F9] disabled:text-[#A0A3BD] ${formErrors.telephone
                              ? "border-red-500"
                              : "border-gray-300"
                            } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""
                            }`}
                          placeholder="Telephone *"
                          readOnly={isReadOnly}
                        />
                        <label
                          htmlFor="telephone"
                          className={`
                        label-filed absolute left-24 top-2 text-[#A0A3BD] text-base transition-all duration-200
                        peer-placeholder-shown:top-2 peer-placeholder-shown:left-24 peer-placeholder-shown:text-base cursor-text
                        peer-focus:-top-3 peer-focus:left-24 peer-focus:text-[13px] peer-focus:text-[#070B68]
                        bg-white px-1  ${formData.telephone && formData.telephone.trim() !== "" ? "-top-3 left-24 !text-[13px] " : ""} 
                        `}
                        >Telephone *</label>
                      </div>
                      {formErrors.telephone && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.telephone}
                        </p>
                      )}
                    </div>

                    <div className="relative input-filed-block">
                      <input
                        type="email"
                        id="official_email"
                        value={formData.officialEmail}
                        onChange={(e) =>
                          handleInputChange("officialEmail", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 peer
                        placeholder-transparent disabled:cursor-not-allowed disabled:bg-[#F4F5F9] disabled:text-[#A0A3BD] ${formErrors.officialEmail
                            ? "border-red-500"
                            : "border-gray-300"
                          } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""
                          }`}
                        placeholder="Official Email *"
                        readOnly={isReadOnly}
                      />
                      <label
                        htmlFor="official_email"
                        className={`
                        label-filed absolute left-3 top-2 text-[#A0A3BD] text-base transition-all duration-200
                        peer-placeholder-shown:top-2 peer-placeholder-shown:left-3 peer-placeholder-shown:text-base cursor-text
                        peer-focus:-top-3 peer-focus:left-3 peer-focus:text-[13px] peer-focus:text-[#070B68]
                        bg-white px-1  ${formData.officialEmail && formData.officialEmail.trim() !== "" ? "!-top-3 !left-3 !text-[13px]" : ""} 
                        `}
                      >Official Email *</label>
                      {formErrors.officialEmail && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.officialEmail}
                        </p>
                      )}
                    </div>

                    <div className="relative input-filed-block">
                      <select
                        value={formData.type}
                        id="select_type"
                        onChange={(e) =>
                          handleInputChange("type", parseInt(e.target.value))
                        }
                        className={`w-full px-3 py-2 h-[42px] border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 peer
                        placeholder-transparent disabled:cursor-not-allowed disabled:bg-[#F4F5F9] disabled:text-[#A0A3BD] ${formErrors.type ? "border-red-500" : "border-gray-300"
                          } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""
                          }`}
                        disabled={isReadOnly}
                      >
                        {commonData?.map((item: any) => (
                          <option key={item.ID} value={item.ID}>
                            {item.EName}
                          </option>
                        ))}
                      </select>
                      <label
                        htmlFor="select_type"
                        className={`
                        label-filed absolute left-3 top-2 text-[#A0A3BD] text-base transition-all duration-200
                        peer-placeholder-shown:top-2 peer-placeholder-shown:left-3 peer-placeholder-shown:text-base cursor-text
                        peer-focus:-top-3 peer-focus:left-3 peer-focus:text-[13px] peer-focus:text-[#070B68]
                        bg-white px-1  ${formData.type ? "!-top-3 !left-3 !text-[13px]" : ""} 
                        `}
                      >Selct Type *</label>
                      {formErrors.type && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.type}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Address
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="relative input-filed-block">
                      <input
                        type="text"
                        id="country"
                        value={formData.country}
                        onChange={(e) =>
                          handleInputChange("country", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 peer
                        placeholder-transparent disabled:cursor-not-allowed disabled:bg-[#F4F5F9] disabled:text-[#A0A3BD] ${formErrors.country
                            ? "border-red-500"
                            : "border-gray-300"
                          } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""
                          }`}
                        placeholder="Country *"
                        readOnly={isReadOnly}
                      />
                      <label
                        htmlFor="country"
                        className={`
                        label-filed absolute left-3 top-2 text-[#A0A3BD] text-base transition-all duration-200
                        peer-placeholder-shown:top-2 peer-placeholder-shown:left-3 peer-placeholder-shown:text-base cursor-text
                        peer-focus:-top-3 peer-focus:left-3 peer-focus:text-[13px] peer-focus:text-[#070B68]
                        bg-white px-1  ${formData.country && formData.country.trim() !== "" ? "!-top-3 !left-3 !text-[13px]" : ""} 
                        `}
                      >Country *</label>
                      {formErrors.country && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.country}
                        </p>
                      )}
                    </div>

                    <div className="relative input-filed-block">
                      <input
                        type="text"
                        id="region"
                        value={formData.region}
                        onChange={(e) =>
                          handleInputChange("region", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 peer
                        placeholder-transparent disabled:cursor-not-allowed disabled:bg-[#F4F5F9] disabled:text-[#A0A3BD] ${formErrors.region
                            ? "border-red-500"
                            : "border-gray-300"
                          } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""
                          }`}
                        placeholder="Region *"
                        readOnly={isReadOnly}
                      />
                      <label
                        htmlFor="region"
                        className={`
                        label-filed absolute left-3 top-2 text-[#A0A3BD] text-base transition-all duration-200
                        peer-placeholder-shown:top-2 peer-placeholder-shown:left-3 peer-placeholder-shown:text-base cursor-text
                        peer-focus:-top-3 peer-focus:left-3 peer-focus:text-[13px] peer-focus:text-[#070B68]
                        bg-white px-1  ${formData.region && formData.region.trim() !== "" ? "!-top-3 !left-3 !text-[13px]" : ""} 
                        `}
                      >Region *</label>
                      {formErrors.region && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.region}
                        </p>
                      )}
                    </div>

                    <div className="relative input-filed-block">
                      <input
                        type="text"
                        id="city"
                        value={formData.city}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 peer
                        placeholder-transparent disabled:cursor-not-allowed disabled:bg-[#F4F5F9] disabled:text-[#A0A3BD] ${formErrors.city ? "border-red-500" : "border-gray-300"
                          } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""
                          }`}
                        placeholder="City *"
                        readOnly={isReadOnly}
                      />
                      <label
                        htmlFor="city"
                        className={`
                        label-filed absolute left-3 top-2 text-[#A0A3BD] text-base transition-all duration-200
                        peer-placeholder-shown:top-2 peer-placeholder-shown:left-3 peer-placeholder-shown:text-base cursor-text
                        peer-focus:-top-3 peer-focus:left-3 peer-focus:text-[13px] peer-focus:text-[#070B68]
                        bg-white px-1  ${formData.city && formData.city.trim() !== "" ? "!-top-3 !left-3 !text-[13px]" : ""} 
                        `}
                      >City *</label>
                      {formErrors.city && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.city}
                        </p>
                      )}
                    </div>

                    <div className="relative input-filed-block">
                      <input
                        type="text"
                        id="national_address"
                        value={formData.nationalAddress}
                        onChange={(e) =>
                          handleInputChange("nationalAddress", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 peer
                        placeholder-transparent disabled:cursor-not-allowed disabled:bg-[#F4F5F9] disabled:text-[#A0A3BD] ${isReadOnly
                          ? "bg-gray-100 cursor-not-allowed"
                          : "border-gray-300"
                          }`}
                        placeholder="National Address - SPL"
                        readOnly={isReadOnly}
                      />
                      <label
                        htmlFor="national_address"
                        className={`
                        label-filed absolute left-3 top-2 text-[#A0A3BD] text-base transition-all duration-200
                        peer-placeholder-shown:top-2 peer-placeholder-shown:left-3 peer-placeholder-shown:text-base cursor-text
                        peer-focus:-top-3 peer-focus:left-3 peer-focus:text-[13px] peer-focus:text-[#070B68]
                        bg-white px-1  ${formData.nationalAddress && formData.nationalAddress.trim() !== "" ? "!-top-3 !left-3 !text-[13px]" : ""} 
                        `}
                      >National Address - SPL</label>
                    </div>

                    <div className="md:col-span-2 relative input-filed-block">
                      <input
                        type="text"
                        id="address"
                        value={formData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 peer
                        placeholder-transparent disabled:cursor-not-allowed disabled:bg-[#F4F5F9] disabled:text-[#A0A3BD] ${formErrors.address
                          ? "border-red-500"
                          : "border-gray-300"
                          } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""
                          }`}
                        placeholder="Address *"
                        readOnly={isReadOnly}
                      />
                      <label
                        htmlFor="address"
                        className={`
                        label-filed absolute left-3 top-2 text-[#A0A3BD] text-base transition-all duration-200
                        peer-placeholder-shown:top-2 peer-placeholder-shown:left-3 peer-placeholder-shown:text-base cursor-text
                        peer-focus:-top-3 peer-focus:left-3 peer-focus:text-[13px] peer-focus:text-[#070B68]
                        bg-white px-1  ${formData.address && formData.address.trim() !== "" ? "!-top-3 !left-3 !text-[13px]" : ""} 
                        `}
                      >Address *</label>
                      {formErrors.address && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.address}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Map placeholder */}
                  <div className="mt-6">
                    <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-8 h-8 bg-gray-400 rounded-full mx-auto mb-2"></div>
                        <p className="text-gray-500">Map Component</p>
                        {!isReadOnly && (
                          <button
                            type="button"
                            className="mt-2 px-4 py-2 bg-black text-white rounded-md text-sm"
                          >
                            Get Direction
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bank Information Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Bank Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative input-filed-block">
                      <input
                        type="text"
                        id="bank_name"
                        value={formData.bankName}
                        onChange={(e) =>
                          handleInputChange("bankName", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 peer
                        placeholder-transparent disabled:cursor-not-allowed disabled:bg-[#F4F5F9] disabled:text-[#A0A3BD] ${formErrors.bankName
                          ? "border-red-500"
                          : "border-gray-300"
                          } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""
                          }`}
                        placeholder="Bank Name *"
                        readOnly={isReadOnly}
                      />
                      <label
                        htmlFor="bank_name"
                        className={`
                        label-filed absolute left-3 top-2 text-[#A0A3BD] text-base transition-all duration-200
                        peer-placeholder-shown:top-2 peer-placeholder-shown:left-3 peer-placeholder-shown:text-base cursor-text
                        peer-focus:-top-3 peer-focus:left-3 peer-focus:text-[13px] peer-focus:text-[#070B68]
                        bg-white px-1  ${formData.bankName && formData.bankName.trim() !== "" ? "!-top-3 !left-3 !text-[13px]" : ""} 
                        `}
                      >Bank Name *</label>
                      {formErrors.bankName && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.bankName}
                        </p>
                      )}
                    </div>

                    <div className="relative input-filed-block">
                      <input
                        type="text"
                        id="iban_number"
                        value={formData.ibanNumber}
                        onChange={(e) =>
                          handleInputChange("ibanNumber", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 peer
                        placeholder-transparent disabled:cursor-not-allowed disabled:bg-[#F4F5F9] disabled:text-[#A0A3BD] ${formErrors.ibanNumber
                          ? "border-red-500"
                          : "border-gray-300"
                          } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""
                          }`}
                        placeholder="IBAN Number *"
                        readOnly={isReadOnly}
                      />
                      <label
                        htmlFor="iban_number"
                        className={`
                        label-filed absolute left-3 top-2 text-[#A0A3BD] text-base transition-all duration-200
                        peer-placeholder-shown:top-2 peer-placeholder-shown:left-3 peer-placeholder-shown:text-base cursor-text
                        peer-focus:-top-3 peer-focus:left-3 peer-focus:text-[13px] peer-focus:text-[#070B68]
                        bg-white px-1  ${formData.ibanNumber && formData.ibanNumber.trim() !== "" ? "!-top-3 !left-3 !text-[13px]" : ""} 
                        `}
                      >IBAN Number *</label>
                      {formErrors.ibanNumber && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.ibanNumber}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                {!isReadOnly && (
                  <div className="flex justify-center pt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-8 py-3 font-medium rounded-md transition-colors flex items-center gap-2 ${isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-black text-white hover:bg-gray-800"
                        }`}
                    >
                      {isSubmitting && (
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      )}
                      {isSubmitting
                        ? isAdd
                          ? "Saving..."
                          : "Updating..."
                        : isAdd
                          ? "Save"
                          : "Update"}
                    </button>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupervisorForm;
