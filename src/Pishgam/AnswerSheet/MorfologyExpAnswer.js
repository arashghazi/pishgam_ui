import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Button, Card, CardBody, CardFooter, Input, Spinner, Table } from 'reactstrap';
import { NewInstance } from '../../Engine/BaseInstance';
import { SearchObject, Utility } from '../../Engine/Common';
import { FromManagerDataTemplate } from '../../Engine/FormDataTemplate';
import { InstanceController } from '../../Engine/InstanceController';
import FormManager from '../../EngineForms/FormManager'
import { ThemeCardHeader } from '../../EngineForms/ThemeControl';
const MorfologyExpAnswer = () => {
    const [cellTypeList, setCellTypeList] = useState();
    const [data, setData] = useState({ items: [], a: 1 });
    const [instance, setInstance] = useState(NewInstance());
    const [reportBuilding, setreportBuilding] = useState(0);
    useEffect(() => {
        const fetch = async () => {
            let temp = await SearchObject('', 'O30E12C47', '<>', ' order by convert(int,PC2) ');
            setCellTypeList(temp);
        }
        if (!cellTypeList)
            fetch();
    }, [cellTypeList])

    const onChangedCellCounterValue = (id, value, type) => {
        let items = data.items;
        let newitem = items.find(x => x.id === id);
        if (!newitem) {
            newitem = { id: id }
            items = [...items, newitem];
        }
        newitem[type] = value;
        setData({ ...data, items });
    }
    const PropertyChanged = async (value, prop) => {
        if (prop === 'P9') {
            let tempData = await FromManagerDataTemplate.LoadByAsync(`#${value.id}#expected#`);
            if (tempData) {
                let temp = JSON.parse(tempData.Json);
                temp.ID = tempData.ID;
                setData(temp);
                let ins = NewInstance();
                ins.Prop.push({ PID: 'P9', IPV: temp.Sample.id, OBJ: temp.Sample });
                ins.Prop.push({ PID: 'P59', IPV: temp.Diagnosis.id, OBJ: temp.Diagnosis });
                setInstance(ins)
            }
            else {
                let newdata = { items: [] };
                newdata.Sample = value;
                setData({ ...newdata });
                let ins = NewInstance();
                ins.Prop.push({ PID: 'P9', IPV: value.id, OBJ: value });
                setInstance(ins)
            }
        }
        else if (prop === 'P59') {
            let ins = { ...instance };
            let index = ins.Prop.findIndex(x => x.PID === 'P59');
            ins.Prop.splice(index, index > -1 ? 1 : 0, { PID: 'P59', IPV: value.id, OBJ: value })
            setInstance(ins)
            //setData(tempData);
        }
    }
    const Save = async () => {
        if (data) {
            data.Diagnosis = instance.Prop.find(x=>x.PID==='P59').OBJ;
            let temp = new FromManagerDataTemplate();
            if (data.ID)
                temp.ID = data.ID;
            temp.ConditionValue = `#${data.Sample.id}#expected#`;
            temp.Json = JSON.stringify(data);
            await temp.SaveAsync();
        }
    }
    const BuildReport=async()=>{
        setreportBuilding(1);

        let result = await InstanceController.InvokeMethod('O30E12C60', 'GetMorfoResultCount',
        `${instance.Prop.find(x=>x.PID==='P9').IPV}#${instance.Prop.find(x=>x.PID==='P59').IPV}`);
        if(Utility.IsInstanceID(result))
            setreportBuilding(2);
        console.log(result)
    }
    return (
        <Card>
            <ThemeCardHeader title='جواب صحیح مرفولوژی'>

            </ThemeCardHeader>
            <CardBody>
                <FormManager Data={[{ formId: 'O30E12C119F0V0', data: instance }]} formId='O30E12C119F0V0' CardOff onChange={PropertyChanged.bind(data)} />
                <Table dir="ltr" style={{ textAlign: 'left' }} hover striped >
                    <thead>
                        <tr>
                            <th>Cell Type</th>
                            <th>Minimum</th>
                            <th>Maximum</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            cellTypeList?.map(item => {
                                return (<tr key={item.id}>
                                    <td >{item.display}</td>
                                    <td >
                                        <Input
                                            bsSize="sm"
                                            className="mb-1"
                                            type="number"
                                            value={data?.items?.find(x => x.id === item.id)?.min ?? ''}
                                            onChange={({ target }) => onChangedCellCounterValue(item.id, target.value, 'min')}
                                        /></td>
                                    <td >
                                        <Input
                                            bsSize="sm"
                                            className="mb-1"
                                            type="number"
                                            value={data?.items?.find(x => x.id === item.id)?.max ?? ''}
                                            onChange={({ target }) => onChangedCellCounterValue(item.id, target.value, 'max')}
                                        /></td>
                                </tr>);
                            })
                        }
                    </tbody>
                </Table>
            </CardBody>
            <CardFooter >
                <Button className="mr-2" outline color='primary' onClick={Save} > {'ذخیره'}</Button >
                <Button className="mr-2" outline color='success' onClick={BuildReport} > {'ساخت گزارش'}</Button >
                {reportBuilding>0?(reportBuilding==1?<Spinner type='grow' color='success' />:<FontAwesomeIcon icon={faCheck}  />):null}
            </CardFooter>
        </Card>
    );
};

export default MorfologyExpAnswer;