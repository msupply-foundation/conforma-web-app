python3 ./utils/convert_docs_to_wiki.py
git -C ./documentation/_wiki add -A
git -C ./documentation/_wiki commit -m "Update documentation"
git -C ./documentation/_wiki push
