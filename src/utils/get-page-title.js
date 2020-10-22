import defaultSettings from '@/settings'

const title = defaultSettings.title || '打洛闪电跑腿网'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
