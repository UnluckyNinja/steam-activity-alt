
export enum BlotterType {
  USER_STATUS,
  GAME_PURCHASE,
  RECOMMENDATION,
  GROUP_STATUS,
  DAILY_ROLLUP,
}

export type ItemID = {
  id: string
  type: 'app' | 'sub'
}

export type BlotterUserStatus = {
  type: BlotterType.USER_STATUS
  authorName: string
  authorID: string
  game?: { title: string } & ItemID
  content: string
  date: number
  assets: {
    avatarURL: string
    capsuleURL?: string
  }
}

export type BlotterGroupStatus = {
  type: BlotterType.GROUP_STATUS
  name: string
  origin: string
  link: string
  title: string
  assets: {
    imageURL: string
  }
}

export type BlotterGamePurchase = {
  type: BlotterType.GAME_PURCHASE
  authorName: string
  authorID: string
  date: number
  description?: string
  games: Array<{ title: string } & ItemID>
  assets: {
    avatarURL: string
  }
}

export type BlotterDailyRollup = {
  type: BlotterType.DAILY_ROLLUP
}

export type BlotterRecommendation = {
  type: BlotterType.RECOMMENDATION
}

export type BlotterBlock = BlotterDailyRollup
| BlotterGamePurchase
| BlotterGroupStatus
| BlotterRecommendation
| BlotterUserStatus
