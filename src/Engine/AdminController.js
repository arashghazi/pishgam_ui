import axiosInstance from "./BaseSetting";

export class AdminController{
    static async BuildCertificate(yearId,labId) {
        let result = {};
        try {
            result = await axiosInstance.get('Admin/BCertificate',{ params: { yearId,labId }});
        } catch (e) {
            console.log(e)
        }
        return result.data;
    }
}