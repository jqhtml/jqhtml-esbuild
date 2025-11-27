# @jqhtml/esbuild-plugin

esbuild plugin for compiling `.jqhtml` templates to JavaScript.

## Installation

```bash
npm install @jqhtml/esbuild-plugin @jqhtml/parser @jqhtml/core jquery
```

## Usage

### Basic Configuration

```javascript
const esbuild = require('esbuild');
const jqhtml = require('@jqhtml/esbuild-plugin');

esbuild.build({
    entryPoints: ['src/main.js'],
    bundle: true,
    outdir: 'dist',
    plugins: [jqhtml()],
});
```

### With Options

```javascript
esbuild.build({
    entryPoints: ['src/main.js'],
    bundle: true,
    outdir: 'dist',
    plugins: [
        jqhtml({
            sourcemap: true,  // Enable source maps (default: true)
        }),
    ],
});
```

### ES Modules

```javascript
import * as esbuild from 'esbuild';
import jqhtml from '@jqhtml/esbuild-plugin';

await esbuild.build({
    entryPoints: ['src/main.js'],
    bundle: true,
    outdir: 'dist',
    plugins: [jqhtml()],
});
```

## Rails 7 Integration

If you're using Rails 7 with `jsbundling-rails` (esbuild), add the plugin to your build script:

```javascript
// esbuild.config.js
const esbuild = require('esbuild');
const jqhtml = require('@jqhtml/esbuild-plugin');

esbuild.build({
    entryPoints: ['app/javascript/application.js'],
    bundle: true,
    sourcemap: true,
    outdir: 'app/assets/builds',
    plugins: [jqhtml()],
    loader: {
        '.js': 'jsx',
    },
}).catch(() => process.exit(1));
```

Update `package.json`:

```json
{
  "scripts": {
    "build": "node esbuild.config.js"
  }
}
```

## Entry Point Setup

```javascript
// src/main.js
import $ from 'jquery';
window.jQuery = window.$ = $;

import jqhtml, { boot, init_jquery_plugin } from '@jqhtml/core';
init_jquery_plugin($);

// Import and register components
import AlertBox from './components/AlertBox.jqhtml';
import UserCard from './components/UserCard.jqhtml';

jqhtml.register(AlertBox);
jqhtml.register(UserCard);

// Boot when DOM is ready
$(document).ready(async () => {
    await boot();
});
```

## Creating Components

```html
<!-- src/components/AlertBox.jqhtml -->
<Define:AlertBox tag="div" class="alert">
    <strong><%= this.args.title %></strong>
    <p><%= this.args.message %></p>
</Define:AlertBox>
```

## Using Components in HTML

```html
<div class="_Component_Init"
     data-component-init-name="AlertBox"
     data-component-args='{"title":"Notice","message":"Hello World"}'>
</div>
```

The `boot()` function finds these placeholders and hydrates them into live components.

## Watch Mode

```javascript
const context = await esbuild.context({
    entryPoints: ['src/main.js'],
    bundle: true,
    outdir: 'dist',
    plugins: [jqhtml()],
});

await context.watch();
console.log('Watching for changes...');
```

## Framework Integrations

For framework-specific setup with additional helpers:

- **Laravel**: [jqhtml/laravel](https://github.com/jqhtml/jqhtml-laravel)
- **WordPress**: [jqhtml/wordpress](https://github.com/jqhtml/jqhtml-wordpress)
- **Rails**: Coming soon

## Documentation

For complete documentation including template syntax, lifecycle methods, and component patterns:

**https://jqhtml.org/**

## License

MIT - Copyright (c) hansonxyz
