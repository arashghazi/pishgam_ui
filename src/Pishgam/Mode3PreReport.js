import React, { Component } from 'react';
import { Card, CardBody, Label } from 'reactstrap';
import { SearchObject } from '../Engine/Common';
import { ConstIdes, PropConstIdes, StaticCondition } from './ConstIdes';
import ModalSampleSelector from './ModalSampleSelector'

export default class Mode3PreReport extends Component {
    state = {
        Period: null
    }
    async PeriodChanged(value) {
        let headers = await SearchObject(StaticCondition.HeaderWithPeriod.replace('#' + PropConstIdes.Period, value.id), 'CONDITION', ConstIdes.DocHeader);
        console.log(headers)
        this.setState({
            ...this.state,
            Period: value
        })
    }
    render() {
        return (
            <>
                <Card>
                    <CardBody>
                        {
                            this.state.Period === null ? <Label>هیچ دوره ای انتخاب نشده است</Label> :
                                <Label>{this.state.Period.display}</Label>
                        }
                </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        {
                            this.state.Period === null ? <Label>هیچ دوره ای انتخاب نشده است</Label> :
                                <Label>{this.state.Period.display}</Label>
                        }
                    </CardBody>
                </Card>
                {
                    this.state.Period === null ? <ModalSampleSelector onChanged={this.PeriodChanged.bind(this)} /> : <div></div>
                }
            </>
        );
    }
}
