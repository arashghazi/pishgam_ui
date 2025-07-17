import React, { Component } from 'react';
import { Input } from 'reactstrap';


export default class ComboBox extends Component {

    onChanged(item) {
        this.props.onChanged(item.target.value, this.props.Source.find(x => x.id === item.target.value));
    }
    render() {
        return (
            <Input type="select" onChange={this.onChanged.bind(this)}>
                <option>انتخاب نشده</option>
                {
                    this.props.Source.map((ins) => (
                        <option key={ins.id } value={ins.id} >{ins.display}</option>
                    ))
                }
            </Input>
        );
    }
}
