import React, { useEffect, useState } from 'react';
import { Col, Label, Row } from 'reactstrap';
import Avatar from '../components/common/Avatar';
import Flex from '../components/common/Flex';
import { GetFile } from '../Engine/Common';

const AvatarControl = ({ prop, name }) => {
    useEffect(() => {
        if (prop?.IPV && !spath)
            getFile();
    })
    const [sfiles, setFiles] = useState();
    const [spath, setPath] = useState();
    const getFile = async () => {
        let file1 = await GetFile(prop.IPV)
        let base64ImageString = Buffer.from(file1.data, 'binary').toString('base64')
        setPath(base64ImageString)
    }
    return (
            <Row>
                    <Avatar src={sfiles ? sfiles.preview.url : (spath ? `data:image/jpeg;base64,${spath}` : null)}
                        size="2xl"
                        rounded="circle"
                    />
                    <Flex className='ml-2' justify='end' align='center'>
                        <Label>{name}</Label>

                    </Flex>

            </Row>

    );
};

export default AvatarControl;