import React, { Component } from 'react';
import { Button, ButtonGroup, Card, CardBody,CardTitle, Col, Dropdown, DropdownMenu, DropdownToggle, Input, InputGroup, Label, Row } from 'reactstrap';
import ButtonIcon from '../components/common/ButtonIcon';
import { faSearch, faTrash } from '@fortawesome/free-solid-svg-icons'
import Flex from '../components/common/Flex';

export default class RowSetting extends Component {
    state = {
        preProp: null,
        columns:'',
        Row: {
            height: '100px',
            controls: [
                {
                    col: "12",
                    pid: "",
                    controlType: "",
                    title: ""
                }
            ]
        }
    }
    columnlist = [1, 2, 3, 4, 6, 12];
    initialize() {
        if (this.state.preProp !== this.props.Row) {
            let cols = '';
            this.props.Row.controls.map((control) => {
                cols += '1/' + control.col + ' +';
            });
            cols = cols.substring(0, cols.length - 2)
            this.setState({
                ...this.state,
                preProp: this.props.Row,
                columns: cols
            });

        }
    }
    componentDidMount() {
        this.initialize();
    }
    componentDidUpdate() {
        this.initialize();
    }
    Click(count) {
        let tempvalue = '1/' + 12 / count;
        let resultvalue = '';
        for (var i = 0; i < count; i++) {
            resultvalue += tempvalue + ' + ';
        }
        resultvalue = resultvalue.substring(0, resultvalue.length - 3)
        this.setState({
            ...this.state,
            columns: resultvalue
        })
    }
    columnButton(){
        let result = [];
        this.columnlist.map((i) => {
            result = [...result, <Button key={'btn'+i} onClick={this.Click.bind(this, i)} >{i}</Button >];
        })
        return result;
    }
    inputChanged(event) {
        this.setState({
            ...this.state,
            columns: event.currentTarget.value
        })
    }
    RowChanged() {
        const row = this.props.Row;
        const columns = this.state.columns.split('+');
        let colCount = columns.length;
        if (colCount >= row.controls.length) {
            for (var i = 0; i < colCount; i++) {
                const number = columns[i].replace('1/', '').trim();
                let temp = row.controls.length > i ? row.controls[i] :
                    {
                        col: number,
                        pid: "",
                        controlType: "",
                        title: ""
                    };
                if (row.controls.length > i) {
                    temp = { ...temp, col: number };
                    row.controls.splice(i, 1);
                }
                row.controls.splice(i, 0, temp);
            }
        }
        else {
            row.controls.splice(colCount, row.controls.length - colCount);
        }
        this.props.RowChanged(row, this.props.index);
    }
    DeleteRow() {
        this.props.RowChanged(null, this.props.index);
    }
    render() {
        return <Dropdown isOpen={this.props.isOpen} toggle={this.props.toggle.bind(this)} className="nopadding" >
            <DropdownToggle
                tag="div"
                data-toggle="dropdown" aria-expanded={this.state.dropdownOpen}
            >
            </DropdownToggle>
            <DropdownMenu >
                {
                    <>
                        <CardTitle>
                            <Flex className="p-1" justify="between" align="end">
                                <div>{"تنظیمات ردیف"}</div>
                                <div>
                                    <ButtonIcon color="falcon-default" className="text-danger" size="sm"
                                        onClick={this.DeleteRow.bind(this)}
                                        icon={faTrash} transform="shrink-1" />
                                </div>
                            </Flex>
                        </CardTitle>
                        <CardBody>
                            <Flex justify="between" align="end">
                                <ButtonGroup aria-label="First group" className="mr-2">
                                    {this.columnButton()}
                                </ButtonGroup>
                                <div >
                                    <Label>ارتفاع ردیف</Label>
                                    <Input value={this.state.Row.height} onChange={(event) => this.setState({ ...this.state, Row: { ...this.state.Row, height: event.target.value } })} />
                                </div>
                            </Flex>
                            <Row>
                                <Label className="m-2">{"تعیین اندازه ستونها"}</Label>
                            </Row>
                            <Row>
                                <Input onChange={this.inputChanged.bind(this)} value={this.state.columns} />
                                <Button onClick={this.RowChanged.bind(this)} >بروزرسانی </Button>
                            </Row>
                        </CardBody>
                    </>
                }
            </DropdownMenu>
        </Dropdown>;
    }
}