#!/usr/bin/python
import os
import glob
import re
import string

ignoreList = [
    r'.+\.(md|svg|png|pdf|log|fls|aux|gz|lock|fdb_latexmk|dvi|tex)',
    r'.+(node_modules|build|dist|_minted-source-list|\.git).+',
    r'.*(server.*|solver.*)',
    r'.*board\.json'
]

highlight = {
    'javascript': r'.+\.(ts|js|tsx|json)',
    'bash': r'.+\.(sh)',
    'yaml': r'.+\.yml',
    'html': r'.+\.html',
    'css': r'.+\.(css|scss)',
    'python': r'.+\.(py)',
}

def genListRec(path):
    for ignore in ignoreList:
        if re.match(ignore, path):
            return ''
    script = ''
    if os.path.isdir(path):
        for entry in glob.glob(path + '/*') + glob.glob(path + '/.*'):
            script += genListRec(entry)
        return script

    lang = 'text'
    for hlang, pat in highlight.items():
        if re.match(pat, path):
            lang = hlang

    path = path.replace('_', r'\_')
    return string.Template(r'''
        \section{$path}
        \inputminted[linenos, obeytabs=true, tabsize=2, breaklines]{$lang}{$path}
        \newpage
    ''').substitute({ 'lang': lang, 'path': path })

if __name__ == '__main__':
    script = string.Template(r'''
        \documentclass[dvipdfmx]{jsarticle}
        \usepackage{minted}
        \begin{document}
            $script
        \end{document}
    ''').substitute({ 'script': genListRec('./') })
    with open('source-list.tex', 'w') as tex:
        tex.write(script)

    os.system('latexmk ./source-list.tex')
