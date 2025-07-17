import { faFilter } from '@fortawesome/free-solid-svg-icons';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { Card, CardBody, CardHeader, CardTitle, Col, Form, Row, Spinner } from 'reactstrap';
import ButtonIcon from '../components/common/ButtonIcon';
import Flex from '../components/common/Flex';
import BaseInstance from '../Engine/BaseInstance';
import { AddNewTabIns, SearchConditionMaker } from '../Engine/Common';
import ObjectClassController from '../Engine/ObjectClassController';
import FormManager from '../EngineForms/FormManager';
import FormRouter from '../Forms/FormRouter';
import WhereCondition from './WhereCondition';

export default class ConditionalClassReport extends Component {
    state = {
        Form: {
            FormID: '',
            title: 'گزارش پارامتریک ',
            cons: [{ "ID": "", "Condition": "", "Prop": "ALL", "RProp": "ALL", "ST": true, "WType": 0, "QT": 0, "IsInstance": false }],
        },
        modals: [],
        ReportResult: [],
        ActiveCommand: false,
        Editable: true,
        isReadonly: false,
        DataLoaded: true
    }
    //async componentDidUpdate() {
    //    //await this.initialize();
    //}
    async componentDidMount() {
        await this.initialize();
    }
    async initialize() {
        if (this.props.Params?.dom !== undefined && this.state.Form.FormID === '') {
            let formtype = this.props.Params.dom.split('F')[1].split('V')[0];
            if (formtype < 4) {
                let oc = await ObjectClassController.LoadAsync(this.props.Params.dom.split('F')[0]);
                this.state.Form.FormID = this.props.Params.dom;
                let modals = [];
                if (this.props.Condition === undefined) {
                    this.state.Form.cons[0].ID = this.props.Params.dom.split('F')[0];

                    let ConditionModal = {
                        OCID: this.state.Form.cons[0].ID,
                        OC: oc,
                        isOpen: false,
                        Content: null
                    };
                    modals = [ConditionModal];
                }
                else {
                    this.state.Form.cons = this.props.Condition;
                }
                this.setState({
                    ...this.state,
                    modals: JSON.parse(JSON.stringify(modals)),
                    Form: { ...this.state.Form }
                });
            }
            else {
                let form = await ObjectClassController.GetFormAsync(this.props.Params.dom);
                console.log(form)
                this.setState(form);
                await this.RunFilter();
            }
        }
    }

    OpenWhere(ConModal) {
        let ConditionModal = this.state.modals.find(x => x.OCID === ConModal.OCID);
        ConditionModal.isOpen = true;

        this.setState({
            ...this.state,
            modals: this.state.modals
        });
    }
    Close(ConModal, result) {
        let context = '';
        if (result !== null)
            for (var i = 0; i < result.BCs.length; i++) {
                for (var j = 0; j < result.BCs[i].Bts.length; j++) {
                    let bit = result.BCs[i].Bts[j];
                    context += bit.t1 + ' ' + bit.t2 + ' ' + bit.t3 + ' ' + (bit.t4 !== undefined ? bit.t4 : '')
                }
            }

        let ConditionModal = this.state.modals.find(x => x.OCID === ConModal.OCID);
        ConditionModal.isOpen = false;
        ConditionModal.Context = context;
        ConditionModal.Content = result;
        this.setState({
            ...this.state,
            modals: this.state.modals
        });

    }
    async RunFilter() {
        this.setState({
            ...this.state,
            ActiveCommand: true,
            DataLoaded: false
        })
        let modals = [];
        this.state.modals.map((modal) => modals = [...modals, { OCID: modal.OCID, Content: modal.Content }])
        let condotion = {
            Form: this.state.Form,
            modals: modals
        };
        let result = await SearchConditionMaker(condotion);
        if (result !== undefined)
            this.setState({
                ...this.state,
                ReportResult: result
            })
        else
            toast.warn('نتیجه ای یافت نشد')
        this.setState({
            ...this.state,
            ActiveCommand: false,
            DataLoaded: true
        })
    }
    RowDoubleClick(instance) {
        if (this.state.Form.ActionLink !== '') {
            if (this.state.Form.ActionFormID !== ''){
                AddNewTabIns(this.state.Form.ActionLink, { Instance: instance, FormID: this.state.Form.ActionFormID });
                console.log(this.state.Form.ActionLinkValue,instance)
            }
            else{
                let id=instance.ID;
                if(this.state.Form.ActionLinkValue)
                id=new BaseInstance(instance).GetValue(this.state.Form.ActionLinkValue);
                window.open(this.state.Form.ActionLink + id, "_blank");
                console.log(this.state.Form.ActionLinkValue,id,instance)
            }
        }

    }
    render() {
        return (<>{this.state.Editable ?
            <Card className='mb-2'>
                <CardHeader>
                    <CardTitle className='float-left' tag="h5">{this.state.Form.title}</CardTitle>
                    <div className='float-right' type="inline">
                        {this.state.ActiveCommand ? < Spinner />
                            : <ButtonIcon icon={faFilter} onClick={this.RunFilter.bind(this)} />}
                    </div>
                </CardHeader>
                <CardBody>
                    <Row>
                        {this.state.modals.map((ConditionModal, index) => {
                            return (
                                <Col key={ConditionModal.OCID} onClick={this.OpenWhere.bind(this, ConditionModal)}>
                                    <Card>
                                        {(ConditionModal.Context !== undefined ? ConditionModal.Context : 'بدون شرط')}
                                        {ConditionModal.isOpen ?
                                            <WhereCondition Modal={ConditionModal} Condition={ConditionModal.Content} OCID={ConditionModal.OCID} Close={this.Close.bind(this)} />
                                            : null}
                                    </Card>
                                </Col>
                            )
                        })}
                    </Row>

                </CardBody>
            </Card> : null}
            <Card>
                <CardHeader>
                    <CardTitle>
                        {this.state.Form.title}
                    </CardTitle>
                </CardHeader>
                {
                    this.state.DataLoaded ?
                        <FormManager RowDoubleClick={this.RowDoubleClick.bind(this)} isReadonly={this.state.isReadonly}
                            TitleFree={true} SaveRow={true} className='pt-2' formId={this.state.Form.FormID} Data={this.state.ReportResult} />
                        : <Flex inline={true} justify='center' align='center'><Spinner style={{ margin: 10 }} /></Flex>
                }
            </Card>
        </>);
    }
}