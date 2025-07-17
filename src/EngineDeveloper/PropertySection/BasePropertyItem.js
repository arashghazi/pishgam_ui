import React from 'react';
import { Badge, CustomInput, Row } from 'reactstrap';
import Flex from '../../components/common/Flex';
import uuid from 'uuid/v1';
import DraggableItem from '../../EngineForms/DraggableItem';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const BasePropertyItem = ({ property, index, data, changeData, draggableId,onDelete, ...rest }) => {

    const IsKey = data.Extended?.KEYS?.findIndex(x => x === property.ID);
    const IsRequired = data.Extended?.Required?.findIndex(x => x === property.ID);
    const IsUnique = data.Extended?.Unique?.findIndex(x => x === property.ID);
    const IsShowProp = data.ShowProp?.split(',').findIndex(x => x === property.ID);
    const ChangedShow = () => {
        let tempsp = data.ShowProp !== '' ? data.ShowProp.split(',') : [];
        console.log(tempsp, IsShowProp);
        if (IsShowProp < 0)
            tempsp.push(property.ID);
        else
            tempsp.splice(IsShowProp, 1);
        data.ShowProp = '';
        tempsp.map((pid, index) => data.ShowProp += pid + (index + 1 < tempsp.length ? ',' : ''));
        console.log(tempsp, data.ShowProp);
        changeData({ ...data })
    }
    const ChangedKey = () => {
        if (!data.Extended.KEYS)
            data.Extended.KEYS = [];
        data.Extended.KEYS.splice(IsKey, IsKey >= 0 ? 1 : 0, IsKey >= 0 ? null : property.ID);
        changeData({ ...data })
    }
    const ChangedUnique = () => {
        if (!data.Extended.Unique)
            data.Extended.Unique = [];
        data.Extended.Unique.splice(IsUnique, IsUnique >= 0 ? 1 : 0, IsUnique >= 0 ? null : property.ID);
        changeData({ ...data })
    }
    const ChangedRequired = () => {
        if (!data.Extended.Required)
            data.Extended.Required = [];
        data.Extended.Required.splice(IsRequired, IsRequired >= 0 ? 1 : 0, IsRequired >= 0 ? null : property.ID);
        changeData({ ...data })
    }
    return (
        <DraggableItem draggableId={property.ID} index={index} >
            <Flex justify="between" >
            <Row>
                <CustomInput
                    type="checkbox"
                    id={uuid()}
                    checked={IsShowProp >= 0}
                    label={property.Name}
                    className="mb-0"
                    onChange={ChangedShow}
                />
            </Row>
            {onDelete?
                <FontAwesomeIcon icon={faTrash} color='red' onClick={()=>onDelete(property)}/>:null}
                </Flex>
            <Flex justify="between" >
                <Row>
                    <Badge style={{ fontSize: 8 }} color={'soft-primary'} pill> {property.StyleW2.Control}</Badge>
                    <Badge style={{ fontSize: 8 }} color={'soft-secondary'} pill> {property.StyleW2.DataType}</Badge>
                </Row>
                <Row>
                {changeData || IsKey >= 0?
                    <Badge onClick={ChangedKey} style={{ fontSize: 8 }} 
                        color={IsKey >= 0 ? 'warning' : 'transparent'} pill>Key</Badge>:null}
                        {changeData || IsUnique >= 0?
                    <Badge onClick={ChangedUnique} style={{ fontSize: 8 }} 
                        color={IsUnique >= 0 ? 'danger' : 'transparent'} pill>Unique</Badge>:null}
                        {changeData || IsRequired >= 0?
                    <Badge onClick={ChangedRequired} style={{ fontSize: 8 }} 
                        color={IsRequired >= 0 ? 'success' : 'transparent'} pill>Required</Badge>:null}
                </Row>
            </Flex>
        </DraggableItem>
    );
};

export default BasePropertyItem;