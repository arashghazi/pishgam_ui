import React from 'react';
import { Col, FormGroup, Input, Label, Row } from 'reactstrap';
import { ThemeDivider } from '../../../EngineForms/ThemeControl';

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
        </Row>
        <hr className='m-0' />
    </>
    );
};

const Crosstest = ({ values, reportColumn, Crossmatch, onChange, data }) => {
    return (
        <div >
            {reportColumn ? <div className='m-4 '><Row  >
                <Col>
                    <FormGroup row>
                        <Label><strong>روش انجام آزمایش: </strong></Label>
                        <Col >
                            <Label><strong>{data?.Way?.display}</strong></Label>
                        </Col>
                    </FormGroup>
                </Col>
            </Row>
            <ThemeDivider>شرکت سازنده معرف در هر آنتی سرم</ThemeDivider>
                <Row>
                    <Col>
                        <FormGroup row>
                            <Label><strong>AHG: </strong></Label>
                            <Col >
                                <Label><strong>{data?.AHG?.display}</strong></Label>
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup row>
                            <Label><strong>Liss: </strong></Label>
                            <Col >
                                <Label><strong>{data?.Liss?.display}</strong></Label>
                            </Col>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormGroup row>
                            <Label><strong>Albumin: </strong></Label>
                            <Col >
                                <Label><strong>{data?.Albumin?.display}</strong></Label>
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup row>
                            <Label><strong>IgG control cell: </strong></Label>
                            <Col >
                                <Label><strong>{data?.IgG?.display}</strong></Label>
                            </Col>
                        </FormGroup>
                    </Col>
                </Row>
            </div> : null}
            <Row>
                <Col xs='2'>
                    نام آزمایش
                </Col>
                <Col>
                    <Row>
                        <Col>
                            مرحله آزمايش
                        </Col>
                        {reportColumn ? <Col>
                            درجه واکنش گزارش شده
                        </Col> : null}
                        <Col>
                            درجه واکنش مورد انتظار
                        </Col>
                    </Row>
                </Col>
            </Row>
            <hr className='m-0' />
            <Row>
                <Col xs='2' style={{ display: 'flex', alignItems: 'center' }}>
                    Crossmatch
                </Col>
                <Col>
                    <RowValue test='RT' values={values} reportColumn={reportColumn} onChange={onChange} data={data} />
                    <RowValue test='Alb/LISS' values={values} reportColumn={reportColumn} onChange={onChange} data={data} />
                    <RowValue test='AHG' values={values} reportColumn={reportColumn} onChange={onChange} data={data} />
                    <RowValue test='CC' values={values} reportColumn={reportColumn} onChange={onChange} data={data} />
                </Col>
            </Row>

            <Row className='m-4'>
                <Col>
                    <FormGroup row>
                        <Label><strong>تفسیر مورد انتظار :</strong></Label>
                        <Col >
                            {reportColumn ? <Label style={{ color: 'green' }}><strong>{data?.Crossmatch?.display}</strong></Label> : <Input bsSize='sm' type='select' style={{ width: '150px' }}
                                value={data?.Crossmatch?.id}
                                onChange={({ target }) => { onChange('Crossmatch', { id: target.value, display: Crossmatch.find(x => x.ID === target.value).DIS }) }}
                            >
                                <option></option>
                                {
                                    Crossmatch.map((item) => <option value={item.ID} key={item.ID} >{item.DIS}</option>)
                                }
                            </Input>}
                        </Col>
                    </FormGroup>
                </Col>
                {reportColumn ? <Col>
                    <FormGroup row>
                        <Label><strong>تفسیر آزمایشگاه :</strong></Label>
                        <Col >
                            <Label style={{ color: data?.CrossmatchL?.display === data?.Crossmatch?.display ? 'green' : 'red' }}><strong>{data?.CrossmatchL?.display}</strong></Label>
                        </Col>
                    </FormGroup>
                </Col> : null}
            </Row>
        </div>
    );
};

export default Crosstest;