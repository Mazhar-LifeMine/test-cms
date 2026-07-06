const BASE_URL = 'https://learn.qutbul-madar.in'

async function warmCache() {
  console.log('🔥 Starting cache warmer...')
  console.log(`Base URL: ${BASE_URL}`)

  // Step 1 — fetch all subjects
  const subjectsRes = await fetch(`${BASE_URL}/api/subjects?limit=100`)
  const subjectsData = await subjectsRes.json()
  const subjects = subjectsData.docs ?? []
  console.log(`Found ${subjects.length} subjects`)

  // Step 2 — warm homepage
  console.log('Warming: /')
  await fetch(`${BASE_URL}/`)
  console.log('✅ /')

  // Step 3 — warm each subject page
  for (const subject of subjects) {
    console.log(`Warming: /${subject.slug}`)
    await fetch(`${BASE_URL}/${subject.slug}`)
    console.log(`✅ /${subject.slug}`)

    // Step 4 — fetch subchapters for this subject
    const subsRes = await fetch(
      `${BASE_URL}/api/sub-chapters?where[subject][equals]=${subject.id}&limit=1000`,
    )
    const subsData = await subsRes.json()
    const subChapters = subsData.docs ?? []
    console.log(`  Found ${subChapters.length} subchapters`)

    // Step 5 — warm each subchapter page
    for (const sub of subChapters) {
      console.log(`  Warming: /${subject.slug}/${sub.id}`)
      await fetch(`${BASE_URL}/${subject.slug}/${sub.id}`)
      console.log(`  ✅ /${subject.slug}/${sub.id}`)
    }
  }

  console.log('🎉 Cache warming complete!')
}

warmCache().catch(console.error)
