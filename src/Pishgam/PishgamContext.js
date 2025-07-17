
import BaseInstance, { NewInstance, NewProperty } from "../Engine/BaseInstance";
export class SendProccess extends BaseInstance {
    constructor(instance) {
        if (instance === undefined) {
            instance = NewInstance('O30E12C64');
            SendProccess.PIDs.map((pid) =>
                instance.Prop.push(NewProperty(pid)));
        }
        super(instance);
    }
    static PIDs = ['P8', 'P3', 'P1', 'P87', 'P88', 'P89', 'P9', 'P90'];
    set Labratoary(value) {
        this.SetValue(SendProccess.PIDs[0], value);
    }
    get Labratoary() {
        return this.GetValue(SendProccess.PIDs[0]);
    } set Period(value) {
        this.SetValue(SendProccess.PIDs[1], value);
    }
    get Period() {
        return this.GetValue(SendProccess.PIDs[1]);
    } set Section(value) {
        this.SetValue(SendProccess.PIDs[2], value);
    }
    get Section() {
        return this.GetValue(SendProccess.PIDs[2]);
    } set InvoiceState(value) {
        this.SetValue(SendProccess.PIDs[3], value);
    }
    get InvoiceState() {
        return this.GetValue(SendProccess.PIDs[3]);
    }
    set SendDate(value) {
        this.SetValue(SendProccess.PIDs[4], value);
    }
    get SendDate() {
        return this.GetValue(SendProccess.PIDs[4]);
    } set TrackID(value) {
        this.SetValue(SendProccess.PIDs[5], value);
    }
    get TrackID() {
        return this.GetValue(SendProccess.PIDs[5]);
    } set Sample(value) {
        this.SetValue(SendProccess.PIDs[6], value);
    }
    get Sample() {
        return this.GetValue(SendProccess.PIDs[6]);
    }
    set PakingDate(value) {
        this.SetValue(SendProccess.PIDs[7], value);
    }
    get PakingDate() {
        return this.GetValue(SendProccess.PIDs[7]);
    }
}

export class ExternalLink extends BaseInstance {
    constructor(instance) {
        if (instance === undefined) {
            instance = NewInstance('O30E0C1');
            ExternalLink.PIDs.map((pid) =>
                instance.Prop.push(NewProperty(pid)));
        }
        super(instance);
    }
    static PIDs = ['PC95', 'P164','PC533'];
    set Title(value) {
        this.SetValue(ExternalLink.PIDs[0], value);
    }
    get Title() {
        return this.GetValue(ExternalLink.PIDs[0]);
    } set Address(value) {
        this.SetValue(ExternalLink.PIDs[1], value);
    }
    get Address() {
        return this.GetValue(ExternalLink.PIDs[1]);
    }
    set Type(value) {
        this.SetValue(ExternalLink.PIDs[2], value);
    }
    get Type() {
        return this.GetValue(ExternalLink.PIDs[2]);
    }
}