import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { Card, CardBody, CardFooter, ListGroup, ListGroupItem } from 'reactstrap'
import { Utility } from '../Engine/Common'
import { ThemeCardHeader } from '../EngineForms/ThemeControl'

function OnlineUserList() {
    const [list, setList] = useState([]);
    useEffect(() => {
        const fetch = async () => {
            let temp = await Utility.ActiveUsersList();
            setList(temp);
        }
        fetch();
    }, [])
    return (
        <Card>
            <ThemeCardHeader title='لیست کاربران آنلاین'></ThemeCardHeader>
            <CardBody>
                <ListGroup>
                    {list?.map((user) => <ListGroupItem>
                        {`${user.user} | ${user.person} | ${user.organization} | ${user.time}`}
                    </ListGroupItem>)}
                </ListGroup>
            </CardBody>
            <CardFooter />
        </Card>
    )
}

export default OnlineUserList