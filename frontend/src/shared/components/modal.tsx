import { useEffect, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  hasCloseBtn?: boolean;
  className?: string;
  onClose?: () => void;
  children: React.ReactNode;
}

function Modal({
  isOpen,
  hasCloseBtn = true,
  className,
  onClose,
  children,
}: ModalProps) {
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    if (isOpen && !modal.open) modal.showModal();
    if (!isOpen && modal.open) modal.close();
  }, [isOpen]);

  return (
    <dialog
      ref={modalRef}
      className={className}
      onClose={() => onClose?.()}
      onKeyDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        // a click on the dark area around the content lands on the dialog itself
        if (e.target === e.currentTarget) modalRef.current?.close();
      }}
    >
      {hasCloseBtn && (
        <button
          type="button"
          className="modal-close-btn"
          onClick={() => modalRef.current?.close()}
        >
          Close
        </button>
      )}

      {children}
    </dialog>
  );
}

export default Modal;
