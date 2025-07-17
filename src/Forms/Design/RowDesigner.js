import React, { Component } from 'react';
import { Label, Button, ButtonGroup, CardBody, Input, Row, DropdownToggle, Dropdown, DropdownMenu, CardTitle, Container } from 'reactstrap';
import ButtonIcon from '../../components/common/ButtonIcon';
import Flex from '../../components/common/Flex';
import ColDesigner from './ColDesigner';
import { faTrash } from '@fortawesome/free-solid-svg-icons'


export default class RowDesigner extends Component {
    state = {
        dropdownOpen: false,
        columns: '',
        mousein: false,

    }
    columnlist = [1, 2, 3, 4, 6, 12];

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
    inputChanged(event) {
        this.setState({
            ...this.state,
            columns: event.currentTarget.value
        })
    }
    ChangeRowCount() {
        const row = this.props.row;
        const columns = this.state.columns.split('+');
        let colCount = columns.length;
        if (colCount > row.controls.length) {
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
            row.controls.splice(row.controls.length - 1, row.controls.length - colCount);
        }

        this.props.onChenge(row, this.props.rowindex);
    }
    MouseEnter() {
        this.setState({
            ...this.state,
            mousein: true
        })
    }
    MouseLeave() {
        this.setState({
            ...this.state,
            mousein: false
        })
    }
    toggle = () => {
        this.setState({
            ...this.state,
            dropdownOpen: !this.state.dropdownOpen
        });
    }
    toggleRowPlus = () => {
        this.setState({
            ...this.state,
            mousein: !this.state.mousein
        });
    }
    columnButton = () => {
        let result = [];
        this.columnlist.map((i) => {
            result = [...result, <Button key={i} onClick={this.Click.bind(this, i)} >{i}</Button >];
            return result;
        })
        return result;
    }
    render() {

        return (
            <>
                <Container onMouseLeave={this.MouseLeave.bind(this)} onMouseEnter={this.MouseEnter.bind(this)}>
                    <Dropdown key={1} isOpen={this.state.dropdownOpen} toggle={this.toggle} className="nopadding" >
                        <DropdownToggle
                            tag="div"
                            data-toggle="dropdown" aria-expanded={this.state.dropdownOpen}
                        >
                            <Row md={this.props.row.controls.length} lg={this.props.row.controls.length}
                                style={{ height: this.props.row.height }} >
                                {this.props.row.title}
                                {this.props.row.controls.map((control, colindex) => (
                                    <ColDesigner key={colindex} colindex={colindex} rowindex={this.props.rowindex} control={control} />
                                ))}
                            </Row>
                        </DropdownToggle>
                        <DropdownMenu >
                            {
                                <>
                                    <CardTitle>
                                        <Flex className="p-1" justify="between" align="end">
                                            <div>{"طرح ردیف"}</div>
                                            <div>
                                                <ButtonIcon color="falcon-default" className="text-danger" size="sm" icon={faTrash} transform="shrink-1" onClick={this.props.Remove.bind(this, this.props.rowindex)} />
                                            </div>
                                        </Flex>
                                    </CardTitle>
                                    <CardBody>
                                        <Row>
                                            <ButtonGroup aria-label="First group" className="mr-2">
                                                {this.columnButton()}
                                            </ButtonGroup>
                                        </Row>
                                        <Row>
                                            <Label className="m-2">{"انتخاب لایه ردیف از تنظیمات از پیش تعریف شده"}</Label>
                                        </Row>
                                        <Row>
                                            <Input onChange={this.inputChanged.bind(this)} value={this.state.columns} />
                                            <Button onClick={this.ChangeRowCount.bind(this)} >بروزرسانی </Button>
                                        </Row>
                                    </CardBody>
                                </>
                            }
                        </DropdownMenu>
                    </Dropdown>
                </Container>
            </>
        );
    }
}
