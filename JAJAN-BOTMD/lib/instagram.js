const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const { exec } = require('child_process');
const path = require('path');

async function indown(url) {
  const get = await axios.get("https://indown.io/en1")
  const cookie = get.headers["set-cookie"].map(v => v.split(";")[0]).join("; ")
  const $ = cheerio.load(get.data)
  const token = $('input[name="_token"]').val()

  const post = await axios.post(
    "https://indown.io/download",
    new URLSearchParams({
      referer: "https://indown.io/en1",
      locale: "en",
      _token: token,
      link: url,
      p: "i"
    }).toString(),
    {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        origin: "https://indown.io",
        referer: "https://indown.io/en1",
        cookie,
        "user-agent": "Mozilla/5.0"
      }
    }
  )

  const $$ = cheerio.load(post.data)
  const video = $$("video source[src], a[href]")
    .map((_, e) => {
      let v = $$(e).attr("src") || $$(e).attr("href")
      if (v?.includes("indown.io/fetch"))
        v = decodeURIComponent(new URL(v).searchParams.get("url"))
      if (!/cdninstagram\.com|fbcdn\.net/.test(v)) return null
      return v
    })
    .get()[0]

  return video
}

async function igAuto(url) {
  const videoUrl = await indown(url)
  if (!videoUrl) throw "Video tidak ditemukan"

  const tmpDir = "./tmp"
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true })
  }  
  const id = Date.now()
  const videoPath = `./tmp/${id}.mp4`
  const audioPath = `./tmp/${id}.mp3`

  // download video
  const res = await axios.get(videoUrl, { responseType: "stream" })
  await new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(videoPath)
    res.data.pipe(stream)
    stream.on("finish", resolve)
    stream.on("error", reject)
  })

  // extract audio
  await new Promise((resolve, reject) => {
    exec(
      `ffmpeg -y -i "${videoPath}" -vn -acodec libmp3lame -ab 128k "${audioPath}"`,
      err => (err ? reject(err) : resolve())
    )
  })

  return { videoPath, audioPath }
}
