import { faSearchengin } from "@fortawesome/free-brands-svg-icons";
import { faBookMedical, faPen } from "@fortawesome/free-solid-svg-icons";

export default [
  {
    media: { icon: faBookMedical, color: 'info', className: 'fs-4' },
    title: 'آموزش',
    description:
    'ارائه آموزش در سطوح مختلف علمی در راستای ارتقاء سطح کیفیت آزمایشگاه ها'
  },
  {
    media: { icon: faSearchengin, color: 'success', className: 'fs-5' },
    title: 'ارزیابی خارجی کیفیت',
    description:
      'مورد تائید وزارت بهداشت و درمان و انجمن های علمی آسیب شناسی ایران وجامعه علمی آزمایشگاهیان ایران و  انجمن متخصصین علوم آزمایشگاهی بالینی ایران'
  },
  {
    media: { icon: faPen, color: 'danger', className: 'fs-6' },
    title: 'مشاوره',
    description:
    'ارائه خدمات مشاوره ای در سطوح مختلف مدیریتی و علمی در راستای ارتقاء سطح کیفیت آزمایشگاه ها'
  }
];
