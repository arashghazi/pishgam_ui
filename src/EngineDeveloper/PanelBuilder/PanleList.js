import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardFooter, FormGroup, Input, Label, ListGroup, ListGroupItem, ListGroupItemText, Row } from 'reactstrap';
import ObjectClassController from '../../Engine/ObjectClassController';
import { ThemeCardHeader } from '../../EngineForms/ThemeControl';

const PanleList = ({builder}) => {
    const [panleList, setPanleList] = useState([]);
    const [filterList, setFilterList] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            let list = await ObjectClassController.GetPanelListAsync();
            setPanleList(list);
            setFilterList(list);
        }
        if (panleList.length === 0)
            fetchData();
    })
    const onChange=(panle)=>{
        builder.ChangeForm(panle.id);
    }
    const onChangeSearch=({target})=>{
        setFilterList(panleList.filter(x =>x.display.includes(target.value)));
    }
    return (
        <Card >
            <ThemeCardHeader title='Panel List' />
            <CardBody>
                    <Label>Search Panel</Label>
                    <Input type='text' onChange={onChangeSearch}/>
            </CardBody>
            <CardBody style={{ height: '60vh', overflowY: 'auto' }}>
                    <ListGroup>
                        {filterList.map((panle) => (
                            <ListGroupItem key={panle.id} action value={panle.id} onClick={()=>onChange(panle)}>{panle.display}</ListGroupItem>
                        ))
                        }
                    </ListGroup>
            </CardBody>
            <CardFooter>
                <small>Panel Count:{panleList.length}</small>
            </CardFooter>
        </Card>

    );
};

export default PanleList;