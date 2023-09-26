import fs from 'fs';
import {ChecklistResults} from '../../../src/ckl-mapper/checklist-mapper';
import { omitCklUuid } from '../../utils';


describe('previously_checklist_converted_hdf_to_checklist', () => {
  it('Successfully converts HDF to Checklist', () => {
    const mapper = new ChecklistResults(
      JSON.parse(
        fs.readFileSync(
          'sample_jsons/checklist_mapper/checklist-RHEL8V1R3-hdf.json',
          {encoding: 'utf-8'}
        )
      )
    );

    // fs.writeFileSync(
    //   'sample_jsons/checklist_mapper/converted-RHEL8V1R3.ckl',
    //   mapper.toCkl()
    // );

    expect(omitCklUuid(mapper.toCkl())).toEqual(
      omitCklUuid(
        fs.readFileSync(
          'sample_jsons/checklist_mapper/sample_input_report/RHEL8V1R3.ckl', {
            encoding: 'utf-8'
          }
        )
      )
    );
  });
});

describe('previously_checklist_converted_hdf_to_checklist', () => {
  it('Successfully converts HDF with multiple stigs to Checklist', () => {
    const mapper = new ChecklistResults(
      JSON.parse(
        fs.readFileSync(
          'sample_jsons/checklist_mapper/three_stig_checklist-hdf.json',
          {encoding: 'utf-8'}
        )
      )
    );

//     // fs.writeFileSync(
//     //   'sample_jsons/checklist_mapper/converted-three-stig-checklist.ckl',
//     //   mapper.toCkl()
//     // );

//     const parser = new XMLParser(options);

    expect(omitCklUuid(mapper.toCkl())).toEqual(
      omitCklUuid(
        fs.readFileSync(
          'sample_jsons/checklist_mapper/sample_input_report/three_stig_checklist.ckl', {
            encoding: 'utf-8'
          }
        )
      )
    );
  });
});

describe('non_checklist_converted_hdf_to_checklist', () => {
  it('Successfully converts HDF to Checklist', () => {
    const mapper = new ChecklistResults(
      JSON.parse(
        fs.readFileSync('sample_jsons/nessus_mapper/nessus-hdf-10.0.0.3.json', {
          encoding: 'utf-8'
        })
      )
    );

//     const parser = new XMLParser(options);

//     const xmlParsed = parser.parse(mapper.toCkl())

//     console.log(JSON.stringify(xmlParsed))

    // fs.writeFileSync(
    //   'sample_jsons/checklist_mapper/converted-nessus.ckl',
    //   mapper.toCkl()
    // );

    expect(omitCklUuid(mapper.toCkl())).toEqual(
      omitCklUuid(
        fs.readFileSync('sample_jsons/checklist_mapper/converted-nessus.ckl', {encoding: 'utf-8'})
      )
    );
  });
});
