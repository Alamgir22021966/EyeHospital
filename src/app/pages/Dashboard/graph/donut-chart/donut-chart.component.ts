import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'Donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss']
})
export class DonutChartComponent implements OnInit {

  @ViewChild('ChartContainer', { static: true })
  private chartContainer: ElementRef<any>;

  constructor() { }

  ngOnInit(): void {
    this.donutSpreadingLabels();
  }

  public donutSpreadingLabels(): void {
    const BarChart = (container) => {
      let data: DataModel[] = [
        { name: 'OPD', value: '9' },
        { name: 'IPD', value: '20' },
        { name: 'Pharmacy', value: '30' },
        { name: 'Pathology', value: '8' },
        { name: 'Radiology', value: '12' },
        { name: 'Blood Bank', value: '4' },
        { name: 'Ambulance', value: '40' },
        { name: 'Income', value: '14' },
        { name: 'Others', value: '25' },
      ];

      let margin = { top: 50, right: 15, bottom: 60, left: 15 };
      let width = 400 + margin.left + margin.right;
      let height = 230 + margin.top + margin.bottom;
      // let radius = Math.min(width, height) / 2 ;
      let radius = Math.min(width, height) / 2 - (margin.left + margin.right);

      let svg = d3
        .select(container)
        .append('svg')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .style('background-color', '#ffeeaa')
        .append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

      let colors: any = d3
      .scaleOrdinal()
      .range(d3.quantize((t) => d3.interpolateSpectral(t * 0.8 + 0.1), 10).reverse())

      // Compute the position of each group on the pie:
      let pie: any = d3
        .pie()
        .sort(null)
        .value((d: any) => d.value);

      let arc: any = d3
        .arc()
        .innerRadius(radius * 0.5)
        .outerRadius(radius * 0.9);

      let outerArc: any = d3
        .arc()
        .innerRadius(radius * 0.95)
        .outerRadius(radius * 0.95);

      svg
        .selectAll('allSlices')
        .data(pie(data))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', (d: any) => colors(d.data.value))
        .attr('stroke', 'white')
        .style('stroke-width', '1px')
        .style('opacity', 0.9);

      // Add the polylines between chart and labels:
      svg
        .selectAll('allPolylines')
        .data(pie(data))
        .enter()
        .append('polyline')
        .attr('stroke', 'black')
        .style('fill', 'none')
        .attr('stroke-width', 1)
        .attr('points', (d: any): any => {
          let posA = arc.centroid(d);
          let posB = outerArc.centroid(d);
          let posC = outerArc.centroid(d);
          let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
          posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1);
          return [posA, posB, posC];
        });

      // Add the polylines between chart and labels:
      svg
        .selectAll('allLabels')
        .data(pie(data))
        .enter()
        .append('text')
        .text((d: any) => d.data.name)
        .attr('transform', (d: any) => {
          var pos = outerArc.centroid(d);
          var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
          pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
          return 'translate(' + pos + ')';
        })
        .style('text-anchor', (d: any) => {
          var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
          return midangle < Math.PI ? 'start' : 'end';
        })
        .style('font-size', '10px');

      // Chart Title
      svg
        .append('text')
        .attr('transform', 'translate(-100, -175)')
        .attr('x', 10)
        .attr('y', margin.top - 20)
        .attr('font-size', '18px')
        // .attr('stroke', '#cc2222')
        // .attr('font-weight', '300')
        // .attr('text-shadow', '2px 2px 4px #000000')
        .text('Categorywise Income Overview');


    };

    const PowerDonut = BarChart('#power-donut');
    // this.BarDataService.getBarDataEmitter().subscribe((x: any) => {
    //   d3.selectAll('#power-bar > *').remove();
    //   const PowerBar = BarChart('#power-bar', x);
    // });

  }

}

export interface DataModel {
  name: string;
  value: string;
  color?: string;
}