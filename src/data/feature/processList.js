import { faDollarSign } from '@fortawesome/free-solid-svg-icons';
import illustration1 from '../../assets/img/illustrations/1.svg';
import illustration2 from '../../assets/img/illustrations/2.svg';
import illustration3 from '../../assets/img/illustrations/3.svg';

export default [
  {
    icon: faDollarSign,
    iconText: ' هزینه',
    color: 'danger',
    title: 'کاهش هزینه و ارتقاء اثر بخشی',
    description:
      'هزینه  اثربخشی برنامه با استفاده از نمونه های چند پارامتری به طور مثال یک نمونه شامل بیوشیمی عمومی، الکترولیت ها، هورمون',
    image: illustration2
  },
  {
    icon: ['far', 'object-ungroup'],
    iconText: 'پردازش',
    color: 'info',
    title: 'الگوی استاندارد',
    description:
      'پردازش تست های کمی بر طبق الگوهای استاندارد و میانگین پر قدرت Rubust Mean',
    image: illustration1,
    inverse: true
  },
  {
    icon: ['far', 'paper-plane'],
    iconText: 'انعطاف پذیر',
    color: 'success',
    title: 'سیستم های متفاوت',
    description:
      'برنامه منعطف با امکان ثبت نام تعداد بیش از یک سیستم بدون هزینه آنالیز ',
    image: illustration3
  }
];
