const axios = require('axios');
const cheerio = require('cheerio');

const baseUrl = 'https://nontonanimeid.my.id';
const ajaxUrl = `${baseUrl}/wp-admin/admin-ajax.php`;
const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function searchDonghua(query) {
    try {
        // Cara 1: Pakai AJAX Search (Cepat)
        const data = new URLSearchParams();
        data.append('action', 'ts_ac_do_search');
        data.append('ts_ac_query', query);

        const res = await axios.post(ajaxUrl, data, {
            headers: { 
                'User-Agent': userAgent, 
                'X-Requested-With': 'XMLHttpRequest',
                'Referer': baseUrl
            }
        });

        let animeUrl = '';
        if (res.data && res.data.res && res.data.res.length > 0) {
            animeUrl = res.data.res[0].url || res.data.res[0].post_link;
        }

        // Cara 2: Jika AJAX gagal, tembak langsung ke halaman search webnya
        if (!animeUrl) {
            const searchPage = await axios.get(`${baseUrl}/?s=${encodeURIComponent(query)}`, {
                headers: { 'User-Agent': userAgent }
            });
            const $s = cheerio.load(searchPage.data);
            animeUrl = $s('.result-item article .details .title a').first().attr('href') || 
                       $s('.animepost a').first().attr('href') ||
                       $s('.bsx a').first().attr('href');
        }

        if (!animeUrl) return { success: false };

        // Ambil Data Anime & List Episode
        const html = await axios.get(animeUrl, { headers: { 'User-Agent': userAgent } });
        const $ = cheerio.load(html.data);
        
        const episodes = [];
        // Selector list episode bisa berbeda tergantung update webnya
        $('.eplister ul li, .episodelist ul li').each((i, el) => {
            const link = $(el).find('a').attr('href');
            const title = $(el).find('.epl-num').text() || $(el).find('.metasul').text() || `Eps ${i + 1}`;
            if (link) {
                episodes.push({ title: title.trim(), url: link });
            }
        });

        return {
            success: true,
            title: $('.entry-title').text().trim() || $('h1.title').text().trim(),
            thumb: $('.thumb img').attr('src') || $('.poster img').attr('src'),
            episodes: episodes // Seringkali web sudah urut dari terbaru ke lama
        };
    } catch (e) { 
        console.error(e);
        return { success: false }; 
    }
}

async function getDownloadLink(url) {
    try {
        const html = await axios.get(url, { headers: { 'User-Agent': userAgent } });
        const $ = cheerio.load(html.data);
        let videoUrl = '';
        
        // Cari direct mp4
        $('iframe, source, video').each((i, el) => {
            const src = $(el).attr('src') || $(el).attr('data-src');
            if (src && src.includes('.mp4')) videoUrl = src;
        });

        // Jika tidak ada mp4, ambil link embed paling atas
        if (!videoUrl) {
            videoUrl = $('.player-embed iframe').attr('src') || 
                       $('#embed_holder iframe').attr('src') || 
                       $('iframe').first().attr('src');
        }
        
        // Bersihkan link jika diawali //
        if (videoUrl && videoUrl.startsWith('//')) videoUrl = 'https:' + videoUrl;
        
        return videoUrl;
    } catch { return null; }
}