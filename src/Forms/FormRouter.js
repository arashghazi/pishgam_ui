import React, { Component } from 'react';
import InstanceDataGrid from './InstanceDataGrid';
import InstanceForm from './InstanceForm/InstanceForm';
import PanelForm from './PanelForm';
export default class FormRouter extends Component {
    state = {
        preProp: null
    }
    defualstate = {
        ShowType: 'vertical',
        FormID: '',
    }
    render() {
        let result = null;
        if (this.props.source?.split('F')?.length>0) {
            let type = this.props.source.split('F')[1].split('V')[0];
            switch (type) {
                case '0':
                    result = <InstanceForm {...this.props} 
                        key={this.props.source} id={this.props.source}
                        source={this.props.source} />;
                    break;
                case '1':
                    result = <InstanceDataGrid {...this.props} 
                          key={this.props.source}
                        id={this.props.source} source={this.props.source} />;
                    break;
                case '3':
                    result = <PanelForm 
                        key={this.props.source} source={this.props.source} />;
                    break;
                default:
                    result = <p>Error</p>
                    break;
            }
        }
        return result;
    }
}
