import React from 'react';
import FormManager from '../EngineForms/FormManager';
import MorfologyCellCounter from '../Pishgam/AnswerSheet/MorfologyCellCounter';
import BacteryAnswerSheet from '../Pishgam/AnswerSheet/bactery/BacteryAnswerSheet';
import TBAnswerSheet from '../Pishgam/AnswerSheet/TBAnswerSheet';
import HBVAnswerSheet from '../Pishgam/AnswerSheet/HBVAnswerSheet';
import { Utility } from '../Engine/Common';


const AdminPath = ({ path,params }) => {
    let result = null;
        console.log(path,params)
    if (path && Utility.IsFormID(path))
        result = <FormManager formId={path} insId={params.id} />;
    // else if (path === 'forms/morphologyanswersheet')
    //     result = <MorfologyCellCounter />
    else if (path === 'forms/morphologyanswersheet')
        result = <MorfologyCellCounter match={{path,params}} />
    else if (path === 'forms/hbvanswer')
        result = <HBVAnswerSheet match={{path,params}}/>
    else if (path === 'forms/tbanswer')
        result = <TBAnswerSheet  match={{path,params}} />
    else if (path === 'forms/bacterybnswersheet')
        result = <BacteryAnswerSheet match={{path,params}} />
    return result;
}

export default AdminPath