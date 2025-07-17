import React, {  useState, Fragment, useEffect } from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, Form, Label, Nav, NavItem, NavLink } from 'reactstrap';
import ClassDefinition from './ClassDefinition';
import { useForm } from 'react-hook-form';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ButtonIcon from '../../components/common/ButtonIcon';
import ClassPropertyControl from './ClassPropertyControl';
import AddClassToMenu from './AddClassToMenu';
import { NewObjectClass, Utility } from '../../Engine/Common';
import { settings } from '../../config';
import ObjectClassController from '../../Engine/ObjectClassController';
const ClassManager = ({match}) => {
    useEffect(()=>{
        const fetchData=async()=>{
            if(Utility.IsClassID(match.params.id)){
                let oc =await ObjectClassController.LoadAsync(match.params.id);
                setData(oc);
            }
            else 
            setData(JSON.parse(JSON.stringify(NewObjectClass )))
        }
        fetchData();
    },[match.params])
    const isRTL = false;
    const [step, setStep] = useState(1);
    const { register, handleSubmit, errors, watch } = useForm();
    const [data, setData] = useState()
    const onSubmitData = async (newdata, event) => {
        event.preventDefault();
        data.Contexts = [];
        for (let i = 0; i < settings.lang.length; i++) {
            data.Contexts = [...data.Contexts, { Lan: settings.lang[i], Context: data['Context' + settings.lang[i]] }];
        }
        let finaldata = { ...data, ...newdata };
        if (step === 2) {
            console.log(finaldata)
            if(!Utility.IsClassID(finaldata.ID))
                finaldata.ID=finaldata.EID;
            finaldata.ID = await ObjectClassController.SaveAsync({ ...finaldata })
        }
        setData({...finaldata})
        setStep(step + 1);

    };

    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    const handleBackStep = targetStep => {
        if (step !== 4) {
            if (targetStep < step) {
                setStep(targetStep);
            }
        } else {
            toggle();
        }
    };
    const changeData = (data) => {
        setData(data);
    }
    const newClass=()=>{
        setData(JSON.parse(JSON.stringify(NewObjectClass )));
        setStep(1);
    }
    return (
        <div>
            <Fragment>
                <Card tag={Form} onSubmit={handleSubmit(onSubmitData)} className="theme-wizard">
                    <CardHeader className="bg-light">
                        <Nav className="justify-content-center">
                            <NavItem>
                                <NavLink
                                    className={classNames('font-weight-semi-bold', {
                                        'done cursor-pointer': step > 1,
                                        active: step === 1
                                    })}
                                    onClick={() => handleBackStep(1)}
                                >
                                    <span className="nav-item-circle-parent">
                                        <span className="nav-item-circle">
                                            <FontAwesomeIcon icon="chart-pie" />
                                        </span>
                                    </span>
                                    <span className="d-none d-md-block mt-1 fs--1">Class Definition</span>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classNames('font-weight-semi-bold', {
                                        'done cursor-pointer': step > 2,
                                        active: step === 2
                                    })}
                                    onClick={() => handleBackStep(2)}
                                >
                                    <span className="nav-item-circle-parent">
                                        <span className="nav-item-circle">
                                            <FontAwesomeIcon icon="user" />
                                        </span>
                                    </span>
                                    <span className="d-none d-md-block mt-1 fs--1">Properties</span>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classNames('font-weight-semi-bold', {
                                        'done  cursor-pointer': step > 3,
                                        active: step === 3
                                    })}
                                    onClick={() => handleBackStep(3)}
                                >
                                    <span className="nav-item-circle-parent">
                                        <span className="nav-item-circle">
                                            <FontAwesomeIcon icon="dollar-sign" />
                                        </span>
                                    </span>
                                    <span className="d-none d-md-block mt-1 fs--1">Add to Menu</span>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classNames('font-weight-semi-bold', {
                                        'done  cursor-pointer': step > 3
                                    })}
                                >
                                    <span className="nav-item-circle-parent">
                                        <span className="nav-item-circle">
                                            <FontAwesomeIcon icon="thumbs-up" />
                                        </span>
                                    </span>
                                    <span className="d-none d-md-block mt-1 fs--1">Done</span>
                                </NavLink>
                            </NavItem>
                        </Nav>
                    </CardHeader>
                    <CardBody style={{ minHeight: '200px' }} className="fs--1 font-weight-normal px-md-6 pt-4 pb-3">
                        {step === 1 && <ClassDefinition data={data}
                            register={register} errors={errors} watch={watch} />}
                        {step === 2 && <ClassPropertyControl
                            data={data} changeData={changeData} />}
                        {step === 3 && <AddClassToMenu register={register} errors={errors} />}
                        {step === 4 && <Button block color='success' onClick={newClass}>New Class</Button>}
                    </CardBody>
                    <CardFooter className={classNames('px-md-6 bg-light', { 'd-none': step === 4, ' d-flex': step < 4 })}>
                        <ButtonIcon
                            color="link"
                            icon={isRTL ? 'chevron-right' : 'chevron-left'}
                            iconAlign="left"
                            transform="down-1 shrink-4"
                            className={classNames('px-0 font-weight-semi-bold', { 'd-none': step === 1 })}
                            onClick={() => {
                                setStep(step - 1);
                            }}
                        >
                            Prev
                        </ButtonIcon>

                        <ButtonIcon
                            color="primary"
                            className="ml-auto px-5"
                            type="submit"
                            //onClick={SubmitButton}
                            icon={isRTL ? 'chevron-left' : 'chevron-right'}
                            iconAlign="right"
                            transform="down-1 shrink-4"
                        >
                            Next
                        </ButtonIcon>
                    </CardFooter>
                </Card>
            </Fragment>
        </div>
    );
};

export default ClassManager;