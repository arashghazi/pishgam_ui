import React, { Component } from 'react'
import {
    Button, CardBody, CardFooter,
    Col, Input, Row,
    Table
} from 'reactstrap';
import MorfologyCard from './MorfologyCard';
import { InstanceController } from '../../Engine/InstanceController';
import { SearchObject, Utility } from '../../Engine/Common';
import { PropConstIdes } from '../ConstIdes';
import FormManager from '../../EngineForms/FormManager';
import BaseInstance, { NewInstance } from '../../Engine/BaseInstance';
import ConditionMaker from '../../Engine/ConditionMaker';
import { AuthenticationController } from '../../Engine/Authentication';
export default class MorfologyCellCounter extends Component {
    state = {
        Header: undefined,
        CellCounter: [],
        CellTypeList: [],
        WBC: [],
        RBC: [],
        Platelet: [],
        Diagnosis1: {},
        Diagnosis2: {},
        MorfologyTestList: [],
        CanSave: true

    }
    HeaderForm = 'O30E12C54F0V1';
    HeaderID = () => this.HeaderForm.split('F')[0];
    Headerpropid = 'P61';
    async componentDidUpdate() {
        
    }
    async componentDidMount() {
        if (this.state.CellTypeList.length === 0) {

            let cellTypeList = await SearchObject('', 'O30E12C47', '<>', ' order by convert(int,PC2) ');
            cellTypeList = cellTypeList.filter(x => x.id !== 'O30E12C47I4');
            if (MorfologyCard.MorfologyTestList.length === 0) {
                let list = await InstanceController.GetInstancesAsync('O30E12C49');
                for (var i = 0; i < list.length; i++) {
                    let temp = { id: list[i].ID, display: list[i].Prop.find(x => x.PID === 'PC95')?.IPV, type: list[i].Prop.find(x => x.PID === 'P55')?.IPV };
                    MorfologyCard.MorfologyTestList = [...MorfologyCard.MorfologyTestList, temp];
                }
            }
            let isAdmin = await AuthenticationController.HasRole('R2');
            this.setState({
                ...this.state,
                isAdmin,
                CellTypeList: cellTypeList,
                MorfologyTestList: MorfologyCard.MorfologyTestList
            });
        }
        if (this.props.match?.params?.id) {
            let condition = new ConditionMaker('O30E12C54');
            condition.AddCondition('ID', '=', this.props.match?.params?.id);
            let instance = await InstanceController.LoadInstanceAsync(this.props.match?.params?.id);
            let doc = await InstanceController.GetRelatedInstancesAsync(JSON.stringify(condition),
                this.Headerpropid, ['O30E12C48', 'O30E12C50']);
            this.convertTodata(doc, instance);
        }
        if (this.props.location?.state?.Active === false) {
            this.props.location.state.Active = true;
            let values = this.props.location?.state.values;
            let ins = new BaseInstance(NewInstance('O30E12C54'));
            for (let i = 0; i < values.length; i++) {
                const element = values[i];
                ins.SetValue(element.pid, element.value);
            }
            this.PropertyChanged('', 'P8', ins.Instance)

        }
    }
    Save = async () => {
        this.setState({ ...this.state, CanSave: false })
        let result = await InstanceController.SaveRelatedInstancesAsync(
            this.state.Header, this.Headerpropid, [...this.state.CellCounter
            , ...this.state.WBC, ...this.state.RBC, ...this.state.Platelet]
        );

        this.setState({
            ...this.state,
            result, CanSave: true
        })
        //toast.success('ذخیره سازی با موفقیت انجام شد')
    }

    Delete = async () => {
        if(this.state.doc)
         await InstanceController.DeleteRelatedInstancesAsync(this.state.Header,this.Headerpropid,this.state.doc.RelatedInstances);
    }
    onChangedCard = (type, list) => {
        if (type === "WBC")
            this.setState({ ...this.state, WBC: list });
        if (type === "RBC")
            this.setState({ ...this.state, RBC: list });
        if (type === "Platelet")
            this.setState({ ...this.state, Platelet: list });

    }


