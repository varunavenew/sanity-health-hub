import { sanityClient } from './config'

async function run() {
  console.log('Querying categories from Sanity...')
  const categories = await sanityClient.fetch(`*[_type == "treatmentCategory"]{
    _id,
    title,
    categoryId
  }`)
  
  console.log(`Found ${categories.length} categories total:`)
  console.log(JSON.stringify(categories, null, 2))
  
  // Identify draft categories that have a blank title or a title value like 'Kategori'
  const toDelete = categories.filter((cat: any) => {
    // If it's a draft
    const isDraft = cat._id.startsWith('drafts.');
    
    // Check if the title is empty or missing or just 'Kategori'
    const hasNoTitle = !cat.title || 
      (Array.isArray(cat.title) && cat.title.length === 0) ||
      (Array.isArray(cat.title) && cat.title.every((t: any) => !t.value || t.value.trim() === '' || t.value.trim() === 'Kategori'));

    return isDraft && hasNoTitle;
  });

  if (toDelete.length === 0) {
    console.log('No empty/draft categories matching the criteria found.')
    return
  }

  console.log(`Deleting ${toDelete.length} draft categories...`)
  let tx = sanityClient.transaction()
  toDelete.forEach((cat: any) => {
    console.log(`Adding deletion of category document: ${cat._id}`)
    tx = tx.delete(cat._id)
  })

  await tx.commit()
  console.log('Successfully deleted the draft category documents!')
}

run().catch((err) => {
  console.error('Error cleaning categories:', err)
})
