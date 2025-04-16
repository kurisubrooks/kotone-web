import { isJapanese, isMixed, toRomaji } from 'wanakana'

const formatName = (name: string): string => {
  if (isJapanese(name) || isMixed(name)) {
    return toRomaji(name).replace(/\s+/g, '').toLowerCase()
  }
  return name.replace(/\s+/g, '').toLowerCase()
}

export default formatName
