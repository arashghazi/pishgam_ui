import React, { Component, Fragment } from 'react';
import { CardBody, InputGroup, Button, CustomInput, Card, Row,Col } from 'reactstrap';
import ButtonIcon from '../components/common/ButtonIcon';
import FalconCardHeader from '../components/common/FalconCardHeader';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, { PaginationProvider, PaginationListStandalone } from 'react-bootstrap-table2-paginator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
export default class InstanceDataList extends Component {
    state = {
        isSelected: false,
        
    }
    render() {
        return (
            <Card className="mb-3">
                <FalconCardHeader title="درخواستها" light={false}>
                    {this.state.isSelected ? (
                        <InputGroup size="sm" className="input-group input-group-sm">
                            <CustomInput type="select" id="bulk-select">
                                <option>Bulk actions</option>
                                <option value="Refund">Refund</option>
                                <option value="Delete">Delete</option>
                                <option value="Archive">Archive</option>
                            </CustomInput>
                            <Button color="falcon-default" size="sm" className="ml-2">
                                Apply
                            </Button>
                        </InputGroup>
                    ) : (
                        <Fragment>
                            <ButtonIcon icon="plus" transform="shrink-3 down-2" color="falcon-default" size="sm">
                            جدید
                            </ButtonIcon>
                        </Fragment>
                    )}
                </FalconCardHeader>
                <CardBody className="p-0">
                    
                </CardBody>
            </Card>
        );
    }
}
