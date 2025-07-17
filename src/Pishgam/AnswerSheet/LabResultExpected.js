import React from 'react';
import { CardTitle, Col, Input, Row, Table } from 'reactstrap';
import FormManager from '../../EngineForms/FormManager';

const LabResultExpected = ({ formId, Data, Expresult }) => {
    return (
        <Row>
            <Col>
                <FormManager isReadonly={true} CardOff formId={formId} Data={Data} />
            </Col>
            <Col xs='auto' >
                <Table hover striped>
                    <thead>
                        <tr>
                            <th>
                                نتیجه مورد انتظار
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Expresult?.Rows?.map((result,index) => <tr key={result?.Test?.id+'-'+index}><td>{result?.Diagnosis?.display}</td></tr>)
                        }
                    </tbody>
                </Table>

            </Col>
        </Row>
    );
};

export default LabResultExpected;