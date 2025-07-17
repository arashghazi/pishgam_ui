import React, { useState } from "react";
import { Button, Card } from "reactstrap";
import { SurveyInstance } from "./SurveyInstance";
import Parameters from "../../Engine/Parameters";

export const  surveyQuestions = [
  { question: "نحوه اجرای برنامه", type: "choice" },
  { question: "نحوه ی بسته بندی و ارسال نمونه ها", type: "choice" },
  { question: "کیفیت نمونه ارسالی - هماتولوژی", type: "choice" },
  { question: "کیفیت نمونه ارسالی - بیوشیمی", type: "choice" },
  { question: "کیفیت نمونه ارسالی - سرولوژی", type: "choice" },
  { question: "کیفیت نمونه ارسالی - باکتری شناسی", type: "choice" },
  { question: "کیفیت نمونه ارسالی - انگل شناسی", type: "choice" },
  { question: "کیفیت نمونه ارسالی - قارچ شناسی", type: "choice" },
  { question: "کیفیت نمونه ارسالی - غربالگری جنینی", type: "choice" },
  { question: "کیفیت نمونه ارسالی - مولکولی عفونی", type: "choice" },
  { question: "نرم افزار مشاهده گسترش خونی با انتظارات شما چه میزان مطابقت دارد؟", type: "choice" },
  { question: "سامانه eqasonline را چگونه ارزیابی می کنید؟", type: "choice" },
  { question: "نحوه ی پاسخگویی و ارائه اطلاعات توسط مجریان برنامه", type: "choice" },
  { question: "آیا نتایج ارسالی و توضیحات مرتبط مفهوم و گویاست؟", type: "yesno" },
  { question: "آیا می توانید بین نتایج برنامه و برنامه کنترل داخلی کیفیت در آزمایشگاه خود ارتباط برقرار نمائید؟", type: "yesno" },
  { question: "آیا نتایج ارسالی منجر به انجام اقدام اصلاحی / پیشگیرانه در بخشهای مختلف آزمایشگاه شده است؟", type: "yesno" },
  { question: "آیا اقدامات اصلاحی انجام شده پس از دریافت نتایج باعث بهبود عملکرد آزمایشگاه شده است؟", type: "yesno" }
];

const Survey = () => {
  const [responses, setResponses] = useState({});

  const handleChange = (question, value) => {
    setResponses({ ...responses, [question]: value });
  };

  const handleSubmit = async () => {
    var survey = new SurveyInstance();
    let org = await Parameters.GetValue('@orgid');
    survey.P8 = org;
    survey.P81 = Date.now();
    survey.P212 = responses["نحوه اجرای برنامه"];
    survey.P213 = responses["نحوه ی بسته بندی و ارسال نمونه ها"];
    survey.P214 = responses["کیفیت نمونه ارسالی - هماتولوژی"];
    survey.P215 = responses["کیفیت نمونه ارسالی - بیوشیمی"];
    survey.P216 = responses["کیفیت نمونه ارسالی - سرولوژی"];
    survey.P217 = responses["کیفیت نمونه ارسالی - باکتری شناسی"];
    survey.P218 = responses["کیفیت نمونه ارسالی - انگل شناسی"];
    survey.P219 = responses["کیفیت نمونه ارسالی - قارچ شناسی"];
    survey.P220 = responses["کیفیت نمونه ارسالی - غربالگری جنینی"];
    survey.P221 = responses["کیفیت نمونه ارسالی - مولکولی عفونی"];
    survey.P222 = responses["نرم افزار مشاهده گسترش خونی با انتظارات شما چه میزان مطابقت دارد؟"];
    survey.P223 = responses["سامانه eqasonline را چگونه ارزیابی می کنید؟"];
    survey.P224 = responses["نحوه ی پاسخگویی و ارائه اطلاعات توسط مجریان برنامه"];
    survey.P225 = responses["آیا نتایج ارسالی و توضیحات مرتبط مفهوم و گویاست؟"];
    survey.P226 = responses["آیا می توانید بین نتایج برنامه و برنامه کنترل داخلی کیفیت در آزمایشگاه خود ارتباط برقرار نمائید؟"];
    survey.P227 = responses["آیا نتایج ارسالی منجر به انجام اقدام اصلاحی / پیشگیرانه در بخشهای مختلف آزمایشگاه شده است؟"];
    survey.P228 = responses["آیا اقدامات اصلاحی انجام شده پس از دریافت نتایج باعث بهبود عملکرد آزمایشگاه شده است؟"];
    survey.P229 = SurveyInstance.year;
    if (await survey.SaveAsync()) {
      localStorage.setItem('@hasSurvey'+org, SurveyInstance.year);
    }
    window.location.href = "/";
  };

  return (
    <Card style={{ padding: "20px", marginTop: "20px" }}>
      <h2 style={{ textAlign: "center", color: "#333" }}>📋 فرم نظرسنجی</h2>
      {surveyQuestions.map((q, index) => (
        <div key={index} style={{ marginBottom: "15px", padding: "10px", backgroundColor: "#fff", borderRadius: "5px", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}>
          <p style={{ fontWeight: "bold", color: "#555" }}>{q.question}</p>
          {q.type === "choice" ? (
            ["خوب", "متوسط", "ضعیف"].map((option) => (
              <label key={option} style={{ marginRight: "10px", display: "inline-block", cursor: "pointer" }}>
                <input
                  type="radio"
                  name={q.question}
                  value={option}
                  onChange={() => handleChange(q.question, option)}
                  style={{ marginRight: "5px" }}
                />
                {option}
              </label>
            ))
          ) : (
            ["بلی", "خیر", "تاحدودی"].map((option) => (
              <label key={option} style={{ marginRight: "10px", display: "inline-block", cursor: "pointer" }}>
                <input
                  type="radio"
                  name={q.question}
                  value={option}
                  onChange={() => handleChange(q.question, option)}
                  style={{ marginRight: "5px" }}
                />
                {option}
              </label>
            ))
          )}
        </div>
      ))}
      <Button
        onClick={handleSubmit}
        color="primary"
        style={{ display: "block", margin: "0 auto", marginTop: "20px" }}
      >
        ✅ ارسال نظرسنجی
      </Button>
    </Card>
  );
};

export default Survey;
