import { request } from "https"
import { parse } from "url"

export type DiscordEmbed = {
  title?: string
  color?: string
  description?: string
  author?: {
    name?: string
    url?: string
    icon_url?: string
  }
  url?: string
  fields?: {
    name?: string
    value?: string
    inline?: boolean
  }[]
  image?: {
    url: string
  }
  thumbnail?: {
    url: string
  }
  footer?: {
    text?: string
    icon_url?: string
  }
  timestamp?: string
}

export class Discord {
  protected _hostname: string
  protected _path: string

  constructor(url: string) {
    const { hostname, pathname } = parse(url)

    if (hostname && pathname) {
      this._hostname = hostname
      this._path = pathname
    }
  }

  send(payload: string | {
    content?: string
    username?: string
    avatarURL?: string
    tts?: boolean
    embeds?: DiscordEmbed[]
  }) {
    if (typeof payload === "string") {
      payload = {
        content: payload
      }
    }

    const json = Buffer.from(JSON.stringify({
      content: payload.content,
      username: payload.username,
      avatar_url: payload.avatarURL,
      tts: payload.tts,
      embeds: payload.embeds
    }))

    return new Promise<any>((resolve, reject) => request({
      method: "POST",
      hostname: this._hostname,
      path: this._path,
      headers: {
        Connection: "keep-alive",
        "Content-Type": "application/json; charset=UTF-8",
        "Content-Length": json.length
      }
    }, res => resolve()).on("error", reject).end(json))
  }
}