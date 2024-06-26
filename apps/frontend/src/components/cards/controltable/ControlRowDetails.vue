<template>
  <v-row no-gutters dense class="pb-1">
    <v-col cols="12" class="font-weight-bold">
      <v-card>
        <v-tabs v-model="localTab" fixed-tabs show-arrows @change="tab_change">
          <!-- Declare our tabs -->
          <v-tab href="#tab-test"> Test </v-tab>
          <v-tab href="#tab-details"> Details </v-tab>
          <v-tab href="#tab-code"> Code </v-tab>

          <v-tab-item value="tab-test">
            <div class="pa-4">
              <div v-if="caveat">
                Caveat: {{ caveat }}
                <v-divider />
                <br />
              </div>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div v-html="sanitize_html(main_desc)" />
            </div>
            <ControlRowCol
              v-for="(result, index) in control.root.hdf.segments"
              :key="'col' + index"
              :class="zebra(index)"
              :result="result"
              :status-code="result.status"
            />
          </v-tab-item>

          <v-tab-item value="tab-details">
            <v-container fluid>
              <!-- Create a row for each detail -->
              <template v-for="(detail, index) in details">
                <v-row :key="'tab' + index" :class="zebra(index)">
                  <v-col cols="12" :class="detail.class">
                    <h3>{{ detail.name }}:</h3>
                    <!-- eslint-disable vue/no-v-html -->
                    <h4 class="mono" v-html="sanitize_html(detail.value)" />
                    <!-- eslint-enable vue/no-v-html -->
                  </v-col>
                  <v-divider />
                </v-row>
              </template>
            </v-container>
          </v-tab-item>

          <v-tab-item value="tab-code">
            <v-container fluid>
              <v-row>
                <v-col cols="12">
                  <prism language="ruby">{{ control.full_code }}</prism>
                </v-col>
              </v-row>
            </v-container>
          </v-tab-item>
        </v-tabs>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import ControlRowCol from '@/components/cards/controltable/ControlRowCol.vue';
import HtmlSanitizeMixin from '@/mixins/HtmlSanitizeMixin';
import {ContextualizedControl} from 'inspecjs';
import _ from 'lodash';
//TODO: add line numbers
import 'prismjs';
import 'prismjs/components/prism-makefile.js';
import 'prismjs/components/prism-ruby.js';
import 'prismjs/themes/prism-tomorrow.css';
import Component, {mixins} from 'vue-class-component';
//@ts-ignore
import Prism from 'vue-prism-component';
import {Prop, Watch} from 'vue-property-decorator';

interface Detail {
  name: string;
  value: string;
  class?: string;
}

@Component({
  components: {
    ControlRowCol,
    Prism
  }
})
export default class ControlRowDetails extends mixins(HtmlSanitizeMixin) {
  @Prop({type: String, default: 'tab-test'}) readonly tab!: string;
  @Prop({type: Object, required: true})
  readonly control!: ContextualizedControl;

  localTab = this.tab;

  @Watch('tab')
  onTabChanged(newTab?: string, _oldVal?: string) {
    if (newTab) {
      this.localTab = newTab;
    }
  }

  get cciControlString(): string | null {
    const cci = this.control.hdf.wraps.tags.cci;
    if (!cci) {
      return null;
    } else if (Array.isArray(cci)) {
      return cci.join(', ');
    } else {
      return cci;
    }
  }

  get main_desc(): string {
    if (this.control.data.desc) {
      return this.control.data.desc.trim();
    } else {
      return 'No description';
    }
  }

  tab_change(tab: string) {
    this.$emit('update:tab', tab);
  }

  /** Shown above the description */
  get header(): string {
    const msgSplit = this.control.root.hdf.finding_details.split(':');
    if (msgSplit.length === 1) {
      return msgSplit[0] + '.';
    } else {
      return msgSplit[0] + ':';
    }
  }

  get caveat(): string | undefined {
    return this.control.hdf.descriptions.caveat;
  }

  get details(): Detail[] {
    const c = this.control;
    const detailsMap = new Map();

    detailsMap.set('Control', c.data.id);
    detailsMap.set('Title', c.data.title);
    detailsMap.set('Caveat', c.hdf.descriptions.caveat);
    detailsMap.set('Desc', c.data.desc);
    detailsMap.set('Rationale', c.hdf.descriptions.rationale);
    detailsMap.set('Severity', c.root.hdf.severity);
    detailsMap.set('Impact', c.data.impact);
    detailsMap.set('Nist controls', c.hdf.rawNistTags.join(', '));
    detailsMap.set('CCI controls', this.cciControlString);
    detailsMap.set('Check', c.hdf.descriptions.check || c.data.tags.check);
    detailsMap.set('Fix', c.hdf.descriptions.fix || c.data.tags.fix);
    detailsMap.set('CWE ID', _.get(c, 'hdf.wraps.tags.cweid'));

    for (const prop in c.hdf.descriptions) {
      if (!detailsMap.has(_.capitalize(prop))) {
        detailsMap.set(_.capitalize(prop), c.hdf.descriptions[prop]);
      }
    }
    return Array.from(detailsMap, ([name, value]) => ({name, value})).filter(
      (v) => v.value
    );
  }

  //for zebra background
  zebra(ix: number): string {
    if (ix % 2 === 0) {
      return 'zebra-table';
    }
    return 'non-zebra-table';
  }
}
</script>

<style lang="scss" scoped>
@import '@/sass/control-row-format.scss';

.clickable {
  cursor: pointer;
}

.v-application {
  code.language-ruby {
    border: none;
    box-shadow: none;
  }
}

pre {
  white-space: pre-wrap; /* Since CSS 2.1 */
  white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
  white-space: -pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: break-word; /* Internet Explorer 5.5+ */
}
.theme--dark .zebra-table {
  background-color: var(--v-secondary-lighten2);
  max-width: 99.9%;
  margin: auto;
}

.theme--dark .non-zebra-table {
  max-width: 99.9%;
  margin: auto;
}

.code-card {
  height: inherit;
  margin: inherit;
  white-space: auto;
}
.wset {
  min-width: 125px;
  justify-content: center;
}

.right {
  margin-left: -1px;
}
</style>
