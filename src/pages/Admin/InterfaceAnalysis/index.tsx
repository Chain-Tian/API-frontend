import {PageContainer} from "@ant-design/pro-components";
import '@umijs/max'
import React, {useEffect, useState} from 'react';
import ReactECharts from 'echarts-for-react';
import {listTopInvokeInterfaceInfoUsingGET} from "@/services/API-backend/analysisController";

/**
 * 接口分析
 * @constructor
 */
const InterfaceAnalysis: React.FC = () => {

  const [data, setData] = useState<API.InterfaceInfoVO[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    try {
      listTopInvokeInterfaceInfoUsingGET().then(res => {
        if (res.data) {
          setData(res.data);
        }
      })
    } catch (e: any) {

    }
  }, [])
  // 映射
  const chartData = data.map(item => {
    return {
      value: item.totalNum,
      name: item.name,
    }
  })


  const option = {
    title: {
      text: '接口调用次数TOP3',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: '50%',
        data: chartData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  return (
    <PageContainer>
      <ReactECharts
        loadingOption={
          {showLoading: loading}}
        option={option}/>
    </PageContainer>
  );
};
export default InterfaceAnalysis;
