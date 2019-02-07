import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

class ConfirmModal extends Component {
    constructor(props) {
        super(props);

        this.onConfirm = this.onConfirm.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }

    onConfirm() {
        const { hide, promise: { resolve } } = this.props;
        resolve();
        hide();
    }

    onCancel() {
        const { hide, promise: { reject } } = this.props;
        reject();
        hide();
    }

    render() {
        const { open, title, body } = this.props;
        return (
            <Modal isOpen={open} toggle={this.onCancel}>
                <ModalHeader>{title}</ModalHeader>
                <ModalBody>
                    <p>{body}</p>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.onConfirm}>Oui</Button>
                    <Button color="secondary" onClick={this.onCancel}>Non</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default ConfirmModal;