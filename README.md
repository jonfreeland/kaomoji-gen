# kaomoji-gen
Kaomoji generator for Slack. Gets you a kaomoji to suit your current feels.

### Kao-what.
Japanese style emoticons. Read more here: https://en.wikipedia.org/wiki/Emoticon#Japanese_style

### Add it to your Slack!

##### /km [tags separated by space]
> e.g.: /km angry cute --> __ʕ ૭•̀Д•́ ʔ૭__

 - Go to: https://YOUR-SLACK-DOMAIN.slack.com/apps/manage/custom-integrations
 - Add a new integration.
 - Add configuration
 - Name your command: `/km` or whatever you wish. This is the command that will be used to output a kaomoji.
 - Press next, and on integration settings add the url: `http://kaomoji-gen.herokuapp.com/`, with the `POST` method. Feel free to hange the name, icon, and the rest of the configuration as you see fit.

That's it! 
You may also add the command `/kmtags` with a `POST` request to `http://kaomoji-gen.herokuapp.com/tags` using the above instructions. It will print a list of the available tags (visible just for you).


Feel free to contribute with a pull request (new parts, additional tagging would be great), or fork it!

##### Techincal stuff: 
This is a small `node.js` experiment using [Koa](http://koajs.com/) and an elasticsearch service. It's currently tested on a `Heroku` environment and should be ready to deploy right away. Tried with `Searchbox` as the elasticsearch service. It's available as a free (or paid) addon.

Use `.envexample` as an example of how your `.env` file should look for local development.


