import React, { Component } from 'react';
import { Card, CardBody, Col, Table, Row } from 'reactstrap';
import FalconCardHeader from '../components/common/FalconCardHeader';
import Flex from '../components/common/Flex';
import { SearchObject } from '../Engine/Common';
import { round, trim } from 'lodash';
export default class TreeDataGrid extends Component {
    state = {
        data: null,
        show: false
    }
    
    async componentDidUpdate() {
        if ((this.state.data === null || this.state.data.length === 0) && this.props.Data !== undefined && this.props.Data.length > 0) {
            let data = this.props.Data;
            if (this.props.CompeletedData === undefined)
                data = await this.addvalue(this.props.Data);
            this.setState({
                ...this.state,
                data: data,
            })
        }
    }
    async addvalue(data) {
        for (var i = 0; i < data.length; i++) {

            let objtemp = await SearchObject(data[i].id, '', '');
            data[i].name = objtemp[0].display;
            if (data[i].children !== undefined)
                data[i].children = await this.addvalue(data[i].children);
        }
        return data;
    }
    Grid(data) {
        if (data !== null) {
            let result = <Table size="sm" hover dir='ltr' style={{ textAlign: 'left' }}>
                <thead>
                    <tr>
                        {
                            this.props.setting.columns.map((column) => (
                            <th xs={column.Size}>
                                {column.title}
                            </th>
                            ))
                        }
                    </tr>
                </thead>
                {this.Row(data, 1)}
            </Table>
        return result;
        }

    }
    compare(a, b) {
        if (a.QTY > b.QTY) {
            return -1;
        }
        if (a.QTY < b.QTY) {
            return 1;
        }
        return 0;
    }
    Row(data, level) {
        let result = null;
        data = data.sort(this.compare);
        console.log(data)
        result = data.map((item, index) => (<>
            <tr className={level === 1 ? 'bg-200' : ''} key={index}>
                {this.props.setting.columns.map((column, colIndex) => {
                    let result = null;
                    if (colIndex === 0)
                        result = <td  >
                            <Row className='p-0 m-0'>
                                <Col className='p-0 m-0' xs='auto'>{level === 1 ? <p class="m-0 font-weight-bold">{item[column.PName]?? 'N.A'}</p> : '  '}</Col>
                                <Col className='p-0 m-0' xs='auto'>{level === 2 ? <p class="m-0 font-italic">{trim(item[column.PName])===''? 'N.A':item[column.PName]}</p> : '  '}</Col>
                                <Col className='p-0 m-0' xs='auto'>{level === 3 ? <p class="m-0 " fontSize='10'>{trim(item[column.PName])===''? 'N.A':item[column.PName]}</p> : '  '}</Col>
                            </Row>
                        </td>;
                    else {
                        if (item[column.PName] !== undefined) {
                            let value = item[column.PName].find(x => x[column.where.PName] === column.where.value);
                        result = <td className='' style={{ borderLeft: 'solid 1px #f0f0f0', textAlign: 'center' }} >{value !== undefined ? round(value[column.where.pvalue], 2) : ' '}</td>;
                        }
                        else
                            result = <td className='' style={{ borderLeft: 'solid 1px #f0f0f0', textAlign: 'center' }} >{' '}</td>;

                    }
                    return result;
                })}
            </tr>
            {item.children !== undefined && this.props.setting.depLevel > level ? this.Row(item.children, level + 1) : null}
        </>))
        return result;
    }
    render() {
        return (

            <Card className="h-100"  >
                <FalconCardHeader title={this.props.title === undefined ? "گزارش جدولی " : this.props.title} titleTag="h6" className="py-2">
                    <Flex>

                    </Flex>
                </FalconCardHeader>
                <CardBody className="h-100">
                    { (this.Grid(this.state.data)) }
                </CardBody>
            </Card>

        );

    }
}
const isDark = false;
