import React from 'react';
import {  Col, FormGroup, Input, Label, Row } from 'reactstrap';

const ValueControl = ({ values, itemValue, reportColumn, onChange, title }) => {
    return (
        reportColumn ? <Label>{itemValue?.display}</Label> : <Input bsSize='sm'
            onChange={({ target }) => { onChange(title, { id: target.value, display: values.find(x => x.ID === target.value).DIS }) }}
            type='select' value={itemValue?.id}>
            <option></option>
            {values.map(value => <option value={value.ID} key={value.ID}>{value.DIS}</option>)}
        </Input>
    );
};

const RowValue = ({ test, reportColumn, values, onChange, data }) => {
    let title = test.replace(' ', '-');
    return (<>
        <Row >
            <Col  ><Label>{test}</Label></Col>
            {reportColumn ? <Col  ><ValueControl itemValue={data[title + '1']} title={title + '1'} reportColumn={reportColumn} values={values} onChange={onChange} /></Col> : null}
            <Col ><ValueControl itemValue={data[title + '2']} title={title + '2'} reportColumn={reportColumn} values={values} onChange={onChange} /></Col>
            {reportColumn ? <Col ><ValueControl itemValue={data[title + '3']} title={title + '3'} reportColumn={reportColumn} values={values} onChange={onChange} /></Col> : null}
        </Row>
        <hr className='m-0' />
    </>
    );
};

const ABOTests = ({ values, reportColumn, RH, ABO, onChange, data }) => {
    return (
        <div >
            <Row className='m-4 ' >
                <Col>
                    <FormGroup row>
                        <Label><strong>روش انجام آزمايش: </strong></Label>
                        <Col >
                            <Label><strong>{data?.Way?.display}</strong></Label>
                        </Col>
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup  row>
                        <Label><strong>نوع معرف: </strong></Label>
                        <Col >
                            <Label ><strong>{data?.Type?.display}</strong></Label>
                        </Col>
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col xs='2'>
                    نام آزمایش
                </Col>
                <Col>
                    <Row>
                        <Col>
                            مراحل آزمايش ABO
                        </Col>
                        {reportColumn ? <Col>
                            درجه واکنش گزارش شده
                        </Col> : null}
                        <Col>
                            درجه واکنش مورد انتظار
                        </Col>
                        {reportColumn ? <Col>
                            شرکت سازنده معرف
                        </Col> : null}
                    </Row>
                </Col>
            </Row>
            <hr className='m-0' />
            <Row>
                <Col xs='2' style={{ display: 'flex', alignItems: 'center' }}>
                    ABO
                </Col>
                <Col>
                    <RowValue test='Anti A' values={values} reportColumn={reportColumn} onChange={onChange} data={data} />
                    <RowValue test='Anti B' values={values} reportColumn={reportColumn} onChange={onChange} data={data} />
                    <RowValue test='A1-cells' values={values} reportColumn={reportColumn} onChange={onChange} data={data} />
                    <RowValue test='B-cells' values={values} reportColumn={reportColumn} onChange={onChange} data={data} />
                </Col>
            </Row>

            <Row className='m-4'>
                <Col>
                    <FormGroup row>
                        <Label><strong>تفسیر مورد انتظار ABO:</strong></Label>
                        <Col >
                            {reportColumn ? <Label style={{color:'green'}}><strong>{data?.ABO?.display}</strong></Label> : <Input bsSize='sm' type='select' style={{ width: '150px' }}
                                value={data?.ABO?.id}
                                onChange={({ target }) => { onChange('ABO', { id: target.value, display: ABO.find(x => x.ID === target.value).DIS }) }}
                            >
                                <option></option>
                                {
                                    ABO.map((item) => <option value={item.ID} key={item.ID} >{item.DIS}</option>)
                                }
                            </Input>}
                        </Col>
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup row>
                        <Label><strong>تفسیر گزارش شده ABO:</strong></Label>
                        <Col >
                            <Label style={{color:data?.ABOL?.display===data?.ABO?.display?'green':'red'}}><strong>{data?.ABOL?.display}</strong></Label>
                        </Col>
                    </FormGroup>
                </Col>
            </Row>
            <hr className='mt-0' />

            <Row className='mt-4'>
                <Col xs='2'>
                    نام آزمایش
                </Col>
                <Col>
                    <Row>
                        <Col>
                            آنتی سرم
                        </Col>
                        {reportColumn ? <Col>
                            درجه واکنش
                        </Col> : null}
                        <Col>
                            درجه واکنش مورد انتظار
                        </Col>
                        {reportColumn ? <Col>
                            شرکت سازنده معرف
                        </Col> : null}
                    </Row>
                </Col>
            </Row>
            <hr className='m-0' />
            <Row>
                <Col xs='2' style={{ display: 'flex', alignItems: 'center' }}>
                    RH(D)
                </Col>
                <Col>
                    <RowValue test='Anti D' values={values} reportColumn={reportColumn} onChange={onChange} data={data} />
                    <RowValue test='RH-control' values={values} reportColumn={reportColumn} onChange={onChange} data={data} />
                </Col>
            </Row>
            <Row className='m-4'>
                <Col>
                    <FormGroup row>
                        <Label><strong>تفسیر مورد انتظار  RH(D):</strong></Label>
                        <Col >
                            {reportColumn ? <Label  style={{color:'green'}}><strong>{data?.RHD?.display}</strong></Label> : <Input bsSize='sm' type='select' style={{ width: '150px' }}
                                value={data?.RHD?.id}
                                onChange={({ target }) => { onChange('RHD', { id: target.value, display: RH.find(x => x.ID === target.value).DIS }) }}>
                                <option></option>
                                {
                                    RH.map((item) => <option value={item.ID} key={item.ID} >{item.DIS}</option>)
                                }
                            </Input>}
                        </Col>
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup row>
                        <Label><strong>تفسیر آزمایشگاه RH(D):</strong></Label>
                        <Col >
                            <Label  style={{color:data?.RHD?.display===data?.RHL?.display?'green':'red'}}><strong>{data?.RHL?.display}</strong></Label>
                        </Col>
                    </FormGroup>
                </Col>
            </Row>

        </div>
    );
};

export default ABOTests;