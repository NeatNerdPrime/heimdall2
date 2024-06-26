<template>
  <div slot="no-body">
    <vue-apex-charts
      id="chart"
      type="radialBar"
      width="350"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script lang="ts">
import {ColorHackModule} from '@/store/color_hack';
import {Filter} from '@/store/data_filters';
import {StatusCountModule} from '@/store/status_counts';
import {ApexOptions} from 'apexcharts';
import Vue from 'vue';
import VueApexCharts from 'vue-apexcharts';
import Component from 'vue-class-component';
import {Prop} from 'vue-property-decorator';

@Component({
  components: {
    VueApexCharts
  }
})
export default class ComplianceChart extends Vue {
  @Prop({type: Object, required: true}) readonly filter!: Filter;

  get chartOptions(): ApexOptions {
    // Produce our options
    return {
      plotOptions: {
        radialBar: {
          startAngle: -150,
          endAngle: 150,
          hollow: {
            size: '70%'
          },
          track: {
            opacity: 0
          },
          dataLabels: {
            show: true,
            value: {
              color: '#99a2ac',
              fontSize: '2rem'
            }
          }
        }
      },
      fill: {
        type: 'solid',
        colors: [
          function (data: {value: number}) {
            if (data.value < 60) {
              return ColorHackModule.lookupColor('complianceLow');
            } else if (data.value >= 60 && data.value < 90) {
              return ColorHackModule.lookupColor('complianceMedium');
            } else {
              return ColorHackModule.lookupColor('complianceHigh');
            }
          }
        ]
      },
      chart: {
        dropShadow: {
          enabled: true,
          top: 0,
          left: 0,
          blur: 3,
          opacity: 0.35
        }
      },
      stroke: {
        dashArray: 8
      },
      labels: ['Compliance Level']
    };
  }

  /**
   * We actually generate our series ourself! This is what shows up in the chart. It should be a single value
   */
  get series(): number[] {
    // Get access to the status counts, to compute compliance percentages
    const passed = StatusCountModule.countOf(this.filter, 'Passed');
    const total =
      passed +
      StatusCountModule.countOf(this.filter, 'Failed') +
      StatusCountModule.countOf(this.filter, 'Profile Error') +
      StatusCountModule.countOf(this.filter, 'Not Reviewed') +
      StatusCountModule.countOf(this.filter, 'Waived');
    if (total === 0) {
      return [0];
    } else {
      return [Math.round((100.0 * passed) / total)];
    }
  }
}
</script>
