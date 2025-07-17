import React, { Component } from 'react';
import { Table, Row, Col, Label } from 'reactstrap';
import JoiSearchBox from '../../components/joi/JoiSearchBox';
import RelationController from '../../Engine/RelationController';
import EmployeForm from '../StaticForm/EmployeForm';
import { Utility } from '../../Engine/Common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FormRouter from '../FormRouter';

export default class RelationForm extends Component {
    state = {
        Data: {...RelationController.DataModel},
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
            if (related !== undefined)
                data.dependencyIDes = related.dependencyIDes;
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
        if (window.confirm('آیا از حذف این آیتم مطمئن هستید؟')) {
            let data = { ...this.state.Data };
            let index = data.dependencyIDes.findIndex(x => x.ID === instance.ID);
            data.dependencyIDes = [instance]
            let result = await RelationController.DeleteRelationAsync(data);
            if (result !== undefined) {
                this.state.Data.dependencyIDes.splice(index, 1);
                this.setState({
                    ...this.state,
                    Data: { ...this.state.Data }
                })
            }
        }
    }
    async FeedBack(instance) {
        if (this.state.Data.dependencyIDes.findIndex(x => x.id === instance.id) < 0) {
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
    async SearchItem(id, item) {
        this.FeedBack(item);
    }
    loadComponent() {
        let result = [];
        if (Utility.IsClassID(this.state.Data?.relationType?.Refrence)) {
            result = [...result, <JoiSearchBox key='relationSerach' autoClear TitleFree={true}
                type={this.state.Data.relationType.Refrence} onChange={this.SearchItem.bind(this)} placeHolder={"جستجو"} />];
        }
        return result;
        
    }
    NewInstance() {
        let result = [];
        if (Utility.IsFormID(this.state.Data?.relationType?.FormID)) {
            result = [...result, <FormRouter key={this.state.Data?.relationType?.FormID}
                source={this.state.Data?.relationType?.FormID} />];

        } else if (this.state.Data?.relationType !== null && this.state.Data?.relationType?.FormID === 'EmployeForm') {
            result = [...result, <EmployeForm key='relationEmploye' HideNew Data={this.state.SelectedItem} FeedBack={this.FeedBack.bind(this)} />];
        }
        return result;
    }
    render() {
        return (<Row>
            <Col>
                {this.loadComponent()}
                <Table hover striped >
                    <thead>
                        <tr>
                            <th>{this.state.Data?.relationType?.DIS }</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.Data.dependencyIDes.map((item) => {
                                return (<tr key={item.id} onDoubleClick={this.SelectItem.bind(this, item)}><td>
                                    {item.display }
                                </td>
                                    <td className='col-1'><FontAwesomeIcon onClick={this.Deleted.bind(this, item)} size='1x' icon={'trash'} className="text-danger" /></td>
                                </tr>);
                            })
                        }
                    </tbody>
                </Table>
            </Col>
            <Col>
                {this.NewInstance()}
            </Col>
        </Row>);
        
    }
}
