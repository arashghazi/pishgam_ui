import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react'
import { Certificate } from './CertificateContext';
import CertIMG from '../../assets/img/pishgam/certificate.jpg'
import { Button, Card, CardBody, Label } from 'reactstrap';
import Flex from '../../components/common/Flex';
import QRCode from 'react-qr-code';
import { settings } from '../../Engine/BaseSetting';
import ButtonIcon from '../../components/common/ButtonIcon';
import { faFileDownload } from '@fortawesome/free-solid-svg-icons';
import { AuthenticationController } from '../../Engine/Authentication';
import { toast } from 'react-toastify';
const CertificateComponent = ({ year, lab, match, data, admin }) => {
  let title = ['سه دوره برنامه: ', 'دو دوره برنامه: ', 'یک دوره برنامه: ']
  const [cert, setCert] = useState()
  useEffect(() => {
    const fetch = async () => {
      if (year && lab) {
        let temp = await Certificate.getCertBy(year.id, lab.id);
        setCert(temp);
      }
    };
    fetch();
  }, [year, lab])
  useEffect(() => {
    const fetch = async () => {
      if (match?.params?.id) {
        let temp = await Certificate.getCertById(match.params.id);
        setCert(temp);
      }
    };
    fetch();
  }, [match?.params?.id])
  useEffect(() => {
    if (data) setCert(data);
  }, [data])
  const show = async () => {
    await cert.show();
    setCert(new Certificate(cert.Instance));
  }
  const hide = async () => {
    await cert.hide();
    setCert(new Certificate(cert.Instance));
  }
  const downloadFile = async () => {
    if (cert.CertID) {
      await Certificate.getFile(cert.CertID);
    }
  };
  const rebuild = async () => {
    if (year && lab) {
      var result = await Certificate.Rebuild(year.id,lab.id);
      if(result===1){
        toast.success("ساخت مجدد گواهی با موفقیت انجام شد")
      }
      else{
        toast.error("ساخت مجدد گواهی با موفقیت انجام شد")
      }
    }
  };
  return (
    cert ? (<div>
      {admin ? <Card className='mb-3'>
        <CardBody>
          <Flex>
            {(cert.debtor === undefined || cert.debtor === "0") ?
              <Button color='danger' onClick={hide}>عدم نمایش گواهی</Button> :
              <Button color='success' onClick={show} > نمایش گواهی</Button>
            }
            <Button color='primary' onClick={rebuild} > بازسازی گزارش</Button>
          </Flex>
        </CardBody>

      </Card> : null}
      {certificate()}
    </div>) :
      <Card>
        <Flex justify={'center'}>
          گواهی مورد نظر یافت نشد
        </Flex>
      </Card>
  )

  function certificate() {
    return cert.debtor === undefined || cert.debtor === '0' ?
      <div >{AuthenticationController.IsLogin() ?
        <ButtonIcon color='primary' className='m-2' icon={faFileDownload} onClick={downloadFile}>دانلود گواهی</ButtonIcon> : null}
        <Card
          style={{
            height: 565, width: 800,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            scrollbarWidth: 'auto',
            display: 'grid',
            placeItems: 'center', backgroundImage: `url(${CertIMG})`
          }}
        > <QRCode
            size={50}
            style={{
              position: 'absolute', right: '90px', height: "auto", maxWidth: "50", width: "50",
              top: 50,
            }}
            value={`${settings.RootServer}/cert/${cert.CertID}`}
            viewBox={`0 0 50 50`} />
          <Label style={{
            fontSize: 16, fontWeight: 'bold',
            color: 'black', position: 'absolute', top: '240px', left: 'center'
          }}>آزمایشگاه: {cert.labDis} </Label>
          <Label style={{
            fontSize: 18, fontWeight: 'bold',
            color: 'black', position: 'absolute', top: '285px', right: '140px'
          }}>{cert?.display?.replace('سال', '')}</Label>
          {cert?.JsonObject?.map((item, index) => {
            if (item != "")
              return <Label className='pl-3 pr-3' key={index + 'key'} style={{ fontSize: 12, color: 'black', position: 'absolute', top: `${325 + (index) * 22}px`, left: 'center' }}>{title[index] + item}</Label>;

            else
              return null;
          })}

        </Card></div> : <Card>
        <CardBody>
          <Flex justify={'center'}>
            همکار گرامی گواهی شرکت در دوره ها در صورت پرداخت کل هزینه های برنامه ، ارائه میگردد
          </Flex>
        </CardBody>
      </Card>;
  }
}

export default CertificateComponent