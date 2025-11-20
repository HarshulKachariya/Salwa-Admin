import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ComanTable from "../components/common/ComanTable";
import type {
  TableColumn,
  ActionButton,
  SortState,
} from "../components/common/ComanTable";
import DashboardLayout from "../layouts/DashboardLayout";
import SupportTicketService from "../services/SupportTicketService";
import {
  getStatusName,
  getStatusBadgeClass,
  formatDate,
} from "../utils/statusEnum";

interface TicketRow {
  ticketId: number;
  id?: string; // optional legacy
  createdDate?: string;
  categoryId?: number;
  serviceId?: number;
  subServiceId?: number | null;
  issueTitle?: string;
  issueDescription?: string | null;
  mediaFilePath?: string | null;
  statusId?: number | null;
  firstName?: string | null;
  lastName?: string | null;
  comments?: any[];
}

const SupportTicketSystem: React.FC = () => {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");

  // Table state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortState, setSortState] = useState<SortState[]>([]);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState<TicketRow[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketRow | null>(null);
  const [modalStatusId, setModalStatusId] = useState<number | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // New: reply state
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  // New: reaction state
  const [openReactionFor, setOpenReactionFor] = useState<number | null>(null);
  const [openAllFor, setOpenAllFor] = useState<number | null>(null);
  const [sendingReaction, setSendingReaction] = useState(false);

  // quick emojis
  const EMOJIS = ["👍", "❤️", "😂", "😮", "😢"];
  // full emoji set shown when user clicks plus
  const ALL_EMOJIS = [
    "👍",
    "👎",
    "❤️",
    "💔",
    "😂",
    "😅",
    "😊",
    "😮",
    "😲",
    "😢",
    "😭",
    "😡",
    "👏",
    "🙌",
    "🤝",
    "🎉",
    "🔥",
    "⭐",
    "💯",
    "➕",
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const orderBy = sortState[0]?.key || "";
      const orderDir = sortState[0]?.order || "";

      const res: any = await SupportTicketService.GetAllSupportTickets({
        PageNumber: page,
        PageSize: pageSize,
        OrderByColumn: orderBy,
        OrderDirection: orderDir,
      });

      // Expecting the API to return an object with data and totalCount (adjust mapping if different)
      if (res && res.data) {
        // If API returns nested data, adjust accordingly
        const items = Array.isArray(res.data) ? res.data : res.data.items || [];
        const total =
          typeof res.totalCount === "number"
            ? res.totalCount
            : res.data.totalCount || items.length;

        // Map API items to TicketRow shape — adjust fields based on actual API response
        const mapped: TicketRow[] = items.map((it: any) => ({
          ticketId: it.ticketId,
          createdDate: it.createdDate,
          categoryId: it.categoryId,
          serviceId: it.serviceId,
          subServiceId: it.subServiceId ?? null,
          issueTitle: it.issueTitle,
          issueDescription: it.issueDescription ?? null,
          mediaFilePath: it.mediaFilePath ?? null,
          statusId: it.statusId ?? null,
        }));

        setData(mapped);
        setTotalCount(total);
      } else {
        setData([]);
        setTotalCount(0);
      }
    } catch (err) {
      setData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // fetch when page/pageSize/sort/query changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, sortState, query]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // Columns and actions
  const columns: TableColumn<TicketRow>[] = [
    {
      label: "Ticket Id",
      value: (r) => `#${String(r.ticketId ?? "").padStart(4, "0")}`,
      sortKey: "ticketId",
      isSort: true,
    },
    {
      label: "Date",
      value: (r) => formatDate(r.createdDate || "", "display"),
      sortKey: "createdDate",
      isSort: true,
    },
    {
      label: "Categories",
      value: (r) => r.categoryId ?? "-",
      sortKey: "categoryId",
      isSort: true,
    },
    {
      label: "Service",
      value: (r) => r.serviceId ?? "-",
      sortKey: "serviceId",
      isSort: true,
    },
    { label: "Sub-Service", value: (r) => (r.subServiceId ?? "-") as any },
    { label: "Issue Title", value: (r) => r.issueTitle ?? "" },
    { label: "Issue Description", value: (r) => r.issueDescription ?? "" },
    {
      label: "Status",
      value: (r) => (
        <span
          className={`${getStatusBadgeClass(
            r.statusId ?? 0
          )} px-2 inline-flex text-xs leading-5 font-semibold rounded-full`}
        >
          {r.statusId != null ? getStatusName(r.statusId) : "Unknown"}
        </span>
      ),
      sortKey: "statusId",
      isSort: true,
    },
  ];

  const actions: ActionButton<TicketRow>[] = [
    {
      label: "View",
      iconType: "view",
      onClick: async (row) => {
        try {
          setLoading(true);
          const res: any =
            await SupportTicketService.GetSupportTicketsByTicketId(
              row.ticketId
            );
          if (res && res.data) {
            // res.data might be an array or single object — normalize
            const detail = Array.isArray(res.data) ? res.data[0] : res.data;
            const mappedDetail: TicketRow = {
              ticketId: detail.ticketId,
              createdDate: detail.createdDate,
              categoryId: detail.categoryId,
              serviceId: detail.serviceId,
              subServiceId: detail.subServiceId ?? null,
              issueTitle: detail.issueTitle,
              issueDescription: detail.issueDescription ?? null,
              mediaFilePath: detail.mediaFilePath ?? null,
              statusId: detail.statusId ?? null,
              firstName: detail.firstName ?? null,
              lastName: detail.lastName ?? null,
              comments: Array.isArray(detail.comments) ? detail.comments : [],
            };
            setSelectedTicket(mappedDetail);
            setModalStatusId(mappedDetail.statusId ?? null);
            // Clear reply input when opening details
            setReplyText("");
            setModalOpen(true);
          }
        } catch (err) {
          // ignore
        } finally {
          setLoading(false);
        }
      },
    },
  ];

  // Analytics placeholders
  const analytics = [
    { title: t("support.totalPending") || "Total Pending", value: 244 },
    { title: t("support.totalInProgress") || "Total In-Progress", value: 22 },
    { title: t("support.totalResolved") || "Total Resolved", value: 473 },
    { title: t("support.totalTicket") || "Total Ticket", value: 1200 },
  ];

  // Helper: parse various possible timestamp fields from a comment and return formatted string or empty
  const formatCommentDate = (c: any) => {
    if (!c) return "";
    const raw =
      c.createdDate ??
      c.createdOn ??
      c.createdAt ??
      c.createdUtc ??
      c.date ??
      c.createdOnDate ??
      c.CreatedDate ??
      null;
    if (!raw) return "";

    let d: Date | null = null;
    if (raw instanceof Date) d = raw;
    else if (typeof raw === "number") d = new Date(raw);
    else if (typeof raw === "string") {
      // handle numeric strings (epoch) and ISO strings
      const asNum = Number(raw);
      d = !Number.isNaN(asNum) ? new Date(asNum) : new Date(raw);
    }

    if (d && !isNaN(d.getTime())) {
      // formatDate expects a string; pass ISO to be safe
      return formatDate(d.toISOString(), "display");
    }
    return "";
  };

  // Updated: send reaction toggles add/remove and updates local comment using response if available
  const sendReaction = async (commentIndex: number, comment: any, emoji: string) => {
    if (!selectedTicket) return;
    setSendingReaction(true);

    try {
      // determine commentId
      let commentId = comment.commentId ?? comment.id ?? comment.commentID ?? null;

      // If comment is a string or has no id, create it first
      if (!commentId) {
        const commentText =
          typeof comment === "string"
            ? comment
            : comment.issueComment || comment.comment || comment.message || comment.text || "";

        const createRes: any = await SupportTicketService.UpsertSupportTicketsUserComment({
          TicketId: selectedTicket.ticketId,
          Comment: commentText,
        });

        const created = createRes && createRes.data ? createRes.data : createRes;
        const newId =
          (created && (created.commentId ?? created.id ?? created.commentID ?? created.CommentId)) ?? null;

        if (newId == null) {
          console.error("Could not obtain created comment id for reaction", createRes);
          setSendingReaction(false);
          return;
        }

        commentId = newId;
        const newCommentObj = {
          ...(typeof created === "object" ? created : {}),
          issueComment: commentText,
          createdDate: (created && (created.createdDate || created.createdOn)) ?? new Date().toISOString(),
          commentId,
        };

        setSelectedTicket((prev) => {
          if (!prev) return prev;
          const comments = Array.isArray(prev.comments) ? [...prev.comments] : [];
          comments[commentIndex] = newCommentObj;
          return { ...prev, comments };
        });

        comment = newCommentObj;
      }

      // Call reaction API
      const payload = { id: 0, commentId, emojiCode: emoji };
      const res: any = await SupportTicketService.UpsertSupportTicketsUserCommentsReaction(payload);

      // If API returns updated reactions, use them; otherwise toggle locally
      let updatedReactions: any[] | null = null;
      if (res && res.data) {
        // attempt to find reactions in response
        updatedReactions =
          res.data.reactions ??
          res.data.Reactions ??
          (res.data.comment && (res.data.comment.reactions ?? res.data.comment.Reactions)) ??
          null;
      }

      setSelectedTicket((prev) => {
        if (!prev) return prev;
        const comments = Array.isArray(prev.comments) ? [...prev.comments] : [];
        const target = { ...(comments[commentIndex] || {}) };

        if (updatedReactions) {
          // normalize to array of {emojiCode,...}
          target.reactions = updatedReactions;
        } else {
          // toggle locally: remove one occurrence of emoji if present, else add
          const existing = Array.isArray(target.reactions) ? [...target.reactions] : [];
          const idx = existing.findIndex((r: any) => (r.emojiCode ?? r.emoji ?? r) === emoji);
          if (idx >= 0) {
            existing.splice(idx, 1);
          } else {
            existing.push({ emojiCode: emoji });
          }
          target.reactions = existing;
        }

        comments[commentIndex] = target;
        return { ...prev, comments };
      });
    } catch (err) {
      console.error("sendReaction error:", err);
    } finally {
      setSendingReaction(false);
      setOpenReactionFor(null);
      setOpenAllFor(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 min-h-[calc(100vh-80px)]">
        <div className="flex items-center justify-between mb-6">
          <div />
          <div className="w-[420px]">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder={t("common.search") || "Search here"}
              className="w-full rounded-md p-3 border border-gray-200 bg-white"
              aria-label={t("common.search") || "Search"}
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {analytics.map((a, idx) => (
            <div
              key={idx}
              className="bg-white rounded-md p-4 shadow flex flex-col items-start"
            >
              <div className="text-2xl font-bold">{a.value}</div>
              <div className="text-sm text-gray-500 mt-2">{a.title}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-md p-4 shadow">
          <ComanTable
            columns={columns}
            data={data}
            actions={actions}
            page={page}
            totalPages={totalPages}
            totalCount={totalCount}
            onPageChange={(p) => setPage(p)}
            sortState={sortState}
            onSortChange={(s) => setSortState(s)}
            pageSize={pageSize}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
            loading={loading}
          />
        </div>

        {/* Ticket details modal */}
        {modalOpen && selectedTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
            <div className="w-[760px] max-w-full bg-white rounded-lg p-6 relative">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                aria-label="Close"
              >
                ×
              </button>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedTicket.firstName || selectedTicket.lastName
                      ? `${selectedTicket.firstName ?? ""} ${selectedTicket.lastName ?? ""}`.trim()
                      : `Ticket #${String(selectedTicket.ticketId)}`}
                  </h3>
                  <div className="text-sm text-gray-500">
                    Ticket #{String(selectedTicket.ticketId)} • Date:{" "}
                    {formatDate(selectedTicket.createdDate || "", "display")}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={modalStatusId ?? selectedTicket?.statusId ?? ""}
                    onChange={(e) => setModalStatusId(Number(e.target.value))}
                    className="border rounded p-2"
                  >
                    <option value="">Select Status</option>
                    <option value="99">Pending</option>
                    <option value="100">Approved</option>
                    <option value="101">Rejected</option>
                    <option value="102">Published</option>
                    <option value="103">Expired</option>
                    <option value="104">FullFilled</option>
                    <option value="105">Approved By Government</option>
                  </select>

                  <button
                    onClick={async () => {
                      if (!selectedTicket || modalStatusId == null) return;
                      setUpdatingStatus(true);
                      try {
                        const res: any =
                          await SupportTicketService.UpdateSupportTicketStatus({
                            TicketId: selectedTicket.ticketId,
                            StatusId: modalStatusId,
                          });
                        // On success, update local ticket status and refresh table
                        if (res && res.success !== false) {
                          setSelectedTicket({
                            ...selectedTicket,
                            statusId: modalStatusId,
                          });
                          // Update in data list
                          setData((prev) =>
                            prev.map((d) =>
                              d.ticketId === selectedTicket.ticketId
                                ? { ...d, statusId: modalStatusId }
                                : d
                            )
                          );
                        }
                      } catch (err) {
                        // ignore — error handled by service
                      } finally {
                        setUpdatingStatus(false);
                      }
                    }}
                    className="px-3 py-2 bg-black text-white rounded-md"
                    disabled={updatingStatus}
                  >
                    {updatingStatus ? "Updating..." : "Update"}
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="px-3 py-2 bg-black text-white rounded-md"
                  >
                    Print
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <select className="border p-2 rounded" disabled>
                  <option>{selectedTicket.categoryId ?? "Category"}</option>
                </select>
                <select className="border p-2 rounded" disabled>
                  <option>{selectedTicket.serviceId ?? "Service"}</option>
                </select>
                <select className="border p-2 rounded" disabled>
                  <option>
                    {selectedTicket.subServiceId ?? "Sub Service"}
                  </option>
                </select>
              </div>

              <div className="mb-3">
                <input
                  className="w-full border rounded p-2 bg-gray-50"
                  value={selectedTicket.issueTitle ?? ""}
                  readOnly
                />
              </div>

              <div className="mb-4">
                <textarea
                  className="w-full border rounded p-2 bg-gray-50 h-24"
                  value={selectedTicket.issueDescription ?? ""}
                  readOnly
                />
              </div>

              <div className="mb-4">
                <div className="flex gap-3 flex-wrap">
                  {(selectedTicket.mediaFilePath || "")
                    .split(",")
                    .filter(Boolean)
                    .map((m, i) => (
                      <div
                        key={i}
                        className="w-[150px] h-[100px] border rounded flex items-center justify-center overflow-hidden bg-gray-100"
                      >
                        <img
                          src={`/${m}`}
                          alt={`media-${i}`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Conversation</h4>
                <div className="space-y-3 max-h-48 overflow-auto mb-3">
                  {(selectedTicket.comments && selectedTicket.comments.length > 0) ? (
                    selectedTicket.comments.map((c: any, idx: number) => {
                      const text = typeof c === 'string' ? c : (c.issueComment || c.comment || c.message || c.text || JSON.stringify(c));
                      const created = formatCommentDate(c);
                      const sender = typeof c === 'object' && (c.firstName || c.name || c.createdByName) ? (c.firstName || c.name || c.createdByName) : null;
                      const isCurrentUser = false; // you can set logic to align right/left if you have current user id

                      return (
                        <div key={idx} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                          {!isCurrentUser && (
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-3">{(sender && sender[0]) || 'U'}</div>
                          )}
                          <div>
                            <div className={`p-3 rounded ${isCurrentUser ? 'bg-blue-100' : 'bg-gray-100'}`}>
                              {text}
                            </div>

                            <div className="flex items-center gap-3 mt-1">
                              {/* timestamp */}
                              {created && <div className="text-xs text-gray-400">{created}</div>}

                              {/* reaction summary (simple) */}
                              {Array.isArray(c.reactions) && c.reactions.length > 0 && (
                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                  {c.reactions.slice(0, 5).map((r: any, ri: number) => (
                                    <span key={ri} className="px-1">{r.emojiCode ?? r.emoji ?? r}</span>
                                  ))}
                                  <span className="text-gray-400">({c.reactions.length})</span>
                                </div>
                              )}

                              {/* quick picker toggle */}
                              <button
                                onClick={() => { setOpenAllFor(null); setOpenReactionFor(openReactionFor === idx ? null : idx); }}
                                className="text-sm text-gray-500"
                                aria-label="React"
                                type="button"
                              >
                                😊
                              </button>

                              {/* plus opens full picker */}
                              <button
                                onClick={() => { setOpenReactionFor(null); setOpenAllFor(openAllFor === idx ? null : idx); }}
                                className="text-sm text-gray-500"
                                aria-label="More emojis"
                                type="button"
                              >
                                ➕
                              </button>

                              {/* inline quick emoji picker */}
                              {openReactionFor === idx && (
                                <div className="absolute z-20 mt-8 bg-white border rounded p-2 shadow flex gap-2">
                                  {EMOJIS.map((e) => (
                                    <button
                                      key={e}
                                      onClick={() => sendReaction(idx, c, e)}
                                      disabled={sendingReaction}
                                      className="text-lg"
                                      type="button"
                                      aria-label={`React with ${e}`}
                                    >
                                      {e}
                                    </button>
                                  ))}
                                </div>
                              )}

                              {/* full emoji grid */}
                              {openAllFor === idx && (
                                <div className="absolute z-30 mt-8 bg-white border rounded p-3 shadow grid grid-cols-8 gap-2 max-h-40 overflow-auto">
                                  {ALL_EMOJIS.map((e) => (
                                    <button
                                      key={e}
                                      onClick={() => sendReaction(idx, c, e)}
                                      disabled={sendingReaction}
                                      className="text-lg p-1"
                                      type="button"
                                      aria-label={`React with ${e}`}
                                    >
                                      {e}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          {isCurrentUser && (
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center ml-3">U</div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-gray-500">No conversation yet</div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    className="flex-1 border rounded p-2"
                    placeholder="Reply"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    aria-label="Reply"
                  />
                  <button
                    className="px-4 py-2 bg-black text-white rounded"
                    onClick={async () => {
                      if (!selectedTicket) return;
                      const text = replyText.trim();
                      if (!text) return;
                      setSendingReply(true);
                      try {
                        const payload = {
                          TicketId: selectedTicket.ticketId,
                          Comment: text,
                        };

                        // Direct service call (uses shared axiosInstance inside service)
                        const res: any =
                          await SupportTicketService.UpsertSupportTicketsUserComment(
                            payload
                          );

                        // on success, append to comments locally for instant UI update
                        if (res && res.success !== false) {
                          const newComment = {
                            issueComment: text,
                            createdDate: new Date().toISOString(),
                            firstName: "You",
                          };
                          setSelectedTicket((prev) =>
                            prev
                              ? { ...prev, comments: [...(prev.comments || []), newComment] }
                              : prev
                          );
                          setReplyText("");
                        } else {
                          console.error("Upsert comment failed:", res);
                        }
                      } catch (err) {
                        console.error("Send comment unexpected error:", err);
                      } finally {
                        setSendingReply(false);
                      }
                    }}
                    disabled={sendingReply || replyText.trim() === ""}
                  >
                    {sendingReply ? "Sending..." : "Send"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SupportTicketSystem;
