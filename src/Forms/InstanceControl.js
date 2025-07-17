import React, { Component } from 'react';
import { Form, Button, Spinner, Card, CardBody, CardTitle, CardFooter} from 'reactstrap';
import FormRow from './FormRow';
import { InstanceController } from './../Engine/InstanceController'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPeopleArrows } from '@fortawesome/free-solid-svg-icons';
import { CommandSetting } from '../PGIAdminroutes';
import { sample } from 'lodash';
import Flex from '../components/common/Flex';
import ButtonIcon from '../components/common/ButtonIcon';

export default class InstanceControl extends Component {
    
    state = {
        Form: {
            FormID:'',
            title: "",
            Relations: [],
        },
        Instance: {
            ID: 'NEW',
            Prop: []

        },
        IsDesignTime: true
    };
    async componentDidMount() {
        if (this.props.onRef !== undefined)
        this.props.onRef(this)
        if (this.state.Form.FormID !== this.props.source) {
            this.LoadForm();
        }
    }
    componentWillUnmount() {
        if (this.props.onRef !== undefined)
        this.props.onRef(null)
    }
    LoadForm = async ()=> {
        await InstanceController.GetFormAsync(this.props.source, this);

    }
    NewInstance;
    Update(datamodel = { Data: '' }) {
        this.NewInstance = { ...datamodel.Data }

        switch (datamodel.Type) {
            case 'FORM': {
                this.setState({
                    ...this.state,
                    Form: { ...this.NewInstance} ,
                    Instance: {
                        ID: this.NewInstance.FormID.split('F')[0],
                        Prop: []
                    }
                });
                break;
            }
            
            default:
                break;
        }
    }
    handlePropertyChange = (pid, value) => {
        let updated = false;
        let props = this.state.Instance.Prop;
        let editedPropindex = this.state.Instance.Prop.findIndex(x => x.PID === pid)
        props.splice(editedPropindex, editedPropindex >= 0 ? 1 : 0, { PID: pid, IPV: value, state: 2 })

        this.setState({
            ...this.state,
                Instance: {
                    ...this.state.Instance,
                    Prop: props
                }
        })
        if (this.props.PropertyChanged !== undefined)
            this.props.PropertyChanged(this.state.Form.FormID, pid, value)
        console.log({ PID: pid, IPV: value, state: 2 })
    }
    async Refresh() {
        //await InstanceController.LoadInstanceAsync('E11C1I1', this);
    }
    async New() {
        this.setState({
            ...this.state,
            Instance: {
                ID: this.NewInstance.FormID.split('F')[0],
                Prop: []
            },
            Form: { ...this.NewInstance },
        });
    }
    async Delete() {
        //await InstanceController.LoadInstanceAsync('E11C1I1', this);
    }
    async Save() {
        let id = await InstanceController.SaveInstanceAsync(this.state.Instance);
        if (this.props.PropertyChanged !== undefined)
            this.props.PropertyChanged(this.state.Form.FormID, 'ID', id)
        this.setState({
            ...this.state,
            Instance: {
                ...this.state.Instance,
                ID: id
            }
        })
        return id;
    }
    returnData() {

        if (this.state.Form !== undefined && this.state.Form.title !== '') {
            return <>
                <div>{this.state.Form.rows.map((row, key) => <FormRow Instance={this.state.Instance} PropertyChange={this.handlePropertyChange.bind(this)} key={key} source={row} />)}</div>
            </>
        } else {
            return <Spinner color="secondary" />
        }
    }
    async Commander(event) {
        if (event.currentTarget.value === 'Save')
            await this.Save();
    }
    CommandBuilder() {
        let commands = [];
        this.state.Form.Commands.map(command => {
            let commandSetting = CommandSetting.find(x => x.command === command);
            commands = [...commands, <Button className="mr-2" key={command} outline color={commandSetting.color} value={command} onClick={this.Commander.bind(this)} > {commandSetting.title}</Button >];
        })
        return commands;
    }
    LoadRelationForm(event) {
        console.log(event.currentTarget.value);
    }
    render() {
        if (this.state.Form.FormID !== this.props.source) {
            return <Spinner color="secondary" />;
        }
        else {
            return (
                <>
                    <Form>
                        {!this.props.IsPanel ?
                            <Card>
                                <CardBody>
                                    <CardTitle className='float-left' tag="h5">{this.state.Form.title}</CardTitle>
                                    <div className='float-right' type="inline">
                                        <ul className="list-inline mb-0">
                                            <Button close className='p-1' onClick={this.LoadForm.bind(this)}><FontAwesomeIcon icon="home" /></Button>
                                            {this.state.Form.Relations !== undefined?
                                                this.state.Form.Relations.map((relationID) => (
                                                    <ButtonIcon icon={faPeopleArrows} className='p-1' close key={relationID} value={relationID} onClick={this.LoadRelationForm.bind(this)}></ButtonIcon>
                                                    )):null
                                            }
                                        </ul>
                                    </div>
                                </CardBody>
                                <CardBody>
                                    {this.returnData()}
                                </CardBody>
                                <CardFooter >
                                    <Flex justify="start" align="end">
                                        {this.CommandBuilder()}
                                    </Flex>
                                </CardFooter>
                            </Card> : this.returnData()}
                    </Form>

                </>
            );
        }
    }
}

