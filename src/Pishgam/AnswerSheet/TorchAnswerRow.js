import React from 'react';
import { Col, Input, Label, Row } from 'reactstrap';

const TorchAnswerRow = ({test,answers,onChanged,value}) => {

    return (
                <Row>
                    <Col>
                        <Label>آزمایش</Label>
                        <Input bsSize={'sm'} readOnly value={test.DIS}/>
                    </Col>
                    <Col>
                        <Label>نتیجه نهایی</Label>
                        <Input bsSize={'sm'} type='select' value={value} onChange={({target})=>onChanged(test,target.value)}>
                            <option>انتخاب نشده</option>
                            {answers.map(answer=><option value={answer.ID} key={answer.ID}>{answer.DIS}</option>)}
                        </Input>
                    </Col>
                </Row>

    );
};

export default TorchAnswerRow;