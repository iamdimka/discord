import { request } from "https"
import { parse } from "url"

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
    content: string
    username?: string
    avatarURL?: string
    tts?: boolean
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
      tts: payload.tts
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