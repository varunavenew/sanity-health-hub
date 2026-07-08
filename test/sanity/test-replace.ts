const text = "            'Velg rekkefølge. La stå tom for å liste alle publiserte klinikker automatisk.',"
const key = "Velg rekkefølge. La stå tom for å liste alle publiserte klinikker automatisk."
const escapedKey = key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
const r = new RegExp(`'${escapedKey}'`, 'g')
console.log('Matches:', r.test(text))
console.log('Replaced:', text.replace(r, "'Select order. Leave empty to automatically list all published clinics.'"))
