import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { Bar } from 'react-chartjs-2'
import { Link } from 'react-router-dom'
import { Card, CardBody, CardFooter, CardHeader } from 'reactstrap'
import { rgbaColor } from '../helpers/utils';
import range from 'lodash/range';
import { Utility } from '../Engine/Common';

const dividerBorder = '1px solid rgba(255, 255, 255, 0.15)';
//const listItemBorderColor = 'rgba(255, 255, 255, 0.05)';

const chartOptions = {
  legend: { display: false },
  scales: {
    yAxes: [
      {
        display: false,
        stacked: true
      }
    ],
    xAxes: [
      {
        stacked: false,
        ticks: { display: false },
        barPercentage: 0.9,
        categoryPercentage: 1.0,
        gridLines: {
          color: rgbaColor('#fff', 0.1),
          display: false
        }
      }
    ]
  }
};
const OnlineUser = () => {
    const [chartData,setChartData]=useState({
        labels: range(1, 26),
        datasets: [
          {
            label: 'Users',
            backgroundColor: rgbaColor('#fff', 0.3),
            data: []
          }
        ]
      });
    const [currentActiveUser,setCurrentActiveUser]=useState(1);
    useEffect(() => {
        let id = setInterval(async() => {
            let temp =await Utility.ActiveUsers();
            setCurrentActiveUser(temp);
            let list1=[...chartData.datasets[0].data,temp];
            if(list1.length>24)
            list1.splice(0,1);
            setChartData({
                ...chartData,
                datasets:[{...chartData.datasets[0],data:list1}]
            });
        }, 10000);
        return () => clearInterval(id);
      }, [chartData]);
   
    return (
        <Card className="bg-gradient" >
          <CardHeader className="bg-transparent">
            <h5 className="text-white">تعداد<strong className='display-5' >&nbsp;{currentActiveUser}&nbsp;</strong> کاربر فعال در این لحظه </h5>
            {/* <div className="real-time-user display-1 font-weight-normal text-white">{currentActiveUser}</div> */}
          </CardHeader>
          <CardBody className="text-white fs--1">
            <p className="pb-2" style={{ borderBottom: dividerBorder }}>
              تعداد کاربران فعال
            </p>
            <Bar data={chartData} options={chartOptions} width={10} height={3} />
          </CardBody>
          <CardFooter className="text-left bg-transparent" style={{ borderTop: dividerBorder }}>
            <Link className="text-white" to="/admin/onlineusers">
              <FontAwesomeIcon icon="chevron-left" transform="down-1" className="ml-1 fs--1" />
              گزارش به لحظه کاربران
            </Link>
          </CardFooter>
        </Card>
      )
}

export default OnlineUser