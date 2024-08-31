'use client';

import { useEffect, useRef } from "react";
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';  // Changed from next/router to next/navigation

// Dynamically import echarts and echarts-gl with SSR disabled
const ECharts = dynamic(() => import('echarts'), { ssr: false });
const EChartsGL = dynamic(() => import('echarts-gl'), { ssr: false });

function EarthModel() {
  const chartRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    let myChart;

    const initChart = async () => {
      const echarts = await import('echarts');
      await import('echarts-gl');

      if (chartRef.current) {
        myChart = echarts.init(chartRef.current);

       const option = {
  backgroundColor: "#000",
  globe: {
    baseTexture: '/assets/earth.jpg',
    heightTexture: '/assets/earth.jpg',
    environment: '/assets/forest3.jpg',
    shading: "lambert",
    atmosphere: {
      show: true
    },
    light: {
      ambient: {
        intensity: 0.1,
      },
      main: {
        intensity: 1
      }
    },
    // Adjust the globe's radius if needed
    radius: 100, // Change this value to fit your needs
  },
  series: [
    {
      type: 'scatter3D',
      coordinateSystem: 'globe',
      blendMode: 'lighter',
      symbol: 'image:///assets/pin.png',
      symbolSize: 63,
      label: {
        show: true,
        formatter: '{b}',
        position: 'right',
        color: '#fff',
        fontSize: 20,
        distance: 15,
        verticalAlign: 'middle',
        offset: [10, 0]
      },
      itemStyle: {
        color: '#ff3333',
        borderColor: '#fff',
        borderWidth: 2,
        borderType: 'solid'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 22,
          color: '#ff6666'
        },
        itemStyle: {
          color: '#ff6666'
        }
      },
      data: [
        { name: 'North America', value: [-100.0, 40.0, 1], route: '/NorthAmerica' },
        { name: 'South America', value: [-60.0, -15.0, 1], route: '/SouthAmerica' },
        { name: 'Europe', value: [10.0, 50.0, 1], route: '/Europe' },
        { name: 'Africa', value: [20.0, 0.0, 1], route: '/Africa' },
        { name: 'Asia', value: [100.0, 40.0, 1], route: '/Asia' },
        { name: 'Australia', value: [135.0, -25.0, 1], route: '/Australia' }
      ]
    }
  ]
};

        myChart.setOption(option);

        myChart.on('click', function (params) {
          if (params.componentType === 'series') {
            const clickedPin = option.series[0].data.find(d => d.name === params.name);
            if (clickedPin) {
              router.push(clickedPin.route);
            }
          }
        });

        const resizeHandler = () => {
          myChart.resize();
        };

        window.addEventListener('resize', resizeHandler);

        return () => {
          window.removeEventListener('resize', resizeHandler);
        };
      }
    };

    if (typeof window !== 'undefined') {
      initChart();
    }

    return () => {
      if (myChart) {
        myChart.dispose();
      }
    };
  }, [router]);

  return <div ref={chartRef} style={{ width: "100vw", height: "100vh" }}></div>;
}

export default EarthModel;