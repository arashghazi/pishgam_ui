import BaseInstance from './BaseInstance';
import axiosInstance, { settings } from './BaseSetting';
import { GetFile } from './Common';

export class AuthenticationController {
    static Person = null;
    static base64ProfileImage;
    static async Pictuer() {
        if (!this.base64ProfileImage) {
            let result = localStorage.getItem('user-info');
            if (result) {
                result = JSON.parse(result);
                if (result.person) {
                    result = new BaseInstance(JSON.parse(result.person));
                    let picdata = result.GetValue('PC105');
                    if (picdata) {
                        let file1 = await GetFile(picdata)
                        this.base64ProfileImage = `data:image/jpeg;base64,${Buffer.from(file1.data, 'binary').toString('base64')}`;
                    }
                }
            }
            else {
                window.location.href="/";
            }
        }
        return this.base64ProfileImage;
    }
    static FullName() {
        let result = localStorage.getItem('person');
        return result;
    }
    static roles =[];
    static Notroles =[];
    static async HasRole(role) {
        if(AuthenticationController.roles.findIndex(x=>x===role)>-1)
            return true;
        if(AuthenticationController.Notroles.findIndex(x=>x===role)>-1)
            return false;
        let response = await axiosInstance.get(settings.Server + `Authentication/isinrole`, {params:{ role }});
        if(response.status===200){
            if(response.data){
                AuthenticationController.roles=[...AuthenticationController.roles,role];
            }
            return response.data;
        }
        AuthenticationController.Notroles=[...AuthenticationController.Notroles,role];
        return false;
    }
    static CheckRole(role) {
         let result = JSON.parse(localStorage.getItem('user-mode'));
         return result.findIndex(x => x === role) >= 0;;
    }
    static async Login(user, pass, relogin,captcha=null) {
        let result = false;
        try {
            let resultback;
            if (user === '' && pass === '' && relogin){
                resultback = await axiosInstance.post(settings.Server + `Authentication/relogin`, { ID: relogin });
            }
            else{
                resultback = await axiosInstance.post(settings.Server + `Authentication/Login`, { UserName: user, Password: pass,RecaptchaToken:captcha });
            }
            console.log(settings.Server + `Authentication/Login`)
            if (resultback.status === 200 && resultback?.data?.token !== null) {
                result = true;
                let userInfo = JSON.stringify(resultback.data);
                localStorage.setItem('token', resultback.data.token);
                localStorage.setItem('user-info', userInfo);
                localStorage.setItem('user-mode', resultback.data.mode);

                this.Person = JSON.parse(resultback.data.person);
                if (this.Person) {
                    let resultperson = this.Person.Prop.find(x => x.PID === "PC88").IPV + " " +
                        this.Person.Prop.find(x => x.PID === "PC323").IPV;
                    localStorage.setItem('person', resultperson);
                }
                // if (!relogin)
                //     window.location.reload(false);
            }
        } catch (e) {
            console.log(e, result);
        }
        return result;
    }
    static LogOut() {
        let result = {};
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('user-info');
            localStorage.removeItem('user-mode');
            localStorage.removeItem('person');
            localStorage.removeItem('org');
            window.location.href = '/';
        } catch (e) {
            console.log(e, result);
        }
        return result;
    }
    static async ReLogin() {
        if (localStorage.getItem('token') !== null)
            return await this.Login('', '', localStorage.getItem('token'));
        return false;
    }
    static IsLogin() {
        return (localStorage.getItem('token') !== null
            && this.FullName() !== '');

    }
    static async GetCode(userkey){
        let response = await axiosInstance.get(settings.Server + `Authentication/CPR`, {params:{ userkey }});
        console.log(response)
        if(response.status===200)
            return response.data;

    }
    static async CheckChangePasswordCode(code,key){
        let response = await axiosInstance.get(settings.Server + `Authentication/CCPC`, {params:{ code,key }});
        console.log(response)
        if(response.status===200)
            return response.data;
    }
    static async ChangePassword(password,key){
        let response = await axiosInstance.get(settings.Server + `Authentication/ChangePassword`, {params:{ password,key }});
        console.log(response)
        if(response.status===200)
            return response.data;
    }
}