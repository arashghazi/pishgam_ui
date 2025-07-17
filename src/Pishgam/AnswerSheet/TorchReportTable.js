import React, { useEffect, useState } from 'react';
import { Fragment } from 'react';
import { CardTitle, Input, Label, Table } from 'reactstrap';

const TorchReportTable = ({ data }) => {
    const [G1, setG1] = useState();
    const [G2, setG2] = useState();
    useEffect(() => {
        let g1 = [];
        let g2 = [];
        if (data)
            data.map(item => {
                if (g1.findIndex(x=>x.id===item.G1)<0)
                    g1 = [...g1, {id:item.G1,display:item.G1display}];
                if (g2.findIndex(x => x.g1 === item.G1display && x.g2 === item.G2display) < 0)
                    g2 = [...g2, { g1: item.G1display, g2: item.G2display }];
            });
        setG1(g1);
        setG2(g2);
    }, [data])
    return (<>
    <CardTitle style={{textAlign:'center'}}>توزیع فراوانی نتایج گزارش شده توسط آزمایشگاهها بر حسب روش مورد استفاده</CardTitle>
        <Table  hover striped>
            <thead>
                <tr>
                    <th>
                        Test
                    </th>
                    <th>
                        Result
                    </th>
                    <th>
                        CL
                    </th>
                    <th>
                        ECL
                    </th>
                    <th>
                        ELFA
                    </th>
                    <th>
                        ELISA
                    </th>
                    <th>
                        Others
                    </th>
                </tr>
            </thead>
            <tbody>
                {G1?.map((g1,index) =>
                    <tr key={g1.id+index}>
                        <td style={{ verticalAlign: 'middle',padding:'0px' ,paddingRight:'20px'}}>
                            {g1.display}
                        </td>
                        <td style={{ verticalAlign: 'middle',padding:'0px' ,paddingRight:'20px'}}>
                            {
                                G2?.filter(x=>x.g1===g1.display)?.map((item,index) => {
                                        return <div key={g1.id+item.g2}><Label>{item.g2}</Label><br /></div>;
                                })
                            }
                        </td>
                        <td style={{ verticalAlign: 'middle',padding:'0px' ,paddingRight:'20px'}}>
                            {
                                G2?.filter(x=>x.g1===g1.display)?.map((item) => {
                                    let g2 = data?.find(x => x.G1display === g1.display && x.G2display === item.g2 
                                        && (x.G3 === "E12C13I7" || x.G3 === "O30E12C19I2") );
                                    return <Fragment key={g1.id+item.g2}><Label>{g2?.QTY}</Label><br/></Fragment>;
                                })

                            }
                        </td>
                        <td style={{ verticalAlign: 'middle',padding:'0px' ,paddingRight:'20px'}}> 
                            {
                                G2?.filter(x=>x.g1===g1.display)?.map((item) => {
                                    let g2 = data?.find(x => x.G1display === g1.display && x.G2display === item.g2 
                                        && (x.G3 === "E12C13I12" || x.G3 === "O30E12C19I3"));
                                    return <Fragment key={g1.id+item.g2}><Label>{g2?.QTY}</Label><br/></Fragment>;
                                })

                            }
                        </td>
                        <td style={{ verticalAlign: 'middle',padding:'0px' ,paddingRight:'20px'}}>
                            {
                                G2?.filter(x=>x.g1===g1.display)?.map((item) => {
                                    let g2 = data?.find(x => x.G1display === g1.display && x.G2display === item.g2 
                                        && (x.G3 === "E12C13I13" || x.G3 === "O30E12C19I4"));
                                    return <Fragment key={g1.id+item.g2}><Label>{g2?.QTY}</Label><br/></Fragment>;
                                })

                            }
                        </td>
                        <td style={{ verticalAlign: 'middle',padding:'0px' ,paddingRight:'20px'}}>
                            {
                                G2?.filter(x=>x.g1===g1.display)?.map((item) => {
                                    let g2 = data?.find(x => x.G1display === g1.display && x.G2display === item.g2 
                                        && (x.G3 === "E12C13I8" || x.G3 === "O30E12C19I1"));
                                    return <Fragment key={g1.id+item.g2}><Label>{g2?.QTY}</Label><br/></Fragment>;
                                })

                            }
                        </td>
                        <td style={{ verticalAlign: 'middle',padding:'0px' ,paddingRight:'20px'}}>
                            {
                                G2?.filter(x=>x.g1===g1.display)?.map((item) => {
                                    let g2 = data?.find(x => x.G1display === g1.display && x.G2display === item.g2 
                                        && (x.G3 === "E12C13I15" || x.G3 === "O30E12C19I5"));
                                    return <Fragment key={g1.id+item.g2}><Label>{g2?.QTY}</Label><br/></Fragment>;
                                })

                            }
                        </td>
                    </tr>)}

            </tbody>
        </Table></>
    );
};

export default TorchReportTable;