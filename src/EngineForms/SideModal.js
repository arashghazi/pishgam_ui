import React from 'react';
import { Modal } from 'reactstrap';

const SideModal = ({children, isOpen, toggle}) => {
    return (
        <Modal
            isOpen={isOpen}
            toggle={toggle}
            modalClassName="overflow-hidden modal-fixed-right modal-theme"
            className="modal-dialog-vertical"
            contentClassName="vh-100 border-0"
        >
            {children}
        </Modal>
    );
};

export default SideModal;