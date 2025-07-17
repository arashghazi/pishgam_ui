import React, { useEffect, useState } from 'react';
import { InstanceController } from '../../Engine/InstanceController';
import BaseInstance from '../../Engine/BaseInstance';
import Parameters from '../../Engine/Parameters';
import OverAllReport from '../OverAllReport';
import MorfologyReport from '../AnswerSheet/MorfologyReport';
import ABOReport from '../AnswerSheet/BloodBank/ABOReport';
import AbReport from '../AnswerSheet/BloodBank/AbReport';
import CrossmatchReport from '../AnswerSheet/BloodBank/CrossmatchReport';
import ReportWithExpectedResult from '../AnswerSheet/ReportWithExpectedResult';
import BacteryReport from '../AnswerSheet/bactery/BacteryReport';
import StatisticalReport from '../StatisticalReport';
import TBReport from '../TBReport';
import HBVReport from '../HBVReport';

const LabratoaryReports = ({ match, history }) => {
    const [section, setSection] = useState();
    //const [parameters, setParameters] = useState();
    const [org, setOrganization] = useState();

    useEffect(() => {
        const fetch = async () => {
            let temp = await InstanceController.LoadInstanceAsync(match.params.dom);
            let ins = new BaseInstance(temp);
            setOrganization(await Parameters.GetValue('@org'));
            //setParameters(JSON.parse(ins.GetValue('PC556'))?.report);
            setSection(ins);
        };
        if (!section || section.ID !== match.params.dom)
            fetch();
    }, [match.params.dom])
    const MainComponent = () => {
        let result = null
        switch (match.params.dom) {
            case 'O30E23C2I13':
                result = <MorfologyReport lab={org} />;
                break;
            case 'O30E23C2I17':
                if (match.params.part === '1')
                    result = <ABOReport match={{ params: { dom: match.params.dom } }} lab={org} />;
                if (match.params.part === '2')
                    result = <AbReport match={{ params: { dom: match.params.dom } }} lab={org} />;
                if (match.params.part === '3')
                    result = <CrossmatchReport match={{ params: { dom: match.params.dom } }} lab={org} />;
                break;
            case 'O30E23C2I2':
            case 'O30E23C2I6':
            case 'O30E23C2I7':
                result = <ReportWithExpectedResult match={{ params: { dom: match.params.dom } }} lab={org} />
                break;
            case 'O30E23C2I12':
                result = <BacteryReport match={{ params: { dom: match.params.dom } }} lab={org} />
                break;
            case 'O30E23C2I8':
            case 'O30E23C2I9':
            case 'O30E23C2I21':
                result = <StatisticalReport match={{ params: { dom: match.params.dom } }} lab={org} />
                break;
            case 'O30E23C2I15':
                result = <TBReport match={{ params: { dom: match.params.dom } }} lab={org} />
                break;
            case 'O30E23C2I16':
                result = <HBVReport match={{ params: { dom: match.params.dom } }} lab={org} />
                break;
            default:
                result = <OverAllReport history={history} labratoary={org} report={section} />;
                break;
        }
        return result;
    }
    return (
        <div>
            {MainComponent()}
        </div>
    );
};

export default LabratoaryReports;