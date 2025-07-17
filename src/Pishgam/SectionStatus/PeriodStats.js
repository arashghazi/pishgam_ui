import React, { Component } from 'react';
import { Button, Card, Col, Input, Label, Row, Spinner } from 'reactstrap';
import FalconCardHeader from '../../components/common/FalconCardHeader';
import JoiSearchBox from '../../components/joi/JoiSearchBox';
import Flex from '../../components/common/Flex';
import { InstanceController } from '../../Engine/InstanceController';
import { ConstIdes, PropConstIdes } from '../ConstIdes';
import SectionStatus from './SectionStatus';
import { CSVLink } from 'react-csv';
import ConditionMaker, { EngineCondition } from '../../Engine/ConditionMaker';
import BaseInstance from '../../Engine/BaseInstance';
import { addDays } from '@fullcalendar/core';
import { DatePicker } from "jalali-react-datepicker";

export default class PeriodStats extends Component {
    state = {
        Sections: [], PeriodID: '', labs: [], Loading: false,
        days: 0,DateValue:''
    };
    Period = {
        col: "3",
        pid: PropConstIdes.Period,
        controlType: "SearchControl",
        title: "دوره",
        source: ConstIdes.Period,
        Value: ''
    }
    async componentDidMount() {
        if (this.state.Sections.length === 0) {
            let Sections = await InstanceController.GetInstancesAsync(ConstIdes.Section);
            this.setState({
                ...this.state,
                Sections
            })
        }
    }
    PropertyHandler(value, obj) {
        this.setState({
            ...this.state,
            PeriodID: value,
            obj, labs: [], Loading: false
        })
    }
    RowGenarate() {
        let result = [];
        let rowCount = parseInt(this.state.Sections.length / 3) + 1;
        let counter = 0;
        for (var i = 0; i < rowCount; i++) {
            let columns = [];
            for (var j = 0; j < 3; j++) {
                if (counter < this.state.Sections.length) {
                    columns = [...columns, <Col className='mt-2' key={'col' + counter}><SectionStatus
                        PeriodID={this.state.PeriodID}
                        section={this.state.Sections[counter]} /></Col>]
                    counter++;
                }
            }
            if (columns.length > 0)
                result = [...result, <Row key={'section' + counter}>{columns}</Row>];
        }
        return result;
    }
    async getLabs1() {
        this.setState({
            ...this.state,
            Loading: true
        })
        let eng = new EngineCondition('O30E12C64');
        let con1 = new ConditionMaker('O30E12C64');
        if(this.state.days!=null && this.state.days>0){
            con1.AddCondition('P3', '=', this.state.PeriodID, 'and');
            let date = addDays(new Date(), this.state.days*-1).toLocaleDateString();
            con1.AddCondition('Convert(DateTime,P90)', '>', date);
        }
        else{
            con1.AddCondition('P3', '=', this.state.PeriodID);
        }
        eng.sqlCondition = con1;
        let eng2 = new EngineCondition('O30E23C6');
        let con2 = new ConditionMaker('O30E23C6');
        con2.AddCondition('PC88', '<>', '');
        eng2.join = " INNER JOIN ";
        eng2.onJoin = "@.P8= #.ID";
        eng2.sqlCondition = con2;
        eng.nextCondition = eng2;
        eng2.returnProperties = 'PC88,P6,P73,P74,P70,PC147,PC365,P72,P173';
        let result = await eng.GetResult();
        this.setState({
            ...this.state,
            labs: result,
            Loading: false
        })
    }
    async getLabs2() {
        this.setState({
            ...this.state,
            Loading: true
        })
        let eng = new EngineCondition('O30E12C64');
        let con1 = new ConditionMaker('O30E12C64');
            con1.AddCondition('P3', '=', this.state.PeriodID, 'and');
            let date =this.state.DateValue;
            con1.AddConditionBetween('Convert(DateTime,P88)', `Convert(DateTime,'${date} 00:00')`,`Convert(DateTime,'${date} 23:59')`);
        eng.sqlCondition = con1;
        let eng2 = new EngineCondition('O30E23C6');
        let con2 = new ConditionMaker('O30E23C6');
        con2.AddCondition('PC88', '<>', '');
        eng2.join = " INNER JOIN ";
        eng2.onJoin = "@.P8= #.ID";
        eng2.sqlCondition = con2;
        eng.nextCondition = eng2;
        eng2.returnProperties = 'PC88,P6,P73,P74,P70,PC147,PC365,P72,P173';
        let result = await eng.GetResult();
        this.setState({
            ...this.state,
            labs: result,
            Loading: false
        })
    }
    render() {

        return (<>
            <Card >
                <FalconCardHeader title='نمای کلی از وضعیت دوره ' >
                    <Row>
                        {this.state.PeriodID !== '' ? <Col xl={9}>

                            {this.state.labs?.length > 0 ? <CSVLink
                                filename={`${this.state.DateValue??this.Period.title}.csv`}
                                headers={[
                                    { label: "شناسه", key: "id" },
                                    { label: "عنوان", key: "display" },
                                    { label: "نام", key: "PC88" },
                                    { label: "کد_قدیم", key: "P6" },
                                    { label: "استان", key: "P73" },
                                    { label: "شهر", key: "P74" },
                                    { label: "نشانی", key: "P70" },
                                    { label: "کدپستی", key: "PC147" },
                                    { label: "موبایل", key: "PC365" },
                                    { label: "تلفن_فکس", key: "P72" },
                                    { label: "نحوه_ارسال", key: "P173" }
                                ]}
                                data={this.state.labs.map(ins => new BaseInstance(ins).instanceToRow())}>
                                دانلود فایل آزمایشگاهها
                            </CSVLink> : <Row>
                                <Col xl={3}>
                                    <Button color='success'
                                        disabled={this.state.Loading} onClick={this.getLabs2.bind(this)} >
                                        {this.state.Loading ? <Spinner size={'sm'} /> : null}آزمایشگاههای ارسال شده</Button>
                                </Col>
                                <Col  xl={3}>
                                <DatePicker onClickSubmitButton={({value})=>{
                                    console.log(value.format('MM/DD/YYYY'))
                                    this.setState({...this.state,DateValue:value.format('YYYY/MM/DD')})
                                }} className={"h-100"} label='تاریخ'
                                    bsSize="sm"    value11={this.state.DateValue} />
                                </Col>
                                <Col xl={4}>
                                    <Button color='primary'
                                        disabled={this.state.Loading} onClick={this.getLabs1.bind(this)} >
                                        {this.state.Loading ? <Spinner size={'sm'} /> : null}آزمایشگاههای این دوره</Button>
                                </Col>
                                <Col xl={2}>
                                    <Label>تعداد روز گذشته</Label>
                                    <Input value={this.state.days}
                                    type='number'
                                        placeholder='چند روز پیش'
                                        onChange={({ target }) => {
                                            this.setState({
                                                ...this.state,
                                                days: target.value
                                            })
                                        }} />
                                </Col>
                            </Row>}
                        </Col> : <Col xl={3}></Col>}
                        <Col >
                            <JoiSearchBox Control={this.Period}
                                TitleFree={true}
                                type={this.Period.source} onChange={this.PropertyHandler.bind(this)}
                                PID={this.Period.pid} placeHolder={this.Period.title} />
                        </Col>
                    </Row>
                </FalconCardHeader>
            </Card>
            <div className='mt-2' >
                {this.state.PeriodID !== '' ? this.RowGenarate() : <Flex className='mt-4' justify='center' align='center' ><strong>
                    دوره مورد نظر را انتخاب نمایید
                </strong></Flex>}
            </div>
        </>)
    }
}
