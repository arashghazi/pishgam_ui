import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { Button, Col, Input, Label, Row, Table } from 'reactstrap';
import Flex from '../../../components/common/Flex';
import { Utility } from '../../../Engine/Common';
import { BacteryTest, BacteryTestResult, BacteryTestRow } from './BacteryContext';

const DiagnosisTest = ({ Changed, Data }) => {
    const [bacteryTest, setBacteryTest] = useState([]);
    const [selbacteryTest, setSelBacteryTest] = useState("");
    const [bacteryResultTest, setBacteryResultTest] = useState([]);
    const [selbacteryResultTest, setSelBacteryResultTest] = useState("");
    const [rows, setRows] = useState([]);
    useEffect(() => {
        async function fetchMyAPI() {
            let bg = new BacteryTest();
            let list = await bg.GetAll();
            setBacteryTest(list);
        }
        if (bacteryTest.length === 0)
            fetchMyAPI();
        if (Data && Data !== rows) {
            setRows(Data);
        }
        else if (!Data || Data.length===0)
        setRows([]);
        setSelBacteryTest("");
        setSelBacteryResultTest("");
    }, [Data]);
    const TestChanged = async (event) => {
        setBacteryResultTest([]);
        let value = event.target.value;
        let objvalue = bacteryTest.find(x => x.ID === value);
        setSelBacteryTest(objvalue);
        setSelBacteryResultTest("");
        let bs = new BacteryTestResult();
        let list = await bs.getListby(value);
        setBacteryResultTest(list);
    }
    const AddRow = () => {
        if (selbacteryTest !== "" && selbacteryResultTest !== "") {
            if (rows.findIndex(x => x.BacteryTest === selbacteryTest.ID && x.Result === selbacteryResultTest.ID) < 0) {
                let row = new BacteryTestRow();
                row.BacteryTest = selbacteryTest;
                row.Result = selbacteryResultTest;
                row.Rows = rows.length + 1;
                setRows([...rows, row]);
                setSelBacteryTest("");
                setSelBacteryResultTest("");
                Changed([...rows, row]);
            }
            else{
                toast.warning('این تست قبلا اضافه شده است')
            }
        }
    }
    const RemoveRow = async(index) => {
        let newrows = [...rows]
        let item = newrows[index];
        if(Utility.IsInstanceID( item.ID))
            await item.DeleteAsync();
        newrows.splice(index, 1);

        setRows(newrows)
        Changed(newrows)

    }
    const ResultSelected = (event) => {
        if (event.target.value !== "") {
            let obj = bacteryResultTest.find(x => x.ID === event.target.value)
            setSelBacteryResultTest(obj);
        }
        else
            setSelBacteryResultTest(event.target.value);
    }
    return (<>
        <Row>
            <Col xs={6} >
                <Label>تست تشخیصی</Label>
                <Input
                    bsSize="sm"
                    className="mb-1"
                    type="select"
                    onChange={TestChanged}
                    value={selbacteryTest?.ID ?? ""}
                >
                    <option value="">
                        انتخاب نشده
                    </option>
                    {
                        bacteryTest.map(test => {
                            return <option key={test.ID} value={test.ID} > {test.DIS}</option>;
                        })
                    }
                </Input>
            </Col>
            <Col xs={4} >
                <Label>نتیجه</Label>
                <Input
                    bsSize="sm"
                    className="mb-1"
                    type="select"
                    onChange={ResultSelected}
                    value={selbacteryResultTest?.ID ?? ''}
                >
                    <option value="">
                        انتخاب نشده
                    </option>
                    {
                        bacteryResultTest.map(ans => {
                            return (
                                <option key={ans.ID} value={ans.ID}>{ans.DIS}</option>
                            );
                        })
                    }
                </Input>
            </Col>
        <Flex  justify={'end'} align={'end'}>
            <Button onClick={AddRow}>+</Button>
        </Flex>
        </Row>
        <Table hover striped style={{ fontSize: '12px' }} >
            <thead>
                <tr>
                    <th>تست تشخیصی</th>
                    <th>نتیجه</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {
                    rows.map((item, index) => {
                        return (<tr key={item.ID + index}>
                            <td className='col-9' >{item.BacteryTestObject ? item.BacteryTestObject.DIS : item.BacteryTest}</td>
                            <td className='col-2'>{item.ResultObject ? item.ResultObject.DIS : item.Result}</td>
                            <td className='col-1'><FontAwesomeIcon onClick={(event) => { RemoveRow(index) }} size='1x' icon={'trash'} className="text-danger" /></td>
                        </tr>);
                    })
                }
            </tbody>
        </Table>
    </>
    )
};

export default DiagnosisTest;