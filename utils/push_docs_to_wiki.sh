python3 ./utils/convert_docs_to_wiki.py
git -C ./docs/_wiki add -A
git -C ./docs/_wiki commit -m "Update docs"
git -C ./docs/_wiki push origin master
