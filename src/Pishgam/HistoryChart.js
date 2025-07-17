import React, { Component } from 'react';
import FalconCardHeader from '../components/common/FalconCardHeader';
import { Badge, Card, CardBody, Col, Row } from 'reactstrap';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
export default class HistoryChart extends Component {

    average = arr => arr.reduce((p, c) => p + c, 0) / arr.length;
    render() {
        let { title, data }=this.props;
        const total = this.average(data);
        return (
            <Card className="h-md-100">
                <FalconCardHeader className="pb-0" title={title} light={false} titleTag="h6" />
                <CardBody dir='ltr' >
                    <Row>
                        <Col xs='auto' className="auto">
                            Relative mean SDI(RMSDI): {total}
                            <Badge pill color="soft-info" className="fs--2">
                                Current SDI :{Math.round(total - data[data.length - 1] * 100) / 100}
                                {
                                    total > data[data.length - 1] ?
                                        <FontAwesomeIcon icon="caret-up" className="mr-1" />
                                        : <FontAwesomeIcon icon="caret-down" className="mr-1" />
                                }
                                
                            </Badge>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="p-0">
                            <ReactEchartsCore className="p-0 m-0"
                                echarts={echarts}
                                option={{
                                    xAxis: {
                                        type: 'category',
                                        data: ['9701', '9702', '9703', '9801', '9802', '9803', '9901', '9902', '9903', '140001']
                                    },
                                    yAxis: {
                                        type: 'value'
                                    },
                                    series: [
                                        {
                                            data: this.props.data,
                                            type: 'scatter',
                                            itemStyle: {
                                                normal: {
                                                    color: ['#2c7be5']
                                                }
                                            }
                                        }
                                    ]
                                }}
                            />
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        );
    }
}

