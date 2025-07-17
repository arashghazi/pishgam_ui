import React, { useEffect, useState } from 'react'
import { Col, Input, Label, Row } from 'reactstrap';
import { BacteryDiagnosis, BacteryGender, BacterySpices } from './BacteryContext';

const Diagnosis = ({ Changed,Data }) => {
    const [bacteryGender, setBacteryGender] = useState([]);
    const [bacterySpecies, setBacterySpecies] = useState([]);
    const [selBacteryGender, setSelBacteryGender] = useState("");
    const [selBacterySpecies, setSelBacterySpecies] = useState("");
    useEffect(() => {
        async function fetchMyAPI() {
            let bg = new BacteryGender();
            let list = await bg.GetAll();
            setBacteryGender(list)
        }
        async function UpdateData() {
            setSelBacteryGender(Data.BacteryGender);
            let bs = new BacterySpices();
            let list = await bs.getActiveListby(Data.BacteryGender);
            setBacterySpecies(list);
            if (Data.BacterySpices !== selBacterySpecies) {
                setSelBacterySpecies(Data.BacterySpices);
            }
        }
        if (bacteryGender.length === 0)
            fetchMyAPI();
        if (Data?.BacteryGender && Data.BacteryGender !== selBacteryGender) {
            UpdateData();
        }
        if(!Data?.BacteryGender ){
            setSelBacteryGender("");
            setSelBacterySpecies("");
        }
    }, [Data]);
    const testChanged = async (event) => {
        setBacterySpecies([]);
        setSelBacterySpecies("");
        let value = event.target.value;
        setSelBacteryGender(value);
        let bs = new BacterySpices();
        let list =await bs.getActiveListby(value);
        setBacterySpecies(list);
        Data.BacteryGender = value;
        Data.BacterySpices ="";
        Changed(Data)
    }
    const test = '';
    return (
        <Row>
            <Col >
                <Label>جنس</Label>
                <Input
                    bsSize="sm"
                    className="mb-1"
                    type="select"
                    onChange={testChanged}
                    value={selBacteryGender}
                >
                    <option value="">
                        انتخاب نشده
                    </option>
                    {
                        bacteryGender.map(test => {
                                return <option key={test.ID} value={test.ID} > {test.DIS}</option>;
                        })
                    }
                </Input>
            </Col>
            <Col>
                <Label>گونه</Label>
                <Input
                    bsSize="sm"
                    className="mb-1"
                    type="select"
                    onChange={(event) => {
                        setSelBacterySpecies(event.target.value)
                        Data.BacterySpices = event.target.value;
                        Changed(Data);
                    }}
                    value={selBacterySpecies}
                >
                    <option value="">
                        انتخاب نشده
                    </option>
                    {
                        bacterySpecies.map(ans => {
                            return (
                                <option key={ans.ID} value={ans.ID}>{ans.DIS}</option>
                            );
                        })
                    }
                </Input>
            </Col>
        </Row>
    )
};

export default Diagnosis;