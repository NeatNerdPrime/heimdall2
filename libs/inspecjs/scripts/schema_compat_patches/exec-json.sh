#!/bin/sh

jq '.
# Make statistic duration optional
| .definitions["Statistics"].required = []

# Naturally, if we have results we will also not know specifically how long they last
| .definitions["Control_Result"].required -= ["run_time"]

# And code as well because sometimes, it just aint there (e.g. web stuff)
| .definitions["Exec_JSON_Control"].required -= ["code"]

# Insert Waiver Data
| .definitions.Waiver_Data = {"type":"object","additionalProperties":true,"required":[],"properties":{"expiration_date":{"type":"string"},"justification":{"type":"string"},"message":{"type":"string"},"run":{"type":"boolean"},"skipped_due_to_waiver":{"type":["string","boolean"]}}}

# Insert waiver_data reference
| .definitions["Exec_JSON_Control"].properties.waiver_data = {"$ref":"#/definitions/Waiver_Data"}
' <&0