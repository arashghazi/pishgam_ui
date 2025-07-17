import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import React, { Component } from 'react'
import {
    Button, Card, CardBody, CardGroup, Col, CustomInput,
    Form, InputGroup, InputGroupAddon, Label, Row
} from 'reactstrap'
import Flex from '../components/common/Flex'
import AppContext, { ProductContext } from '../context/Context'
import ProductCardItem from './ProductCardItem'
import { CartContextClass } from './ShopContext'
export default class Shop extends Component {
    state = {
        GroupSource: [],
        Data: [],
        SelectedProduct: []
    }
    async componentDidMount() {
        if (this.state.GroupSource?.length === 0) {
            let groupSource = await CartContextClass.GetProductGroups(); 
            let products = await CartContextClass.GetProducts();
            products = products.sort((item1,item2)=>(parseInt(item1.row)-parseInt(item2.row)))
            this.setState({ ...this.state, GroupSource: groupSource, Data: products })
        }
       let  {currentTitle} = AppContext.Consumer;
        //this.myContext.setCurrentTitle('ثبت نام دوره های ارزیابی');
    }
    static contextType = ProductContext;

    handleAddToCart = (ID) => {
        let selectedProduct = [...this.state.SelectedProduct, ID];
        this.setState({
            ...this.state,
            SelectedProduct: selectedProduct
        })
    };
    async GroupChanged(event) {
        let selectedGroup = event.target.value;
        let products = await CartContextClass.GetProducts(selectedGroup);
        this.setState({ ...this.state, Data: products })
    }
    render() {
        let total = 10;
        let isAsc = false;
        let isList = true;
        let isGrid = !isList;
        return <>
        <AppContext.Consumer>
            {({setCurrentTitle})=>setCurrentTitle('ثبت نام دوره های ارزیابی')}
        </AppContext.Consumer>
            <CardBody>
                <Card >
                    <CardBody>
                        <Row className="justify-content-between align-items-center">
                            <Col sm="auto" className=" mb-sm-0" tag={Flex} align="center">
                                <Label>ثبت نام ارزیابی خارجی کیفیت </Label>
                                
                            </Col>
                            <Col sm="auto">
                                <Form className="d-inline-block mr-3">
                                    <InputGroup size="sm" tag={Flex} align="center">
                                        <small className="mr-1">گروه</small>
                                        <CustomInput
                                            id="ProductGroup"
                                            type="select"
                                            onChange={this.GroupChanged.bind(this)}
                                        >
                                            <option value='allGroup'>همه</option>
                                            {this.state.GroupSource.map((item) =>
                                                (<option key={item.id} value={item.id}>{item.display}</option>))}
                                        </CustomInput>
                                        <InputGroupAddon addonType="append">
                                            <Button onClick={() => {
                                             }} className="cursor-pointer">
                                                <FontAwesomeIcon icon={classNames({ 'sort-amount-up': isAsc, 'sort-amount-down': !isAsc })} />
                                            </Button>
                                        </InputGroupAddon>
                                    </InputGroup>
                                </Form>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </CardBody>
            <CardBody className='mt-0 pt-0'>
                <CardGroup>
                    {
                        this.state.Data.map((item, index) => (<ProductCardItem key={index}
                            item={item} AddToCart={this.handleAddToCart} />))
                    }
                </CardGroup>
            </CardBody>
        </>
    }
}