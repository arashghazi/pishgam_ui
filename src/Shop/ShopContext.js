import { createContext } from "react";
import { PGISsettings } from "../config";
import { AuthenticationController } from '../Engine/Authentication';
import BaseInstance, { NewInstance, NewProperty } from "../Engine/BaseInstance";
import { SearchObject, Utility } from "../Engine/Common";
import ConditionMaker from "../Engine/ConditionMaker";
import { InstanceController } from '../Engine/InstanceController';
import Parameters from '../Engine/Parameters';
import InstitutionContext from "../InstitutionContext";

export class CartContextClass {
    static products = [];
    static productGroups = [];
    static cart = [];
    static GetInfo() {
        let subtotal = 0;
        this.cart.map((invoiceRow) => subtotal += invoiceRow.total);
        let tax = ((subtotal * PGISsettings.taxRate) / 100);
        let total = subtotal + tax;
        return { total, tax, subtotal };
    }
    static addToCart(product) {
        let invRow = this.cart.find(x => x.productobject.ID === product.ID)
        if (invRow === undefined) {
            invRow = new InvoiceRow();
            invRow.product = product;
            invRow.quantity = 0;
            invRow.realPrice = (!!product.sale ? product.price - product.price * (product.sale / 100) : product.price);
            this.cart = [...this.cart, invRow];
        }
        invRow.Add(1);
        return this.cart;
    };
    static removeFromCart(id) {

        let invRow = this.cart.findIndex(x => x.product === id)
        if (invRow >= 0)
            this.cart.splice(invRow, 1);
        return this.cart;
    };
    static async GetProductGroups() {
        if (this.productGroups.length === 0)
            this.productGroups = await SearchObject('', 'O30E12C52', '<>', ' order by PC2');
        return this.productGroups;
    }
    static async GetProducts(selectedGroup) {
        let prods = await this.LoadProducts();
        if (selectedGroup !== undefined && selectedGroup !== 'allGroup')
            prods = prods.filter(x => x.category === selectedGroup);
        return prods;
    }
    static async LoadProducts() {
        if (this.products.length === 0) {
            let condition = new ConditionMaker('O30E12C53')
            condition.AddCondition('P63', '=', '1', 'and');
            condition.AddCondition('convert(datetime,P64)', '>', `convert(datetime,${(await Utility.GetNow()).date})`)
            let instances = await condition.GetResult();
            this.products = []
            if (instances !== undefined) {
                instances.map((instance) => {
                    this.products = [...this.products, new Product(instance)]
                })
            }
        }
        return this.products;
    }
    static async CreateInvoice(save,user,items) {
        if (items??this.cart?.length > 0) {
            let invoice = {
                Header: new InvoiceHeader(),
                Details: items??CartContextClass.cart
            };
            let { total, tax, subtotal } = CartContextClass.GetInfo();
            // invoice.Header.Date = moment((await Utility.GetNow()).date, 'MM/DD/YYYY')
            //     .locale('fa')
            //     .format('YYYY/M/D');
            let serverdate= await Utility.GetNow();
            invoice.Header.Date = serverdate.toString
            invoice.Header.user = user??await InstitutionContext.GetInstitution();
            invoice.Header.tax = tax;
            invoice.Header.subtotal = subtotal;
            invoice.Header.total = total;
            invoice.Header.state = 'O30E12C63I1';
            let detailinstances = [];
            invoice.Details.map((row) => {
                detailinstances = [...detailinstances, row.Instance];
            })
            if (save) {
                let saveddata = await InstanceController.SaveRelatedInstancesAsync(
                    invoice.Header.Instance, 'P80', detailinstances
                );
                invoice.Header = new InvoiceHeader(saveddata.Header);
                let details = [];
                saveddata.RelatedInstances.map((row) => {
                    let newRow = new InvoiceRow(row);
                    newRow.product = invoice.Details.find(x => x.productobject.ID === newRow.product).productobject
                    details = [...details, newRow]
                })
                invoice.Details = details;
            }
            return invoice;
        }
        return null;
    }
    static async LoadInvoice(id) {
        let invoice = {};
        let condition = new ConditionMaker('O30E12C60');
        if (await AuthenticationController.HasRole('R6')) {

            condition.AddCondition('ID', '=', id, 'AND');
            condition.AddCondition('PC337', '=', await Parameters.GetValue('@orgid'));
        }
        else if (await AuthenticationController.HasRole('R2')) {
            condition.AddCondition('ID', '=', id);
        }


        let saveddata = await InstanceController.GetRelatedInstancesAsync(JSON.stringify(condition), 'P80', ['O30E12C61'])
        if (saveddata) {
            invoice.Header = new InvoiceHeader(saveddata.Header);
            let details = [];
            for (var i = 0; i < saveddata.RelatedInstances.length; i++) {
                let row = saveddata.RelatedInstances[i];
                let newRow = new InvoiceRow(row);
                newRow.product = new Product(await InstanceController.LoadInstanceAsync(newRow.product));
                details = [...details, newRow]
            }
            invoice.Details = details;
        }
        return invoice;
    }
}
export class InvoiceHeader extends BaseInstance {
    constructor(instance) {
        if (instance === undefined) {
            instance = NewInstance('O30E12C60');
            InvoiceHeader.PIDs.map((pid) =>
                instance.Prop.push(NewProperty(pid)));
        }
        super(instance);
        this.PaymentDue = 0;
    }
    static PIDs = ["PC363",
        "P75",
        "P76",
        "P77",
        "P78",
        "PC337", "P87"]
    set Date(value) {
        this.SetValue(InvoiceHeader.PIDs[0], value);
    }
    get Date() {
        return this.GetValue(InvoiceHeader.PIDs[0]);
    }
    set PaymentDue(value) {
        this.SetValue(InvoiceHeader.PIDs[1], value);
    }
    get PaymentDue() {
        return this.GetValue(InvoiceHeader.PIDs[1]);
    }
    set subtotal(value) {
        this.SetValue(InvoiceHeader.PIDs[2], value);
    }
    get subtotal() {
        return this.GetValue(InvoiceHeader.PIDs[2]);
    }
    set tax(value) {
        this.SetValue(InvoiceHeader.PIDs[3], value);
    }
    get tax() {
        return this.GetValue(InvoiceHeader.PIDs[3]);
    }
    set total(value) {
        this.SetValue(InvoiceHeader.PIDs[4], value);
    }
    get total() {
        return this.GetValue(InvoiceHeader.PIDs[4]);
    }
    set user(value) {
        this.SetValue(InvoiceHeader.PIDs[5], value);
    }
    get user() {
        return this.GetValue(InvoiceHeader.PIDs[5]);
    }
    set state(value) {
        this.SetValue(InvoiceHeader.PIDs[6], value);
    }
    get state() {
        return this.GetValue(InvoiceHeader.PIDs[6]);
    }
}
export class InvoiceRow extends BaseInstance {
    constructor(instance) {
        if (instance === undefined) {
            instance = NewInstance('O30E12C61');
            InvoiceRow.PIDs.map((pid) =>
                instance.Prop.push(NewProperty(pid)));
        }
        super(instance);
    }
    static PIDs = ['PC338', 'PC339', 'P79', 'P80'];
    set quantity(value) {
        this.SetValue(InvoiceRow.PIDs[0], value);
    }
    get quantity() {
        return this.GetValue(InvoiceRow.PIDs[0]);
    }
    set realPrice(value) {
        this.SetValue(InvoiceRow.PIDs[1], value);
    }
    get realPrice() {
        return this.GetValue(InvoiceRow.PIDs[1]);
    } set product(value) {
        this.SetValue(InvoiceRow.PIDs[2], value);
    }
    get product() {
        return this.GetValue(InvoiceRow.PIDs[2]);
    }
    get productobject() {
        let obj = this.GetValue(InvoiceRow.PIDs[2], true);
        if (obj !== undefined && obj.Instance === undefined)
            obj = new Product(obj);
        return obj
    }
    set Invoiceid(value) {
        this.SetValue(InvoiceRow.PIDs[3], value);
    }
    get Invoiceid() {
        return this.GetValue(InvoiceRow.PIDs[3]);
    }
    get total() {
        return this.quantity * this.realPrice;
    }
    realPrice;
    Change(value) {
        this.quantity = value;
    }
    Add(value) {
        this.quantity = parseInt(this.quantity) + parseInt(value);
    }
    Remove(value) {
        this.quantity = parseInt(this.quantity) - parseInt(value);
    }
}
export class PaymentDocument extends BaseInstance {
    constructor(instance, invoice) {
        if (instance === undefined) {
            instance = NewInstance('O30E12C62');
            PaymentDocument.PIDs.map((pid) =>
                instance.Prop.push(NewProperty(pid)));
        }
        super(instance);
        if (invoice !== undefined) {
            this.PayerAccount = invoice.user;
            this.Invoice = invoice;
        }
    }
    static async LoadInvoice(id) {
        let invoice = {};
        let condition = new ConditionMaker('O30E12C60');
        condition.AddCondition('ID', '=', id);
        let saveddata = await InstanceController.GetRelatedInstancesAsync(JSON.stringify(condition), 'P80', ['O30E12C62'])
        invoice.Header = new InvoiceHeader(saveddata.Header);
        let payments = [];
        if (saveddata.RelatedInstances.length > 0) {
            for (var i = 0; i < saveddata.RelatedInstances.length; i++) {
                let row = saveddata.RelatedInstances[i];
                let newRow = new PaymentDocument(row);
                payments = [...payments, newRow]
            }
        }
        invoice.Payments = payments;
        return invoice;
    }
    static PIDs = ['P81', 'P82', 'PC346', 'P83', 'P84', 'P85', 'PC128', 'P86', 'P80'];
    set RegisterDate(value) {
        this.SetValue(PaymentDocument.PIDs[0], value);
    }
    get RegisterDate() {
        return this.GetValue(PaymentDocument.PIDs[0]);
    }
    set PaymentTime(value) {
        this.SetValue(PaymentDocument.PIDs[1], value);
    }
    get PaymentTime() {
        return this.GetValue(PaymentDocument.PIDs[1]);
    }
    set Amount(value) {
        this.SetValue(PaymentDocument.PIDs[2], value);
    }
    get Amount() {
        return this.GetValue(PaymentDocument.PIDs[2]);
    }
    set trackNumber(value) {
        this.SetValue(PaymentDocument.PIDs[3], value);
    }
    get trackNumber() {
        return this.GetValue(PaymentDocument.PIDs[3]);
    }
    set CardNumber(value) {
        this.SetValue(PaymentDocument.PIDs[4], value);
    }
    get CardNumber() {
        return this.GetValue(PaymentDocument.PIDs[4]);
    }
    set ReciverAccount(value) {
        this.SetValue(PaymentDocument.PIDs[5], value);
    }
    get ReciverAccount() {
        return this.GetValue(PaymentDocument.PIDs[5]);
    }
    set PaymentType(value) {
        this.SetValue(PaymentDocument.PIDs[6], value);
    }
    get PaymentType() {
        return this.GetValue(PaymentDocument.PIDs[6]);
    }
    set PayerAccount(value) {
        this.SetValue(PaymentDocument.PIDs[7], value);
    }
    get PayerAccount() {
        return this.GetValue(PaymentDocument.PIDs[7]);
    }
    set Invoice(value) {
        this.SetValue(PaymentDocument.PIDs[8], value);
    }
    get Invoice() {
        return this.GetValue(PaymentDocument.PIDs[8]);
    }
}

