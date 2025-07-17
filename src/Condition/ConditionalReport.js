import { faFilter } from '@fortawesome/free-solid-svg-icons';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { Card, CardBody, CardHeader, CardTitle, Col, Row, Spinner } from 'reactstrap';
import ButtonIcon from '../components/common/ButtonIcon';
import { SearchConditionMaker, SearchObject } from '../Engine/Common';
import ObjectClassController from '../Engine/ObjectClassController';
import FormRouter from '../Forms/FormRouter';
import { Domain } from '../Pishgam/ConstIdes';
import WhereCondition from './WhereCondition'
export default class ConditionalReport extends Component {
    state = {
        Form: {
            FormID:'O30E3C2F1V1',
            title: 'گزارش پارامتریک ',
            cons: [{ "ID": "O30E12C1", "Condition": "", "Prop": "ALL", "RProp": "ALL", "ST": true, "WType": 0, "QT": 0, "IsInstance": false }, { "ID": "O30E3C2", "Condition": "", "Prop": "ALL", "RProp": "ALL", "ST": false, "join": " INNER JOIN ", "onjoin": " #.P17=@.ID ", "WType": 0, "QT": 0, "IsInstance": false }],
        },
        modals: [],
        ReportResult: [],
        ActiveCommand: false,
        Domain: null
    }
    async componentDidUpdate() {
        await this.initialize();
    }
    async componentDidMount() {
        await this.initialize();
    }
    async initialize() {
        if (this.state.Domain === null & this.props.Params.dom !== undefined) {
            let domain = await SearchObject(this.props.Params.dom, 'INSTANCE', '=');
            if (domain.length > 0) {
                this.state.Form.cons[1].ID = Domain.find(x => x.sec === domain[0].id).resultId;
                let modals = [];
                for (var i = 0; i < this.state.Form.cons.length; i++) {
                    let con = this.state.Form.cons[i];
                    let oc = await ObjectClassController.LoadAsync(con.ID);
                    let ConditionModal = {
                        OCID: con.ID,
                        OC: oc,
                        isOpen: false,
                        Content: null
                    };
                    modals = [...modals, ConditionModal];
                }
                this.setState({
                    ...this.state,
                    modals: JSON.parse(JSON.stringify(modals)),
                    Domain: domain[0],
                    Form: { ...this.state.Form }
                });
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
            ActiveCommand: true
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
            ActiveCommand: false
        })
    }
    render() {
        return (<>
            <Card className='mb-2'>
                <CardHeader>
                    <CardTitle className='float-left' tag="h5">{this.state.Form.title + (this.state.Domain !== null? this.state.Domain.display:'')}</CardTitle>
                    <div className='float-right' type="inline">
                        {this.state.ActiveCommand ? < Spinner />
                            : <ButtonIcon icon={faFilter} onClick={this.RunFilter.bind(this)} />}
                    </div>
                </CardHeader>
                <CardBody>
                    <Row>
                        {this.state.modals.map((ConditionModal,index) => {
                            return (
                                <Col key={ConditionModal.OCID} onClick={this.OpenWhere.bind(this, ConditionModal)}>
                                    <Card>
                                        {ConditionModal.OC.Context + ': ' + (ConditionModal.Context !== undefined ? ConditionModal.Context : 'بدون شرط')}
                                        <WhereCondition Modal={ConditionModal} OCID={ConditionModal.OCID} Close={this.Close.bind(this)} />
                                    </Card>
                                </Col>
                            )
                        })}
                    </Row>
                    
                </CardBody>
            </Card>
            <FormRouter SaveRow={true} className='pt-2' source={this.state.Form.FormID} Data={this.state.ReportResult} />
        </>);
    }
}