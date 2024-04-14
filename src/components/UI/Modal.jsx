import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

function Modal({ isOpen, onClose, children }) {
  const dialogRef = useRef();

  useEffect(() => {
    if (isOpen) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [isOpen]);

  // closing the modal when the mouse is cliked outside modals visible part
  const handleClickedOutside = (e) => {
    e.stopPropagation();
    if (dialogRef.current === e.target) {
      onClose();
    }
  };

  return (
    <>
      {createPortal(
        <dialog
          ref={dialogRef}
          onClose={onClose}
          onClick={handleClickedOutside}
          className=" backdrop:bg-[rgba(0,0,0,0.3)] outline-none bg-transparent"
        >
          {children}
        </dialog>,
        document.getElementById("modal")
      )}
    </>
  );
}

export default Modal;
