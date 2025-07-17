import React from 'react'
import { useEffect } from 'react'
import { Fragment } from 'react'
import { useState } from 'react'
import { Button, Card, CardBody, CardFooter, CustomInput, Spinner } from 'reactstrap'
import Flex from '../../components/common/Flex'
import JoiSearchBox from '../../components/joi/JoiSearchBox'
import BaseInstance from '../../Engine/BaseInstance'
import { Utility } from '../../Engine/Common'
import ConditionMaker from '../../Engine/ConditionMaker'
import { InstanceController } from '../../Engine/InstanceController'
import { ThemeCardHeader } from '../../EngineForms/ThemeControl'
import AdminPath from '../../layouts/AdminPath'
import { ConstIdes, LabratoryControl, PeriodControl, PropConstIdes } from '../ConstIdes'
import NoData from '../NoData'

const AdminAnswersComponent = () => {
    const Period = { ...PeriodControl, value: '' };
    const Labratory = { ...LabratoryControl, Value: '' }
    const [domains, SetDomains] = useState([]);
    const [sampleList, SetSampleList] = useState([]);
    const [selectedList, SetSelectedList] = useState([]);
    const [period, setPeriod] = useState();
    const [lab, setLab] = useState();
    const [LoadForms, setLoadForms] = useState();
    useEffect(() => {
        const fetch = async () => {
            let result = await InstanceController.GetInstancesAsync('O30E23C2');
            SetDomains(result.filter(x=>x.ID!=='O30E23C2I11'&& x.ID!=='O30E23C2I20').map(item => {
                let temp = new BaseInstance(item);
                temp.data = JSON.parse(temp.GetValue('PC556'));
                return temp;
            }));
        }
        fetch();
    }, [])
    useEffect(() => {
        const fetch = async () => {
            let con = new ConditionMaker(ConstIdes.Sample);
            con.AddCondition('P3', '=', period?.id);
            let list = await con.GetResult();
            SetSampleList(list.map(item => new BaseInstance(item)));
        }
        fetch();
    }, [period])

    const fetch = async () => {
        setLoadForms(false);
        for (let index = 0; index < selectedList.length; index++) {
            const part = selectedList[index];
            part.headers = [];
            if (part.ID !== 'O30E23C2I16' && part.ID !== 'O30E23C2I15') {
                let classid = [];
                const samples = sampleList.filter(x => x.GetValue('P1') === part.ID);
                if (Array.isArray(part.data)) {
                    classid = [...part.data.map(f => f.form2 ? f.form2 : f.form)]
                }
                else
                    classid = [part.data.form2 ? part.data.form2 : part.data.form];
                for (let j = 0; j < samples.length; j++) {
                    const smp = samples[j];
                    if (classid) {
                        for (let g = 0; g < classid.length; g++) {
                            const cid = classid[g];
                            let con = new ConditionMaker(Utility.GetClassID(cid));
                            con.AddCondition(PropConstIdes.Sample, '=', smp.ID, 'AND')
                                .AddCondition(PropConstIdes.Lab, '=', lab.id);
                            let headers = await con.GetResult();
                            if (Array.isArray(headers) && headers.length > 0) {
                                let formid = part.data.form2 ? part.data.form : cid;
                                if (Array.isArray(part.data)) {
                                    formid = part.data.find(f => f.form === cid || f.form2 === cid).form
                                }
                                part.headers = [...part.headers, ...headers.map(h => ({ form: formid, header: h.ID }))];
                            }
                        }

                    }
                }
            }
            else {
                let con = new ConditionMaker(Utility.GetClassID(part.data.form2));
                con.AddCondition(PropConstIdes.Period, '=', period.id, 'AND')
                    .AddCondition(PropConstIdes.Lab, '=', lab.id);
                let headers = await con.GetResult();
                if (Array.isArray(headers) && headers.length > 0) {
                    part.headers = [...part.headers, ...headers.map(h => ({ form: part.data.form, header: h.ID }))];
                }

            }
        }
        SetSelectedList([...selectedList]);
        setLoadForms(true);
    }
    return (<>
        <Card>
            <ThemeCardHeader title='بررسی پاسخنامه های آزمایشگاه'>
                <Flex>
                    <JoiSearchBox Control={Period}
                        TitleFree={true}
                        type={Period.source} onChange={(pid, value) => setPeriod(value)}
                        PID={Period.pid} placeHolder={Period.title} />
                    <JoiSearchBox Control={Labratory}
                        TitleFree={true}
                        type={Labratory.source} onChange={(pid, value) => setLab(value)}
                        PID={Labratory.pid} placeHolder={Labratory.title} />
                </Flex>
            </ThemeCardHeader>
            <CardBody>
                <CustomInput
                    type="checkbox"
                    id={'allPart'}
                    label={<h5>همه بخش ها</h5>} className='text-nowrap m-2 p-2'
                    checked={selectedList.length === domains.length}
                    onChange={() => {
                        if (selectedList.length === domains.length) {
                            SetSelectedList([]);
                        }
                        else {
                            SetSelectedList([...domains]);
                        }
                    }}
                />
                <Flex wrap  >
                    {
                        domains?.map((item) => <CustomInput
                            type="checkbox"
                            id={item.ID} key={item.ID}
                            label={item.DIS} className='text-nowrap m-2 p-2'
                            checked={selectedList?.findIndex(x => x.ID === item.ID) > -1}
                            onChange={() => {
                                let itemInex = selectedList?.findIndex(x => x.ID === item.ID);
                                if (itemInex > -1) {
                                    let newlist = [...selectedList];
                                    newlist.splice(itemInex, 1);
                                    SetSelectedList(newlist);
                                }
                                else {
                                    SetSelectedList([...selectedList, item])
                                }
                            }}
                        />
                        )
                    }
                </Flex>
            </CardBody>
            <CardFooter >
                <div className='float-right'>
                    <Button color='primary' onClick={fetch} >بارگزاری</Button>
                </div>
            </CardFooter>
        </Card>
        {
            LoadForms ? selectedList.map((ins) => {
                let result = [];
                if (ins.headers?.length > 0) {

                    for (let index = 0; index < ins.headers.length; index++) {
                        const header = ins.headers[index];
                        result = [...result, <div className='mt-2' key={header.form}><AdminPath className='mt-2' path={header.form} params={{ id: header.header }} /></div>];
                    }
                }
                else {
                    result = [...result, <Card className='mt-2' key={result.length} ><ThemeCardHeader title={`سند پاسخنامه ${ins.DIS} یافت نشد`} /></Card>];
                }
                return <Fragment key={ins.ID}>{result}</Fragment>;
            }) : (LoadForms === false ? 
                <Card className='mt-2'>
                <CardBody>
                    <Flex justify={'center'}>
                        <NoData title={<div>
                            <h5>{'درحال واکشی پاسخنامه های آزمایشگاه '+(lab?.display??'')}</h5>
                            <Spinner/></div>
                            }/>
                    </Flex>
                    
                </CardBody>
            </Card>  : null)
        }
       
    </>
    )
}

export default AdminAnswersComponent