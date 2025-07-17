import React from 'react';
import { Card, CardBody, CardHeader, CardTitle, CardFooter, Button } from "reactstrap";
import { SurveyInstance } from '../survey/SurveyInstance';
import Parameters from '../../Engine/Parameters';

export default function SurveyCard({ onSkip }) {
  const handleCancelSurveyClick =async () => {
    if (onSkip) {
      let org = await Parameters.GetValue('@orgid');
      var attemp = localStorage.getItem('@surveyAttemp'+org);
      if (attemp < 3) {
        localStorage.setItem('@surveyAttemp'+org,
          attemp ? parseInt(attemp) + 1 : 1
        );
      }
      else{
        alert(
          "📢 یادآوری نظرسنجی\n\n" +
          "با توجه به اینکه شما چندین بار ثبت نظرسنجی را به تعویق انداخته‌اید،" +
          " به نظر می‌رسد که از خدمات ما رضایت کامل دارید. ✅\n\n" +
          "💡 بنابراین، نظرسنجی شما به‌صورت **اتوماتیک ثبت گردید**.\n\n" +
          "در صورت داشتن هرگونه پیشنهاد یا انتقاد، لطفاً با ما در میان بگذارید. 🙌"
        );
        await SurveyInstance.fillAuto();
      }
      onSkip();
    }
  };
  const handleSurveyClick = () => {
    window.location.href = "/survey";
  };
  return (
    <Card className="max-w-md mx-auto text-center p-4 shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold">📢 نظرسنجی آزمایشگاه</CardTitle>
      </CardHeader>
      <CardBody>
        <p className="text-gray-700 mb-4">
          احتراماً، در راستای ارتقای کیفیت خدمات آزمایشگاهی، خواهشمندیم در این نظرسنجی کوتاه شرکت فرمایید. نظرات شما در بهبود روندها و ارائه خدمات بهتر به شما بسیار مؤثر خواهد بود. 📝
        </p>
        <p className="text-gray-600 mb-6">⏳ زمان مورد نیاز: کمتر از 2 دقیقه</p>
      </CardBody>
      <CardFooter className="d-flex justify-content-between">
        <Button onClick={handleSurveyClick} href='/survey' color='primary'>
          شرکت در نظرسنجی
        </Button>
        <Button onClick={handleCancelSurveyClick} >
          بعدا انجام می‌دهم
        </Button>
      </CardFooter>
    </Card>
  );
}