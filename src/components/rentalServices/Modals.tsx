import type { ReactNode } from "react";

type SuccessStatus = "Approved" | "Published";

const SUCCESS_COPY: Record<SuccessStatus, { verb: string; dateLabel: string }> = {
  Approved: { verb: "accepted", dateLabel: "Order Accepted Date" },
  Published: { verb: "published", dateLabel: "Order Published Date" },
};

const formatDisplayDate = (value?: string | Date) => {
  const dateInstance = typeof value === "string" ? new Date(value) : value ?? new Date();
  return dateInstance.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export const ModalOverlay = ({ children }: { children: ReactNode }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-[6px] px-4">
    {children}
  </div>
);

interface ModalShellProps {
  title?: string;
  onClose: () => void;
  children: ReactNode;
}

export const ModalShell = ({ title, onClose, children }: ModalShellProps) => (
  <div className="w-full max-w-xl rounded-[36px] bg-white px-8 py-10 shadow-[0_40px_90px_rgba(5,6,104,0.18)]">
    <div className={`flex items-center gap-4 ${title ? "justify-between" : "justify-end"}`}>
      {title ? <h3 className="text-xl font-semibold text-primary">{title}</h3> : null}
      <button
        type="button"
        aria-label="Close"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f7f8fd] text-gray-500 transition hover:bg-primary/10 hover:text-primary"
        onClick={onClose}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>
    <div className="mt-8 space-y-6">{children}</div>
  </div>
);

interface StatusSuccessModalProps {
  orderNo: string;
  orderTitle: string;
  status: SuccessStatus;
  onClose: () => void;
  actionDate?: string | Date;
}

export const StatusSuccessModal = ({ orderNo, orderTitle, status, onClose, actionDate }: StatusSuccessModalProps) => {
  const copy = SUCCESS_COPY[status];

  return (
    <ModalShell onClose={onClose}>
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-primary/10 text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-10 w-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <div className="space-y-2">
          <p className="text-lg font-helveticaBold text-primary">Order Number : {orderNo}</p>
          <p className="text-sm text-gray-600">{orderTitle} order has been successfully {copy.verb}.</p>
          <p className="text-xs text-gray-400">{copy.dateLabel} : {formatDisplayDate(actionDate)}</p>
        </div>
        <button
          type="button"
          className="rounded-full bg-primary px-10 py-3 text-sm font-semibold text-white shadow transition hover:bg-[#030447]"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </ModalShell>
  );
};

export type RejectReasonModalMode = "edit" | "view";

interface RejectReasonModalProps {
  reason: string;
  onCancel: () => void;
  mode?: RejectReasonModalMode;
  onReasonChange?: (value: string) => void;
  onSubmit?: () => void;
  orderTitle?: string;
}

export const RejectReasonModal = ({
  reason,
  mode = "edit",
  onCancel,
  onReasonChange,
  onSubmit,
  orderTitle,
}: RejectReasonModalProps) => {
  const isViewMode = mode === "view";

  return (
    <ModalShell title="Reason for Cancellation" onClose={onCancel}>
      <div className="space-y-4">
        {orderTitle ? <p className="text-sm font-semibold text-primary/80">{orderTitle}</p> : null}
        <div>
          <label className="text-sm font-semibold text-primary" htmlFor="reject-reason">
            Reason*
          </label>
          <textarea
            id="reject-reason"
            value={reason}
            onChange={(event) => onReasonChange?.(event.target.value)}
            readOnly={isViewMode}
            className={`mt-2 h-32 w-full rounded-3xl border border-gray-200 bg-[#f7f8fd] px-4 py-3 text-sm text-gray-600 shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/20 ${isViewMode ? "cursor-default focus:ring-0" : "focus:border-primary"
              }`}
            placeholder="Please share the reason for rejecting this order."
          />
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="rounded-full border border-gray-300 px-6 py-2 text-sm font-semibold text-gray-500 transition hover:border-primary hover:text-primary"
            onClick={onCancel}
          >
            {isViewMode ? "Close" : "Cancel"}
          </button>
          {!isViewMode && onSubmit ? (
            <button
              type="button"
              className="rounded-full bg-primary px-10 py-3 text-sm font-semibold text-white shadow transition hover:bg-[#030447]"
              onClick={onSubmit}
            >
              Send
            </button>
          ) : null}
        </div>
      </div>
    </ModalShell>
  );
};

interface DeleteConfirmModalProps {
  itemName: string;
  itemType: string;
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export const DeleteConfirmModal = ({ itemName, itemType, onCancel, onConfirm, isDeleting = false }: DeleteConfirmModalProps) => {
  return (
    <ModalShell onClose={onCancel}>
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-red-100 text-red-600">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-10 w-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </span>
        <div className="space-y-2">
          <p className="text-lg font-semibold text-gray-900">Delete {itemType}</p>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete <span className="font-semibold text-primary">{itemName}</span>? This action cannot be undone.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            className="rounded-full border border-gray-300 px-6 py-2 text-sm font-semibold text-gray-500 transition hover:border-primary hover:text-primary"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-full bg-red-600 px-6 py-2 text-sm font-semibold text-white shadow transition hover:bg-red-700 disabled:opacity-50"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </ModalShell>
  );
};