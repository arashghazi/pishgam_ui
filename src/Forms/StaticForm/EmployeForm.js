import React, { Component } from 'react'
import { Button, CardBody, Col, Input, Label, Row } from 'reactstrap';
import { LoadEmploye, NewEmploye, SaveEmploye } from '../../Engine/Common';
import InstanceForm from '../InstanceForm/InstanceForm';
import generator from 'generate-password'
import { toast } from 'react-toastify';
export default class EmployeForm extends Component {
    state = NewEmploye();
    LoadCompleted() {

    }
    async componentDidUpdate() {
        if (this.props.Data !== null && this.props.Data !== 'new' &&
            this.state.Data?.UID !== this.props.Data?.UID) {
            let data = await LoadEmploye(this.props.Data.id);

            this.setState({
                ...this.state,
                Data: data
            })
        }
        if (this.props.Data === 'new' && this.state.Data.UID !== 'new') {
            this.New();
        }
    }
    onChangeusername = (value) => {
        this.setState({
            ...this.state,
            Data: {
                ...this.state.Data,
                User: {
                    ...this.state.Data.User,
                    UserName: value.target.value
                }
            }
        })
    }
    onChangepassword = (value) => {
        this.setState({
            ...this.state, Data: {
                ...this.state.Data,
                User: {
                    ...this.state.Data.User,
                    Password: value.target.value
                }
            }
        })
    }
    onChangeState = (value) => {
        this.setState({
            ...this.state, Data: {
                ...this.state.Data,
                User: {
                    ...this.state.Data.User,
                    State: (value.target.value === 'true')
                }
            }
        })
    }
    PropertyChanged(form, property, newvalue, instance) {
        let data = this.state.Data;
        data.Person = instance;
        if (property === "PC325") {
            data.User.UserName = newvalue;
            if (data.User.Password === '') {
                var password = generator.generate({
                    length: 10,
                    numbers: true
                });
                data.User.Password = password;
            }
        }
        this.setState({
            ...this.state,
            Data: data
        })
    }
    Save = async () => {
        this.setState({
            ...this.state,
            disable: true,
        })

        let data = await SaveEmploye(this.state.Data);
        if (data !== undefined) {
            if (this.props.FeedBack !== undefined)
                this.props.FeedBack({ id: data.ID, display: data.DIS });
            this.setState({
                ...this.state,
                Data: data,
            })
            toast.success('اطلاعات با موفقیت ذخیره گردید')
        }
        this.setState({
            ...this.state,
            disable: false,
        })
    }
    New = () => {
        this.setState(NewEmploye());
    }
    RestPass = () => {
        var password = generator.generate({
            length: 10,
            numbers: true
        });
        let data = this.state.Data;
        data.User.Password = password;
        this.setState({
            ...this.state,
            Data: data
        })
    }
    render() {
        return (
            <CardBody>
                <Row>
                    <Col className='d-flex flex-column' >
                        <Label className='text-truncate' >نام کاربر</Label>
                        <Input readOnly={this.state.disable} bsSize="sm" type="text" value={this.state.Data.User.UserName || ''} onChange={this.onChangeusername} />
                    </Col>
                    <Col className='d-flex flex-column' >
                        <Label className='text-truncate'>رمز عبور</Label>
                        <Input readOnly={this.state.disable} bsSize="sm" value={this.state.Data.User.Password || ''} onChange={this.onChangepassword} />
                    </Col>
                    <Col className='d-flex flex-column' >
                        <Label className='text-truncate'>وضعیت</Label>
                        <Input readOnly={this.state.disable} type='select' bsSize="sm" value={this.state.Data.User.State} onChange={this.onChangeState} >
                            <option value={true}>
                                فعال
                            </option>
                            <option value={false} >
                                غیر فعال
                            </option>
                        </Input>
                    </Col>
                </Row>
                <Row>
                    <Col className='d-flex flex-column' >
                        <InstanceForm disable={this.state.disable} Instance={this.state.Data.Person}
                            Mode={'2'} IsPanel={true} source={this.state.FormID}
                            PropertyChanged={this.PropertyChanged.bind(this)} />
                    </Col>
                </Row>
                <Row><Col>
                    <div className='float-right mt-3' type="inline" >
                        <Button className="mr-2" outline disabled={this.state.disable} onClick={this.Save}>ذخیره</Button>
                        {
                            !this.props.HideNew ?
                                <Button className="mr-2" outline disabled={this.state.disable} onClick={this.New}>جدید</Button>
                                : null
                        }
                        <Button className="mr-2" outline disabled={this.state.disable} color='warning' onClick={this.RestPass}>بازنشانی رمز عبور</Button>
                    </div></Col>
                </Row>
            </CardBody>
        );
    }
}