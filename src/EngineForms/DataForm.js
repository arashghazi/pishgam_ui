import React from 'react';
import PropTypes from 'prop-types';
import {  CardBody,  Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import CellControl from './CellControl';
import {  ThemeDivider } from './ThemeControl'
import Commands from './Commands';
import RelationForm from './RelationForm';
import { useState } from 'react';
import classnames from 'classnames';
import { useEffect } from 'react';
import DroppableArea from './DroppableArea';
import DraggableItem from './DraggableItem';
import RowEditor from '../EngineDeveloper/FormBuilder/RowEditor';
const RelationManager = (props) => {
    const Relations = props.Form.Relations


    const { DataDataForm, Form } = props;
    const [activeTab, toggle] = useState(props.selectedTab??'INSTANCE')
    return (Relations?.length > 0 ? (<>
        <Nav tabs>
            <NavItem>
                <NavLink
                    className={classnames({ active: activeTab === 'INSTANCE' })}
                    onClick={() => { toggle('INSTANCE'); }}
                >
                    {Form.title}
                </NavLink>
            </NavItem>
            {
                Relations?.length > 0 ?
                    (
                        Relations.map((relation, index) => {

                            return (<NavItem key={relation.ID}>
                                <NavLink
                                    className={classnames({ active: activeTab === relation.ID })}
                                    onClick={() =>toggle(relation.ID)}
                                >
                                    {relation.DIS}
                                </NavLink>
                            </NavItem>);
                        })) : null
            }
        </Nav>
        <TabContent activeTab={activeTab}>
            <TabPane tabId='INSTANCE'>
                <MainForm {...props} />
            </TabPane>
            {
                Relations?.length > 0 ?
                    (
                        Relations.map((relation, index) => {
                            let rtype=relation.Type;
                            if(!rtype)
                                rtype=7;
                            return (<TabPane key={relation.ID} tabId={relation.ID}>
                                <CardBody>
                                    <RelationForm BaseId={DataDataForm?.data?.ID}
                                        RelationType={relation} RelationControl={rtype}/>
                                </CardBody>
                            </TabPane>);
                        })) : null
            }
        </TabContent></>) : null)
}
const MainForm = ({ Form, DataDataForm, CardOff, DM, ...rest }) => {
    
    const onChange = async (value, pid,refrence,TP) => {
        if (DataDataForm)
        await DM.ChangeData(value, pid, DataDataForm.data,TP);
    };

    
    const AddToDrop = (content, rowIndex, colIndex, control) => {
        if(rest.mode==='design')
        return <DroppableArea droppableId={rowIndex + '-' + colIndex}>
            <DraggableItem draggableId={rowIndex + '-' + colIndex + '#' + control.pid} index={0} >
                {content}
            </DraggableItem>
        </DroppableArea>
        else return content;
    }
    return (<>{
        Form?.rows?.map((row, rowIndex) => {
            return (<div key={rowIndex}>
                {row.title ? <ThemeDivider >{row.title}</ThemeDivider> : null}
                {rest.mode==='design' ?<RowEditor DM={DM} index={rowIndex} />:null}
                <Row style={{height: row.height }} className='p-1 pb-2'  >
                    {
                        row.controls.map((control, colIndex) => {
                            let resultlist = DataDataForm?.data?.Prop?.find((p) => p.PID === control.pid);
                            return (control.col?
                                <Col lg={control.col} xs='12' sm='6' md={control.col} key={rowIndex + '-' + colIndex}>
                                    {AddToDrop(<CellControl prop={resultlist} DM={DM} control={control}
                                        rowIndex={rowIndex} colIndex={colIndex} {...rest} refrence={DataDataForm?.data}
                                        onChange={onChange} />,rowIndex,colIndex,control)}
                                </Col>:
                                <Col key={rowIndex + '-' + colIndex}>
                                {AddToDrop(<CellControl prop={resultlist} DM={DM} control={control}
                                    rowIndex={rowIndex} colIndex={colIndex} {...rest} refrence={DataDataForm?.data}
                                    onChange={onChange} />,rowIndex,colIndex,control)}
                            </Col>
                            )
                        })
                    }
                </Row>
            </div>);
        })
    }
        {(!CardOff || rest.CommandOff) ? <Commands commands={Form.Commands} DM={DM} formId={Form.FormID} callback={DataDataForm?.callback} type='0' /> : null}

    </>);
}
const DataForm = ({ Form, DataDataForm, CardOff, DM, ...rest }) => {
    useEffect(() => {
        const fetch=async()=>{
        if (!DataDataForm)
            await DM.New(Form.FormID,'0')
        }
        fetch();
    }, [DataDataForm])
    return (Form?.Relations && Form?.Relations?.length>0 ? <RelationManager 
        Form={Form}
        DataDataForm={DataDataForm}
        CardOff={CardOff}
        DM={DM}
        {...rest} /> : <MainForm Form={Form}
        DataDataForm={DataDataForm}
        CardOff={CardOff}
        DM={DM}
        {...rest}  />);
}
export default DataForm;
DataForm.propTypes = {
    Form: PropTypes.object.isRequired,
};