    async PropertyChanged(objValue, property, instance) {
        if ((property === 'P9' || property === 'P8') &&
            (instance.Prop.find(x => x.PID === 'P8')?.IPV !== undefined &&
                instance.Prop.find(x => x.PID === 'P9')?.IPV !== undefined)) {

            let condition = {
                OCID: this.HeaderForm.split('F')[0],
                BCs: [
                    {
                        Bts: [
                            {
                                PID: PropConstIdes.Sample,
                                PRA: 1,
                                IPV: instance.Prop.find(x => x.PID === 'P9')?.IPV,
                                NLC: 2,
                                SRC: null
                            }, {
                                PID: PropConstIdes.Lab,
                                PRA: 1,
                                IPV: instance.Prop.find(x => x.PID === 'P8')?.IPV,
                                NLC: 0,
                                SRC: null
                            }
                        ],
                        NLC: 0
                    }
                ]
            }
            let doc = await InstanceController.GetRelatedInstancesAsync(JSON.stringify(condition),
                this.Headerpropid, ['O30E12C48', 'O30E12C50']);
            this.convertTodata(doc, instance);
        }

    }
    CellTestPropID = 'P54';
    CellValuePropID = 'P15';
    convertTodata(doc, instance) {
        if (!Utility.IsInstanceID(doc.Header.ID)) {
            doc.Header.ID = this.HeaderForm.split('F')[0];
            let newheder = new BaseInstance(doc.Header);
            let Changedheader = new BaseInstance(instance);
            newheder.SetValue('P9', Changedheader.GetValue('P9', true));
            newheder.SetValue('P8', Changedheader.GetValue('P8', true));
        }
        this.setState({
            ...this.state,
            doc,
            Header: doc.Header,
            CellCounter: doc.RelatedInstances.filter(x => x.ID.includes('O30E12C48I')),
            WBC: doc.RelatedInstances.filter(x => x.ID.includes('O30E12C50I') && x.Prop.find(p => p.PID === 'P56'
                && this.state.MorfologyTestList.findIndex(x => x.id === p.IPV && x.type === 'WBC') >= 0)),
            RBC: doc.RelatedInstances.filter(x => x.ID.includes('O30E12C50I') && x.Prop.find(p => p.PID === 'P56'
                && this.state.MorfologyTestList.findIndex(x => x.id === p.IPV && x.type === 'RBC') >= 0)),
            Platelet: doc.RelatedInstances.filter(x => x.ID.includes('O30E12C50I') && x.Prop.find(p => p.PID === 'P56'
                && this.state.MorfologyTestList.findIndex(x => x.id === p.IPV && x.type === 'Platelet') >= 0)),
            CellTypeList: this.state.CellTypeList
        });
    }

    async onChangedCellCounterValue(id, event) {
        let source = [...this.state.CellCounter];
        let value = event.target.value;
        let a = source.filter(x => x.Prop.find(p => p.PID === this.CellTestPropID && p.IPV === id))
        if (a.length > 1) {
            await new BaseInstance(a[0]).DeleteAsync(true);
            source.splice(this.state.CellCounter.findIndex(x => x.ID === a[0].ID), 1);
        }
        let rowindex = source.findIndex(x => x.Prop.find(p => p.PID === this.CellTestPropID && p.IPV === id))
        let temp = {};

        if (rowindex >= 0) {
            temp = { ...source[rowindex] };
            new BaseInstance(temp).SetValue(this.CellValuePropID, value);
            source.splice(rowindex, 1);
        }
        else {
            temp = {
                ID: 'O30E12C48', Prop: [{ PID: this.CellTestPropID, IPV: id },
                { PID: this.CellValuePropID, IPV: value }]
            };
        }
        this.setState({
            ...this.state,
            CellCounter: [...source, temp]
        });
    }
    render() {
        let result = null;
        result =
            <FormManager title='فرم ثبت نتایج افتراقی گلبول های سفید، مرفولوژی سلولی و تشخیص های احتمالی'
                Data={this.state.Header !== undefined ? [{ formId: this.HeaderForm, data: this.state.Header }] : undefined}
                Mode={'2'} IsPanel={true} formId={this.HeaderForm} onChange={this.PropertyChanged.bind(this)} >


                <CardBody dir={'ltr'} style={{ textAlign: 'left' }}>
                    <Row>
                        <Col>
                            <Table dir="ltr" style={{ textAlign: 'left' }} hover striped >
                                <thead>
                                    <tr>
                                        <th>Cell Type</th>
                                        <th>Result</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.CellTypeList.map(item => {
                                            return (<tr key={item.id}>
                                                <td className='col-8'>{item.display}</td>
                                                <td className='col-4'>
                                                    <Input
                                                        bsSize="sm"
                                                        className="mb-1"
                                                        type="number"
                                                        step="1"
                                                        value={this.state.CellCounter.find(x => x.Prop.find(p => p.PID === this.CellTestPropID &&
                                                            p.IPV === item.id))?.Prop?.find(p => p.PID === this.CellValuePropID)?.IPV ?? ''}
                                                        onChange={this.onChangedCellCounterValue.bind(this, item.id)}
                                                        onKeyPress={(e) => {
                                                            if (!/^[0-9]$/.test(e.key)) {
                                                                e.preventDefault(); // فقط اجازه وارد کردن اعداد را می‌دهد
                                                            }
                                                        }}
                                                    /></td>
                                            </tr>);
                                        })
                                    }
                                </tbody>
                            </Table>
                        </Col>
                        <Col>{
                            this.state.MorfologyTestList.length > 0 ? <>
                                <MorfologyCard title='WBC' DataSource={this.state.WBC} onChanged={this.onChangedCard} />
                                <MorfologyCard title='RBC' DataSource={this.state.RBC} onChanged={this.onChangedCard} />
                                <MorfologyCard title='Platelet' DataSource={this.state.Platelet} onChanged={this.onChangedCard} />
                            </> : null
                        }
                        </Col>
                    </Row>
                </CardBody>
                <CardFooter >
                    <Button disabled={!this.state.CanSave} className="mr-2" outline color='primary' onClick={this.Save} > {'ذخیره'}</Button >
                    {this.state.isAdmin ? <Button className='ml-1 mr-1' color='danger'
                        onClick={this.Delete.bind(this)}
                    >حذف</Button> : null}
                </CardFooter>
            </FormManager>;
        return <>
            {/* <AppContext.Consumer>
                {({ setCurrentTitle }) => setCurrentTitle('گزارش پلاسما کنترل لئوفیلیزه')}
            </AppContext.Consumer> */}
            {result} </>;
    }
}
