<template>
  <ApexPieChart
    :categories="categories"
    :series="series"
    :center-value="centerValue"
    @category-selected="onSelect"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import ApexPieChart, {Category} from '@/components/generic/ApexPieChart.vue';
import {StatusCountModule} from '@/store/status_counts';
import {ControlStatus} from 'inspecjs';
import {Prop} from 'vue-property-decorator';
import {Filter} from '@/store/data_filters';

/**
 * Categories property must be of type Category
 * Model is of type ControlStatus | null - reflects selected severity
 */
@Component({
  components: {
    ApexPieChart
  }
})
export default class StatusChart extends Vue {
  @Prop({type: String, default: null}) readonly value!: string | null;
  @Prop({type: Object, required: true}) readonly filter!: Filter;
  @Prop({type: Boolean, default: false}) showCompliance!: boolean;

  categories: Category<ControlStatus>[] = [
    {
      label: 'Passed',
      value: 'Passed',
      color: 'statusPassed'
    },
    {
      label: 'Failed',
      value: 'Failed',
      color: 'statusFailed'
    },
    {
      label: 'Not Applicable',
      value: 'Not Applicable',
      color: 'statusNotApplicable'
    },
    {
      label: 'Not Reviewed',
      value: 'Not Reviewed',
      color: 'statusNotReviewed'
    },
    {
      label: 'Profile Error',
      value: 'Profile Error',
      color: 'statusProfileError'
    }
  ];

  get centerValue(): string {
    if (this.showCompliance) {
      const passed = StatusCountModule.countOf(this.filter, 'Passed');
      const total =
        passed +
        StatusCountModule.countOf(this.filter, 'Failed') +
        StatusCountModule.countOf(this.filter, 'Profile Error') +
        StatusCountModule.countOf(this.filter, 'Not Reviewed');
      if (total === 0) {
        return '0%';
      } else {
        return `${Math.round((100.0 * passed) / total)}%`;
      }
    } else {
      return '';
    }
  }

  get series(): number[] {
    return [
      StatusCountModule.countOf(this.filter, 'Passed'),
      StatusCountModule.countOf(this.filter, 'Failed'),
      StatusCountModule.countOf(this.filter, 'Not Applicable'),
      StatusCountModule.countOf(this.filter, 'Not Reviewed'),
      StatusCountModule.countOf(this.filter, 'Profile Error')
    ];
  }

  onSelect(status: Category<ControlStatus>) {
    // In the case that the values are the same, we want to instead emit null
    if (status.value === this.value) {
      this.$emit('input', null);
    } else {
      this.$emit('input', status.value);
    }
  }
}
</script>
