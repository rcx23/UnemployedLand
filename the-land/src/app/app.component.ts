import {Component, ViewChild, NgModule, NgZone, ElementRef} from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import {MatTabsModule} from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';

am4core.useTheme(am4themes_animated);

export class AppModule {}
@NgModule({
  imports: [BrowserModule,   BrowserAnimationsModule, MatTabsModule, RouterModule],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})



export class AppComponent {

  title = 'the-land';
  private chartLine: am4charts.XYChart;
  private chartBar: am4charts.XYChart;
  private chartTiming: am4charts.PieChart;

@ViewChild('chartDiv') chartDiv: ElementRef<HTMLElement>;
@ViewChild('chartBar') chartBar1: ElementRef<HTMLElement>;
  constructor(private zone: NgZone) {}

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      // Line Chart

      const chartLine = am4core.create(this.chartDiv.nativeElement, am4charts.XYChart);

      chartLine.paddingRight = 20;

      const data = [];
      let visits = 10;
      for (let i = 1; i < 366; i++) {
        visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
        data.push({ date: new Date(2018, 0, i), name: 'name' + i, value: visits });
      }

      chartLine.data = data;

      const dateAxisLine = chartLine.xAxes.push(new am4charts.DateAxis());
      dateAxisLine.renderer.grid.template.location = 0;

      const valueAxisLine = chartLine.yAxes.push(new am4charts.ValueAxis());
      valueAxisLine.tooltip.disabled = true;
      valueAxisLine.renderer.minWidth = 35;

      const seriesLine = chartLine.series.push(new am4charts.LineSeries());
      seriesLine.dataFields.dateX = 'date';
      seriesLine.dataFields.valueY = 'value';

      seriesLine.tooltipText = '{valueY.value}';
      chartLine.cursor = new am4charts.XYCursor();

      const scrollbarX = new am4charts.XYChartScrollbar();
      scrollbarX.series.push(seriesLine);
      chartLine.scrollbarX = scrollbarX;

      this.chartLine = chartLine;


      // Bar graph
      const chartBar = am4core.create(this.chartBar1.nativeElement, am4charts.XYChart);

      chartBar.data = [{
        platform: 'Facebook',
        visits: 31
      }, {
        platform: 'Instagram',
        visits: 53
      }, {
        platform: 'Twitter',
        visits: 28
      }, {
        platform: 'LinkedIn',
        visits: 20
      }, {
        platform: 'Text',
        visits: 42
      }, {
        platform: 'Email',
        visits: 6
      }, {
        platform: 'WhatsApp',
        visits: 15
      }, {
        platform: 'Messenger',
        visits: 12
      }, {
        platform: 'Pinterest',
        visits: 4
      }];

      const barAxis = chartBar.xAxes.push(new am4charts.CategoryAxis());
      barAxis.dataFields.category = 'platform';
      barAxis.renderer.grid.template.location = 0;
      barAxis.renderer.minGridDistance = 30;

      barAxis.renderer.labels.template.adapter.add('dy', function(dy, target) {
        if (target.dataItem && target.dataItem.index as Number & 2 == 2) {
          return dy + 25;
        }
        return dy;
      });

      const valueAxis = chartBar.yAxes.push(new am4charts.ValueAxis());

// Create series
      const seriesBar = chartBar.series.push(new am4charts.ColumnSeries());
      seriesBar.dataFields.valueY = 'visits';
      seriesBar.dataFields.categoryX = 'platform';
      seriesBar.name = 'Visits';
      seriesBar.columns.template.tooltipText = '{categoryX}: [bold]{valueY}[/]';
      seriesBar.columns.template.fillOpacity = .8;

      const columnTemplate = seriesBar.columns.template;
      columnTemplate.strokeWidth = 2;
      columnTemplate.strokeOpacity = 1;

      // Timing Chart
      const chartTiming = am4core.create('chartTiming', am4charts.PieChart);

      chartTiming.data = [{
        time: '0-5 Minutes',
        value: '14.8%'
      }, {
        time: '5-20 Minutes',
        value: '29.2%'
      }, {
        time: '20-60 Minutes',
        value: '10.5%'
      }, {
        time: '60-120 Minutes',
        value: '7.6%'
      }, {
        time: '>120 Minutes',
        value: '37.6%'
      }];

      const timingSeries = chartTiming.series.push(new am4charts.PieSeries());
      timingSeries.dataFields.value = 'value';
      timingSeries.dataFields.category = 'time';
      timingSeries.innerRadius = am4core.percent(50);
      timingSeries.ticks.template.disabled = true;
      timingSeries.labels.template.disabled = true;

      const rgm = new am4core.RadialGradientModifier();
      rgm.brightnesses.push(-0.8, -0.8, -0.5, 0, - 0.5);
      timingSeries.slices.template.fillModifier = rgm;
      timingSeries.slices.template.strokeModifier = rgm;
      timingSeries.slices.template.strokeOpacity = 0.4;
      timingSeries.slices.template.strokeWidth = 0;

      chartTiming.legend = new am4charts.Legend();
      chartTiming.legend.position = 'right';

    });
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chartLine) {
        this.chartLine.dispose();
      }

      if (this.chartBar) {
        this.chartBar.dispose();
      }

      if (this.chartTiming) {
        this.chartTiming.dispose();
      }
    });
  }
}
