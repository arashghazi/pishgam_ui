import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'reactstrap';
import { ThemeDivider } from './ThemeControl'
import { Fragment } from 'react';
import FormManager from './FormManager';
import Commands from './Commands';
import RowEditor from '../EngineDeveloper/FormBuilder/RowEditor';
import CellEditor from '../EngineDeveloper/PanelBuilder/CellEditor';
import DroppableArea from './DroppableArea';
import DraggableItem from './DraggableItem';
const PanelForm = ({ Form, Data, onChangeData, DM, onSelected, ...rest }) => {

    const DesignMode=(content)=>{
        if(rest.mode === 'design')
        content = <DroppableArea droppableId='PanelGround' > 
            {content}
        </DroppableArea>
        return content;
    }
    const rowDesignMode=(content,rowIndex)=>{
        if(rest.mode === 'design')
        content = <DraggableItem draggableId={'row-'+rowIndex} index={rowIndex} key={rowIndex}> 
        <RowEditor DM={DM} index={rowIndex} panel/>
            {content}
        </DraggableItem>
        return content;
    }
    return (<>{DesignMode(
        Form?.rows?.map((row, rowIndex) => {
            let controls = row?.controls ?? row?.sections;
            return ( rowDesignMode(<Fragment key={rowIndex}>
                {row.title && row.title !== '' ? <div><ThemeDivider>{row.title}</ThemeDivider></div> : null}
                <Row className='p-1 pb-2'  >
                    {Array.isArray(controls) ?
                        controls?.map((section, colIndex) => {
                            return (
                                <Col lg={section.col} xs='12' sm='6' md={section.col} key={rowIndex + '-' + colIndex}>
                                    {section.title !== '' ? <ThemeDivider>{section.title}</ThemeDivider> : null}
                                    {rest.mode === 'design' ? 
                                    <CellEditor DM={DM} {...rest} rowIndex={rowIndex} colIndex={colIndex} formId={section.formid} >
                                        <FormManager Data={Data} DM={DM} CardOff={true} formId={section.formid}
                                        Editor={section.Editor}
                                        key={section.formid}
                                    /></CellEditor> : 
                                    <FormManager Data={Data} DM={DM} CardOff={true} formId={section.formid}
                                        Editor={section.Editor}
                                        key={section.formid}
                                    />}

                                </Col>
                            )
                        }) : <Commands commands={Form.Commands} DM={DM} Mode={rest.mode} type='3' />
                    }
                    {/* {!!row?.Commands ?
                        <Commands commands={Form.Commands} DM={DM} type='3'/> : null} */}
                </Row>
            </Fragment>,rowIndex));
        }))
    }

    </>);
}
export default PanelForm;
PanelForm.propTypes = {
    Form: PropTypes.object.isRequired,
};