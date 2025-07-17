export default class StorageController {
    static SourceList = [{ DataModel: { Key: '', Type:''}}];
    static AddToSource(dataModel, component = null) {
        try {
        
            let model = new ComponentSource();
            model.DataModel = dataModel;
            if (component !== null)
                model.Components = [...model.Components, component];
            this.SourceList = [...this.SourceList, model];
            if (component !== null)
                component.Update(dataModel);
        } catch (e) {
            console.log(e);
        }
    }
    static GetModel(key, type) {
        let list = this.SourceList.find(x => x.DataModel.Key === key && x.DataModel.Type === type);
        if (list !== undefined)
            return list.DataModel;
        return null;
    }
    static FindModel(instanceid, type = 'INSTANCE') {
        let result = null;
        let list = this.SourceList.find(x => x.DataModel.Type === type && x.DataModel.Key === instanceid);
        if (list !== null && list !== undefined)
            result = list;
        return result;
    }
    static Remove(instanceid, type = 'INSTANCE') {
        let index = this.SourceList.findIndex(x => x.DataModel.Type === type && x.DataModel.Key === instanceid);
        this.SourceList.splice(index, 1);
    }
    static Update(csource) {
        csource.Components.map((component) => component.Update(csource.DataModel))
    }
    static UpdateModel(dataModel) {
        let csource = this.FindModel(dataModel.Key, dataModel.Type)
        csource.DataModel = dataModel;
        csource.Components.map((component) => component.Update(csource.DataModel))
    }
}

class ComponentSource {
    DataModel ;
    Components = [];
}

export class DataModel {
    Key = '';
    Data = {}
    Type = {};
    state = 0;
}
