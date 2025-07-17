import React, { Component } from 'react';
import { Table, Row, Col } from 'reactstrap';
import RelationController from '../Engine/RelationController';
import EmployeForm from './StaticForm/EmployeForm';
import { Utility } from '../Engine/Common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FormManager from './FormManager';
import SearchControl from './SearchControl';
import GetDisplay from '../Engine/Lan/Context';

export default class RelationForm extends Component {
    state = {
        Data: { ...RelationController.DataModel },
        loading: false,
        SelectedItem: null
    }
    async componentDidMount() {
        await this.Initial();
    }
    async componentDidUpdate() {
        await this.Initial();
    }
    async Initial() {
        if (this.props.RelationType !== null && Utility.IsInstanceID(this.props.BaseId)
            && this.state.Data.baseID !== this.props.BaseId) {
            let data = {};
            data.baseID = this.props.BaseId;
            data.relationType = this.props.RelationType;
            data.relationTypeID = this.props.RelationType.ID;
            let related = await RelationController.GetRelationAsync(data);
            if (related !== undefined){
                data.dependencyIDes = related.dependencyIDes;
                if(((this.props.RelationControl & 2) !== 2 )&& data.dependencyIDes?.length===1)
                this.setState({ ...this.state, SelectedItem: data.dependencyIDes[0] })
            }
            this.setState({
                ...this.state,
                Data: data
            });
        }
    }
    CustomeComponent = <div></div>;
    SelectItem(item) {
        this.setState({ ...this.state, SelectedItem: item })
    }
    async Deleted(instance) {
        if (window.confirm(GetDisplay('delete-comfirm'))) {
            let data = { ...this.state.Data };
            
            data.dependencyIDes = [instance]
            let result = await RelationController.DeleteRelationAsync(data);
            if (result !== undefined) {
                let index = this.state.Data.dependencyIDes.findIndex(x => x.id === instance.id);
                this.state.Data.dependencyIDes.splice(index, 1);
                this.setState({
                    ...this.state,
                    Data: { ...this.state.Data }
                })
            }
        }
    }
    async FeedBack(instance) {
        if (this.state.Data.dependencyIDes.findIndex(x => x.id === instance?.id) < 0) {
            let data = { ...this.state.Data };
            data.dependencyIDes = [instance];
            let result = await RelationController.AddRelationAsync(data);
            if (result !== undefined) {
                this.state.Data.dependencyIDes = [...this.state.Data.dependencyIDes, instance]
                this.setState({
                    ...this.state,
                    Data: { ...this.state.Data }
                })
            }
        }
    }
    async SearchItem(item) {
        this.FeedBack(item);
    }
    loadComponent() {
        let result = [];
        if (Utility.IsClassID(this.state.Data?.relationType?.Refrence)) {
            result = [...result, <SearchControl key='relationSerach' autoClear TitleFree={true}
                type={this.state.Data.relationType.Refrence} onChange={this.SearchItem.bind(this)} placeHolder={GetDisplay('search')} />];
        }
        return result;

    }

    NewInstance() {
        let result = [];
        if (Utility.IsFormID(this.state.Data?.relationType?.FormID)) {
            result = [...result, <FormManager key={this.state.Data?.relationType?.FormID} CardOff CommandOff={true}
                formId={this.state.Data?.relationType?.FormID} FeedBack={this.FeedBack.bind(this)} insId={this.state.SelectedItem?this.state.SelectedItem.id:undefined} />];

        } else if (this.state.Data?.relationType !== null && this.state.Data?.relationType?.FormID === 'EmployeForm') {
            result = [...result, <EmployeForm key='relationEmploye' New={() => this.setState({ ...this.state, SelectedItem: 'new' })} 
            Data={this.state.SelectedItem} FeedBack={this.FeedBack.bind(this)} />];
        }
        return result;
    }
    
    render() {
        return (<Row>
             {(this.props.RelationControl & 4) === 4 ? <Col>
                {this.NewInstance()}
            </Col> : null}
            {((this.props.RelationControl & 1) === 1 || (this.props.RelationControl & 2) === 2 )? 
                <Col>
                    {(this.props.RelationControl & 1) === 1?this.loadComponent():null}
                    <Table hover striped >
                        <thead>
                            <tr>
                                <th>{this.state.Data?.relationType?.DIS}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.Data.dependencyIDes.map((item) => {
                                    return (<tr key={item.id} onDoubleClick={this.SelectItem.bind(this, item)}><td>
                                        {item.display??item?.Prop[0]?.IPV}
                                    </td>
                                        <td className='col-1'><FontAwesomeIcon onClick={this.Deleted.bind(this, item)} size='1x' icon={'trash'} className="text-danger" /></td>
                                    </tr>);
                                })
                            }
                        </tbody>
                    </Table>
                </Col> :null}
           
        </Row>);

    }
}
