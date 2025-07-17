import React from 'react';
import uuid from 'uuid/v1';
import axiosInstance from './BaseSetting';
import ErrorHandler from './ErrorHandler';
import { InstanceController } from './InstanceController';
import NumberFormat from 'react-number-format';
import { faFolderPlus, faPlus, faRedo, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';

const SearchObject = async (context, source, operator = '=', orderBy = '', props) => {
    let result = {};
    try {
        result = await axiosInstance.post('Utility/SearchObject',
            { context, source, operator, orderBy, props }
        );
    } catch (e) {
        await ErrorHandler.CominicationError(e, SearchObject);
    }
    return result.data;
}
const SearchConditionMaker = async (con) => {
    let result = {};
    try {
        result = await axiosInstance.get('Instance/GetConMakerInstances',
            { params: { condition: JSON.stringify(con) } });
        console.log(result)
    } catch (e) {
        ErrorHandler.CominicationError(e);
    }
    return result.data;
}
const SearchCondition = async (condition) => {
    let result = {};
    try {
        result = await axiosInstance.post('Instance/GetConInstances', { conditions: condition });
    } catch (e) {
        ErrorHandler.CominicationError(e);
    }
    return JSON.parse(result.data);
}
const Upload = async (file, filedata, onUploadProgress) => {
    let formData = new FormData();
    formData.append("file", file);
    formData.append("filedata", filedata);
    return await axiosInstance.post("Utility/SaveFile", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
    });
}
const GetFile = async (filename) => {
    return await axiosInstance.get("Utility/GetFile", { params: { name: filename, type: '1' }, responseType: 'arraybuffer' });
}

export class Utility {
    static isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
    static GetClassID(id = '') {
        let result = '';
        if (this.IsClassID(id))
            return id
        if (this.IsInstanceID(id)) {
            id = id.replace('Instance-', '');
            result = id.substring(0, id.indexOf('I') > 0 ? id.indexOf('I') : id.length);
        }
        else if (this.IsFormID(id)) {
            result = id.split('F')[0];
        }
        return result;
    }
    static GetInstanceSerial(eId){
        let result = null;
        if (this.IsInstanceID(eId)) {
            result = eId.substring(eId.indexOf('I'));
            result = result.replace('I', '');
        }
        return parseInt(result);
    }
    static Pasword(str = '') { return str !== null ? str.toString().match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/) : false; }
    static IsInstanceID(str = '') { return str !== null ? str.toString().match(/^O[0-9]+E[0-9]+C[0-9]+I\d+$|^E[0-9]+C[0-9]+I\d+$/) : false; }
    static IsFormID(str = '') { return str !== null ? str.toString().match(/^O[0-9]+E[0-9]+C[0-9]+F[0-9]+V\d+$|^E[0-9]+C[0-9]+F[0-9]+V\d+$|^Panel+F[0-9]+V\d+$/) : false; }
    static IsClassID(str = '') { return str !== null ? str.match(/^O[0-9]+E[0-9]+C\d+$|^E[0-9]+C\d+$/) : false; }
    static IsEntityID(str = '') { return str !== null ? str.match(/^O[0-9]+E\d+$|^E\d+$/) : false; }
    static IsPropertyID(str = '') { return str !== null ? str.match(/^P[0-9]|^PC[0-9]/) : false; }
    static IsSystemPropertyID(str = '') { return str !== null ? str.match(/^PC[0-9]/) : false; }
    static IsID(str = '') {
        return (
            this.IsInstanceID(str) ||
            this.IsFormID(str) ||
            this.IsClassID(str) ||
            this.IsEntityID(str) ||
            this.IsPropertyID(str) ||
            this.IsSystemPropertyID(str)
        )
    }
    static IsClassOrInstanceID(str = '') {
        return this.IsClassID(str) || this.IsInstanceID(str);
    }
    static datelocal;
    static dateserver;
    static async GetNow() {
        let time = null;
        if (!this.dateserver) {
            let resultdata = await axiosInstance.get('Utility/GetNow');
            if (resultdata.status === 200) {
                this.dateserver = resultdata.data;
            }
        }
        let temp = this.dateserver.split(' ');
        time = {
            hour: temp[1],
            date: temp[0],
            toString: this.dateserver
        }
        return time;
    }

    static async ActiveUsers() {
        let resultdata = await axiosInstance.get('Utility/ActiveUsers');
        if (resultdata.status === 200) {
            return resultdata.data;
        }
        return undefined;
    }
    static async ActiveUsersList() {
        let resultdata = await axiosInstance.get('Utility/ActiveUsersList');
        if (resultdata.status === 200) {
            return resultdata.data;
        }
        return undefined;
    }
    static async DownloadFile(filename) {
        let headers = { 'Content-Type': 'blob' };
        try {
            const response = await axiosInstance.get('Utility/GetFile', { params: { name: filename, type: 'Conditions' }, responseType: 'arraybuffer', headers });
            const outputFilename = `${Date.now()}.xls`;
            const url = URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', outputFilename);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            throw Error(error);
        }
    }
    static async SendMali(formdata) {
        try {
            var response = await axiosInstance.post('Utility/SendMail', formdata);
            if (response?.status === 200)
                return true;
            return undefined;
        } catch (error) {
            console.log(error.message)
            ErrorHandler.CominicationError(error);
        }
    }
    static ObjToInsList(list = []) {
        let inses = [];
        list.map((item) => inses = [...inses, item.Instance]);
        return inses;
    }
    static GetFormType(formId) {
        if (formId?.split('F')[1]?.split('V')[0])
            return formId?.split('F')[1]?.split('V')[0];
        return 'NA';
    }
    static async GetCertificate(id) {
        try {
            var response = await axiosInstance.get('Utility/GetCertificate', { params: { id } });
            if (response?.status === 200)
                return response.data;
            return undefined;
        } catch (error) {
            ErrorHandler.CominicationError(error);
        }
    }
    static async GetCertFile(id) {
        try {
            var response = await axiosInstance.get('Utility/GetCertFile', {
                responseType: 'blob',
                params: { id }
            });
            if (response?.status === 200) {
                // const contentDisposition = response.headers['content-disposition'];
                // console.log(response)
                // const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                // const matches = filenameRegex.exec(contentDisposition);
                // const filename = matches != null && matches[1] ? matches[1].replace(/['"]/g, '') : 'file1.pdf';
            
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'گواهی پیشگام ایرانیان.pdf');
                document.body.appendChild(link);
                link.click();
            }
            return null;
        } catch (error) {
            ErrorHandler.CominicationError(error);
        }
    }
}
export class ReportHistory {
    static new11 = `{"title":"test","ID":"E0C24","ref":"'''',''O30E12C2''"}`;
    static con = `{"OCID":"E0C24","BCs":[{"Bts":[{"PID":"PC19","PRA":"Equal","IPV":"#PC19","NLC":"#NLC","SRC":""}^],"NLC":"None"}]}`;
    static async Find(key, name) {
        let condition = this.con.replaceAll('#PC19', key)
        if (name !== undefined)
            condition = condition.replaceAll('^', `,{"PID":"PC95","PRA":"Equal","IPV":"${name}","NLC":"None","SRC":""}`)
                .replaceAll('#NLC', 'And')
        else
            condition = condition.replaceAll('^', '').replaceAll('#NLC', 'None')

        let result = await InstanceController.GetInstancesAsync(condition);
        if (result.ID !== undefined)
            result = JSON.parse(result.Prop.find(x => x.PID === 'PC556').IPV.replaceAll(`'`, '"'));
        return result;
    }
}

