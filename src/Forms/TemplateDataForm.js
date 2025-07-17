import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';
import ButtonIcon from '../components/common/ButtonIcon';
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import FormSelector from './FormSelector';
import FormRouter from './FormRouter';


export default class TemplateDataForm extends Component {
    state = {
        FormID: '',
        modal: {
            isOpen: false,
            source: ''
        }
    }
    Forms;
    isOpen() {
        this.setState({
            ...this.state,
            modal: {
                isOpen: true,
                source: ''
            }
        })
    }
    async ModalClosed(source = '', form) {
        this.setState({
            FormID: form !== null ? form.ID : '',
            modal: {
                isOpen: false,
                source: ''
            }
        });
    }
    render() {
        return (
            <>
                <Row>
                    <ButtonIcon className="m-1" color="falcon-default" size="sm" icon={faSearch} transform="shrink-1" onClick={this.isOpen.bind(this)} />
                </Row>
                <Row>
                    <Col className="m-2" key={this.state.FormID} >
                        <FormRouter source={this.state.FormID} onRef={ref => (this.Forms = ref)} Mode='TempData' />
                    </Col>
                </Row>
                <FormSelector Modal={this.state.modal} Close={this.ModalClosed.bind(this)} />
            </>
        );
    }
}
