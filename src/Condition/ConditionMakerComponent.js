import { faDownload, faFilter, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from "react";
import { CSVLink } from "react-csv";
import { Card, Col, Row, Spinner } from "reactstrap";
import ButtonIcon from "../components/common/ButtonIcon";
import Flex from "../components/common/Flex";
import { AuthenticationController } from "../Engine/Authentication";
import BaseInstance from "../Engine/BaseInstance";
import { AddNewTabIns } from "../Engine/Common";
import { ConditionManager } from "../Engine/ConditionMaker";
import FormManager from "../EngineForms/FormManager";
import { ThemeCardHeader } from "../EngineForms/ThemeControl";
import ConditionHandler from "./ConditionHandler";
import ObjectClassController from "../Engine/ObjectClassController";

export default class ConditionMakerComponent extends Component {
    state = {
        content: new ConditionManager(),
        conditionid: '',
        ReportResult: [],
        DataLoaded: true,

    }
    headers;
    async componentDidUpdate() {
        await this.Initialized();
    }
    async componentDidMount() {
        await this.Initialized();
    }
    async Initialized() {
        if (this.props.conditionid && this.props.conditionid !== this.state.conditionid) {
            let content = await ConditionManager.GetContentAsync(this.props.conditionid);
            this.setState({
                ...this.state,
                content,
                conditionid: this.props.conditionid
            });
            if (content?.AutoRun){
                await this.RunFilter();
            }

        }
    }
    RowDoubleClick(instance) {
        if (this.state.content.ActionLink !== '') {
            if (this.state.content.ActionFormID !== '') {
                AddNewTabIns(this.state.content.ActionLink, { Instance: instance, FormID: this.state.content.ActionFormID });
            }
            else {
                let id = instance.ID;
                if (this.state.content.ActionLinkValue)
                    id = new BaseInstance(instance).GetValue(this.state.content.ActionLinkValue);
                window.open(this.state.content.ActionLink + id, "_blank");
            }
        }
        if (this.props.setSelected) {
            this.props.setSelected(instance);
        }

    }
    async RunFilter() {
        this.headers=await ObjectClassController.GetFieldForm(this.state.content.ResultFormID);
        if (this.state.content.MainCondition.ID !== null) {
            this.setState({
                ...this.state,
                ReportResult: [],
                DataLoaded: false
            });
            let ReportResult = await this.state.content.MainCondition.GetResult();
            if (ReportResult === null)
                ReportResult = [];
            this.setState({
                ...this.state,
                ReportResult,
                DataLoaded: true
            });
        }
    }
    OnChangeCondition() {
        this.setState({
            ...this.state,
            MainCondition: this.state.content.MainCondition
        })
    }
    Maker(condition) {
        let cmp = <Col key={condition.ID ?? 'test'}><ConditionHandler Editable={this.state.content.Editable} Condition={condition} onChange={this.OnChangeCondition.bind(this)} /></Col>;
        let result = [cmp];
        if (condition.nextCondition)
            result = [...result, ...this.Maker(condition.nextCondition)];

        return result;
    }
    convertForExcel(){
      let result = this.state.ReportResult.map(ins => new BaseInstance(ins).instanceToRow());
      return result;
    }
    async Save() {
        await this.state.content.SaveAsync();
    }
    render() {
        let Condition = this.state.content.MainCondition;
        return (this.props.CardOff ?
            <>
                {this.state.content?.TitleOff ? null : <Row>
                    {this.Maker(Condition)}
                </Row>}
                {
                    this.state.DataLoaded ?
                        <FormManager RowDoubleClick={this.RowDoubleClick.bind(this)} isReadonly={true}
                            CardOff className='pt-2' formId={this.state.content.ResultFormID} Data={[{ formId: this.state.content.ResultFormID, data: this.state.ReportResult }]} />
                        : <Flex inline={true} justify='center' align='center'><Spinner style={{ margin: 10 }} /></Flex>
                }</> :
            <Card>
                <ThemeCardHeader title={this.state.content.title}>
                    {!this.state.DataLoaded ? < Spinner />
                        : <>
                            {this.state.content.ActiveCommand ?
                                <ButtonIcon disabled={this.state.content.FormID === undefined} color='primary' icon={faFilter} onClick={this.RunFilter.bind(this)} />
                                : null}
                            {!this.state.content.IsReadOnly ? <ButtonIcon disabled={this.state.content.FormID === undefined}
                                color='light' icon={faSave} onClick={this.Save.bind(this)} /> : null}
                            {this.state.ReportResult?.length > 0 && AuthenticationController.HasRole('R2') ?
                                <CSVLink headers={[...this.headers.map((x)=>{return{label:x.title,key: x.pid};}),{ label: 'شناسه', key: 'id' },]} data={this.convertForExcel()}
                                    filename={`${this.state.content.title ?? "my-file"}.csv`}>
                                    <FontAwesomeIcon icon={faDownload} />
                                </CSVLink> : null}
                        </>}
                </ThemeCardHeader>
                {this.state.content?.TitleOff ? null : <Row>
                    {this.Maker(Condition)}
                </Row>}
                {
                    this.state.DataLoaded ?
                        <FormManager RowDoubleClick={this.RowDoubleClick.bind(this)} isReadonly={true} delete={this.state.content.Delete}
                            CardOff className='pt-2' formId={this.state.content.ResultFormID} Data={[{ formId: this.state.content.ResultFormID, data: this.state.ReportResult }]} />
                        : <Flex inline={true} justify='center' align='center'><Spinner style={{ margin: 10 }} /></Flex>
                }
            </Card>
        );
    }
}