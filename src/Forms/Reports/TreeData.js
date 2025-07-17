import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component, Fragment } from 'react';
import {  Table, Tooltip } from 'reactstrap';

export default class TreeData extends Component {
    state = {
        data: null,
        chartType: 'tree',
        show: false,
        tooltipOpen: false
    }
    colors = ['#dd4c51', '#187a2f', '#0aa4b5', '#d9e2ef', '#d7e2ef', '#d6e2ef'];
    async componentDidUpdate() {
        if ((this.state.data === null || this.state.data.length === 0) && this.props.Data !== undefined && this.props.Data.length > 0) {
            let data = this.props.Data;
            if (this.props.chartType !== undefined)
                this.state.chartType = this.props.chartType;
            this.setState({
                ...this.state,
                data: data,
            })
        }
    }

    ChangeChartType() {
        this.setState({
            ...this.state,
            chartType: this.state.chartType === 'tree' ? 'group' : 'tree'
        });
    }
    Grid(data) {
        let result = (

            <tbody>{this.Row(data, 1, true)}</tbody>);

        return result;

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
    toggle() {
        this.setState({
            ...this.state,
            tooltipOpen: !this.state.tooltipOpen
        });
    }
    Row(data, level, thisPath) {
        let result = null;
        data = data.sort(this.compare);
        result = data.map((item, index) => {
            if((level<3 && item.id) || (level===3 )){
            let flag = false;
            let notInChild = false;
            if (thisPath) {
                if (level === 1 && !flag) {
                    flag = item.id === this.props.labResult?.G1;
                    if (item.children)
                        notInChild = item.children?.findIndex(x => x.id === this.props.labResult?.G2) < 0;
                    else
                        notInChild = true;
                }
                else if (!flag && level === 2) {
                    flag = item.id === this.props.labResult?.G2;
                    if (item.children)
                        notInChild = item.children.findIndex(x => x.id === this.props.labResult?.G3) < 0;
                    else
                        notInChild = true;
                }
                else if (!flag && level === 3) {
                    flag = item.id === this.props.labResult?.G3;
                    notInChild = true;
                }

            }
            return (<Fragment key={index}><tr key={item.id + index} style={{ backgroundColor: flag && notInChild ? 'lightpink' : null }} >
                <td>
                    {level === 1 ? <p className="font-weight-bold" style={{ marginBottom: '0px' }}>{item.name??'N.A'}</p>
                        : (level === 2 ? <p className="font-italic pr-2" style={{ marginBottom: '0px' }}>{item.name??'N.A'}</p>
                            : level === 3 ? <p className=' pr-4' style={{ marginBottom: '0px', fontSize: '.8rem' }} >{item.name??'N.A'}</p> : null)}
                </td>
                <td>{item.QTY}</td>
                <td>{item.CV !== undefined ? parseFloat(item.CV).toFixed(2) : ' '}</td>
                <td>{item.AVG !== undefined ? parseFloat(item.AVG).toFixed(2) : ' '}</td>
                {/* <td>{item.um !== undefined ? parseFloat(item.um).toFixed(3) : ' '}</td> */}
                <td>{flag && notInChild ? <>
                    <Tooltip placement="top" isOpen={this.state.tooltipOpen} target="your_result" toggle={this.toggle.bind(this)}>
                        Your Group
                    </Tooltip>
                    <FontAwesomeIcon id="your_result" icon={faArrowAltCircleLeft} />
                </> : null}</td>
            </tr>
                {item.children !== undefined ? this.Row(item.children, level + 1, flag) : null}
            </Fragment>)
            }
            return null;
        })
        return result;
    }

    render() {
        return (<>
            <Table size="sm" hover striped dir='ltr' style={{ textAlign: 'left' }}  >
                <thead><tr>
                    <th>{this.props.Test.id.includes('O30E12C23I')?'CellCounter': 'Method'}</th>
                    <th>No.</th>
                    <th>CV</th>
                    <th>Target</th>
                    {/* <th>UM</th> */}
                </tr>
                </thead>
                {this.state.data !== null ?
                    ((this.Grid(this.state.data))
                    ) : null}
            </Table></>
        );

    }
}