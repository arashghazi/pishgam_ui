import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react';
import { Card, CardTitle, ListGroup, ListGroupItem, Button, CustomInput, Label } from 'reactstrap';
import JoiAccordion from '../components/joi/JoiAccordion';
import JoiSearchBox from '../components/joi/JoiSearchBox';
import JoiComboBox from '../components/joi/JoiComboBox';
import JoiMultiLanInput from '../components/joi/JoiMultiLanInput';
import ButtonIcon from '../components/common/ButtonIcon';
import ObjectClassController from '../Engine/ObjectClassController';
import JoiBaseProperty from '../components/joi/JoiBaseProperty';
import { Droppable } from 'react-beautiful-dnd';
import BasePropertyHandler from './BasePropertyHandler';
import BasePropertyController from '../Engine/BasePropertyController';
import { Utility } from '../Engine/Common';
import Flex from '../components/common/Flex';
import { faSave, faPlus } from '@fortawesome/free-solid-svg-icons'
import { CardBody } from 'reactstrap';
const newClass = {
    Name: "",
    ShowProp: "",
    UserCanChange: true,
    Contexts: [{ Lan: 'fa-IR', Context:'' },
    ],
    HasReadLimitation: false,
    ID: "",
    EID: '',
    Version: "",
    properties: [],
    Forms: [],
    Extended: {
        KEYS: [],
        IsUniqe: false,
        LOH: false,
        RST:0
    }
}
export default class ObjectClassHandler extends Component {
    state = {
        isopen: false,
        FormData: {},
        Source: { ...newClass} ,
        Model: {},
        modal: {
            isOpen: false,
            source: '',
            selectedID:''
        },
        entityList: [],
        ShowProplist: [],
    };
    async componentDidMount() {
        this.props.onRef(this)
        let entities = await ObjectClassController.GetAllEntities();
        this.setState({
            ...this.state,
            entityList: entities
        })
    }
    componentWillUnmount() {
        this.props.onRef(null)
    }
    onDragEnd = result => {
        const { destination, source } = result;
        if (!destination)
            return;
        if (destination.droppableId === source.droppableId &&
            destination.index === source.index)
            return;
        const start = source.droppableId;
        const end = destination.droppableId;
        if (start === end) {
            const newProperties = Array.from(this.state.Source.properties);
            let desObj = {
                ...this.state.Source.properties[source.index]
            } ;
            newProperties.splice(source.index, 1);
            newProperties.splice(destination.index, 0, desObj);
            this.setState({
                ...this.state,
                Source: {...this.state.Source,properties:newProperties}
            })
            //ObjectClassController.Update(newModel);
            return;
        }
    }
    async selectionChanged(selectedclass) {
        let datamodel = await ObjectClassController.LoadAsync(selectedclass);
        if (datamodel.ID !== this.state.Source.ID) {
            let source = {
                ...datamodel,
                EID: datamodel.ID.split('C')[0]
            };
            if (source.ShowProp !== undefined)
                this.state.ShowProplist = source.ShowProp.split(',');
            this.setState({
                ...this.state,
                Source: source,
                Model: datamodel,
                ShowProplist: this.state.ShowProplist
            });
            this.props.ChangeSource(this.state.Source.ID);
        }
    }
    entityChanged(selected) {
        this.setState(
            {
                ...this.state,
                Source: {
                    ...this.state.Source,
                    ID: selected,
                    EID: selected

                }
            })
    }
    //Update(datamodel = { Data: {ID:''} }) {
    //    if (datamodel.ID !== this.state.Source.ID) {
    //        let source = {
    //            ...datamodel,
    //            EID: datamodel.ID.split('C')[0]
    //        };
    //        if (source.ShowProp !== undefined)
    //            this.state.ShowProplist = source.ShowProp.split(',');
    //        this.setState({
    //            ...this.state,
    //            Source: source,
    //            Model: datamodel,
    //            ShowProplist: this.state.ShowProplist
    //        });
    //        this.props.ChangeSource(this.state.Source.ID);
    //    }

