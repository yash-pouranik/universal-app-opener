# Universal App Opener

A zero-dependency JavaScript library that converts standard HTTP URLs (YouTube, LinkedIn) into Native Mobile Deep Links (Custom Schemes & Android Intents).

## Installation

```bash
npm install universal-app-opener
```

```bash
pnpm add universal-app-opener
```

```bash
yarn add universal-app-opener
```

## Usage

### Basic Example

```typescript
import { generateDeepLink, detectOS } from 'universal-app-opener';

const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
const result = generateDeepLink(url);

console.log(result);
// {
//   webUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
//   ios: 'vnd.youtube://watch?v=dQw4w9WgXcQ',
//   android: 'intent://watch?v=dQw4w9WgXcQ#Intent;scheme=vnd.youtube;package=com.google.android.youtube;end',
//   platform: 'youtube'
// }
```

### Opening Deep Links Based on Platform

```typescript
import { generateDeepLink, detectOS } from 'universal-app-opener';

function openLink(url: string) {
  const os = detectOS();
  const result = generateDeepLink(url);
  
  if (os === 'ios' && result.ios) {
    window.location.href = result.ios;
  } else if (os === 'android' && result.android) {
    window.location.href = result.android;
  } else {
    window.open(result.webUrl, '_blank');
  }
}

openLink('https://www.linkedin.com/in/iamsaban/');
```

### With Fallback to Web

```typescript
import { generateDeepLink, detectOS } from 'universal-app-opener';

function openLinkWithFallback(url: string) {
  const os = detectOS();
  const result = generateDeepLink(url);
  
  let deepLink: string | null = null;
  
  if (os === 'ios' && result.ios) {
    deepLink = result.ios;
  } else if (os === 'android' && result.android) {
    deepLink = result.android;
  }
  
  if (deepLink) {
    window.location.href = deepLink;
    setTimeout(() => {
      window.location.href = result.webUrl;
    }, 2500);
  } else {
    window.open(result.webUrl, '_blank');
  }
}
```

### CommonJS Usage

```javascript
const { generateDeepLink, detectOS } = require('universal-app-opener');

const result = generateDeepLink('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
console.log(result.ios);
```

## API Reference

### `generateDeepLink(url: string): DeepLinkResult`

Converts a web URL into platform-specific deep links.

**Parameters:**
- `url` (string): The web URL to convert (YouTube or LinkedIn)

**Returns:**
```typescript
interface DeepLinkResult {
  webUrl: string;        // Original web URL
  ios: string | null;     // iOS deep link (custom scheme)
  android: string | null; // Android deep link (intent URL)
  platform: 'youtube' | 'linkedin' | 'unknown';
}
```

**Supported Platforms:**
- YouTube: `youtube.com/watch?v=*` and `youtu.be/*`
- LinkedIn: `linkedin.com/in/*`

### `detectOS(): 'ios' | 'android' | 'desktop'`

Detects the current operating system based on user agent.

**Returns:**
- `'ios'` - iPhone, iPad, or iPod
- `'android'` - Android devices
- `'desktop'` - Desktop browsers or unknown

## Examples

### YouTube Video

```typescript
const result = generateDeepLink('https://www.youtube.com/watch?v=BdgwH614LM0');
// result.ios: 'vnd.youtube://watch?v=BdgwH614LM0'
// result.android: 'intent://watch?v=BdgwH614LM0#Intent;scheme=vnd.youtube;package=com.google.android.youtube;end'
```

### LinkedIn Profile

```typescript
const result = generateDeepLink('https://www.linkedin.com/in/iamsaban/');
// result.ios: 'linkedin://in/iamsaban'
// result.android: 'intent://in/iamsaban#Intent;scheme=linkedin;package=com.linkedin.android;end'
```

### Unknown URL

```typescript
const result = generateDeepLink('https://example.com');
// result.ios: null
// result.android: null
// result.platform: 'unknown'
```

## Demo

Try it out: [Live Demo](https://mdsaban.github.io/universal-app-opener/)

## License

MIT

