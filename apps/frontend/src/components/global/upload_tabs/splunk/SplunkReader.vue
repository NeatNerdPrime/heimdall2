<template>
  <v-stepper v-model="step" vertical class="elevation-0">
    <v-stepper-step step="1"> Login Credentials </v-stepper-step>
    <v-stepper-step step="2"> Search Execution Events </v-stepper-step>

    <AuthStep
      @authenticated="handle_login"
      @error="handle_error"
      @show-help="errorCount = -1"
    />

    <FileList
      :endpoint="splunkState"
      @exit-list="handle_logout"
      @got-files="got_files"
      @error="handle_error"
    />

    <v-overlay
      :opacity="50"
      absolute="absolute"
      :value="errorCount >= 3 || errorCount < 0"
    >
      <div class="text-center">
        <p>
          <span v-if="errorCount > 0">
            It seems you may be having trouble using the Splunk toolkit. Are you
            sure that you have configured it properly?
          </span>
          <br />
          <span>
            For installation instructions and further information, check here:
          </span>
          <v-btn
            target="_blank"
            href="https://github.com/mitre/hdf-json-to-splunk/"
            text
            color="info"
            px-0
          >
            <v-icon pr-2>mdi-github-circle</v-icon>
            Splunk HDF Plugin
          </v-btn>
        </p>
        <v-btn color="info" @click="errorCount = 0"> Ok </v-btn>
      </div>
    </v-overlay>
  </v-stepper>
</template>

<script lang="ts">
import {FileID} from '@/store/report_intake';
import {SnackbarModule} from '@/store/snackbar';
import {SplunkEndpoint, SplunkErrorCode} from '@/utilities/splunk_util';
import Vue from 'vue';
import Component from 'vue-class-component';
import AuthStep from './AuthStep.vue';
import FileList from './FileList.vue';

/**
 * File reader component for taking in inspec JSON data.
 * Uploads data to the store with unique IDs asynchronously as soon as data is entered.
 * Emits "got-files" with a list of the unique_ids of the loaded files.
 */
@Component({
  components: {
    AuthStep,
    FileList
  }
})
export default class SplunkReader extends Vue {
  /** Our session information, saved iff valid */
  splunkState: SplunkEndpoint | null = null;

  /** Current step. 1 for login, 2 for search */
  step = 1;

  /** Count errors to know if we should show overlay */
  errorCount = 0;

  /** When login is clicked - save credentials, verify that they work, then proceed if they do*/
  handle_login(newEndpoint: SplunkEndpoint) {
    // Store the state
    this.splunkState = newEndpoint;

    // Move the carousel
    this.step = 2;
  }

  /** When cancel/logout is clicked from the search window */
  handle_logout() {
    this.step = 1;
    this.splunkState = null;
  }

  /** Callback to handle a splunk error.
   * Sets shown error.
   */
  handle_error(error: SplunkErrorCode): void {
    this.step = 1;
    switch (error) {
      case SplunkErrorCode.BadNetwork:
        this.errorCount += 1;
        // https://docs.splunk.com/Documentation/Splunk/8.0.1/Admin/Serverconf
        this.show_error_message(
          'Connection to host failed. Please ensure that the hostname is correct, and that your splunk server has been properly configured to allow CORS requests. Please see https://docs.splunk.com/Documentation/Splunk/8.0.1/Admin/Serverconf for information on how to enable CORS.'
        );
        break;
      case SplunkErrorCode.PageNotFound:
        this.errorCount += 1;
        this.show_error_message(
          'Connection made with errors. Please ensure your hostname is formatted as shown in the example.'
        );
        break;
      case SplunkErrorCode.BadAuth:
        this.show_error_message('Bad username or password.');
        break;
      case SplunkErrorCode.SearchFailed:
        this.show_error_message('Internal splunk error while searching');
        break;
      case SplunkErrorCode.ConsolidationFailed:
      case SplunkErrorCode.SchemaViolation:
        this.errorCount += 1;
        this.show_error_message('Error creating execution from splunk events.');
        break;
      case SplunkErrorCode.InvalidGUID:
        this.show_error_message(
          'Duplicate execution GUID detected. The odds of this happening should be astronomically low. Please file a bug report.'
        );
        break;
      case SplunkErrorCode.BadUrl:
        this.show_error_message(
          'Invalid URL. Please ensure you have typed it correctly.'
        );
        break;
      case SplunkErrorCode.UnknownError:
        this.show_error_message(
          "Something went wrong, but we're not sure what. Please file a bug report."
        );
        break;
    }
  }

  /** Give our error tooltip the message */
  show_error_message(msg: string) {
    // Toast whatever error we got
    SnackbarModule.failure(msg);
  }

  /** Callback on got files */
  got_files(files: Array<FileID>) {
    this.$emit('got-files', files);
  }
}
</script>
