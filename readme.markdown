# lob-story

> Post items to Lobste.rs

# Installation

```shell
$ npm install --save lob-story
```

# Usage

The example shown below will post a link on Lobste.rs.

```js
var lob = require('lob-story');

lob({
  username: '{{your username}}',
  password: '{{your password}}',
  title: 'Example Blog Article',
  url: 'http://exampleblog.com/articles/example-blog-article',
  tags: ['web']
}, done);

function done (err, res, body, story) {
  // handle response
}
```

# API

# `lob(options, done)`

Posts an article on Lobste.rs by making a series of requests against their website. Takes some `options`, detailed below.

Property      | Description
--------------|------------------------------------------------------------------------------------
`username`    | Your username, used to authenticate, and to post stories on your behalf
`password`    | Your password, used to authenticate
`title`       | The title for the story
`url`         | The URL to the story
`description` | A description of the story
`tags`        | An array of tags for your story
`author`      | Boolean value indicating whether the submitter is the author of the story

When the requests against Lobste.rs are done, the `done` callback will be invoked with four arguments.

- `err` will have an error if one occurred, and `null` otherwise
- `res` will be a response object
- `body` will be the response body
- `story` will be a link to the story on Lobste.rs

# CLI

The CLI has a simple interface. You'll be asked for your credentials once, and they'll be stored at `~/.lob`. You can edit that file directly, the CLI expects YAML.

```shell
$ cat ~/.lob
```

```yaml
username: foo,
password: foo
```

```shell
$ lob -t "some title" -u http://exampleblog.com -x "some text"
> https://lobste.rs/s/$YOUR_STORY
```

### CLI Usage

```txt
Usage:
  lob <options>

Options:
  -t, --title               | Title for the news item
  -u, --url, --uri          | URL to the news item
  -d, --desc, --description | Text describing the news item
  --tags                    | Space-separated list of tags for the story
  -a, --author, --no-author | Whether you\'re the author for the story
```

# License

MIT