export const AddNewTabIns = (path, instance) => {
    let id = uuid()
    localStorage.setItem(id, JSON.stringify(instance))
    window.open(path + id, "_blank") //to open new page

}
export const GetNewTabIns = (id) => {
    let instance = localStorage.getItem(id);
    localStorage.removeItem(id)
    if (instance !== undefined)
        return JSON.parse(instance);
    return null;

}
const AnonymousReg = async (content) => {
    let result = {};
    try {
        result = await axiosInstance.post('Utility/AnonymousReg', content);
        if (result.status === 200)
            return result.data;
        else
            return result.status;
    } catch (e) {
        ErrorHandler.CominicationError(e);
    }
}
const SaveEmploye = async (content) => {
    let result = {};
    try {
        content.Code = 'vnsoi85bv937qoc';
        result = await axiosInstance.post('Utility/SaveEmploye', content);
        if (result.status === 200)
            return result.data;
        else
            return result.status;
    } catch (e) {
        ErrorHandler.CominicationError(e);
    }
}
export const NewEmploye = () => {
    let result = {
        FormID: "E11C1F0V1",
        Data: {
            ...{
                ID: '',
                UID: 'new',
                User: { ...{ ID: '', UserName: '', Password: '', State: true } },
                Person: { ...{ UID: '', ID: 'E11C1', Prop: [] } }
            }
        }
    };

    result.Data.Person.UID = uuid();
    return { ...result };
}
export const LoadEmploye = async (id) => {
    let result = {};
    try {
        result = await axiosInstance.get('Utility/GetEmploye', { params: { employeid: id } });
        console.log(id, result.data)
        if (result.status === 200)
            return result.data;
        else
            return result.status;
    } catch (e) {
        ErrorHandler.CominicationError(e);
    }
}
export const MoneyFormat = (value) => {
    return <NumberFormat thousandSeparator={true} displayType={'text'} prefix={'ریال'}
        value={value} />
}
export const NewForm = {
    ShowType: "vertical", FormID: "", title: "",
    Commands: ["Save", "New", "Delete", "Save-New"],
    Realations: [],
    rows: [{
        height: "auto",
        controls: []
    }]
}
export const NewCell = {
    col: "",
    pid: "",
    controlType: "",
    title: ""
}
export const CommandRow = {
    height: "auto",
    sections: "Commands"
}
export const NewObjectClass = {
    ID: "",
    EID: '',
    Contexts: [], Name: "", prm: 0,
    ShowProp: '',
    UserCanChange: true,
    HasReadLimitation: false,
    properties: [],
    Extended: {
        KEYS: [],
        IsUniqe: false,
        LOH: false,
        RST: 0
    }
}
export const NewProperty = {
    Contexts: [],
    StyleW2: {
        Control: "None", DataType: "String", Min: 0, Max: 0, ValueLengh:
            0, MultiValue: false, ValueQty: 0, State: "1",
        History: false, FixedValue: false, IsMultilingual: false
    },
    Name: "",
    ID: ""
}
export const NewPanel = {
    FormID: "",
    ShowType: "Panel", title: "",
    rows: [{
        height: "auto", controls:
            [{
                col: "12",
                formid: "",
                connectionPid: "",
                title: ""
            }]
    },
    {
        height: "auto",
        controls: 'Commands'
    },
    {
        height: "auto",
        controls: [
            {
                col: "12",
                formid: "",
                connectionPid: "",
                title: "",
                Editor: ""
            }
        ]
    }], Connectors: [],
    Commands: [{
        Command: "Save",
        Order: []
    },
    {
        Command: "Delete",
        Order: []
    },
    {
        Command: "New",
        Order: [],
        Show: "TempData"
    },
    {
        Command: "Save-New",
        Order: []
    },
    {
        Command: "Refresh",
        Order: []
    }],
    Relations: []
}
export const dataTypeList = [
    {
        id: "Double", display: "Double"
    },
    {
        id: "String", display: "String"
    },
    {
        id: "Boolean", display: "Boolean"
    },
    {
        id: "DateTime", display: "DateTime"
    },
    {
        id: "Time", display: "Time"
    },
    {
        id: "BaseProperty", display: "BaseProperty"
    },
    {
        id: "Entity", display: "Entity"
    },
    {
        id: "ObjectClass", display: "ObjectClass"
    },
    {
        id: "Instance", display: "Instance"
    },
    { id: "AnyInstance", display: "AnyInstance" },
    { id: "Group", display: "Group" },
    { id: "ObjectClassList", display: "ObjectClassList" },
    { id: "User", display: "User" },
    { id: "Date", display: "Date" },
    { id: "File", display: "File" },
    { id: "Role", display: "Role" },
    { id: "Json", display: "Json" },
    {
        id: "TimeSpan", display: "TimeSpan"
    },
    {
        id: "NewInstance", display: "NewInstance"
    }
];
export const controlTypeList = [
    { display: "None", id: "None" },
    { display: "TextBox", id: "AITextBox" },
    { display: "MultiLang_TextBox", id: "MultiLang_TextBox" },
    { display: "ComboBox", id: "ComboBox" },
    { display: "CheckBox", id: "CheckBox" },
    { display: "Slider_CheckBox", id: "Slider_CheckBox" },
    { display: "TreeView", id: "TreeView" },
    { display: "SearchControl", id: "SearchControl" },
    { display: "InstanceControl", id: "InstanceControl" },
    { display: "UserBox", id: "UserBox" },
    { display: "Weight", id: "Weight" },
    { display: "RaidoButton", id: "RaidoButton" },
    { display: "MultiLineText", id: "MultiLineText" },
    { display: "File", id: "FileControl" },
    { display: "TimePeriod", id: "TimePeriod" }];
export const formTypes = [
    { display: "Data Form", id: "vertical", index: '0' },
    { display: "List Form", id: "horizental", index: '1' },
    { display: "Panel", id: "Panel", index: '3' }
];
export const commandList = [{
    id: 'Save',
    title: 'ذخیره', icon: faSave
}, {
    id: 'New',
    title: 'جدید', icon: faPlus
}, {
    id: 'Delete',
    title: 'حذف', icon: faTrash
}, {
    id: 'Save-New',
    title: 'ذخیره و جدید', icon: faFolderPlus
}, {
    id: 'Refresh',
    title: 'بارگزاری', icon: faRedo
}];
const SetLocalLink = (obj) => {
    let id = uuid();
    let json = JSON.stringify(obj);
    localStorage.setItem(id, json);
    return id;
};
const GetLocalLink = (id) => {
    let json = localStorage.getItem(id);
    localStorage.removeItem(id);
    if (json)
        return JSON.parse(json);
    else return undefined;
};
export {
    SearchObject, SearchCondition, SearchConditionMaker, SaveEmploye,
    Upload, GetFile, AnonymousReg, SetLocalLink, GetLocalLink
};