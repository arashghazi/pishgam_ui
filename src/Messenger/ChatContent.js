import React, { Component } from 'react';
import { CardBody } from 'reactstrap';
import ChatContentBody from './ChatContentBody';
import FormRouter from '../Forms/FormRouter';
import { GetNewTabIns, Utility } from '../Engine/Common';
import { InstanceController } from '../Engine/InstanceController';
import MessageTextArea from './MessageTextArea';
export default class ChatContent extends Component {
    state = {
        Instance: null,
        FormID: null,
        content:[]
    }
    condition = '{"OCID":"E23C2","BCs":[{"Bts":[{"PID":"PC19","PRA":"Equal","IPV":"#ID","NLC":"None","SRC":""}],"NLC":"None"}]}';

    async componentDidMount() {
        if (this.props.params !== undefined && this.props.params.stog !== undefined
            && this.state.FormID === null) {
            let data = GetNewTabIns(this.props.params.stog);
            this.state.FormID = data.FormID;
            this.state.Instance = data.Instance;
            let temp = await InstanceController.GetInstancesAsync(this.condition.replace('#ID', data.Instance.ID));
            let content = [];
            temp.map((msg) => {
                content = [...content, {
                    senderUserId: 2,
                    message: msg.Prop.find(x=>x.PID==='PC502').IPV,
                    time: {
                        hour: msg.Prop.find(x => x.PID === 'PC35')?msg.Prop.find(x => x.PID === 'PC35').IPV.split(' ')[1]:'',
                        date: msg.Prop.find(x => x.PID === 'PC35')?msg.Prop.find(x => x.PID === 'PC35').IPV.split(' ')[0]:''
                    }
                }]
            })
            this.state.content = content;
            this.setState({
                ...this.state
            })
        }
    }
    async addMessage(message) {
        let time = await Utility.GetNow();
        console.log(time)
        let messageIns = {
            ID: 'E23C2', Prop: [{ PID: 'PC502', IPV: message },
                { PID: 'PC509', IPV: 'E11C8I1' },
                { PID: 'PC19', IPV: this.state.Instance.ID },
                { PID: 'PC35', IPV: time.date + ' ' + time.hour }]
        }
        let result = await InstanceController.SaveInstanceAsync(messageIns);
        let content = [...this.state.content, {
            senderUserId: 1,
            message: message,
            time: {
                day: 'Mon',
                hour: time.hour,
                date: time.date
            }
        }]
        this.setState({
            ...this.state,
            content: content
        })
        //this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }
    render() {
        return (<><CardBody style={{ height:'auto' }}>
            {<FormRouter source={this.state.FormID} IsPanel={true} Data={this.state.Instance} FormTitle={true} />}
                    <ChatContentBody content={this.state.content} isOpenThreadInfo={false} />
            </CardBody>
            <MessageTextArea AddMessage={this.addMessage.bind(this)} />
            </>
        );
    }
}
