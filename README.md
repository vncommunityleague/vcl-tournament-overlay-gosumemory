# VCL Tournament Overlay - Lazer edition by Try-Z

This overlay is helpful for those that likes the look of Lazer overlay, but doesn't want to go through the complicated setup steps.
It only include Gameplay & Mappool scene, but we might add winner scene in the future if we even care.

[**How the overlay looks like (with a bit of CSS modification)**](https://www.twitch.tv/videos/1445278730?collection=vyL2iPlp4xYysw&t=00h11m56s)

## Setup guide:
- Gosumemory installed (duh). Also OBS Studio is highly recommended due to the overlay was only tested on this. 
- Download this repo as .zip, and extract to `static` folder of Gosumemory
- Put your APIv1 key in `api.json`
- Update mappool by changing IDs in `mappool\mappool.json`
- Change mod icons in `mappool\static` folder
- Change background in `static` folder (`mp-bg` for Gameplay, `mp-bg2` for Mappool)

## Styling
- Most colors can be found in `css\style.css`
- For P1/P2 score, change hex color in `index.js` (Line 253 for P1 and line 266 for P2)

## Overlay interaction (in OBS)
- Add a browser source in OBS, size `2420x1080`
- Below the preview, you should see an `Interact` button. Click on that to interact with the overlay.

- Picks: Left click for P1, right click for P2
- Bans: Shift + Left click for P1, Shift + Right click for P2
- Reset map status: Ctrl + Click

Note: **Same as lazer, bans must be done manually. You will also have to select who will have first pick**

## Note
- For the time being, to trigger the auto-switching between gameplay and mappool, the score announce must contain `Next Pick: ...` keyword (case sensitive). Of course with some code digging you can find where to change this
- If the players' avatars are not visible, spam Refresh in OBS
- This overlay only support 1v1 format, you are on your own to add support for TeamVS with icons

# We will not provide basic support (install guide, basic debug) for this overlay, so you are on your own. If you find any bug or need help with modifying other aspect of the overlay (e.g. change to acc win cond), contact `hoaq#6054` on Discord (or ping me in osu! Tournament Hub).

Credit is not required but it would help us :D 