export class Product extends BaseInstance {
    constructor(instance) {
        if (instance === undefined) {
            instance = NewInstance('O30E12C53');
            Product.PIDs.map((pid) =>
                instance.Prop.push(NewProperty(pid)));
        }
        super(instance);
    }
    static PIDs = ['PC95', 'P62', 'PC2', 'PC341', 'PC339', 'P63', 'P64', 'P65', 'P66', 'P67'];
    set title(value) {
        this.SetValue(Product.PIDs[0], value);
    }
    get title() {
        return this.GetValue(Product.PIDs[0]);
    } set category(value) {
        this.SetValue(Product.PIDs[1], value);
    }
    get category() {
        return this.GetValue(Product.PIDs[1]);
    } set row(value) {
        this.SetValue(Product.PIDs[2], value);
    }
    get row() {
        return this.GetValue(Product.PIDs[2]);
    } set description(value) {
        this.SetValue(Product.PIDs[3], value);
    }
    get description() {
        return this.GetValue(Product.PIDs[3]);
    } set price(value) {
        this.SetValue(Product.PIDs[4], value);
    }
    get price() {
        return this.GetValue(Product.PIDs[4]);
    } set stateProduct(value) {
        this.SetValue(Product.PIDs[5], value);
    }
    get stateProduct() {
        return this.GetValue(Product.PIDs[5]);
    } set expierDate(value) {
        this.SetValue(Product.PIDs[6], value);
    }
    get expierDate() {
        return this.GetValue(Product.PIDs[6]);
    } set sale(value) {
        this.SetValue(Product.PIDs[7], value);
    }
    get sale() {
        return this.GetValue(Product.PIDs[7]);
    } set scale(value) {
        this.SetValue(Product.PIDs[8], value);
    }
    get scale() {
        return this.GetValue(Product.PIDs[8]);
    } set file(value) {
        this.SetValue(Product.PIDs[9], value);
    }
    get file() {
        return this.GetValue(Product.PIDs[9]);
    }
}

