import React, { Component } from 'react';
import { Row } from 'reactstrap';
import FormControl from './FormControl';


export class FormRow extends Component {
    render() {
        let { height, controls } = this.props.source;
        let { Instance } = this.props;
        if (Instance === null || Instance === undefined)
            Instance = { Prop: [], ID: '' }
        return (
            <Row style={{ height: `${height}px` }} form>
                {
                    controls.map(control => {
                        let pvalue = '';
                        let resultlist = Instance.Prop.find((p) => p.PID === control.pid);
                        if (resultlist !== null && resultlist !== undefined)
                            pvalue = resultlist.IPV;
                        return <FormControl PropertyChange={this.props.PropertyChange} Instance={Instance} PValue={pvalue} key={control.pid} Property={resultlist } source={control} />
                    })
                }
            </Row>
        );
    }
}
export default FormRow;