    //}
    LoadForm(event) {
        if (event === 'NEW')
            this.props.ChangeSource(this.state.Source.ID,'NEW');
        else
            this.props.ChangeSource(event);
    }
    AddNewProperty() {

    }
    isOpen(id,event) {
        this.setState({
            ...this.state,
            modal: {
                isOpen: true,
                source: id
            }
        })
    }
    async ModalClosed(source = '', form) {
        this.setState({
            ...this.state,
            modal: {
                isOpen: false,
                source: '',
                selectedID: ''
            }
        })
        if (form !== null)
            await this.SearchPropertyChanged({ id: form })
    }
    async SearchPropertyChanged(selectedproperty) {
        let property = await BasePropertyController.LoadAsync(selectedproperty)
        if (property !== null) {
        let props = this.state.Source.properties;
            props = [...props, property]

            this.setState({
                ...this.state,
                Source: {
                    ...this.state.Source,
                    properties: props
                }
            });
        }
    }
    ContextChanged(newContextvalue) {
        let index = this.state.Source.Contexts.findIndex(x => x.Lan === newContextvalue.Lan);
        let contexts = this.state.Source.Contexts;
        contexts.splice(index, 1, newContextvalue);
        this.setState({
            ...this.state,
            Source: {
                ...this.state.Source,
                Contexts:contexts
        }
        })
    }
    async SaveClass() {
        await ObjectClassController.SaveAsync(this.state.Source)
        this.props.ChangeSource(this.state.Source.ID);
    }
    NewClass() {
        this.setState({
            ...this.state,
            FormData: {},
            Source: {
                ...newClass, Contexts: [{ Lan: 'fa-IR', Context: '' },
                ],ID:'E3',EID:'E3' }
        })
    }
    ChangedShowProp(propid) {
        if (!this.state.ShowProplist.find(x => x === propid))
            this.state.ShowProplist = [...this.state.ShowProplist, propid]
        else
            this.state.ShowProplist.splice(this.state.ShowProplist.findIndex(x => x === propid), 1)
        let showprop = '';
        this.state.Source.OCP.map((propid) => {
            if (this.state.ShowProplist.findIndex(p => p === propid) >= 0)
                showprop += propid + ',';
        })
        showprop = showprop.substring(0, showprop.length - 1);
        console.log(this.state)
        this.setState({
            ...this.state,
            Source: {
                ...this.state.Source,
                ShowProp: showprop
            },
            ShowProplist: this.state.ShowProplist
        })
    }
    ChangedKey(propid) {
        if (this.state.Source.Extended.KEYS === undefined)
            this.state.Source.Extended.KEYS = [];
        if (!this.state.Source.Extended.KEYS.find(x => x === propid))
            this.state.Source.Extended.KEYS = [...this.state.Source.Extended.KEYS, propid]
        else
            this.state.Source.Extended.KEYS.splice(this.state.Source.Extended.KEYS.findIndex(x => x === propid), 1)
        let showprop = '';
        console.log(this.state)
        this.setState({
            ...this.state,
            Source: {
                ...this.state.Source,
                Extended: this.state.Source.Extended
            },
        })
    }
    render() {
        return (
            <>
                <Flex className="p-1" justify="between" align="end">
                    <Flex align="start">
                        <FontAwesomeIcon className='float-left' icon="home" />
                        <CardTitle tag="h5">مدیریت کلاس</CardTitle>
                    </Flex>
                    <div className="p-2">
                        <ButtonIcon color="falcon-default" size="sm" icon={faSave} transform="shrink-1" onClick={this.SaveClass.bind(this)} />
                        <ButtonIcon id='newbutton' color="falcon-default" size="sm" icon={faPlus} transform="shrink-1" onClick={this.NewClass.bind(this)} />
                    </div>
                </Flex>
                <Card className='mb-1' >
                    <CardBody>
                        <JoiSearchBox placeHolder=" کلاس" type='CLASS'  onChange={this.selectionChanged.bind(this)} />
                    </CardBody>
                </Card>
                <Card>
                    <JoiAccordion title="عنوان" open={true} >
                        <JoiComboBox Title={' موجودیت'} value={this.state.Source.EID} isDisabled={Utility.IsClassID(this.state.Source.ID)} onChange={this.entityChanged.bind(this)} source={this.state.entityList} />
                        <JoiMultiLanInput Title={'نام کلاس'} Contexts={this.state.Source.Contexts} onChange={this.ContextChanged.bind(this)} />
                    </JoiAccordion>
                    <JoiAccordion title="مشخصات" >
                        <JoiSearchBox placeHolder=" مشخصه" type='PROPERTY' onChange={this.SearchPropertyChanged.bind(this)} />
                        <ButtonIcon className="mr-2" color="falcon-default" icon="plus" transform="shrink-3" value='NEWBASEPROPERTY' onClick={this.isOpen.bind(this, 'NEWBASEPROPERTY')} block>
                            ویژگی جدید
                        </ButtonIcon>
                            <div className="list-group" >
                                <Droppable droppableId='propertyList'>
                                    {(provided) => (
                                        <div ref={provided.innerRef}
                                            {...provided.droppableProps}>
                                        {this.state.Source.properties.map((prop, index) => (
                                            <JoiBaseProperty IsShowProp={this.state.ShowProplist.findIndex(x => x === prop.ID) >= 0} value={prop.ID} key={prop.ID} property={prop} index={index}
                                                onClick={this.isOpen.bind(this, prop.ID)}
                                                ShowProp={this.ChangedShowProp.bind(this)}
                                                ChangedKey={this.ChangedKey.bind(this)}
                                                IsKey={this.state.Source.Extended.KEYS !== undefined && this.state.Source.Extended.KEYS.findIndex(x => x === prop.ID) >= 0}
                                                />
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                    </JoiAccordion>
                    <JoiAccordion title="تنظیمات" >
                        <ListGroup>
                            <ListGroupItem>
                                {this.state.Source.Extended !== undefined ?
                                    <CustomInput
                                        type="checkbox"
                                        id='ExtendedIsUniqe'
                                        checked={this.state.Source.Extended.IsUniqe}
                                        label='منحصر بفرد'
                                        className="mb-0"
                                        onChange={() => {
                                            this.state.Source.Extended.IsUniqe = !this.state.Source.Extended.IsUniqe
                                            this.setState({
                                                ...this.state,
                                                Source: {
                                                    ...this.state.Source,
                                                    Exd: JSON.stringify(this.state.Source.Extended),
                                                    Extended: {
                                                        ...this.state.Source.Extended,
                                                        IsUniqe : !this.state.Source.Extended.IsUniqe
                                                    }
                                                }
                                            })
                                        }}
                                    /> : <Label>منحصر بفرد</Label>}
                            </ListGroupItem>
                            <ListGroupItem>
                                {this.state.Source.Extended !== undefined ?
                                    <CustomInput
                                        type="checkbox"
                                        id='ExtendedIsHistory'
                                        checked={this.state.Source.Extended.LOH}
                                        label='ثبت تغییرات'
                                        className="mb-0"
                                        onChange={() => {
                                            this.state.Source.Extended.LOH = !this.state.Source.Extended.LOH
                                            this.setState({
                                                ...this.state,
                                                Source: {
                                                    ...this.state.Source,
                                                    Exd: JSON.stringify(this.state.Source.Extended),
                                                    Extended: this.state.Source.Extended
                                                }
                                            })
                                        }}
                                    /> : <Label>ثبت تغییرات</Label>}
                            </ListGroupItem>
                            <ListGroupItem>
                                {this.state.Source.Extended !== undefined ?
                                    <CustomInput
                                        type="checkbox"
                                        id='ExtendedIsRST'
                                        checked={this.state.Source.Extended.RST===4}
                                        label='تعیین دسترسی'
                                        className="mb-0"
                                        onChange={() => {
                                            (this.state.Source.Extended.RST === 4)
                                                ? this.state.Source.Extended.RST = 0
                                                : this.state.Source.Extended.RST=4
                                            this.setState({
                                                ...this.state,
                                                Source: {
                                                    ...this.state.Source,
                                                    Exd: JSON.stringify(this.state.Source.Extended),
                                                    Extended: this.state.Source.Extended
                                                }
                                            })
                                        }}
                                    /> : <Label>تعیین دسترسی</Label>}
                            </ListGroupItem>
                        </ListGroup>
                    </JoiAccordion>
                    <JoiAccordion title="فرمها" >
                        <div>
                            <Button className="mr-2" color="falcon-default" icon="plus" transform="shrink-3" block key={'NEW'} value={'NEW'} onClick={this.LoadForm.bind(this,'NEW')} >
                                {'فرم جدید'}
                            </Button>
                            {(
                                this.state.Source.Forms.map((form) => (
                                    <Button className="mr-2" transform="shrink-3" block key={form.ID} value={form.ID} onClick={this.LoadForm.bind(this, form.ID)} >
                                        {form.Display}
                                    </Button>
                                    ))
                                )}
                        </div>
                    </JoiAccordion>
                </Card>
                <BasePropertyHandler Modal={this.state.modal} Close={this.ModalClosed.bind(this)} />
            </>
        );
    }
}
