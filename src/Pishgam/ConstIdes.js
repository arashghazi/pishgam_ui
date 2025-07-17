export const ConstIdes = {
    Year: 'O30E23C1',
    Section:'O30E23C2',
    Period: 'O30E23C3',
    Sample: 'O30E23C4',
    DocHeader: 'O30E12C1',
    Lab: 'O30E23C6',
    BioTest: 'O30E12C2',
    BioResult: 'O30E3C2',
    ExpectedResultDH: 'O30E12C10'
};
export const PropConstIdes = {
    Year: 'P2',
    Period: 'P3',
    Lab: 'P8',
    Sample: 'P9',
    BioTest: 'P11',
};
export const StaticCondition = {
    periodOfYear: '{"OCID":"' + ConstIdes.Period + '","BCs":[{"Bts":[{"PID":"' + PropConstIdes.Year + '","PRA":"Equal","IPV":"#' + PropConstIdes.Year + '","NLC":"None","SRC":""}],"NLC":"None"}]}',
    SampleOfPeriod: '{"OCID":"' + ConstIdes.Sample + '","BCs":[{"Bts":[{"PID":"' + PropConstIdes.Period + '","PRA":"Equal","IPV":"#' + PropConstIdes.Period + '","NLC":"None","SRC":""}],"NLC":"None"}]}',
    HeaderWithPeriod: `[{"ID":"${ConstIdes.Sample}","Condition":"${PropConstIdes.Period}='#${PropConstIdes.Period}'","Prop":"ALL","RProp":"ALL","ST":true,"WType":0,"QT":0},{"ID":"${ConstIdes.DocHeader}","Condition":"P8<>''","Prop":"ALL","RProp":"ALL","ST":false,"join":" INNER JOIN ","onjoin":" #.P9=@.ID ","WType":0,"QT":0}]`,
    Report: `{"analytics":{"MainProp":"P15","vcfg":"#vcfg","CVV":"#CVV","SR":#SR,"fields":"P12,P13,P14","conditions":[{"con":"P12 = '#P12'"},{"con":"P12 = '#P12' AND P13 = '#P13'"},{"con":"P12 = '#P12' AND P13 = '#P13' AND P14='#P14'"}],"Qtype":"#Qtype"},"conditions":[{"ID":"${ConstIdes.DocHeader}","Condition":"P9 ='#P9' ","Prop":"ALL","RProp":"ALL","ST":true,"WType":0,"QT":0,"IsInstance":false},{"ID":"#ResultClassID","Condition":" P11='#P11' ","Prop":"ALL","RProp":"P12,P13,P14,P15","ST":false,"join":"INNER JOIN","onjoin":"#.P17=@.ID","WType":0,"QT":0,"IsInstance":false}]}`,
    ResultLab: `{"cons":[{"ID":"${ConstIdes.DocHeader}","Condition":"${PropConstIdes.Sample} ='#${PropConstIdes.Sample}' AND ${PropConstIdes.Lab}='#${PropConstIdes.Lab}' ","Prop":"ALL","RProp":"ALL","ST":true,"WType":0,"QT":0,"IsInstance":false},{"ID":"#ResultClassID","Condition":" ${PropConstIdes.BioTest}='#${PropConstIdes.BioTest}' ","Prop":"ALL","RProp":"ALL","ST":false,"join":"INNER JOIN","onjoin":"#.P17=@.ID","WType":0,"QT":0,"IsInstance":false}]}`,
    ResultOtherLab: `{"cons":[{"ID":"${ConstIdes.DocHeader}","Condition":"${PropConstIdes.Sample} ='#${PropConstIdes.Sample}' AND ${PropConstIdes.Lab}='#${PropConstIdes.Lab}' ","Prop":"ALL","RProp":"ALL","ST":true,"WType":0,"QT":0,"IsInstance":false},{"ID":"#ResultClassID","Condition":" ","Prop":"ALL","RProp":"ALL","ST":false,"join":"INNER JOIN","onjoin":"#.P17=@.ID","WType":0,"QT":0,"IsInstance":false}]}`,
    ExpectedResult: `{"cons":[{"ID":"${ConstIdes.ExpectedResultDH}","Condition":"${PropConstIdes.Sample} ='#${PropConstIdes.Sample}' ","Prop":"ALL","RProp":"ALL","ST":true,"WType":0,"QT":0,"IsInstance":false},{"ID":"#ResultClassID","Condition":" ","Prop":"ALL","RProp":"ALL","ST":false,"join":"INNER JOIN","onjoin":"#.P17=@.ID","WType":0,"QT":0,"IsInstance":false}]}`,
    ReportGroup: `{"analytics":{"MainProp":"P15","vcfg":"#vcfg","TestID":"#TestID","CVV":"#CVV","SR":#SR,"fields":"P12,P13,P14","conditions":[{"con":"P12 = '#P12'"},{"con":"P12 = '#P12' AND P13 = '#P13'"},{"con":"P12 = '#P12' AND P13 = '#P13' AND P14='#P14'"}],"Qtype":"#Qtype"},"conditions":[{"ID":"${ConstIdes.DocHeader}","Condition":"P9 ='#P9' and P8 is not null ","Prop":"ALL","RProp":"ALL","ST":true,"WType":0,"QT":0,"IsInstance":false},{"ID":"#ResultClassID","Condition":" P11='#P11' ","Prop":"ALL","RProp":"P12,P13,P14,P15","ST":false,"join":"INNER JOIN","onjoin":"#.P17=@.ID","WType":0,"QT":0,"IsInstance":false}]}`,
    ReportGroupTorch: `{"analytics":{"MainProp":"","TestID":"","vcfg":"0","CVV":"","SR":#SR,"fields":"#Props","conditions":[{"con":"#PIDTest is not null "}],"Qtype":"#Qtype"},
"conditions":[{"ID":"${ConstIdes.DocHeader}","Condition":"P9 ='#P9' ","Prop":"ALL","RProp":"ALL","ST":true,"WType":0,"QT":0,"IsInstance":false},
{"ID":"#resultId","Condition":" #PIDResult is not null ","Prop":"ALL","RProp":"#Props","ST":false,"join":"INNER JOIN","onjoin":"#.P17=@.ID","WType":0,"QT":0,"IsInstance":false}]}`,
    EmptyCondition: '{"OCID":"#OCID","BCs":[{"Bts":[{"PID":"' + PropConstIdes.Year + '","PRA":"Equal","IPV":"#' + PropConstIdes.Year + '","NLC":"None","SRC":""}],"NLC":"None"}]}',
    ParaBKCondition: `{"analytics":null,"conditions":[{"ID":"#resultId","OB":"order by #PIDResult","GB":" Group by P9,#PIDResult","GR":"#PIDResult as id,Count(*) as QTY","Condition":"P9='#P9' and P8 is not null ","Prop":"ALL","RProp":"ALL","ST":true,"WType":0,"QT":0,"IsInstance":false}]}`,
    ResultParaBKLab: `{"cons":[{"ID":"#resultId","Condition":"${PropConstIdes.Sample} ='#${PropConstIdes.Sample}' AND ${PropConstIdes.Lab}='#${PropConstIdes.Lab}' ","Prop":"ALL","RProp":"ALL","ST":true,"WType":0,"QT":0,"IsInstance":false}]}`,
    expResultParaBKLab: `{"cons":[{"ID":"#AnswerId","Condition":"${PropConstIdes.Sample} ='#${PropConstIdes.Sample}'","Prop":"ALL","RProp":"ALL","ST":true,"WType":0,"QT":0,"IsInstance":false}]}`,
    ReportBC: `{"analytics":{"MainProp":"P15","vcfg":"#vcfg","CVV":"#CVV","SR":#SR,"fields":"P34","conditions":[{"con":"P34 = '#P34'"}],"Qtype":"#Qtype"},"conditions":[{"ID":"${ConstIdes.DocHeader}","Condition":"P9 ='#P9' ","Prop":"ALL","RProp":"ALL","ST":true,"WType":0,"QT":0,"IsInstance":false},{"ID":"#ResultClassID","Condition":" P33='#P33' ","Prop":"ALL","RProp":"P34,P15","ST":false,"join":"INNER JOIN","onjoin":"#.P17=@.ID","WType":0,"QT":0,"IsInstance":false}]}`,
    ReportGroupBC: `{"analytics":{"MainProp":"P15","vcfg":"#vcfg","TestID":"#TestID","CVV":"#CVV","SR":#SR,"fields":"P34","conditions":[{"con":"P34 = '#P34'"}],"Qtype":"#Qtype"},"conditions":[{"ID":"${ConstIdes.DocHeader}","Condition":"P9 ='#P9' and P8 is not null ","Prop":"ALL","RProp":"ALL","ST":true,"WType":0,"QT":0,"IsInstance":false},{"ID":"#ResultClassID","Condition":" P33='#P33' ","Prop":"ALL","RProp":"P34,P15","ST":false,"join":"INNER JOIN","onjoin":"#.P17=@.ID","WType":0,"QT":0,"IsInstance":false}]}`,
    getReportGroup(section) {
        let result = Domain.find(x => x.sec === section).ReportGroup;
        return result.replaceAll('#ResultClassID', Domain.find(x => x.sec === section).resultId);
    },
    getReport(section) {
        let result = Domain.find(x => x.sec === section).Report;
        return result.replaceAll('#ResultClassID', Domain.find(x => x.sec === section).resultId);
    },
    getResultOfLab(section) {
        return this.ResultLab.replaceAll('#ResultClassID', Domain.find(x => x.sec === section).resultId);
    }
};
export const Domain = [
    {
        display: 'بیوشیمی',
        id: 'O30E23C2I1',
        sec: 'O30E23C2I1',
        resultId: 'O30E3C2',
        testId: 'P11',
        fields: "P12,P13,P14",
        Report: StaticCondition.Report,
        ReportGroup: StaticCondition.ReportGroup
    },
    {
        display: 'پروتئین ادرار',
        id: 'O30E23C2I3',
        sec: 'O30E23C2I3',
        resultId: 'O30E3C5',
        testId: 'P11',
        fields: "P12,P13,P14",
        Report: StaticCondition.Report,
        ReportGroup: StaticCondition.ReportGroup
    },
    {
        display: 'A1C',
        id: 'O30E23C2I4',
        sec: 'O30E23C2I4',
        resultId: 'O30E3C3',
        testId: 'P11',
        fields: "P12,P13,P14",
        Report: StaticCondition.Report,
        ReportGroup: StaticCondition.ReportGroup
    },
    {
        display: 'مارکرهای قلبی',
        id: 'O30E23C2I5',
        sec: 'O30E23C2I5',
        resultId: 'O30E3C4',
        testId: 'P11',
        fields: "P12,P13,P14",
        Report: StaticCondition.Report,
        ReportGroup: StaticCondition.ReportGroup
    },
    {
        display: 'خون کنترل',
        id: 'O30E23C2I10',
        sec: 'O30E23C2I10',
        resultId: 'O30E12C25',
        testId:'P33',
        fields: "P34",
        Report: StaticCondition.ReportBC,
        ReportGroup: StaticCondition.ReportGroupBC
    },
    {
        display:'Torch',
        sec: 'O30E23C2I6',
        resultId: 'E12C15',
        PIDTest: 'PC495',
        PIDResult: 'PC496',
        AnswerPanelID: 'PanelF3V18',
        Props: 'PC495,PC496,PC498',
        chartSetting: {
            depLevel: 2,
            columns: [
                { title: 'Test>result', PName: 'name', Size: '3' },
                { title: 'CL', PName: 'children', Size: 'auto', where: { PName: 'id', value: 'E12C13I1', pvalue: 'QTY' } },
                { title: 'ECL', PName: 'children', Size: 'auto', where: { PName: 'id', value: 'E12C13I2', pvalue: 'QTY' } },
                { title: 'ELFA', PName: 'children', Size: 'auto', where: { PName: 'id', value: 'E12C13I3', pvalue: 'QTY' } },
                { title: 'ELISA', PName: 'children', Size: 'auto', where: { PName: 'id', value: 'E12C13I4', pvalue: 'QTY' } },
                { title: 'Others', PName: 'children', Size: 'auto', where: { PName: 'id', value: 'E12C13I5', pvalue: 'QTY' } },
            ]
        }
    },
    {
        display:'Wright',
        sec: 'O30E23C2I7',
        resultId: 'E12C7',
        PIDTest: 'PC481',
        PIDResult: 'PC482',
        AnswerPanelID: 'PanelF3V20',
        Props: 'PC481,PC482',
        chartSetting: {
            depLevel: 1,
            columns: [
                { title: 'Test>result', PName: 'name', Size: '1' },
                { title: '1/10', PName: 'children', Size: 'auto', where: { PName: 'id', value: 'E12C4I3', pvalue: 'QTY' } },
                { title: '1/20', PName: 'children', Size: 'auto', where: { PName: 'id', value: 'E12C4I4', pvalue: 'QTY' } },
                { title: '1/40', PName: 'children', Size: 'auto', where: { PName: 'id', value: 'E12C4I5', pvalue: 'QTY' } },
                { title: '1/80', PName: 'children', Size: 'auto', where: { PName: 'id', value: 'E12C4I6', pvalue: 'QTY' } },
                { title: '1/160', PName: 'children', Size: 'auto', where: { PName: 'id', value: 'E12C4I7', pvalue: 'QTY' } },
                { title: '1/320', PName: 'children', Size: 'auto', where: { PName: 'id', value: 'E12C4I8', pvalue: 'QTY' } },
                { title: '1/640', PName: 'children', Size: 'auto', where: { PName: 'id', value: 'E12C4I9', pvalue: 'QTY' } },
                { title: '1/1280', PName: 'children', Size: 'auto', where: { PName: 'id', value: 'E12C4I10', pvalue: 'QTY' } },
                { title: '1/2560', PName: 'children', Size: 'auto', where: { PName: 'id', value: 'E12C4I11', pvalue: 'QTY' } },
            ]
        }
    },
    {
        display: 'Parasite',
        sec: 'O30E23C2I9',
        resultId: 'O30E12C12',
        PIDResult: 'PC440',
        AnswerId: 'O30E12C13',
        PIDTest:'P9'
    },
    {
        display: 'BK',
        sec: 'O30E23C2I8',
        resultId: 'O30E12C11',
        PIDResult: 'PC490',
        AnswerId: 'O30E12C14',
        PIDTest: 'P9'
    },
    {
        display: 'سرولوژی',
        sec: 'O30E23C2I2',
        resultId: 'O30E12C20',
        PIDTest: 'P25',
        PIDResult: 'P26',
        AnswerPanelID: 'PanelF3V35',
        Props: 'P25,P26,P29',
        chartSetting: {
            depLevel: 2,
            columns: [
                { title: 'Test>result', PName: 'name', Size: '3' },
                { title: 'CL', PName: 'children', Size: 'auto', where: { PName: 'id', value: 'O30E12C19I1', pvalue: 'QTY' } },
                { title: 'ECL', PName: 'children', Size: 'auto', where: { PName: 'id', value: 'O30E12C19I2', pvalue: 'QTY' } },
                { title: 'ELFA', PName: 'children', Size: 'auto', where: { PName: 'id', value: 'O30E12C19I3', pvalue: 'QTY' } },
                { title: 'ELISA', PName: 'children', Size: 'auto', where: { PName: 'id', value: 'O30E12C19I4', pvalue: 'QTY' } },
                { title: 'Others', PName: 'children', Size: 'auto', where: { PName: 'id', value: 'O30E12C19I5', pvalue: 'QTY' } },
            ]
        }
    }
];
export const SectionGroups=[
    {id:1,color:'#FFCDD2',display:'بیوشیمی',comment:' بیوشیمی عمومی و هورمون - پروتئین ادرار - مارکرهای قلبی - مارکرهای تشخیصی سندروم داون - A1C'},
    {id:2,color:'#F8BBD0',display:'هماتولوژی',comment:' خون کنترل - پلاسما کنترل لئوفلیزه - گسترش خون - بانک خون (ایموتوهماتولوژی)'},
    {id:3,color:'#E1BEE7',display:'تشخیص مولکولی',comment: 'تشخیص مولکولی HBV - تشخیص مولکولی TB'},
    {id:4,color:'#BBDEFB',display:'سرولوژی',comment:' TORCH - رایت - سرولوژی(آنتی بادی وایرال)'},
    {id:5,color:'#B2DFDB',display:'میکروب شناسی',comment:' میکروب شناسی - BK - انگل شناسی - قارچ شناسی'},
    {id:6,color:'#2ECC71',display:'پاتولوژی- سیتوپاتولوژی',comment:'واژینال اسمیر'},
];
export const PeriodControl = {
    col: "3",
    pid: PropConstIdes.Period,
    controlType: "SearchControl",
    title: "دوره",
    source: ConstIdes.Period,
}
export const LabratoryControl = {
    col: "3",
    pid: PropConstIdes.Lab,
    controlType: "SearchControl",
    title: "آزمایشگاه",
    source: ConstIdes.Lab
};