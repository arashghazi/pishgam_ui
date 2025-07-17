import React from 'react';
import { Spinner } from 'reactstrap';
//import creationImage from '../assets/img/illustrations/creating.png'
import creationImage from '../assets/img/illustrations/6.svg'
import Flex from '../components/common/Flex';

const NoData = ({ title, loading, beforeLoadingTitle }) => {
    return (<div className='m-4'>
        <h4 style={{ textAlign: 'center' }} >{loading ? beforeLoadingTitle : title}</h4>
        {
            loading ?<div style={{textAlign:'center'}}> <Spinner /></div> :
                <Flex justify='center' align='center'>
                    <img height={'200px'} alt='No data' src={creationImage} />
                </Flex>
        }
    </div>
    );
};

export default NoData;