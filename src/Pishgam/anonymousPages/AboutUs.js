import React from 'react';
import { Fragment } from 'react';
import Section from '../../components/common/Section';
import FooterStandard from '../../components/landing/FooterStandard';
import SectionHeader from '../../components/landing/SectionHeader';
import NavbarStandard from '../../components/navbar/NavbarStandard';
import Logo from '../Logo';
import HeaderFooter from './HeaderFooter';

const AboutUs = ({ location, match }) => {
    return (<Fragment>
        {/* <NavbarStandard location={location} match={match} collapsed={true} /> */}
        <HeaderFooter location={location} match={match} >
        <Section>
            <Logo  width={'200px'}/>
            <div className='mb-4'/>
            <SectionHeader
                title="درباره پیشگام ایرانیان"
                subtitle="شركت پیشگام ایرانیان درسال 1387 توسط كارشناسان و متخصصین برنامه های تضمین كیفیت و با هدف مشاركت در ارتقای وضعیت سلامت و ارائه خدمات به آزمایشگاههای تشخیص پزشكی ، تشكیل گردید. پشتوانه دانش فنی این كارشناسان گذراندن دوره های مختلف در مراکزعلمی معتبرداخلی و بین‌المللی مانند INSTAND, CSCQ, WHO ,BSI و... در زمینه‌ های مختلف برنامه تضمین كیفیت در آزمایشگاه‌های پزشکی بوده وتجربیات ارزشمند این مجموعه که بدنبال سال‌ها فعالیت در زمینه طراحی و اجرای برنامه EQAS در سطح کشور بدست آمده است موجب گردید که با برقرای سازمانی منسجم در سال اول بتواند پس از ممیزی بر اساس استاندارد ILAC2007 موفق به اخذ تائیدیه از وزارت بهداشت درمان آموزش پزشکی گردد.از آن زمان تا کنون گروه پیشگام ایرانیان با عقد تفاهم‌نامه با جامعه علمی آزمایشگاهیان ایران، انجمنهای علمی آسیب ‌شناسی و متخصصین علوم آزمایشگاهی بالینی ایران، و در ارتباط با وزارت بهداشت و درمان و آموزش پزشکی، مجری برنامه های کامل و کاربردی ارزیابی خارجی کیفیت در زمینه‌های خونشناسی، بیوشیمی، سرولوژی و میکروبشناسی برای آزمایشگاه‌های پزشکی داوطلب در سراسر کشور می باشد."
            />
            <SectionHeader
            title="و همچنین"
                subtitle="ارائه برنامه‌ها و مشاوره‌های علمی از دیگر خدمات این شرکت میباشد. این مجموعه در اجرای برنامه‌های خود از حمایت و همکاری ارزنده اساتید عضو هیئت علمی و مشاورین انجمنهای تخصصی بهره‌مند می باشد."
            />
        </Section>
        </HeaderFooter>
      {/* <FootekrStandard /> */}

    </Fragment>
    );
};

export default AboutUs;