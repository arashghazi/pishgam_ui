import ReactEchartsCore from 'echarts-for-react/lib/core';
import React, { Component } from 'react';
import {  Card, CardBody } from 'reactstrap';
import FalconCardHeader from '../../components/common/FalconCardHeader';
import Flex from '../../components/common/Flex';
import { getGrays, getPosition, rgbaColor, themeColors } from '../../helpers/utils';
import * as echarts from 'echarts';
import ButtonIcon from '../../components/common/ButtonIcon';
import { faChartBar } from '@fortawesome/free-regular-svg-icons';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';
export default class AnalyticsHistogram extends Component {
    state = {
        data: [],
        chartType: 'bar',
        perProp: null, labresult : {
            value:0,
            x: 0,
            y: 0
        }
    }
    colors = ['#2c7be5', '#a496de', '#ffc19c'];
    LoadData() {
        if (this.props.Data !== []) {
            let result = this.props.Data;
            if (result !== undefined) {
                let list = [["بازه", ...this.props.Headers]];
                let labresult = {
                    value: 0,
                    x: 0,
                    y: 0
                }
                console.log(result, this.props.Headers)
                result.map((item,index) => {
                    list = [...list, [item.leveldis, item.QTY1, item.QTY2, item.QTY3]]
                    let domain = item.leveldis.replace('[', '').replace(')', '').split(',');
                    if (parseFloat(domain[0]) <= this.props.labResult.P15 && this.props.labResult.P15 < parseFloat(domain[1])) {
                        labresult = {
                            value: this.props.labResult.P15,
                            x: index,
                            y: item.QTY1
                        }
                    }
                });
                if (result !== null) {
                    this.setState({
                        ...this.state,
                        data: list,
                        perProp: this.props.Data,
                        labresult: labresult
                    })
                }
            }
        }

    }
    componentDidUpdate() {
        if (this.props.Data !== [] && this.props.Data !== this.state.perProp)
            this.LoadData();
    }
    getOption = (data, colors, isDark) => {
        const data0 = data.length > 0 ? data[0] : [];
        const grays = getGrays(isDark);
        return {
            dataset: { source: data },
            tooltip: {
                trigger: 'item',
                padding: [7, 10],
                backgroundColor: grays.white,
                borderColor: grays['300'],
                borderWidth: 1,
                textStyle: { color: grays.dark },
                transitionDuration: 0,
                position(pos, params, dom, rect, size) {
                    return getPosition(pos, params, dom, rect, size);
                }
            },
            legend: {
                data: data0.slice(1),
                left: 'left',
                itemWidth: 10,
                itemHeight: 10,
                borderRadius: 0,
                icon: 'circle',
                inactiveColor: grays['500'],
                textStyle: { color: grays['1100'] }
            },
            xAxis: {
                type: 'category',
                axisLabel: { color: grays['400'] },
                axisLine: {
                    lineStyle: {
                        color: grays['300'],
                        type: 'solid'
                    }
                },
                axisTick: false,
                boundaryGap: true
            },
            yAxis: {
                axisPointer: { type: 'none' },
                axisTick: 'none',
                splitLine: {
                    lineStyle: {
                        color: grays['300'],
                        type: 'solid'
                    }
                },
                axisLine: { show: false },
                axisLabel: { color: grays['400'] }
            },
            series: data0.slice(1).map((value, index) => {
                let result = ({
                    type: this.state.chartType,
                    barWidth: '12%',
                    barGap: '30%',
                    label: { normal: { show: false } },
                    z: 10,
                    smooth: 0.3,
                    itemStyle: {
                        normal: {
                            barBorderRadius: [10, 10, 0, 0],
                            color: colors[index]
                        }
                    },
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
                    },
                    //markLine: {
                    //    label: {
                    //        show: true,
                    //        position: "end",
                    //        distance: 5
                    //    },
                    //    data: [
                    //        { type: 'average', name: 'میانگین تعداد' }
                    //    ]
                    //}
                })
                if (index === 0)
                    result.markPoint = {
                        data: [
                            {
                                name: 'نتیجه شما', value: this.state.labresult.value,
                                xAxis: this.state.labresult.x, yAxis: this.state.labresult.y
                            }
                        ]
                    };
                else
                    result.markPoint = {};
                return result;
            }),
            markLine: {
                label: {
                    show: true,
                    position: "end",
                    distance: 5
                }
            },
            grid: { right: '40px', left: '30px', bottom: '10%', top: '20%' }
        };
    };
    ChangeChartType() {
        this.setState({
            ...this.state,
            chartType: this.state.chartType === 'line' ? 'bar' : 'line'
        });
    }
    render() {
        return (
            <Card className="h-100">
                <FalconCardHeader title="گزارش پراکندگی نتایج" titleTag="h6" className="py-2">
                    <Flex>
                        <ButtonIcon icon={this.state.chartType === 'line' ? faChartLine : faChartBar} onClick={this.ChangeChartType.bind(this)} />

                    </Flex>
                </FalconCardHeader>
                <CardBody className="h-100">
                    <ReactEchartsCore
                        echarts={echarts}
                        option={this.getOption(this.state.data, this.colors, isDark)}
                        style={{ minHeight: '18.75rem' }}
                    />
                </CardBody>
            </Card>);

    }
}
const isDark = false;
//const { isDark } = useContext(AppContext);