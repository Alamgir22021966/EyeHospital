import { Component, OnInit } from '@angular/core';
import { GraphService } from '@services/Graph/graph.service';
import * as d3 from 'd3';

@Component({
  selector: 'Bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {

  constructor(
    private BarDataService: GraphService
  ) { }

  ngOnInit(): void {
    this.draw();
  }

  private margin: any = { top: 50, bottom: 60, left: 60, right: 10 };

  public draw(): void {
      const BarChart = (container, DATA:any) => {

      let width = 350, height = 230;
      let svg = d3
        .select(container)
        .append('svg:svg')
        .attr('viewBox', `0 0 ${width + this.margin.left + this.margin.right} ${height + this.margin.top + this.margin.bottom}`)
        .style('background-color', '#ffeeaa');

        // define X & Y domains
    let xDomain = DATA.map((d) => d.MONTH);
    let yDomain:any = [d3.min(DATA, (d:any) => d.Value - 0.4), d3.max(DATA, (d:any) => d.Value)];
    // let yDomain:any = [80, d3.max(DATA, (d:any) => d.Value)];

    // create scales
    let xScale = d3
      .scaleBand()
      .padding(0.05)
      .domain(xDomain)
      .rangeRound([0, width]);
    let yScale = d3.scaleLinear().domain(yDomain).range([height, 0]).nice();

    // x & y axis
    let xAxis = svg
      .append('g')
      .attr('class', 'axis axis-x')
      .attr(
        'transform',
        `translate(${this.margin.left}, ${this.margin.top + height})`
      )
      .call(d3.axisBottom(xScale).tickSizeOuter(0));

    // const x_axis = d3
    // .axisBottom(x)
    // .tickSizeOuter(0)
    // .tickValues(
    //   x.domain().filter((d, i) => {
    //     return !(i % 4);
    //   })
    // );

    let yAxis = svg
      .append('g')
      .attr('class', 'axis axis-y')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
      .call(d3.axisLeft(yScale).tickSizeOuter(0));

       // bar colors
    // let colors = d3
    // .scaleLinear()
    // .domain([0, DATA.length])
    // .range(<any[]>['red', 'blue']);

    const colors = d3
    .scaleSequential()
    .domain([0, DATA.length])
    .interpolator(d3.interpolateSpectral);

    // d3.interpolateWarm/Cool/Rainbow/Sinebow

  let chart = d3
    .select('svg')
    .append('g')
    .selectAll('rect')
    .data(DATA)
    .enter()
    .append('rect')
    .attr('x', (d:any) => xScale(d.MONTH) + this.margin.left)
    .attr('y', (d) => {
      return yScale(0);
    })
    // .attr('y', (d:any) => yScale(Math.max(0, d.Value)))
    .attr('width', xScale.bandwidth())
    .attr('height', 0)
    .style('fill', (d, i) => colors(i))
    .attr('y', (d:any) => yScale(d.Value) + this.margin.top)
    .attr('height', (d:any) => height - yScale(d.Value));

    d3.select('svg')
      .append('g')
      .selectAll('text')
      .data(DATA)
      .enter()
      .append('text')
      .text((d: any) => d.Value)
      .attr('y', (d:any) => yScale(d.Value) + this.margin.top + 15)
      .attr('x', (d:any) => xScale(d.MONTH) + this.margin.left + 4)
      .attr('font-family', 'sans-serif')
      .attr('font-size', '8px')
      .attr('fill', 'white');

    // X axis label:
    svg
      .append('text')
      .attr('text-anchor', 'end')
      .attr(
        'x',
        width + this.margin.left + this.margin.right - width / 2
      )
      .attr('y', height + this.margin.bottom/2 + this.margin.top + 10)
      .text('--> Month');

    // Y axis label:
    svg
      .append('text')
      .attr('text-anchor', 'end')
      .attr('transform', 'rotate(-90)')
      .attr('y', this.margin.left / 3)
      .attr('x', (-height - this.margin.bottom + this.margin.top)/2)
      .text('--> Value');

    // Chart Title
    svg
      .append('text')
      .attr('transform', 'translate(100, 0)')
      .attr('x', 10)
      .attr('y', this.margin.top - 20)
      .attr('font-size', '20px')
      // .attr('stroke', '#cc2222')
      // .attr('font-weight', '300')
      // .attr('text-shadow', '2px 2px 4px #000000')
      .text('Monthwise Income');

      const tooltip = d3
      .select('body')
      .append('div')
      .style('opacity', 0)
      .attr('class', 'tooltip')
      .style('background-color', '#ffeeaa')
      .style('border', 'solid')
      .style('border-width', '1px')
      .style('border-radius', '5px')
      .style('padding', '8px')
      .style('position', 'absolute')
      .style('top', '0px');

    chart
      .on('mouseover', function (event, d: any) {
        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip
          .html(`${d.Value}`)
          .style('left', event.pageX - 15 + 'px')
          .style('top', event.pageY - 50 + 'px');
      })
      .on('mouseout', function (d) {
        tooltip.transition().duration(500).style('opacity', 0);
      });

    };

    this.BarDataService.getBarDataEmitter().subscribe((x: any) => {
      d3.selectAll('#power-bar > *').remove();
      const PowerBar = BarChart('#power-bar', x);
    });

  }

}
