<template>
  <v-card>
    <v-container fluid class="bar lighten-2">
      <v-row justify="space-around" no-gutters>
        <AboutModal>
          <template #clickable="{on}">
            <v-btn text small v-on="on">
              <v-icon small>mdi-alpha-a-circle</v-icon>
              <span class="d-none d-sm-inline pl-3">About</span>
            </v-btn>
          </template>
        </AboutModal>
        <HelpModal>
          <template #clickable="{on}">
            <v-btn text small v-on="on">
              <v-icon small>mdi-help-circle</v-icon>
              <span class="d-none d-sm-inline pl-3">Help</span>
            </v-btn>
          </template>
        </HelpModal>
        <v-btn :href="repository" target="_blank" text small>
          <v-icon small>mdi-github</v-icon>
          <span class="d-none d-sm-inline pl-3">Github</span>
        </v-btn>
        <v-btn :href="repository" target="_blank" text small>
          <v-icon small>mdi-information</v-icon>
          <span class="d-none d-sm-inline pl-3">Docs</span>
        </v-btn>
        <v-btn :href="repository + changelog" target="_blank" text small>
          <v-icon small>mdi-alpha-v-circle</v-icon>
          <span class="d-sm-inline pl-3 text-center">{{ version }}</span>
        </v-btn>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import AboutModal from '@/components/global/AboutModal.vue';
import HelpModal from '@/components/global/HelpModal.vue';
import AppInfoMixin from '@/mixins/AppInfoMixin';
import Component, {mixins} from 'vue-class-component';

@Component({
  components: {
    AboutModal,
    HelpModal
  }
})
export default class HelpFooter extends mixins(AppInfoMixin) {}
</script>
