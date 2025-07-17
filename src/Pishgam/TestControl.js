import React, { Component } from 'react'
import { Badge, CustomInput, Input, Label, ListGroupItem, Spinner } from 'reactstrap';
import { InstanceController } from '../Engine/InstanceController';
export default class TestControl extends Component {
    state = {
        Test: null,
        selected: false,
        Group: 'dark',
        GroupID: '',
        distribution: 'dark',
        distributionID: '',
    }

    async componentDidMount() {
        if (this.state.Test === null) {
            let result = await InstanceController.GetDisplay(this.props.TestId);
            this.setState({
                ...this.state,
                Test: result
            })
        }
    }
    async componentDidUpdate() {
        if (!this.state.loading
            && this.props.RunMethod ) {
                await this.Action();
            }
            
    }

    async Action() {
        if(!this.state.selected && this.state.Group==='dark'){
            this.props.EndProccess();
        }
        else if (this.state.selected) {
            this.setState({ ...this.state, selected: false, loading: true })
            let strValue = this.props.Domain.GetValue('PC19');
            if (this.props.TestId === "O30E12C5I1")
                strValue = 'O30E12C1#O30E12C8#P17#P18#P19,P23,P14,P20#P20#P10#P19,P23,P14#';
            let result = await InstanceController.InvokeMethod('O30E12C60', 'MakeAnalysisReport',
                `${strValue}${this.props.Sample.id}#${this.props.TestId}#${this.props.MinGroup}`);
            if (result) {
                this.setState({ ...this.state, Group: 'success', loading: false, selected: false })
            }
            else {
                this.setState({ ...this.state, Group: 'warning', loading: false, selected: false })
            }
            this.props.EndProccess();
        }
        
    }

    render() {
        return (
            <ListGroupItem>
                {this.state.Test !== null ?
                    <CustomInput
                        type="checkbox"
                        id={this.props.TestId}
                        label={this.state.Test?.display}
                        checked={this.state.selected}
                        onChange={() => (this.setState({ ...this.state, selected: !this.state.selected }))}
                    />
                    : <Spinner />}
                <Label>
                    <Badge color={'soft-' + this.state.Group} className="mr-1"> ساخت گزارش</Badge>
                </Label>
                {this.state.loading ?
                    <Label>
                        <Spinner size="sm" type='grow' />
                    </Label> : null}
            </ListGroupItem>
        )
    }
}
