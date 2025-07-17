import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Badge, Button, FormGroup, Input, Label, ListGroup, ListGroupItem } from 'reactstrap';
import ObjectClassController from '../../Engine/ObjectClassController';
import Flex from '../../components/common/Flex'
import { toast } from 'react-toastify';
const ClassList = () => {
    const [entityList, setEntityList] = useState([]);
    const [classes, setClasses] = useState([]);
    const [data, setData] = useState({});
    const history = useHistory();
    useEffect(() => {
        const FetchEntities = async () => {
            let entities = await ObjectClassController.GetAllEntities();
            setEntityList(entities);
        }

        if (entityList.length === 0)
            FetchEntities();

    }, [])
    const selectHandler = (id) => {
        history.push(`/env/developer/classmanager/${id}`);
    }
    const copyCode=async(type,id)=>{
        console.log(id,type)
        let result = await ObjectClassController.GetCode(id,type);
        await navigator.clipboard.writeText(result);
        toast.success('Code copy to clipboard.');
    }
    return (
        <div>
            <FormGroup>
                <Label htmlFor='EID'>{"Entity"}
                </Label>
                <Input
                    type="select"
                    name='EID'
                    id='EID'
                    defaultValue={data?.EID}
                    value={data?.EID ? data.EID : undefined}
                    onChange={async (e) => {
                        setData({ ...data, EID: e.target.value })
                        let list = await ObjectClassController.GetClasses(e.target.value);
                        setClasses(list);
                        console.log(list)
                    }}
                >
                    <option value='' ></option>
                    {entityList.map(entity => (<option key={entity.id} value={entity.id}>{entity.display}</option>))}
                </Input>
            </FormGroup>
            <ListGroup>
                {
                    classes.map(oc => <ListGroupItem value={oc.ID} onDoubleClick={selectHandler.bind(this, oc.ID)} key={oc.ID}>
                        <Flex justify='between'>
                            {oc.Context}
                            <div>
                                <Badge tag='button' style={{cursor:'hand'}} onClick={copyCode.bind(this,'dart',oc.ID)} color='primary' >.dart</Badge>
                                <Badge tag='button' onClick={copyCode.bind(this,'js',oc.ID)}  color='success'>.js</Badge>
                            </div>
                        </Flex>
                    </ListGroupItem>)
                }
            </ListGroup>
        </div>
    );
};

export default ClassList;