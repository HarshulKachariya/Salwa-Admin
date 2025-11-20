import { errorHandler, successHandler } from "../common/appHandler";
import axiosInstance from "../common/axiosInstance";

class SupportTicketService {
  static GetAllSupportTickets = async (params: {
    PageNumber?: number;
    PageSize?: number;
    OrderByColumn?: string;
    OrderDirection?: string;
    Search?: string;
  }) => {
    try {
      // Use only provided params; do not attach language
      const paramsWithLang = { ...params } as Record<string, any>;

      // Remove keys that are undefined, null or empty strings so they are not sent in query
      const filteredParams = Object.fromEntries(
        Object.entries(paramsWithLang).filter(
          ([, v]) =>
            v !== undefined &&
            v !== null &&
            !(typeof v === "string" && v.trim() === "")
        )
      );

      const res = await axiosInstance.get(
        `SupportTickets/GetAllSupportTickets`,
        {
          params: filteredParams,
        }
      );

      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  // New method: update ticket status
  static UpdateSupportTicketStatus = async (payload: {
    TicketId: number;
    StatusId: number;
  }) => {
    try {
      const res = await axiosInstance.post(
        `SupportTickets/UpdateSupportTicketStatus`,
        payload
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  // New method: get ticket details by ticket id
  static GetSupportTicketsByTicketId = async (ticketId: number) => {
    try {
      const res = await axiosInstance.post(
        `SupportTickets/GetSupportTicketsByTicketId?TicketId=${ticketId}`
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  // Ensure comment upsert exists
  static UpsertSupportTicketsUserComment = async (payload: {
    TicketId: number;
    Comment: string;
  }) => {
    try {
      const res = await axiosInstance.post(
        `SupportTickets/UpsertSupportTicketsUserComment`,
        payload
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };

  // New: upsert reaction for a comment
  static UpsertSupportTicketsUserCommentsReaction = async (payload: {
    id?: number;
    commentId: number;
    emojiCode: string;
  }) => {
    try {
      const res = await axiosInstance.post(
        `SupportTickets/UpsertSupportTicketsUserCommentsReaction`,
        payload
      );
      return successHandler(res);
    } catch (error: any) {
      return errorHandler(error);
    }
  };
}

export default SupportTicketService;
