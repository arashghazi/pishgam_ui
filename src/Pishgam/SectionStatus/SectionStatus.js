import React, { useEffect, useState } from 'react';
import { getGrays, getPosition, numberFormatter } from '../../helpers/utils';
import { Card, CardBody, Col, Row, Spinner } from 'reactstrap';
import echarts from 'echarts/lib/echarts';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import 'echarts/lib/chart/pie';
import SectionStatusItem from './SectionStatusItem'
import ConditionMaker, { EngineCondition } from '../../Engine/ConditionMaker';
const getOption = (data, isDark) => {
    const grays = getGrays(isDark);
    return {
        color: data.map(d => d.color),
        tooltip: {
            trigger: 'item',
            padding: [7, 10],
            backgroundColor: grays.white,
            textStyle: { color: grays.black },
            transitionDuration: 0,
            borderColor: grays['300'],
            borderWidth: 1,
            formatter: function (params) {
                return `<strong>${params.data.name}:</strong> ${params.percent}%`;
            }
        },
        position(pos, params, dom, rect, size) {
            return getPosition(pos, params, dom, rect, size);
        },
        legend: { show: false },
        series: [
            {
                type: 'pie',
                radius: ['100%', '87%'],
                avoidLabelOverlap: false,
                hoverAnimation: false,
                itemStyle: {
                    borderWidth: 2,
                    borderColor: isDark ? '#0E1C2F' : '#fff'
                },
                labelLine: { normal: { show: false } },
                data: data
            }
        ]
    };
};

const SectionStatus = ({ section, PeriodID }) => {
    const [data, dataSet] = useState([
        { color: "#d8e2ef", id: 2, name: "ثبت نام", value: 0 },
        { color: "#27bcfd", id: 3, name: "بسته بندی", value: 0 },
        { color: "#2c7be5", id: 1, name: "ارسال ", value: 0 },
    ])
const [isLoaded,setIsLoaded]=useState();
    useEffect(() => {
        async function fetchMyAPI() {
            setIsLoaded(false);
            let condition = new EngineCondition('O30E12C64');
            condition.qType = 1;
            let where = new ConditionMaker('O30E12C64');
            where.AddCondition('P1', '=', `${section.ID}`,'and');
            where.AddCondition('P3', '=', `${PeriodID}`, 'and');
            where.AddCondition('P88', 'None', 'Is Null', 'and');
            where.AddCondition('P90', 'None', 'Is Null');
            condition.sqlCondition = where;
            let allRegister = await condition.GetResult();
            where.RemoveAtEnd(1);
            where.AddCondition('P90', 'None', 'Is Not Null');

            condition.sqlCondition = where;
            let allpakage = await condition.GetResult();
            where.RemoveAtEnd(2);
            where.AddCondition('P88', 'None', 'Is Not Null');
            condition.sqlCondition = where;
            let allsend = await condition.GetResult();
            dataSet( [
                { color: "#d8e2ef", id: 2, name: "ثبت نام", value: allRegister },
                { color: "#27bcfd", id: 3, name: "بسته بندی", value: allpakage },
                { color: "#2c7be5", id: 1, name: "ارسال ", value: allsend },
            ])
        setIsLoaded(true);
    }

        fetchMyAPI();
    }, [PeriodID,section])
    const { isDark } = false;
    let totalRegister = 0;
    data.map(({ value }) => (totalRegister += value));
    const title = section.DIS;
    return (
        <Card className="h-md-100">
            <CardBody>
                <Row noGutters className="h-100 justify-content-between">
                    <Col xs={5} sm={6} className="col-xxl pr-2">
                        <h6 className="mt-1">{title}</h6>
                        <div className="fs--2 mt-3">
                            {isLoaded?
                                data.map(({ id, ...rest }) => <SectionStatusItem {...rest} totalShare={totalRegister} key={id} />)
                                :<Spinner/>
                            }
                        </div>
                    </Col>
                    <Col xs="auto">
                        <div className="position-relative">
                            <ReactEchartsCore
                                echarts={echarts}
                                option={getOption(data, isDark)}
                                style={{ width: '6.625rem', height: '6.625rem' }}
                            />
                            <div className="absolute-centered font-weight-medium text-dark fs-2">
                                {numberFormatter(totalRegister, 1)}
                            </div>
                        </div>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
};

export default SectionStatus;
