import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, Input, ModalFooter, Button } from 'reactstrap';

class PromptModal extends Component {
    onConfirm(value) {
        const { hide, promise: { resolve } } = this.props;
        resolve(value);
        hide();
    }

    onCancel(value) {
        const { hide, promise: { reject } } = this.props;
        reject(value);
        hide();
    }

    render() {
        const { open, title, placeholder, value, update } = this.props;
        return (
            <Modal isOpen={open} toggle={e => this.onCancel(value)}>
                <ModalHeader>{title}</ModalHeader>
                <ModalBody>
                    <Input type="text" spellCheck="false" placeholder={placeholder} value={value} onChange={e => update(e.target.value)}/>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={e => this.onConfirm(value)}>Valider</Button>
                    <Button color="secondary" onClick={e => this.onCancel(value)}>Annuler</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default PromptModal;