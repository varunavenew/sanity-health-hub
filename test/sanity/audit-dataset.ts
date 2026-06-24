import { sanityClient } from './config'

async function run() {
  const draftCount = await sanityClient.fetch<number>(`count(*[_id in path("drafts.**")])`)
  console.log('Draft documents:', draftCount)

  const socialPosts = await sanityClient.fetch(`*[_type == "socialPost"]{_id}`)
  console.log('socialPost docs:', socialPosts)

  const published = await sanityClient.fetch<number>(`count(*[!(_id in path("drafts.**"))])`)
  console.log('Published documents:', published)
}

run().catch(console.error)
