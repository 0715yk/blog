import { memo } from 'react'

function Utterances() {
  return (
    <section
      ref={(el) => {
        if (el) {
          const scriptElement = document.createElement('script')
          scriptElement.src = 'https://utteranc.es/client.js'
          scriptElement.crossOrigin = 'anonymous'
          scriptElement.async = true

          scriptElement.setAttribute('repo', '0715yk/blog')

          scriptElement.setAttribute('issue-term', 'pathname')
          scriptElement.setAttribute('label', '🦊')
          scriptElement.setAttribute('theme', 'github-dark-orange')
          el.appendChild(scriptElement)
        } else {
          return
        }
      }}
    />
  )
}

export default memo(Utterances)
