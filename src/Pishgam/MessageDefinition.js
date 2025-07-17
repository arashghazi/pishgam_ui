
import BaseInstance, { NewInstance, NewProperty } from "../Engine/BaseInstance";
import React, { useEffect, useState } from 'react';
import { ThemeCardHeader } from "../EngineForms/ThemeControl";
import { Button, Card, CardBody, Col, Input, Label, Row } from "reactstrap";
import { ConstIdes, PropConstIdes } from "./ConstIdes";
import JoiSearchBox from "../components/joi/JoiSearchBox";
import ConditionMaker from "../Engine/ConditionMaker";
const Period = {
    col: "3",
    pid: PropConstIdes.Period,
    controlType: "SearchControl",
    title: 'ٍکلید Enter را بزنید ودوره مورد نظر را انتخاب نمایید',
    source: ConstIdes.Period
};
const MessageDefinition = ({ typeid }) => {
    useEffect(() => {
        setMessage(new Message());
        setClear('Clear');
    }, [typeid])
    const [message, setMessage] = useState(new Message());
    const [clear, setClear] = useState();
    const [value1, setValue1] = useState();
    const [value2, setValue2] = useState();
    const Sample = {
        col: "3",
        pid: PropConstIdes.Sample,
        controlType: "SearchControl",
        title: "نمونه مورد نظر را انتخاب نماييد و يا سال مورد نظر را نوشته و كليد Enter را بزنيد",
        source: ConstIdes.Sample
    };
    const SampleChanged = async (value, obj) => {
        setClear('');
        let temp = new Message();
        temp.Title = '';
        temp.Content = '';
        temp.Refrence = value1;
        temp.ReplyMessage = value2;
        setMessage(temp);
        setValue1(value);
    }
    const SearchMessage = async (value,pid) => {
        let v1=value1;
        let v2=value2;
        if(typeid!==3){
            SampleChanged(value);
        }
        if(pid===Period.pid){
            SampleChanged(value);
            v1=value;
        }
        else{
            ReplyMessage(value);
            v2=value;
        }
        let con = new ConditionMaker('E23C2');
        if (typeid === 3 && (v1  && v2)) {

            con.AddCondition('PC19', '=', v1??value1, 'AND')
                .AddCondition('P174', '=', typeid, 'AND')
                .AddCondition('PC510', '=', v2??value2);
        }
        else if (typeid !== 3 && v1) {
            con.AddCondition('PC19', '=', v1, 'AND')
                .AddCondition('P174', '=', typeid);
        }
        let temp;
        if (con.BCs) {
            let result = await con.GetResult();
            console.log(typeid,result,con)
            if (result?.length > 0) {
                temp = (new Message(result[0]));
            }
        }
        if(!temp) {
            temp = new Message();
            temp.Title = '';
            temp.Content = '';
            temp.Refrence = v1;
            temp.ReplyMessage = v2;
        }
        setMessage(temp);
    }
    const ReplyMessage = async (value, pid) => {
        setClear('');
        setValue2(value);
    }
    const Save = async () => {
        message.MessageType = typeid;
        message.Refrence = value1;
        message.ReplyMessage = value2;
        await message.SaveAsync();
    }
    const Delete =async () => { 
        if(message.ID){
            await message.DeleteAsync(true);
        }
    }
    const titlestr = () => {
        let result = 'فرم تعریف پیام پاسخنامه';
        switch (typeid) {
            case 2:
                result = 'فرم تعریف پیام برای گزارشات (نمونه)';
                break;
            case 3:
                result = 'فرم تعریف پیام برای گزارشات (دوره)';
                break;
            default:
                break;
        }
        return result;
    }
    return (
        <Card >
            <ThemeCardHeader title={titlestr()} />
            <CardBody>
                <Row>
                    <Col>
                        {typeid !== 3 ? <JoiSearchBox Control={Sample}
                            TitleFree={false} PValue={clear}
                            operator={`like N'%{#}%'`}
                            type={Sample.source} onChange={(value,obj)=>SearchMessage(value,Period.pid)} PIDS='P156,P3'
                            PID={Sample.pid} placeHolder={Sample.title} />
                            : <JoiSearchBox Control={Period}
                                TitleFree={false} PValue={clear}
                                type={Period.source} onChange={(value,obj)=>SearchMessage(value,Period.pid)}
                                PIDS='PC88,P2' operator={`like N'%{#}%'`}
                                PID={Period.pid} placeHolder={Period.title} />
                        }
                    </Col>
                    {typeid===3? <Col>
                        <JoiSearchBox Control={Period}
                            TitleFree={false} PValue={clear}
                            type={ConstIdes.Section} onChange={(value)=>SearchMessage(value,'PC510')}
                            PIDS='PC88' operator={`like N'%{#}%'`}
                            PID={'PC510'} placeHolder={Period.title} />
                    </Col>:null}
                </Row>
                <Row >
                    <Col>
                        <Label>عنوان</Label>
                        <Input value={message.Title ?? ''} onChange={({ target }) => {
                            message.Title = target.value;
                            setMessage(new Message(message.Instance))
                        }} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Label>محتوی پیام</Label>
                        <Input style={{ minHeight: '200px' }} type="textarea" value={message.Content ?? ''} onChange={({ target }) => { message.Content = target.value; setMessage(new Message(message.Instance)) }} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <CardBody>
                            <div className='float-right' type="inline" >
                                <Button color="primary" onClick={Save} className="mr-1" >ذخیره</Button>
                                <Button color="danger" onClick={Delete} >حذف</Button>
                            </div>
                        </CardBody>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
};

export default MessageDefinition;

export class Message extends BaseInstance {
    constructor(instance) {
        if (instance === undefined) {
            instance = NewInstance('E23C2');
            Message.PIDs.map((pid) =>
                instance.Prop.push(NewProperty(pid)));
        }
        super(instance);
    }
    static PIDs = ['PC95', 'PC42', 'PC502', 'PC35', 'PC509', 'PC335', 'PC510', 'PC517', 'PC604', 'PC19', 'P174'];
    set Title(value) {
        this.SetValue(Message.PIDs[0], value);
    }
    get Title() {
        return this.GetValue(Message.PIDs[0]);
    } set Importance(value) {
        this.SetValue(Message.PIDs[1], value);
    }
    get Importance() {
        return this.GetValue(Message.PIDs[1]);
    } set Content(value) {
        this.SetValue(Message.PIDs[2], value);
    }
    get Content() {
        return this.GetValue(Message.PIDs[2]);
    } set EndTime(value) {
        this.SetValue(Message.PIDs[3], value);
    }
    get EndTime() {
        return this.GetValue(Message.PIDs[3]);
    } set Sender(value) {
        this.SetValue(Message.PIDs[4], value);
    }
    get Sender() {
        return this.GetValue(Message.PIDs[4]);
    } set Time(value) {
        this.SetValue(Message.PIDs[5], value);
    }
    get Time() {
        return this.GetValue(Message.PIDs[5]);
    } set ReplyMessage(value) {
        this.SetValue(Message.PIDs[6], value);
    }
    get ReplyMessage() {
        return this.GetValue(Message.PIDs[6]);
    } set MessageState(value) {
        this.SetValue(Message.PIDs[7], value);
    }
    get MessageState() {
        return this.GetValue(Message.PIDs[7]);
    } set MessageReciver(value) {
        this.SetValue(Message.PIDs[8], value);
    }
    get MessageReciver() {
        return this.GetValue(Message.PIDs[8]);
    } set Refrence(value) {
        this.SetValue(Message.PIDs[9], value);
    }
    get Refrence() {
        return this.GetValue(Message.PIDs[9]);
    } set MessageType(value) {
        this.SetValue(Message.PIDs[10], value);
    }
    get MessageType() {
        return this.GetValue(Message.PIDs[10]);
    }
}