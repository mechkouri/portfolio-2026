"""Zips dist/ for a Netlify Drop deploy (index.html at the zip root, forward-slash paths).

Uses Windows long-path (\\\\?\\) access: the build folder can sit deep enough that a few asset
paths pass 260 characters, and a normal zip would silently skip them.
"""
import os
import sys
import zipfile

root = os.path.abspath('dist')
out = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else 'deploy-dist.zip')
PREFIX = '\\\\?\\'


def long(path: str) -> str:
    return PREFIX + path if os.name == 'nt' and not path.startswith(PREFIX) else path


if os.path.exists(long(out)):
    os.remove(long(out))

missing = []
with zipfile.ZipFile(long(out), 'w', zipfile.ZIP_DEFLATED) as z:
    for folder, _, files in os.walk(long(root)):
        for name in files:
            full = os.path.join(folder, name)
            rel = os.path.relpath(full, long(root)).replace(os.sep, '/')
            try:
                with open(full, 'rb') as fh:
                    z.writestr(rel, fh.read())
            except OSError as error:
                missing.append((rel, str(error)[:60]))

names = zipfile.ZipFile(long(out)).namelist()
print(f'{round(os.path.getsize(long(out)) / 1024 / 1024, 2)} MB, {len(names)} files, missing: {missing}')
print('index.html at root:', 'index.html' in names, '| _headers:', '_headers' in names)
print('fonts:', [n.split('/')[-1][:30] for n in names if 'jetbrains' in n])
