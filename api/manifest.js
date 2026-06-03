export default function handler(req, res) {
  const host = req.headers.host;
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const baseUrl = `${protocol}://${host}`;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>items</key>
    <array>
        <dict>
            <key>assets</key>
            <array>
                <dict>
                    <key>kind</key>
                    <value>software-package</value>
                    <key>url</key>
                    <value>${baseUrl}/adconnect-release.ipa</value>
                </dict>
            </array>
            <key>metadata</key>
            <dict>
                <key>bundle-identifier</key>
                <key>com.adconnect.app</key>
                <key>bundle-version</key>
                <key>1.0.0</key>
                <key>kind</key>
                <value>software</value>
                <key>title</key>
                <value>Ad-Connect</value>
            </dict>
        </dict>
    </array>
</dict>
</plist>`;

  res.setHeader('Content-Type', 'text/xml');
  res.status(200).send(xml);
}