export class Labratoary extends BaseInstance {
    constructor(instance) {
        if (instance === undefined) {
            instance = NewInstance('O30E23C6');
            Labratoary.PIDs.map((pid) =>
                instance.Prop.push(NewProperty(pid)));
        }
        super(instance);
    }
    static async LoadAsync(id) {
        let ins = await InstanceController.LoadInstanceAsync(id);
        return new Labratoary(ins);
    }
    static PIDs = ['PC88', 'P4', 'P5', 'P6', 'P7', 'P74', 'P68', 'PC108', 'PC324', 'P69', 'P70', 'P71', 'PC147', 'PC365', 'P72'];
    set Name(value) {
        this.SetValue(Labratoary.PIDs[0], value);
    }
    get Name() {
        return this.GetValue(Labratoary.PIDs[0]);
    }
    set OldCode(value) {
        this.SetValue(Labratoary.PIDs[3], value);
    }
    get OldCode() {
        return this.GetValue(Labratoary.PIDs[3]);
    }
    set EcoCode(value) {
        this.SetValue(Labratoary.PIDs[6], value);
    }
    get EcoCode() {
        return this.GetValue(Labratoary.PIDs[6]);
    } set Email(value) {
        this.SetValue(Labratoary.PIDs[7], value);
    }
    get Email() {
        return this.GetValue(Labratoary.PIDs[7]);
    } set NationalCode(value) {
        this.SetValue(Labratoary.PIDs[8], value);
    }
    get NationalCode() {
        return this.GetValue(Labratoary.PIDs[8]);
    }
    set Address(value) {
        this.SetValue(Labratoary.PIDs[10], value);
    }
    get Address() {
        return this.GetValue(Labratoary.PIDs[10]);
    } set ZipCode(value) {
        this.SetValue(Labratoary.PIDs[12], value);
    }
    get ZipCode() {
        return this.GetValue(Labratoary.PIDs[12]);
    }
    set Tel(value) {
        this.SetValue(Labratoary.PIDs[13], value);
    }
    get Tel() {
        return this.GetValue(Labratoary.PIDs[13]);
    }
}
const CartContext = createContext(new CartContextClass());
export default CartContext;