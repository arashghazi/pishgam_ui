import React, { Component } from 'react';
import ButtonIcon from '../../components/common/ButtonIcon';
import { faSearch, faPlus, faCog, faTrash, faSave } from '@fortawesome/free-solid-svg-icons'
import Flex from '../../components/common/Flex';
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, CardTitle, ButtonGroup, Input, Button, CardBody, CustomInput } from 'reactstrap';



export default class PanelRow extends Component {
    state = { dropdownOpen: false, rowindex: null }
    AddSection() {
        this.props.AddSection(this.props.rowindex);
    }
    isOpen(event) {
        this.props.isOpen(event.currentTarget.value)
    }
    EditSection(secindex, value) {
        this.props.EditSection(this.props.rowindex, secindex, 'Editable', !value)
    }
    
    Remove(a) {

    }
    render() {
        return (
            <>
                <Row>
                    {this.props.row.sections.map((section, index) =>
                        <Col key={this.props.rowindex + '-' + index} >
                            <Flex justify="center" align="center" style={{ height: this.props.row.height }}>
                                <label className="m-1" >{section.title} {index}</label>
                                <ButtonIcon className="m-1" color="falcon-default" size="sm" value={this.props.rowindex + '-' + index} icon={faSearch} transform="shrink-1" onClick={this.isOpen.bind(this)} />
                                <ButtonIcon className="m-1" color="falcon-default" size="sm" value={index} icon={faPlus} transform="shrink-1" onClick={this.AddSection.bind(this)} />
                                <ButtonIcon className="m-1" color="falcon-default" size="sm" value={index} icon={faCog} transform="shrink-1"
                                    onClick={() => this.setState({ ...this.state, dropdownOpen: !this.state.dropdownOpen })} />

                            </Flex>
                            <Dropdown key={this.props.rowindex + '-' + index}  isOpen={this.state.dropdownOpen} toggle={() => this.setState({ ...this.state, dropdownOpen: this.state.dropdownOpen })} className="nopadding" >
                                <DropdownToggle
                                    tag="div"
                                    data-toggle="dropdown" aria-expanded={this.state.dropdownOpen}
                                >

                                </DropdownToggle>
                                <DropdownMenu >
                                    {
                                        <>
                                            <CardTitle>
                                                <Flex className="p-1" justify="between" align="end">
                                                    <div>{"تنظیمات قسمت"}</div>
                                                    <div>
                                                        <ButtonIcon color="falcon-default" className="text-danger" size="sm" icon={faTrash}
                                                            transform="shrink-1" onClick={this.Remove.bind(this, this.props.rowindex)} />
                                                    </div>
                                                </Flex>
                                            </CardTitle>
                                            <CardBody>
                                                <CustomInput
                                                    type="checkbox"
                                                    id={this.props.rowindex + '-' + index}
                                                    checked={section !== null ? section.Editable : false}
                                                    label='امکان تغییر'
                                                    className="mb-0"
                                                    onChange={this.EditSection.bind(this, index, section.Editable)}
                                                />

                                            </CardBody>
                                            <Flex className="p-1" justify="end" align="end">
                                                <div>
                                                    <ButtonIcon color="falcon-default" size="sm" icon={faSave} transform="shrink-1"
                                                        onClick={() => this.setState({ ...this.state, dropdownOpen: false })} />
                                                </div>
                                            </Flex>
                                        </>
                                    }
                                </DropdownMenu>
                            </Dropdown>
                        </Col>)}
                </Row>
            </>
        );
    }
}
