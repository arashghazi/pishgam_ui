import React from 'react';
import { useContext } from 'react';
import { useEffect, useState } from 'react';
import { Button, Card, CardBody, Col, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText, Row, Spinner } from 'reactstrap';
import FalconCardHeader from '../components/common/FalconCardHeader';
import JoiSearchBox from '../components/joi/JoiSearchBox';
import AppContext from '../context/Context';
import { ConstIdes, PropConstIdes } from '../Pishgam/ConstIdes';
import { CartContextClass, InvoiceHeader } from './ShopContext';
import NumberFormat from 'react-number-format';
import Flex from '../components/common/Flex';
import { toast } from 'react-toastify';
import ConditionMaker, { EngineCondition } from '../Engine/ConditionMaker';
import { Link } from 'react-router-dom';
import moment from 'jalali-moment';

const ProductRow = ({ item, onClick, active }) => {
    const { currency } = useContext(AppContext);
    return (
        <ListGroupItem key={item.ID} onDoubleClick={onClick} id={item.ID} active={active}>
            <ListGroupItemText>
                <Flex tag='span' justify={'between'}>
                    {item.title} <NumberFormat thousandSeparator={true} displayType={'text'} prefix={currency}
                        value={!!item.sale ? item.price - item.price * (item.sale / 100) : item.price} />
                </Flex>
            </ListGroupItemText>
        </ListGroupItem>
    );
};

const AdminInvoice = ({ history }) => {
    const Labratory = {
        col: "3",
        pid: PropConstIdes.Lab,
        controlType: "SearchControl",
        title: "آزمایشگاه",
        source: ConstIdes.Lab
    };
    const [products, setProducts] = useState([]);
    const [selLab, setSelLab] = useState();
    const [invoice, setInvoice] = useState();
    const [lastInvoice, setLastInvoice] = useState();
    const [state, setState] = useState(0);
    const [selProducts, setSelProducts] = useState([]);
    useEffect(() => {
        const fetch = async () => {
            let tempproducts = await CartContextClass.GetProducts();
            tempproducts = tempproducts.sort((item1, item2) => (parseInt(item1.row) - parseInt(item2.row)))
            setProducts(tempproducts);
        }
        fetch();
    }, [])
    const PropertyHandler = async (value, obj) => {
        CartContextClass.cart = [];
        setSelLab(obj);
        setInvoice(undefined);
        setState(0);
        setSelProducts([]);
        let wh = new ConditionMaker('O30E12C60');
        wh.AddCondition('PC337', '=', value);

        var con = new EngineCondition();
        con.ID = "O30E12C60";
        con.SQLCondition = JSON.stringify(wh);
        con.OrderBy = " Order by convert(datetime,[PC363]) DESC";
        con.StartFor = "0";
        con.RecordCount = "1";
        let list = await con.GetResult();
        if (list.length > 0) {
            setLastInvoice(new InvoiceHeader(list[0]));
        }
    }
    const LoadTests = () => { }
    const onClick = ({ currentTarget }) => {
        let selproduct = CartContextClass.cart.findIndex(x => x.ID === currentTarget.id);
        let temp = [];
        if (selproduct < 0) {
            let product = products.find(x => x.ID === currentTarget.id);
            temp = [...selProducts, product];
            CartContextClass.addToCart(product);
        }
        else {
            temp = CartContextClass.cart.splice(selproduct, 1);
            temp = [...selProducts];
            CartContextClass.cart = [...temp];
        }
        setSelProducts(temp);
    }
    const newInvoice = async () => {
        setState(1);
        if (selLab) {
            let value = await CartContextClass.CreateInvoice(true, selLab);
            setInvoice(value.Header.ID);

        }
        else {
            toast.warn('آزمایشگاه را انتخاب نمایید');
        }
        setState(2);
    }
    const openInvoice = () => {
        const newWindow = window.open("/e-commerce/invoice/" + invoice)
        if (newWindow) newWindow.opener = null
        // history.push({
        //     pathname: "/e-commerce/invoice/" + invoice,
        // });
    }
    return (<>
        <Card className='mb-2 d-print-none'>
            <FalconCardHeader title='ثبت نام آزمایشگاه ها ' >
            </FalconCardHeader>
            <CardBody>
                <Row>
                    <Col>
                        <JoiSearchBox Control={Labratory}
                            TitleFree={false}
                            type={Labratory.source} onChange={(pid, value) => {
                                PropertyHandler(pid, value);
                                LoadTests();
                            }}
                            PID={Labratory.pid} placeHolder={Labratory.title} />
                    </Col>
                    <Col>
                        {lastInvoice ? 
                        <Link to={"/e-commerce/invoice/" + lastInvoice.ID}>
                            {lastInvoice.total}
                            { moment(lastInvoice.Date, 'MM/DD/YYYY')
                                                .locale('fa').format('YYYY/M/D')}
                        </Link> 
                        : <p>هیچ فاکتوری یافت نشد</p>}
                    </Col>
                </Row>
            </CardBody>
        </Card>
        <Row>
            <Col>
                <Card>
                    <FalconCardHeader title='لیست محصولات' titleTag="h6" className="py-2" />
                    <ListGroup>
                        {products.map(item => <ProductRow key={item.ID} item={item} onClick={onClick} active={selProducts.findIndex(x => x.ID === item.ID) >= 0} />)}
                    </ListGroup>
                </Card>
            </Col>
            <Col>
                <Card>
                    <FalconCardHeader title='لیست انتخاب شده' titleTag="h6" className="py-2" />
                    <ListGroup>
                        {selProducts.map(item => <ProductRow key={item.ID} item={item} onClick={onClick} />)}
                    </ListGroup>
                    {
                        selProducts.length > 0 ?
                            (state === 0 ? <Button className='p-3 m-3' onClick={newInvoice}>صدور فاکتور </Button>
                                : (state === 1 ? <Button className='p-3 m-3'><Spinner /></Button>
                                    : <Button color='primary' onClick={openInvoice} className='p-3 m-3'>برای باز کردن فاکتور کلیک نمایید</Button>)
                            )
                            : <h5 className='p-3 m-3'>جهت انتخاب محصول بروی آن دوبار کلیک نمایید</h5>
                    }

                </Card>
            </Col>
        </Row>

    </>
    );
};

export default AdminInvoice;