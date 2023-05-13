


# VCL Tournament Overlay - Lazer edition by Try-Z

This overlay is helpful for those that likes the look of Lazer overlay, but doesn't want to go through the complicated setup steps. As a bonus, this overlay has support for Accuracy win condition, which the default Lazer client cannot do as of the time this repo is updated.
For the time being, only Gameplay and Mappool scene is included.

[**How the overlay looks like (with a bit of CSS modification)**](https://www.twitch.tv/videos/1445278730?collection=vyL2iPlp4xYysw&t=00h11m56s)

## Setup guide:
- Install Gosumemory (duh)
	 - As of now, there are 2 different versions to use. If you are using this overlay in score mode, the latest release of Gosumemory works just fine. **If you are using accuracy mode, use [THIS VERSION](baka-ero.kotworks.cyou/new/gosumemory_b20230313.exe) instead.** 
- Download this repo as .zip and extract to `static` folder of Gosumemory
- Rename either `index_acc.js` or `index_score.js` to `index.js`, depends on which win condition you are using.
- Put your APIv1 key in `api.json`
- Update mappool by changing IDs in `mappool\mappool.json`.
- Change mod icons in `mappool\static` folder
- Change background in `static` folder (`mp-bg` for Gameplay, `mp-bg2` for Mappool)

## Styling
- Most colors can be found in `css\style.css`
- For P1/P2 score, change hex code in `index.js` (Line `253` for P1 and line `266` for P2)

## Overlay interaction (in OBS)
- Add a browser source in OBS, size `2420x1080`
- Below the preview, you should see an `Interact` button. Click on that to interact with the overlay.
- Picks: Left click for P1, right click for P2
- Bans: Shift + Left click for P1, Shift + Right click for P2
- Reset map status: Ctrl + Click

***Note:** Same as Lazer, bans must be done manually. You will also have to select who will have first pick.*

## Known bug
- Mappool is not changed after updating `mappool.json`. This can be fixed by:
	- Updating `mappool.json` **BEFORE** starting Gosumemory
	- Delete cache. This is located in `C:\Users\{YourUsername}\AppData\Roaming\obs-studio\plugin_config\obs-browser` (delete the whole folder). After doing so, refresh browser source.

## Additional notes
- To trigger the auto-switching between gameplay and mappool, **the score announce message must contain `Next Pick: ...` phrase (case sensitive).** Of course with some code digging you can find where to change this.
- If the players' avatars are not visible, spam Refresh in OBS.
- **This overlay only support 1v1 format.** TeamVS could work, but there will be a default avatar as placeholder.
___
For additional support, DM `hoaq#6054` on Discord (or ping in osu! Tournament Hub).
Credit is not required but it would help us :D 
