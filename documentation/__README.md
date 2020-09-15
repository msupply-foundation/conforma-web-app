## Guidelines for maintaining documentation.

The `./documentation` folder is the root documentation folder for this repository.

Within this documentation folder is a clone of the repo's [**wiki**](https://github.com/openmsupply/application-manager-web-app/wiki) repository, which appears as a submodule in the main repo, in `./documentation/_wiki`

### To configure with submodule:

- Clone repo with submodule pulled (if already in master):  
  `git clone --recurse-submodules https://github.com/openmsupply/application-manager-web-app.git`

- Clone repo with submodule in specific branch:  
  `git clone --recurse-submodules -b <branch_name> https://github.com/openmsupply/application-manager-web-app.git`

- Init and pull submodule folder:  
  `git submodule update --init`

- If already on master, you can clone + pull submodules:  
  `git clone --recurse-submodules https://github.com/openmsupply/application-manager-web-app.git`

- Or after changing branches the command to init and pull:  
  `git submodule update --init`

## Wiki info

The wiki contents is essentially exactly the same as the main documentation folder. However, the way the wiki software handles internal links when online is different, and all pages are presented at the wiki root level, which means some relative links need to be adjusted accordingly.

In order to update the wiki from the current documentation state, and push the wiki docs online, simply run:

`yarn push_docs`

(This runs a python script to convert the wiki docs -- it can be configured by adjusting the variables at the top of `./utils/convert_docs_to_wiki.py`)

## Best practices and caveats

- Page (`.md`) files should have hyphens ( `-` ) instead of spaces, e.g. `Database-Schema.md`, which will appear on the wiki with the page title **Database Schema**.

- While pages can be organised into subfolders within the `documentation` folder, when published to the wiki, they appear with a "flat" structure -- i.e. they'll appear with the URL `/wiki/<Page-name>` regardless of internal folder nesting. Therefore, proper linking (including a well-maintained **Contents**) is the best way to manage wiki structure.

- Try to keep image files in the `images` folder and prefix them with the name of the page they appear (in lower case). Also, try to remove images that are no longer referenced to avoid build-up of orphaned media files.

- Only push documentation to the wiki from the `master` branch. This ensures that all documentation updates have been through PR and merged before being pushed "live".

- Docs should only go "one-way" -- from the main `documentation` folder _to_ the wiki, not the other way. So please don't edit the wiki directly on Github, or else you risk any changes being over-written the next time the docs folder is "published".
