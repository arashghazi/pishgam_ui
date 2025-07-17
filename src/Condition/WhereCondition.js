import React, { Component } from 'react';
import { Modal, ModalBody, ModalFooter, Button, CardTitle, CardHeader, Spinner } from 'reactstrap';
import Flex from '../components/common/Flex';
import { Utility } from '../Engine/Common';
import ObjectClassController from '../Engine/ObjectClassController';
import BitCondition from './BitCondition';
import ComboBox from '../EngineForms/ComboBox';
export default class WhereCondition extends Component {
    state = {
        objectclass: null,
        Condition: {
            OCID: '',
            BCs: [{
                Bts: [{ PID: '', PRA: '', IPV: '', NLC: 'None', SRC: '' }],
                NLC: 'None'
            }]
        }
    }
    Logicoptions = [
        { id: 'and', display: 'و' },
        { id: 'or', display: 'یا' }
    ]
    Properties = [];
    async componentDidMount() {
        await this.GetProperties();
    }
    async componentDidUpdate() {
        await this.GetProperties();
    }
    async GetProperties() {
        if ((!Utility.IsClassID(this.state.Condition.OCID)) && (this.state.objectclass === null || this.state.objectclass.ID !== this.state.Condition.OCID)) {
            this.state.Condition.OCID = this.props.OCID;
            let oc = await ObjectClassController.LoadAsync(this.state.Condition.OCID);
            if (oc?.properties !== undefined) {
                oc.properties =await ObjectClassController.FillObjectClass(oc.properties);
                let state = { ...this.state, objectclass: oc };
                if (this.props.Condition !== undefined)
                    state.Condition = this.props.Condition;
                this.setState(state)
            }
        }
    }
    toggle() {
        this.props.Close(this.props.Modal, null);
    }
    AddBlock() {
        this.setState({
            ...this.state,
            Condition: {
                ...this.state.Condition,
                BCs: [...this.state.Condition.BCs,
                {
                    Bts: [{ PID: '', PRA: '', IPV: '', NLC: 'None', SRC: '' }],
                    NLC: 'None'
                }]
            }
        })
    }
    AddBit(index, rowindex) {
        let bitBlock = this.state.Condition.BCs[index];
        if ((bitBlock.Bts.length - 1) === rowindex) {
            bitBlock.Bts = [...bitBlock.Bts, { PID: '', PRA: '', IPV: '', NLC: 'None', SRC: '' }];
            this.state.Condition.BCs.splice(index, 1, bitBlock)
            this.setState({
                ...this.state,
                Condition: {
                    ...this.state.Condition,
                    BCs: [...this.state.Condition.BCs]
                }
            })
        }
    }
    RemoveBit(index, rowindex) {
        let bitBlock = this.state.Condition.BCs[index];
        if (bitBlock.Bts.length > 1) {
            bitBlock.Bts.splice(rowindex, 1);
            this.state.Condition.BCs.splice(index, 1, bitBlock)
            this.setState({
                ...this.state,
                Condition: {
                    ...this.state.Condition,
                    BCs: [...this.state.Condition.BCs]
                }
            })
        }
    }
    PropertyChange(blockindex, index, data) {
        let bitBlock = this.state.Condition.BCs;
        bitBlock[blockindex].Bts.splice(index, 1, data);
        
        this.setState({
            ...this.state,
            Condition: {
                ...this.state.Condition,
                BCs: bitBlock
            }
        })
    }
    OpratorChanged(index, value) {
        let bitBlock = this.state.Condition.BCs;
        bitBlock[index].NLC = value.value;
        this.setState({
            ...this.state,
            Condition: {
                ...this.state.Condition,
                BCs: bitBlock
            }
        })
    }
    Save() {
        this.props.Close(this.props.Modal, this.state.Condition);
    }
    render() {

        return (this.state.objectclass !== null ?
            <>
                <Modal isOpen={this.props.isOpen} size='lg'>
                    <CardHeader>
                        <div className="d-flex justify-content-between">
                            <CardTitle >
                                {'ایجاد شرط'}
                            </CardTitle>
                            <Button className='text-truncate'
                                onClick={this.AddBlock.bind(this)}
                            >اضافه کردن بلاک</Button>
                        </div>
                    </CardHeader>
                    <hr />
                    <ModalBody>
                        {this.state.Condition.BCs.map((block, rowIndex) => {
                            let logic = null;
                            if (this.state.Condition.BCs.length > (rowIndex + 1))
                                logic = (<ComboBox source={this.Logicoptions}
                                    onChange={this.OpratorChanged.bind(this, rowIndex)}>
                                </ComboBox>);
                            return (
                                <div key={'rowIndex' + rowIndex} >
                                    <div style={{ background: 'lightblue' }} className='d-flex justify-content-between' key={rowIndex}>
                                        <Flex>
                                            <div >
                                                {block.Bts.map((bit, index) => {
                                                    bit.display=bit?.t3;
                                                    return (<BitCondition key={rowIndex + '-' + index}
                                                        RemoveBit={this.RemoveBit.bind(this)}
                                                        HasLogic={this.AddBit.bind(this)}
                                                        BlockIndex={rowIndex} Index={index}
                                                        PropertyChange={this.PropertyChange.bind(this)}
                                                        Bit={bit} ObjectClass={this.state.objectclass} />
                                                    )
                                                })}
                                            </div>
                                        </Flex>
                                        {
                                            rowIndex > 0 ?
                                                <Button onClick={() => {
                                                    this.state.Condition.BCs.splice(rowIndex, 1)
                                                    this.setState({
                                                        ...this.state,
                                                        Condition: {
                                                            ...this.state.Condition,
                                                            BCs: [...this.state.Condition.BCs]
                                                        }
                                                    })
                                                }}>X</Button> : null
                                        }
                                    </div>
                                    {logic}
                                </div>
                            )
                        })}

                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggle.bind(this)}>انصراف</Button>
                        <Button color="primary" onClick={this.Save.bind(this)}>ذخیره</Button>
                    </ModalFooter>
                </Modal>

            </> : <Spinner />
        );
    }
}
