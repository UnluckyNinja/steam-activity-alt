export const STEAM_API_ENDPOINT = {
  MiniProfile: 'https://steamcommunity.com/miniprofile/',
  GetNotificationCounts: 'https://steamcommunity.com/actions/GetNotificationCounts',
  UserNews: 'https://steamcommunity.com/my/ajaxgetusernews/',
  // Emoticon: extractEmoticonBaseURL(),
}

interface UserNewsJson {
  blotter_html: string
  next_request: string
  success: boolean
  timestart: number
}

export async function fetchUserNewsSince(unixtime: number) {
  const res = await fetch(`${STEAM_API_ENDPOINT.UserNews}?start=${unixtime.toFixed(0)}`, {
    method: 'GET',
    credentials: 'include',
  })
  return await res.json() as UserNewsJson
}
