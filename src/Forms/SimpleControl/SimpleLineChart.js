import React from 'react';
import PropTypes from 'prop-types';
import FalconCardHeader from '../../components/common/FalconCardHeader';

import { Badge, Card, CardBody, Col, Row } from 'reactstrap';
import Flex from '../../components/common/Flex';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getGrays, themeColors, rgbaColor, getPosition, numberFormatter } from '../../helpers/utils';

const getOption = (data, isDark) => {
    const grays = getGrays(isDark);
    return {
        tooltip: {
            triggerOn: 'mousemove',
            trigger: 'axis',
            padding: [7, 10],
            formatter: '{b0}: {c0}',
            backgroundColor: grays.white,
            borderColor: grays['300'],
            borderWidth: 1,
            transitionDuration: 0,
            position(pos, params, dom, rect, size) {
                return getPosition(pos, params, dom, rect, size);
            },
            textStyle: { color: themeColors.dark }
        },
        xAxis: {
            type: 'category',
            data: ['Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8', 'Week 9', 'Week 10', 'Week 11', 'Week 12', 'Week 13'],
            boundaryGap: false,
            splitLine: { show: false },
            axisLine: {
                show: false,
                lineStyle: {
                    color: grays['300'],
                    type: 'dashed'
                }
            },
            axisLabel: { show: false },
            axisTick: { show: false },
            axisPointer: { type: 'none' }
        },
        yAxis: {
            type: 'value',
            splitLine: { show: false },
            axisLine: { show: false },
            axisLabel: { show: false },
            axisTick: { show: false },
            axisPointer: { show: false }
        },
        series: [
            {
                type: 'line',
                lineStyle: {
                    color: themeColors.primary,
                    width: 3
                },
                itemStyle: {
                    color: grays['100'],
                    borderColor: themeColors.primary,
                    borderWidth: 2
                },
                hoverAnimation: true,
                data: data,
                connectNulls: true,
                smooth: 0.6,
                smoothMonotone: 'x',
                symbol: 'circle',
                symbolSize: 8,
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            {
                                offset: 0,
                                color: rgbaColor(themeColors.primary, 0.25)
                            },
                            {
                                offset: 1,
                                color: rgbaColor(themeColors.primary, 0)
                            }
                        ]
                    }
                }
            }
        ],
        grid: { bottom: '2%', top: '0%', right: '10px', left: '10px' }
    };
};
const average = arr => arr.reduce((p, c) => p + c, 0) / arr.length;
const SimpleLineChart = ({ data,title }) => {
    const isDark = true;

    const total = average(data);
    return (
        <Card className="h-md-100">
            <FalconCardHeader className="pb-0" title={title } light={false} titleTag="h6" />
            <CardBody tag={Flex} align="end">
                <Row className="flex-grow-1">
                    <Col className="auto">
                        <div className="fs-4 font-weight-normal text-sans-serif text-700 line-height-1 mb-1">
                            {numberFormatter(total, 1)}
                        </div>
                        <Badge pill color="soft-info" className="fs--2">
                            {
                                total > data[data.length - 1] ?
                                    <FontAwesomeIcon icon="caret-up" className="mr-1" />
                                    : <FontAwesomeIcon icon="caret-down" className="mr-1" />
                            }
                            {Math.round(total - data[data.length - 1] * 100) / 100}
                        </Badge>
                    </Col>
                    <Col xs="align-self-end" className="pl-0">
                        <ReactEchartsCore
                            echarts={echarts}
                            option={getOption(data, isDark)}
                            style={{ width: '20.75rem', minHeight: '5rem', height: '100%' }}
                        />
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
};

SimpleLineChart.propTypes = { data: PropTypes.array.isRequired };

export default SimpleLineChart;
