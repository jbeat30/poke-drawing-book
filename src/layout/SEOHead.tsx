import { Helmet } from '@dr.pogodin/react-helmet'

interface SEOHeadProps {
  title?: string
  description?: string
  image?: string
  url?: string
}

export default function SEOHead({
  title,
  description = 'React + TypeScript로 만든 포켓몬 도감 앱. 포켓몬 검색, 상세 정보 조회 기능을 제공합니다.',
  image = '/images/poke-og.png',
  url,
}: SEOHeadProps) {
  const currentUrl =
    url || (typeof window !== 'undefined' ? window.location.href : '')

  return (
    <Helmet
      title={title || '포켓몬 도감 미니'}
      titleTemplate={title ? '%s | 포켓몬 도감 미니' : '%s'}
      meta={[
        { name: 'description', content: description },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },

        {
          property: 'og:title',
          content: title ? `${title} | 포켓몬 도감 미니` : '포켓몬 도감 미니',
        },
        { property: 'og:description', content: description },
        { property: 'og:image', content: image },
        { property: 'og:url', content: currentUrl },
        { property: 'og:type', content: 'website' },

        { name: 'twitter:card', content: 'summary_large_image' },
        {
          name: 'twitter:title',
          content: title ? `${title} | 포켓몬 도감 미니` : '포켓몬 도감 미니',
        },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: image },
      ]}
      link={[{ rel: 'canonical', href: currentUrl }]}
    />
  )
}
