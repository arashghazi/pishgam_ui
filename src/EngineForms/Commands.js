import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, CardBody } from 'reactstrap';
import { Utility } from '../Engine/Common';
import GetDisplay from '../Engine/Lan/Context';
import { CSVLink } from "react-csv";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import BaseInstance from '../Engine/BaseInstance';
import { AuthenticationController } from '../Engine/Authentication';
const CommandSetting = [
    { command: 'Save', title: GetDisplay('save'), color: 'primary' },
    { command: 'New', title: GetDisplay('new'), color: 'secondary' },
    { command: 'Delete', title: GetDisplay('delete'), color: 'danger' },
    { command: 'Save-New', title: GetDisplay('save-new'), color: 'secondary' },
    { command: 'Refresh', title: GetDisplay('refresh'), color: 'secondary' },
    { command: 'RefreshTemplate', title: GetDisplay('refresh-template'), color: 'secondary' },
    { command: 'DownLoad', title: GetDisplay('download'), color: 'secondary' },

]
const Commands = ({ commands, DM, type, formId, callback, Mode }) => {
    let result = [];
    const [data, setData] = useState([]);
    const [busy, setBusy] = useState(false);
    useEffect(() => {
        const checkrole = async () => {
            for (let index = 0; index < commands.length; index++) {
                const element = commands[index];
                if (typeof (element) === 'string') {
                    element = { Command: element, Order: [formId] }
                }
                if (element.Role)
                    element.visible = await AuthenticationController.HasRole(element.Role);
                else
                    element.visible = true;
            }
        }
        checkrole();
    }, [commands])
    const Commander = async (command, type, ides = []) => {
        setBusy(true);
        switch (command) {
            case 'Save':
                if (DM.ActionType === 'template')
                    DM.Save();
                else {
                    for (let i = 0; i < ides.length; i++) {
                        await DM.Save(ides[i], callback);
                    }
                }
                break;
            case 'New':
                for (let i = 0; i < ides.length; i++) {
                    DM.New(ides[i], Utility.GetFormType(ides[i]));
                }
                break;
            case 'Save-New':
                if (DM.ActionType === 'template')
                    DM.Save();
                else {
                    for (let i = 0; i < ides.length; i++) {
                        await DM.Save(ides[i], callback);
                    }
                }
                for (let i = 0; i < ides.length; i++) {
                    DM.New(ides[i], Utility.GetFormType(ides[i]));
                }
                break;
            case 'Refresh':
                for (let i = 0; i < ides.length; i++) {
                    await DM.Refresh(ides[i]);
                    setData(DM.GetDataFromFrom(ides[i]))
                }
                break;
            case 'Delete':
                if (DM.ActionType === 'template'){
                    await DM.DeleteTemplate();
                }
                else {
                    for (let i = 0; i < ides.length; i++) {
                        await DM.Delete(ides[i]);
                    }
                }
                break;
        }
        setBusy(false);

    }
    if (type === '3') {
        commands.map((item) => {
            if (item.visible) {
                if (item.Show !== "TempData" || Mode === 'template') {
                    if (item.Order?.length > 0) {
                        let commandSetting = CommandSetting.find(x => x.command === item.Command);
                        result = [...result, commandSetting.command === 'DownLoad' ? (data?.length > 0 ?
                            <CSVLink data={data.map(ins => new BaseInstance(ins).instanceToRow())}
                                filename={`${DM?.formStructuer?.title ?? "-file"}.csv`}>
                                <FontAwesomeIcon icon={faDownload} />
                            </CSVLink> : null) : <Button disabled={busy} className="mr-2" key={item.Command} outline color={commandSetting.color}
                                value={item.Command} onClick={() => Commander(item.Command, type, item.Order)} > {commandSetting.title}</Button >];
                    }
                    else if (!item.Order) {
                        let commandSetting = CommandSetting.find(x => x.command === item);
                        result = [...result, <Button disabled={busy} className="mr-2" key={item} outline color={commandSetting.color}
                            onClick={() => Commander(item, type, [formId])} > {commandSetting.title} </Button >];
                    }
                }
            }
        })
    }
    else {
        commands.map(item => {
            if (item.visible) {
                if (item.Order?.length > 0) {
                    let commandSetting = CommandSetting.find(x => x.command === item.Command);
                    result = [...result, commandSetting.command === 'DownLoad' ? (data?.length > 0 ?
                        <CSVLink data={data.map(ins => new BaseInstance(ins).instanceToRow())}
                            filename={`${DM?.formStructuer?.title ?? "-file"}.csv`}>
                            <FontAwesomeIcon icon={faDownload} />
                        </CSVLink> : null) : <Button disabled={busy} className="mr-2" key={item.Command} outline color={commandSetting.color}
                            value={item.Command} onClick={() => Commander(item.Command, type, item.Order)} > {commandSetting.title}</Button >];
                }
                else if (!item.Order) {
                    let commandSetting = CommandSetting.find(x => x.command === item);
                    result = [...result, <Button className="mr-2" key={item} outline color={commandSetting.color}
                        onClick={() => Commander(item, type, [formId])} > {commandSetting.title}</Button >];
                }
                return result;
            }
        })
    }
    return DM.loading ? null : <CardBody><div className='float-right' type="inline" >{result}</div></CardBody>;
}
export default Commands;
Commands.propTypes = {
    commands: PropTypes.array.isRequired,
};