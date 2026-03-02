import { getArticles } from '../../lib/store'

export async function GET() {
  const articles = await getArticles()
  return Response.json(articles)
}
