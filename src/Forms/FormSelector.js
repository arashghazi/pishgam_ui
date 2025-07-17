import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import JoiSearchBox from '../components/joi/JoiSearchBox';
import ObjectClassController from '../Engine/ObjectClassController';
import Flex from '../components/common/Flex';

export default class FormSelector extends Component {
    state = {
        propIsopen: false,
        source: '',
        Forms: null,
        Panels: null
    }
    toggle() {
        this.props.Close(this.props.Modal.source, null);
    }
    async selectionChanged(selectedvalue) {
        await ObjectClassController.LoadAsync(selectedvalue, this);
    }
    Update(datamodel = { Data: '' }) {
        let source = datamodel;
        if (source !== null) {
            this.setState({
                ...this.state,
                Forms: source.Forms
            })
        }
    }
    async componentDidMount() {
        if (this.state.Panels === null) {
            let forms = await ObjectClassController.GetPanelListAsync()
            this.setState({
                ...this.state,
                Panels: forms
            })
        }
    }
    SelectForm(event) {
        let form = this.state.Forms.find((x) => { return x.ID === event.target.value });
        this.props.Close(this.props.Modal.source, form );
    }
    SelectPanel(event) {
        let form = this.state.Panels.find((x) => { return x.ID === event.target.value });
        this.props.Close(this.props.Modal.source, form);
    }
    closeBtn = <button className="close" onClick={this.toggle.bind(this)}>&times;</button>;
    render() {
        
        return (
            <Modal isOpen={this.props.Modal.isOpen}  style={{ width: '800px' }}>
                <ModalHeader toggle={this.toggle.bind(this)} close={this.closeBtn}>انتخاب فرم</ModalHeader>
                <ModalBody>
                    <JoiSearchBox placeHolder="جستجوی کلاس" type='CLASS' onChange={this.selectionChanged.bind(this)} />
                    <hr />
                    <Flex justify="start" wrap align="start" >
                        {this.state.Forms !== null?(
                            this.state.Forms.map((form, index) => (
                                <Button className="m-1" key={form.ID} index={index} value={form.ID} onClick={this.SelectForm.bind(this)} >
                                    {form.Display}
                                </Button>
                            ))
                        ) : <h6>هیچ فرمی یافت نشد</h6>}
                    </Flex>
                    <hr />
                    <Flex justify="start" wrap align="start" >
                        {this.state.Panels !== null ? (
                            this.state.Panels.map((form, index) => (
                                <Button className="m-1" key={form.ID} index={index} value={form.ID} onClick={this.SelectPanel.bind(this)} >
                                    {form.Display}
                                </Button>
                            ))
                        ) : <h6>هیچ پنلی یافت نشد</h6>}
                    </Flex>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={this.toggle.bind(this)}>انصراف</Button>
                </ModalFooter>
            </Modal>
        );
    }
}
