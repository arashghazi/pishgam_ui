import React from 'react';
import Divider from '../components/common/Divider';
import FalconCardHeader from '../components/common/FalconCardHeader';

const ThemeDivider = (props) => {
    return <Divider {...props} />;
};
const ThemeCardHeader = (props) => {
    // if(props.mode==='design')
    // return <CardHeader {...props} >
    //     <Input type='text' value={props.title} />
    // </CardHeader>;
    // else 
    return <FalconCardHeader {...props} />;
};

export { ThemeCardHeader, ThemeDivider };