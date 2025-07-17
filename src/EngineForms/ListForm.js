import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, CustomInput, Row, Table } from 'reactstrap';
import CellControl from './CellControl';
import moment from 'jalali-moment'
import { Fragment } from 'react';
import Commands from './Commands';
import RowEditor from '../EngineDeveloper/FormBuilder/RowEditor';
import { ThemeDivider } from './ThemeControl';
import DroppableArea from './DroppableArea';
import DraggableItem from './DraggableItem';
import { InstanceController } from '../Engine/InstanceController';
import ButtonIcon from '../components/common/ButtonIcon';
import { faArrowCircleDown, faArrowCircleUp, faTrash } from '@fortawesome/free-solid-svg-icons';
const ListForm = ({ Form, DataListForm, CardOff, DM, Editor, ...rest }) => {
    const [listdata, setListData] = useState()
    useEffect(() => {
        setListData(DataListForm?.data)
    }, [DataListForm?.data])
    useEffect(() => {
        if (Form.BeforeValidate)
            DM.AddDataProperty(Form.FormID, 'BeforeValidate', Form.BeforeValidate);
    }, [Form])
    const [loading, setLoading] = useState(false);
    const [selectedRow, setSelectedRow] = useState();
    const onChange = async (value, pid, refrence) => {
        await DM.ChangeData(value, pid, refrence);
    };
    const [sortType, setsortType] = useState(1);
    const sort = (pid) => {
        if (listdata) {
            let type = 'str';
            let item1objType = listdata[0].Prop.find(x => x.PID === pid);
            let item1 = (item1objType?.DIS ?? item1objType?.IPV) ?? '';
            if (parseFloat(item1))
                type = 'num';
            listdata.sort((a, b) => {
                let item1obj = a.Prop.find(x => x.PID === pid);
                let item1 = (item1obj?.DIS ?? item1obj?.IPV) ?? '';
                let item2obj = b.Prop.find(x => x.PID === pid);
                let item2 = (item2obj?.DIS ?? item2obj?.IPV) ?? '';
                if (type === 'str')
                    return item1.localeCompare(item2) * sortType;
                if (parseFloat(item1) > parseFloat(item2))
                    return 1 * sortType;
                else if (parseFloat(item1) < parseFloat(item2))
                    return -1 * sortType;
                return 0;
            });
            setsortType(sortType * -1);
            setListData([...listdata])
        }
    }
    const RowDBLClick = (instance) => {
        setSelectedRow(instance)
        if (rest.RowDoubleClick)
            rest.RowDoubleClick(instance);
        if (Editor) {
            DM.SendToEditor(instance, Form.FormID, Editor);
        }
    }
    const FillProp = (propid) => {
        if (propid) {
            DM.FillProp(Form.FormID, propid);
        }
    }
    const AddToDrop = (content, rowIndex, colIndex, control) => {
        if (rest.mode === 'design')
            return <DroppableArea droppableId={rowIndex + '-' + colIndex}>
                <DraggableItem draggableId={rowIndex + '-' + colIndex + '#' + control.pid} index={0} >
                    {content}
                </DraggableItem>
            </DroppableArea>
        else return content;
    }
    return (<Fragment >
        {!CardOff ? <Row> <Commands commands={Form.Commands} DM={DM} formId={Form.FormID} type='1' /> </Row> : null}

        {Form?.rows[0].title ? <Row><ThemeDivider>{Form?.rows[0].title}</ThemeDivider></Row> : null}
        {rest.mode === 'design' ? <Row><RowEditor DM={DM} index={0} /></Row> : null}
        {rest.mode === 'design' ? <Row style={{ height: Form?.rows[0].height }} className='p-1 pb-2'  >
            {
                Form?.rows[0].controls.map((control, colIndex) => {
                    return (
                        <Col lg={control.col} xs='12' sm='6' md={control.col} key={'0-' + colIndex}>
                            {AddToDrop(<CellControl DM={DM} control={control}
                                rowIndex={0} colIndex={colIndex} {...rest}
                            />, 0, colIndex, control)}
                        </Col>
                    )
                })
            }
        </Row> :
            <div style={{ minHeight: '320px', overflowX: 'auto' }} >
                <Table hover striped   >
                    <thead>
                        <tr key='headRow'>
                            {DM.ActionType === 'template' ?
                                <>
                                    <th>%</th>
                                    <th>بالا</th>
                                    <th>پایین</th>
                                </>
                                : null}
                            {Form.HasRow ? <th>#</th> : null}

                            {
                                Form?.rows[0].controls.map((control, colIndex) => (<Fragment key={control.pid}>
                                    <th className='text-truncate' col={control.col}
                                        style={{ minWidth: control.minWidth ?? null }}
                                        onClick={() => DM.ActionType !== 'template' ? sort(control.pid) : null} >
                                        {DM.ActionType === 'template' ?
                                            <Button className='btn-block'
                                                onClick={() => FillProp(control.pid)}
                                                color={
                                                    DataListForm?.fillProp?.findIndex(x => x === control.pid) > -1
                                                        ? 'primary' : 'light'
                                                } >{control.title}</Button> : control.title
                                        }
                                    </th>
                                </Fragment>))
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            loading ? null :
                                listdata?.map((instance, index) => (
                                    <tr onDoubleClick={(e) => { e.preventDefault(); RowDBLClick(instance) }}
                                        style={selectedRow?.ID === instance.ID ? {
                                            background: '#2c7be5',
                                            color: 'white'
                                        } : null}
                                        key={instance.ID + index}>
                                        {DM.ActionType === 'template' ?
                                            <td><ButtonIcon icon={faTrash} color='danger' onClick={
                                                () => { DM.RemoveRow(Form.FormID, index) }} ></ButtonIcon></td>
                                            : null}
                                        {DM.ActionType === 'template' ?
                                            <td><ButtonIcon disabled={index < 1} icon={faArrowCircleUp} onClick={
                                                  () => { DM.RowUp(Form.FormID, index) }} ></ButtonIcon></td>
                                            : null}
                                        {DM.ActionType === 'template' ?
                                            <td><ButtonIcon disabled={index === listdata.length-1} icon={faArrowCircleDown}
                                             onClick={
                                                 () => { DM.RowDown(Form.FormID, index) } } ></ButtonIcon></td>
                                            : null}
                                        {Form.HasRow ? <td>{index + 1}</td> : null}
                                        {
                                            Form.rows[0].controls.map((control, colIndex) => {
                                                let resultlist = instance.Prop?.find((p) => p.PID === control.pid);
                                                if ((control?.Editable || DM.ActionType === 'template') && !rest.isReadonly) {
                                                    return (
                                                        <td className={"p-1 m-0 col-md-" + control.col} key={instance.ID + '-' + colIndex + '-' + index}>
                                                            <CellControl TitleOff={true} DM={DM} value={resultlist?.IPV} control={control}
                                                                onChange={onChange} refrence={instance} prop={resultlist} />
                                                        </td>
                                                    )
                                                }
                                                else {
                                                    try {
                                                        let pvalue = '';
                                                    if (resultlist !== null && resultlist !== undefined) {
                                                        pvalue = resultlist.DIS ? resultlist.DIS : resultlist.IPV;
                                                        if (control.controlType === "TimePeriod" || control.controlType === "DatePeriod"){
                                                            pvalue = moment(resultlist.IPV, 'MM/DD/YYYY')
                                                            .locale('fa')
                                                            .format('YYYY/M/D');
                                                        }
                                                        else if(control.controlType==="DateTime"){
                                                            pvalue = moment(resultlist.IPV, 'MM/DD/YYYY HH:mm')
                                                                .locale('fa')
                                                                .format('YYYY/M/D HH:mm');
                                                        }
                                                    }
                                                    return <td key={control.pid + index + colIndex}>{pvalue}</td>
                                                    } catch (error) {
                                                        return <td key={control.pid + index + colIndex}>{resultlist.IPV}</td>
                                                    }
                                                    
                                                }
                                            })
                                        }
                                        {rest.delete ? <td><Button color='danger' onClick={async () => await InstanceController.DeleteAsync(instance.ID)} >حذف</Button></td> : null}
                                    </tr>
                                ))
                        }
                    </tbody>
                </Table></div>}
    </Fragment>);
}
export default ListForm;
ListForm.propTypes = {
    Form: PropTypes.object.isRequired,
};