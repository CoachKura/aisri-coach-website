# Open docx in LibreOffice, update TOC/fields, export PDF.
import sys, os, time, subprocess, uno
from com.sun.star.beans import PropertyValue
src, out = os.path.abspath(sys.argv[1]), os.path.abspath(sys.argv[2])
p = subprocess.Popen(["soffice", "--headless", "--invisible", "--norestore",
    "--accept=socket,host=localhost,port=2002;urp;"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
ctx = uno.getComponentContext()
res = ctx.ServiceManager.createInstanceWithContext("com.sun.star.bridge.UnoUrlResolver", ctx)
for _ in range(60):
    try: c = res.resolve("uno:socket,host=localhost,port=2002;urp;StarOffice.ComponentContext"); break
    except Exception: time.sleep(1)
desk = c.ServiceManager.createInstanceWithContext("com.sun.star.frame.Desktop", c)
def pv(n, v): x = PropertyValue(); x.Name = n; x.Value = v; return x
doc = desk.loadComponentFromURL(uno.systemPathToFileUrl(src), "_blank", 0, (pv("Hidden", True),))
for _ in range(2):
    idx = doc.getDocumentIndexes()
    for i in range(idx.getCount()): idx.getByIndex(i).update()
    doc.getTextFields().refresh()
doc.storeToURL(uno.systemPathToFileUrl(out), (pv("FilterName", "writer_pdf_Export"),))
doc.close(True)
try: desk.terminate()
except Exception: pass
p.wait(timeout=30)
print("pdf ok", out)
