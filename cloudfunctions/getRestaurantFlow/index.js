// cloudfunctions/getRestaurantFlow/index.js

const https = require('https');
const { URL } = require('url');

exports.main = async (event) => {
  const restaurantId = event.restaurantId;
  const urlString = `https://campuslife.sjtu.edu.cn/api/jczs/sub?id=${restaurantId}`;
  console.log('👉 请求 URL:', urlString);

  return new Promise((resolve) => {
    const urlObj = new URL(urlString);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        // 必须带上 Referer
        Referer: `https://campuslife.sjtu.edu.cn/ui/restaurant?id=${restaurantId}`,
        // 模拟浏览器 UA
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
          'AppleWebKit/537.36 (KHTML, like Gecko) ' +
          'Chrome/90.0.4430.212 Safari/537.36'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log('✅ 原始返回字符串:', data);
        let body;
        try {
          body = JSON.parse(data);
        } catch (e) {
          console.error('❌ JSON 解析失败', e);
          return resolve({
            success: false,
            error: '返回非 JSON 格式',
            raw: data
          });
        }
        // 检查 code
        if (body.code !== 0) {
          console.error('❌ code 非 0:', body);
          return resolve({
            success: false,
            error: `后端返回 code=${body.code}`,
            body
          });
        }
        // 检查 data.subs
        if (!body.data || !Array.isArray(body.data.subs)) {
          console.error('❌ data.subs 格式异常:', body);
          return resolve({
            success: false,
            error: 'data.subs 格式异常',
            body
          });
        }
        // 一切正常
        resolve({
          success: true,
          data: body.data
        });
      });
    });

    req.on('error', (err) => {
      console.error('❌ HTTPS 请求失败', err);
      resolve({ success: false, error: err.message });
    });

    req.end();
  });
};


