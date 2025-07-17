import React, { Component } from 'react';
import { Card, CardBody, Col, Label, Row } from 'reactstrap';
import FalconCardHeader from '../../components/common/FalconCardHeader';
import HistoryChart from '../../Pishgam/HistoryChart';
import AnalyticsHistogram from '../Reports/AnalyticsHistogram';
import TreeData from '../Reports/TreeData';
import SimpleLineChart from '../SimpleControl/SimpleLineChart';

export default class AnalyticsReportFormat1 extends Component {
    
    render() {
        return (
            <>
                {this.props.data !== undefined ?
                    <div style={{ direction: 'rtl' }}>
                        <Row className='pb-1'>
                            <Col>
                                <AnalyticsHistogram Data={this.props.data.Data} labResult={this.props.data.labResult} Headers={this.props.data.Headers} type='list' />
                            </Col>
                        </Row>
                        <Row className='pb-1'>
                            <Col className='pr-0' style={{ display: 'flex', flexDirection: 'column' }}>
                                <Row className='pb-1 ' style={{ flex: '1' }}  >
                                    <Col >
                                        <Card className="h-100">
                                            <FalconCardHeader title={this.props.data.Controls[0].title + ': ' + this.props.data.Controls[0].Value.display} >
                                                <Label>{this.props.data.Controls[1].Value.display} </Label>
                                            </FalconCardHeader>
                                            {
                                                this.props.data.labResult !== null ?
                                                    <CardBody dir="ltr" style={{ textAlign: 'left' }}>
                                                        <Row>
                                                            <Col xs="8">
                                                                <Row>
                                                                    <Col>
                                                                        <Label>Test: </Label>
                                                                        <Label tag='h5'>{this.props.data.Controls[2].Value !== null ? this.props.data.Controls[2].Value.display : null}</Label>
                                                                    </Col>
                                                                    <Col>
                                                                        <Label>Your Result: </Label>
                                                                        <Label tag='h4'>{this.props.data.labResult !== null ? this.props.data.labResult.P15 : 0}</Label>
                                                                    </Col>
                                                                </Row>
                                                                <Label>Your Method</Label>
                                                                <Row>
                                                                    {
                                                                        this.props.data.labResult !== null ? (<>
                                                                            <Col><p >{this.props.data.labResult.G1}</p></Col>
                                                                            <Col><p >{this.props.data.labResult.G2}</p></Col>
                                                                            <Col><p >{this.props.data.labResult.G3}</p></Col></>)
                                                                            : null
                                                                    }
                                                                </Row>

                                                            </Col>
                                                            <Col xs="4">
                                                                <Row className='p-1' >
                                                                     Target:
                                                                    {this.props.data.labResult !== null ? this.props.data.labResult.AVG3 : 0}
                                                                </Row>
                                                                <Row className='p-1'>SDI:{
                                                                    this.props.data.labResult.SDI < 5 && this.props.data.labResult.SDI > -5 ? this.props.data.labResult.SDI : 'OOR'}</Row>
                                                                <Row className='p-1'>%Dev:{
                                                                    this.props.data.labResult.SDI < 5 && this.props.data.labResult.SDI > -5 ? this.props.data.labResult.DEV : 'OOR'}</Row>
                                                                <Row className='p-1'>
                                                                    UM:{this.props.data.labResult.UM}
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                    </CardBody>
                                                    : null

                                            }

                                        </Card>
                                    </Col>
                                </Row>
                                <Row className='pb-1'>
                                    <Col>
                                        <HistoryChart title='روند تغییرات SDI' data={[-1.2, 2, 3, 4.3, -2.1, 1.2, -2, -3, 4.3, 2.1]} />
                                    </Col>
                                </Row>
                                <Row className='pb-1'>
                                    <Col>
                                        <SimpleLineChart title='Relative mean % Dev' data={[10.2, 21, 15, 11.3, 12.1, 21, 15, 11.3, 12.1, 23]} />
                                    </Col>
                                </Row>
                            </Col>
                            <Col className='pl-1'>
                                <TreeData chartType='group' Data={this.props.data.GroupResult} />
                            </Col>
                        </Row>
                    </div>
                    : <></>}
            </>
        );
    }
}
