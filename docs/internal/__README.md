## Guidelines for maintaining documentation.

The `./docs` folder is the root documentation folder for this repository.

Subfolders: **internal** and **public**.

Pages and images from `docs/internal` will be published in [**This repo wiki**](https://github.com/msupply-foundation/conforma-web-app/wiki) after running the script (described in Wiki info below).
Pages and images from `docs/public` will be published to our [**Public docs**](https://msupply-foundation.github.io/conforma-web-app/) when a PR is merged to the `main` branch - by automation.

The subfolder `docs/_wiki` is a clone of the repo's [**wiki**](https://github.com/msupply-foundation/conforma-web-app/wiki) repository, which appears as a submodule in the main repo (see `.gitmodules`)

### To configure with submodule:

- Clone repo with submodule pulled (if already in master):  
  `git clone --recurse-submodules https://github.com/msupply-foundation/conforma-web-app.git`

- Clone repo with submodule in specific branch:  
  `git clone --recurse-submodules -b <branch_name> https://github.com/msupply-foundation/conforma-web-app.git`

- Then Init and pull submodule folder:  
  `git submodule update --init`

## Wiki info

The wiki contents is essentially exactly the same as the `docs/internal` folder. However, the way the wiki software handles internal links when online is different, and all pages are presented at the wiki root level, which means some relative links need to be adjusted accordingly.

In order to update the wiki from the current internal documentation state, and push the wiki docs online, simply run:

`yarn push_docs`

(This runs a python script to convert the wiki docs -- it can be configured by adjusting the variables at the top of `./utils/convert_docs_to_wiki.py`)

## Best practices and caveats

- Page (`.md`) files should have hyphens ( `-` ) instead of spaces, e.g. `Database-Schema.md`, which will appear on the wiki with the page title **Database Schema**.

- While pages can be organised into subfolders within the `documentation` folder, when published to the wiki, they appear with a "flat" structure -- i.e. they'll appear with the URL `/wiki/<Page-name>` regardless of internal folder nesting. Therefore, proper linking (including a well-maintained **Contents**) is the best way to manage wiki structure.

- Try to keep image files in the `images` folder and prefix them with the name of the page they appear (in lower case). Also, try to remove images that are no longer referenced to avoid build-up of orphaned media files.

- Only push documentation to the wiki from the `master` branch. This ensures that all documentation updates have been through PR and merged before being pushed "live".

- Docs should only go "one-way" -- from the subfolder `docs/internal` _to_ the wiki, not the other way. So please don't edit the wiki directly on Github, or else you risk any changes being over-written the next time the docs folder is "published".
