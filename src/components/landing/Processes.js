import React from 'react';
import processList from '../../data/feature/processList';
import Section from '../common/Section';
import Process from './Process';
import SectionHeader from './SectionHeader';
import { isIterableArray } from '../../helpers/utils';
const Processes = () => (<>
    {/* <Logo width='250px'/> */}
  <Section>
    <SectionHeader
      title="ابزار بهبود کیفیت آزمایشگاه های بالینی"
      subtitle="اجرای  برنامه کشوری ارزیابی خارجی کیفیت آزمایشگاهی برای بخشهای بیوشیمی، هورمون، مارکرهای قلبی، سرولوژی، ایمونوسرولوژی، هماتولوژی، ایمونوهماتولوژی، میکروب شناسی، انگل شناسی، بررسی مولکولی عفونی وایرال (HBV) بررسی مولکولی PCR  برای تشخیص باسیل مایکوباکتریوم توبرکلوزیس‌TB، تستهای غربالگری جنینی "
    />
    {isIterableArray(processList) && processList.map((process, index) => <Process key={index} {...process} />)}
  </Section></>
);

export default Processes;
