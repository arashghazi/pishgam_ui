import axiosInstance from "../../Engine/BaseSetting";
import ErrorHandler from "../../Engine/ErrorHandler";

export class BankController {
    static async GetToken(amount, merchantId) {
        try {
            console.log(amount)
            let result = await axiosInstance.post('Bank/get-token', {
                amount: amount, merchantId: merchantId
            });
            this.redirectToBank(result.data.token);
        } catch (e) {
            ErrorHandler.CominicationError(e);
        }
    }
    static async redirectToBank (token){
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "https://say.shaparak.ir/_ipgw_/MainTemplate/payment/";

        const tokenInput = document.createElement("input");
        tokenInput.type = "hidden";
        tokenInput.name = "token";
        tokenInput.value = token;
        form.appendChild(tokenInput);

        const langInput = document.createElement("input");
        langInput.type = "hidden";
        langInput.name = "language";
        langInput.value = "fa";
        form.appendChild(langInput);

        document.body.appendChild(form);
        form.submit();
    };
}