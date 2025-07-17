import React, { Component } from 'react';
import BitCondition from './BitCondition';

export default class BlockCondition extends Component {
    state = { Bts: [], NLC:'None'}
    render() {
        return (
            <>
                {this.props.Source.Bts.map((bit) => (
                    <BitCondition Source={bit} Properties={this.props.Properties} />
                ))}
            </>
        );
    }
}
