import ErrorHandler from './ErrorHandler';
import axiosInstance from './BaseSetting';


export default class RelationController {
    static DataModel = {
        baseID: '#',
        relationType: null,
        relationTypeID: '',
        beUniqe: true,
        dependTypeID: '',
        dependencyIDes: []
    }
    static async AddRelationAsync(dataModel) {
        let result = {};
        try {
            result = await axiosInstance.post('Relation/AddRelation', dataModel);
        } catch (e) {
            ErrorHandler.CominicationError(e);
        }
        return result.data;

    }
    static async DeleteRelationAsync(dataModel) {
        let result = {};
        try {
            result = await axiosInstance.post('Relation/DeleteRelation', dataModel);
        } catch (e) {
            ErrorHandler.CominicationError(e);
        }
        return result.data;

    }
    static async GetRelationAsync(dataModel) {
        let result = {};
        try {
            result = await axiosInstance.post('Relation/GetRelation', dataModel);

        } catch (e) {
            ErrorHandler.CominicationError(e);
        }
        return result.data;

    }
    static async GetRelationBaseAsync(dataModel) {
        let result = {};
        try {
            result = await axiosInstance.post('Relation/GetRelationBase', dataModel);

        } catch (e) {
            ErrorHandler.CominicationError(e);
        }
        return result.data;

    }
}