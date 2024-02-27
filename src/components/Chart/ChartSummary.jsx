import React, { useState, useEffect } from 'react';
import {ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList } from "recharts";

const ChartSummary = ({ remainAll, remainGood, remainReject, remainGoodNormal, remainRejectNormal,
                    remainAllNormal, remainGoodScraped, remainRejectScraped, remainAllScraped,
                    remainGoodRemelting, remainRejectRemelting, remainAllRemelting, remainGoodLowISAShear,
                    remainRejectLowISAShear, remainAllLowISAShear, remainGoodLowCOSAShear,
                    remainRejectLowCOSAShear, remainAllLowCOSAShear, remainGoodMetalBurr,
                    remainRejectMetalBurr, remainAllMetalBurr, remainGoodAuDelamination,
                    remainRejectAuDelamination, remainAllAuDelamination, 
                    remainGoodNormalNVI, remainRejectNormalNVI, remainAllNormalNVI }) => {

    const [isChartReady, setChartReady] = useState(false);

    const data = [
        // {
        //     name: "All",
        //     All: remainAll,
        //     Good: remainGood,
        //     Reject: remainReject,
        // },
        {
            name: "Normal",
            Total: remainAllNormal,
            Good: remainGoodNormal,
            Reject: remainRejectNormal,
        },
        {
            name: "Normal-NVI",
            Total: remainAllNormalNVI,
            Good: remainGoodNormalNVI,
            Reject: remainRejectNormalNVI,
        },
        {
            name: "Remelting",
            Total: remainAllRemelting,
            Good: remainGoodRemelting,
            Reject: remainRejectRemelting,
        },
        {
            name: "Scraped",
            Total: remainAllScraped,
            Good: remainGoodScraped,
            Reject: remainRejectScraped,
        },
        
        {
            name: "Low ISA Shear",
            Total: remainAllLowISAShear,
            Good: remainGoodLowISAShear,
            Reject: remainRejectLowISAShear,
        },
        {
            name: "Low COSA Shear",
            Total: remainAllLowCOSAShear,
            Good: remainGoodLowCOSAShear,
            Reject: remainRejectLowCOSAShear,
        },
        {
            name: "Metal Burr",
            Total: remainAllMetalBurr,
            Good: remainGoodMetalBurr,
            Reject: remainRejectMetalBurr,
        },
        {
            name: "Au Delamination",
            Total: remainAllAuDelamination,
            Good: remainGoodAuDelamination,
            Reject: remainRejectAuDelamination,
        },
        
    ];

    // Filter out objects where the "All" value is not equal to 0
    const filteredData = data.filter(item => item.Total !== 0);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setChartReady(true);
        }, 200);
    
        return () => clearTimeout(timeout);
    }, []);

    return (
        <div>
            {isChartReady && (
                <ComposedChart
                    width={975}
                    height={300}
                    data={filteredData}
                    margin={{
                        top: 25,
                        right: 20,
                        bottom: 0,
                        left: 0
                    }}
                    >
                    <CartesianGrid stroke="#f5f5f5" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Total" stroke="#4b5bec">
                        <LabelList dataKey="Total" position="top" fill="#4b5bec" offset={15} />
                    </Line>
                    <Bar dataKey="Good" barSize={30} fill="#15dc99">
                        <LabelList dataKey="Good" position="top" fill="#00c583" />
                    </Bar>
                    <Bar dataKey="Reject" barSize={30} fill="#ff4756">
                        <LabelList dataKey="Reject" position="top" fill="#ff4756" />
                    </Bar>
                </ComposedChart>
            )}
        </div>
    );
};

export default ChartSummary;
