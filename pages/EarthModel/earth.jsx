'use client';  // Mark this component as a Client Component

import { useEffect, useRef } from "react";
import * as echarts from 'echarts';
import 'echarts-gl';
import { useRouter } from 'next/router';  // Use next/navigation instead of next/router

function EarthModel() {
  const chartRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const chartDom = chartRef.current;
    const myChart = echarts.init(chartDom);

    const option = {
      backgroundColor: "#000",
      globe: {
        baseTexture: '/assets/earth.jpg',  // Use relative URL path
        heightTexture: '/assets/earth.jpg',  // Use relative URL path
        environment: '/assets/starfield.jpg',  // Use relative URL path
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
        }
      },
      series: [
        {
          type: 'scatter3D',
          coordinateSystem: 'globe',
          blendMode: 'lighter',
          symbol: 'image:///assets/pin.png',  // Use relative URL path
          symbolSize: 64,
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
            { name: 'North America', value: [-100.0, 40.0, 1], route: '/north-america' },
            { name: 'South America', value: [-60.0, -15.0, 1], route: '/south-america' },
            { name: 'Europe', value: [10.0, 50.0, 1], route: '/europe' },
            { name: 'Africa', value: [20.0, 0.0, 1], route: '/africa' },
            { name: 'Asia', value: [100.0, 40.0, 1], route: '/asia' },
            { name: 'Australia', value: [135.0, -25.0, 1], route: '/australia' }
          ]
        }
      ]
    };

    option && myChart.setOption(option);

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
      myChart.dispose();
      window.removeEventListener('resize', resizeHandler);
    };
  }, [router]);

  return <div ref={chartRef} style={{ width: "100vw", height: "100vh" }}></div>;
}

export default EarthModel;
