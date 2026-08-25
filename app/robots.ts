const baseUrl = 'https://32dent-beta.vercel.app'

export default robots

export const robots = {
  rules: {
    userAgent: '*',
    allow: ['/([a-z]+)?/'],
    disallow: ['/api/', '/admin/', '/(.*)__*'],
  },
  sitemap: `${baseUrl}/sitemap.xml`,
}