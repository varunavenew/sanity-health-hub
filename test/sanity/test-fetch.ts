async function run() {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent('Les mer')}&langpair=no%7Cen`
  console.log('Fetching:', url)
  try {
    const res = await fetch(url)
    console.log('HTTP Status:', res.status)
    const json = await res.json()
    console.log('Response:', JSON.stringify(json, null, 2))
  } catch (e) {
    console.error('Fetch failed:', e)
  }
}
run()
