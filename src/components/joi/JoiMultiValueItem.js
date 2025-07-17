import React, { Component } from 'react';
import { Badge,  Col} from "reactstrap";


export default class JoiMultiValueItem extends Component {

    render() {
        
        return (
            
                <Badge color={'soft-primary'} className="mt-1 mr-2">
                    <Col className="d-inline-flex p-0 m-0">Inline flexbox container!
                        <Col className=" p-0 m-0 pl-1" style={{ cursor: 'pointer' }}>x</Col>
                    </Col>
                </Badge>
            
        );
    }
};
