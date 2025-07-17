import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { Button, Col, Input, Label, Row, Table } from 'reactstrap';
import Flex from '../../../components/common/Flex';
import { Utility } from '../../../Engine/Common';
import { AntibioticsDisk, AntibioticsDiskMaker, AntibioticsResultInterpretation, AntibioticsRow } from './BacteryContext';

const Antibiotics = ({ Changed, Data }) => {
    const [antibioticsDisk, setAntibioticsDisk] = useState([]);
    const [antibioticsDiskMaker, setAntibioticsDiskMaker] = useState([]);
    const [antibioticsResultInterpretation, setAntibioticsResultInterp] = useState([]);
    const [selantibioticsDisk, setSelAntibioticsDisk] = useState('');
    const [selantibioticsDiskMaker, setSelAntibioticsDiskMaker] = useState('');
    const [selantibioticsResultInterp, setSelAntibioticsResultInterp] = useState('');
    const [growsHole, setGrowsHole] = useState(0);
    const [rows, setRows] = useState([]);

    useEffect(() => {
        async function fetchMyAPI() {
            let bg = new AntibioticsDisk();
            let list = await bg.GetAll();
            let bgk = new AntibioticsDiskMaker();
            let list1 = await bgk.GetAll();
            let bri = new AntibioticsResultInterpretation();
            let list2 = await bri.GetAll();
            setAntibioticsDisk(list);
            setAntibioticsDiskMaker(list1);
            setAntibioticsResultInterp(list2);
        }
        if (antibioticsDisk.length === 0)
            fetchMyAPI();
        if (Data && Data !== rows) {
            setRows(Data);
        }
        else if (!Data || Data.length === 0)
            setRows([]);
        Clear();
    }, [Data]);
    const AddRow = () => {
        if (rows.length < 10) {
            if (antibioticsDisk !== "notselected" && antibioticsDiskMaker !== "notselected"
                && antibioticsResultInterpretation !== "notselected" ) {
                if (rows.findIndex(x => x.AntibioticsDisk === selantibioticsDisk.ID) < 0) {
                    let row = new AntibioticsRow();
                    row.AntibioticsDisk = selantibioticsDisk;
                    row.AntibioticsDiskMaker = selantibioticsDiskMaker;
                    row.AntibioticsResultInterpretation = selantibioticsResultInterp;
                    row.GrowsHole = growsHole;
                    row.Rows = rows.length + 1;
                    let newrows = [...rows, row];
                    setRows(newrows);
                    Changed(newrows);
                    Clear();
                }
                else {
                    toast.warning('این آنتی بیوتیک قبلا اضافه شده است')
                }
            }

        }
        else {
            toast.error('در بیشترین حالت شما مجاز به ثبت 10 ردیف آنتی بیوتیک هستید')
        }
    }
    const Clear = () => {
        setSelAntibioticsDisk('notselected');
        setSelAntibioticsDiskMaker('notselected');
        setSelAntibioticsResultInterp('notselected');
        setGrowsHole(0);
    }
    const RemoveRow =async (index) => {
        let newrows = [...rows];
        let item = newrows[index];
        if(Utility.IsInstanceID( item?.ID))
            await item.DeleteAsync();
        newrows.splice(index, 1);
        newrows.map((item,index) => item.Rows=index+1);
        setRows(newrows)
        Changed(newrows);

    }
    return (<>
        <Row>
            <Label>آنتی بیوتیک</Label>
            <Input
                bsSize="sm"
                className="mb-1"
                type="select"
                onChange={(event) => setSelAntibioticsDisk(antibioticsDisk.find(x => x.ID === event.target.value))}
                value={selantibioticsDisk?.ID ?? 'notselected'}
            >
                <option value="notselected">
                    انتخاب نشده
                </option>
                {
                    antibioticsDisk.map(test => {
                        return <option key={test.ID} value={test.ID} > {test.DIS}</option>;
                    })
                }
            </Input>


            <Label>سازنده آنتی بیوتیک</Label>
            <Input
                bsSize="sm"
                className="mb-1"
                type="select"
                onChange={(event) => setSelAntibioticsDiskMaker(antibioticsDiskMaker.find(x => x.ID === event.target.value))}
                value={selantibioticsDiskMaker?.ID ?? 'notselected'}
            >
                <option value="notselected">
                    انتخاب نشده
                </option>
                {
                    antibioticsDiskMaker.map(ans => {
                        return (
                            <option key={ans.ID} value={ans.ID}>{ans.DIS}</option>
                        );
                    })
                }
            </Input>
            <Row>
                <Col>
                    <Label>قطرهاله رشد</Label>
                    <Input
                        bsSize="sm"
                        className="mb-1"
                        type="number"
                        onChange={(event) => { setGrowsHole(event.target.value) }}
                        value={growsHole ?? 0}
                    >
                    </Input>
                </Col>
                <Col>
                    <Label>تفسیر نتیجه</Label>
                    <Input
                        bsSize="sm"
                        className="mb-1"
                        type="select"
                        onChange={(event) => setSelAntibioticsResultInterp(antibioticsResultInterpretation.find(x => x.ID === event.target.value))}
                        value={selantibioticsResultInterp?.ID ?? 'notselected'}
                    >
                        <option value="notselected">
                            انتخاب نشده
                        </option>
                        {
                            antibioticsResultInterpretation.map(ans => {
                                return (
                                    <option key={ans.ID} value={ans.ID}>{ans.DIS}</option>
                                );
                            })
                        }
                    </Input>
                </Col>
                <Flex justify={'start'} align={'end'}>
                    <Button onClick={AddRow}>+</Button>
                </Flex>
            </Row>
        </Row>

        <Table className='mt-2' hover striped responsive style={{ fontSize: '12px' }}>
            <thead>
                <tr >
                    <th>ردیف</th>
                    <th>آنتی بیوتیک</th>
                    <th>سازنده آنتی بیوتیک</th>
                    <th>قطرهاله</th>
                    <th>تفسیر نتیجه</th>
                </tr>
            </thead>
            <tbody >
                {
                    rows.map((item, index) => {
                        return (<tr key={item.ID + index}>
                            <td className='col-2' >{item.Rows}</td>
                            <td className='col-4' >{item.AntibioticsDiskObject ? item.AntibioticsDiskObject.DIS : item.AntibioticsDisk}</td>
                            <td className='col-3'>{item.AntibioticsDiskMakerObject ? item.AntibioticsDiskMakerObject.DIS : item.AntibioticsDiskMaker}</td>
                            <td className='col-2'>{item.GrowsHole}</td>
                            <td className='col-3'>{item.AntibioticsResultInterpretationObject ? item.AntibioticsResultInterpretationObject.DIS : item.AntibioticsResultInterpretation}</td>
                            <td className='col-1'><FontAwesomeIcon onClick={(event) => { RemoveRow(index) }} size='1x' icon={'trash'} className="text-danger" /></td>
                        </tr>);
                    })
                }
            </tbody>
        </Table>
    </>)
};

export default Antibiotics;