<template>
  <v-tooltip top>
    <template #activator="{on}">
      <IconLinkItem
        key="export_json"
        text="Export as JSON"
        icon="mdi-code-json"
        @click="export_json()"
        v-on="on"
      />
    </template>
    <span>JSON Download</span>
  </v-tooltip>
</template>

<script lang="ts">
import IconLinkItem from '@/components/global/sidebaritems/IconLinkItem.vue';
import {FilteredDataModule} from '@/store/data_filters';
import concat from 'concat-stream';
import {saveAs} from 'file-saver';
import Vue from 'vue';
import Component from 'vue-class-component';
import {ZipFile} from 'yazl';

type FileData = {
  name: string;
  contents: string;
};

@Component({
  components: {
    IconLinkItem
  }
})
export default class ExportJSON extends Vue {
  populate_files(): FileData[] {
    const ids = FilteredDataModule.selected_file_ids;
    const fileData: FileData[] = [];
    for (const evaluation of FilteredDataModule.evaluations(ids)) {
      fileData.push({
        name: this.cleanup_filename(evaluation.from_file.filename),
        contents: JSON.stringify(evaluation.data)
      });
    }
    for (const prof of FilteredDataModule.profiles(ids)) {
      fileData.push({
        name: prof.from_file.filename,
        contents: JSON.stringify(prof.from_file.profile.data)
      });
    }
    return fileData;
  }

  //exports .zip of jsons if multiple are selected, if one is selected it will export that .json file
  export_json() {
    const files = this.populate_files();
    if (files.length < 1) {
      return;
    } else if (files.length === 1) {
      //will only ever loop once
      for (const file of files) {
        const blob = new Blob([file.contents], {
          type: 'application/json'
        });
        saveAs(blob, file.name);
      }
    } else {
      const zipfile = new ZipFile();
      for (const file of files) {
        const buffer = Buffer.from(file.contents);
        zipfile.addBuffer(buffer, file.name);
      }
      //let zipfile.addBuffer(Buffer.from("hello"), "hello.txt");
      // call end() after all the files have been added
      zipfile.outputStream.pipe(
        concat({encoding: 'uint8array'}, (b: Uint8Array) => {
          saveAs(new Blob([b]), 'exported_jsons.zip');
        })
      );
      zipfile.end();
    }
  }

  cleanup_filename(filename: string): string {
    filename = filename.replace(/\s+/g, '_');
    if (filename.substring(filename.length - 6) !== '.json') {
      filename = filename + '.json';
    }
    return filename;
  }
}
</script>
