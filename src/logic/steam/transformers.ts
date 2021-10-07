/* eslint-disable @typescript-eslint/no-unused-vars */

import { BlotterUserStatus, BlotterType, BlotterGroupStatus, BlotterGamePurchase, BlotterRecommendation, BlotterDailyRollup, BlotterBlock } from './types'

const parseUserStatus = (el: Element): BlotterUserStatus => {
  const result = { type: BlotterType.USER_STATUS } as any

  const avatar = el.querySelector<HTMLImageElement>('.blotter_author_block .playerAvatar > img')
  result.authorID = avatar?.dataset.miniprofile
  result.authorName = el.querySelector('div.blotter_author_block > div:nth-child(3)')?.textContent
  result.assets = { avatarURL: avatar?.src }

  const appLink = el.querySelector<HTMLAnchorElement>('a.blotter_userstats_game')
  if (appLink) {
    const game = {} as any
    game.id = appLink.href.match(/app\/(\d+)/)![1]
    const link = el.querySelector<HTMLAnchorElement>('div.blotter_author_block > div:nth-child(4) a')
    game.title = link?.textContent
    game.type = 'app'
    result.game = game
    result.assets.capsuleURL = appLink.querySelector<HTMLImageElement>('img')?.src
  }

  result.content = el.querySelector('.blotter_userstatus_content')?.textContent

  const commentLink = el.querySelector<HTMLAnchorElement>('.blotter_comment_thread a[href*="status"]')
  result.date = commentLink?.href.match(/status\/(\d+)/)![1]

  return result
}

const parseGroupStatus = (el: Element): BlotterGroupStatus => {
  const result = { type: BlotterType.GROUP_STATUS } as any

  const author = el.querySelector<HTMLAnchorElement>('.blotter_group_announcement_header_text a')
  result.name = author?.textContent
  result.origin = author?.href

  const title = el.querySelector<HTMLAnchorElement>('.blotter_group_announcement_headline a')
  result.link = title?.href
  result.title = title?.textContent
  const imageURL = el.querySelector<HTMLImageElement>('.blotter_rollup_avatar img')?.src
  result.assets = { imageURL }

  return result
}

const parseGamePurchase = (el: Element): BlotterGamePurchase => {
  const result = { type: BlotterType.GAME_PURCHASE } as any
  const author_block = el.querySelector('.blotter_author_block')
  function parseSinglePurchase() {
    result.description = el.querySelector('.blotter_gamepurchase_text')?.textContent

    const game = {} as any
    const sublink = author_block?.querySelector<HTMLAnchorElement>('a[href^="https://store.steampowered.com/sub/"]')
    if (sublink) {
      game.id = sublink.href.match(/sub\/(\d+)/)![1]
      game.type = 'sub'
      result.games = [{ title: sublink.textContent, ...game }]
    }
    else {
      const applink = author_block?.querySelector<HTMLAnchorElement>('a[href^="https://store.steampowered.com/app/"]')
      game.id = applink!.href.match(/app\/(\d+)/)![1]
      game.type = 'app'
      result.games = [{ title: applink?.textContent, ...game }]
    }
  }

  function parseMultiPurchases() {
    const games = [] as any[]
    el.querySelectorAll<HTMLAnchorElement>('.blotter_gamepurchase_details a').forEach((node) => {
      const game = {} as any
      game.title = node.textContent
      const match = node.href.match(/(sub|app)\/(\d+)/)
      if (!match) throw new Error(`Not founding any games when parsing ${el} as game purchase`)
      game.type = match[1]
      game.id = match[2]
      games.push(game)
    })
    result.games = games
  }

  if (el.querySelector('.blotter_gamepurchase_details'))
    parseMultiPurchases()

  else
    parseSinglePurchase()

  const avatar = el.querySelector<HTMLImageElement>('.blotter_author_block .playerAvatar > img')
  result.authorID = avatar?.dataset.miniprofile
  result.authorName = el.querySelector('div.blotter_author_block > div:nth-child(2)')?.textContent
  result.assets = { avatarURL: avatar?.src }

  const commentLink = el.querySelector<HTMLAnchorElement>('.blotter_comment_thread a[href*="friendactivitydetail"]')
  result.date = commentLink?.href.match(/friendactivitydetail\/\d\/(\d+)/)![1]

  return result
}

const parseRecommendation = (el: Element): BlotterRecommendation => {
  const result = { type: BlotterType.RECOMMENDATION } as any
  return result
}

const parseDailyRollup = (el: Element): BlotterDailyRollup => {
  const result = { type: BlotterType.DAILY_ROLLUP } as any
  return result
}

export function parseHtml(blotter: string): BlotterBlock[] {
  const parser = new DOMParser()

  const fragment = parser.parseFromString(blotter, 'text/html')
  const list = fragment.querySelectorAll('.blotter_day > .blotter_block')
  const result = Array.from(list).map<BlotterBlock>((el) => {
    if (el.querySelector('.blotter_daily_rollup'))
      return parseDailyRollup(el)

    else if (el.querySelector('.blotter_gamepurchase'))
      return parseGamePurchase(el)

    else if (el.querySelector('.blotter_userstatus[id^=group]'))
      return parseGroupStatus(el)

    else if (el.querySelector('.blotter_recommendation'))
      return parseRecommendation(el)

    else if (el.querySelector('.blotter_userstatus[id^=userstatus]'))
      return parseUserStatus(el)

    else
      throw new Error(`can not identify blotter type: ${el}`)
  })
  return result
}

// honor to https://stackoverflow.com/a/51123826/2651796
export function steamID64toSteamID32(steamID64: string) {
  return `${Number(steamID64.substr(-16, 16)) - 6561197960265728}`
}
