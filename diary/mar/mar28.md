# 28. märts
## Ajakulu: 3h
Kirjutasin *AppRequest*'i ja *AppDatabase*'i klassid ümber sellisteks, et nad oleksid *builder* programmeerimismustrit järgimas. *AppRequest*'i muutsin eile, täna tegin *AppDatabase*'i ümber. Panin tähele, et tihti teste jooksutades hakkab MongoDB vinguma, et liiga palju ühendusi on andmebaasiga. Seega *AppDatabase*'i klass pakub ka võimalust ühendus sulgeda. Pidin vastavalt *backend*'i koodi ümber tegema ja õigetes kohtades siis ühenduse sulgema. Juhtusin paari bugi otsa ka niimoodi, kus oli ära jäänud *await* võtmesõna enne andmebaasi päringu algust. Aga lõpuks sain kõik parandatud!

Pole ikka veel aga brauseris juhtuvale pilku peale heitnud, aga kui testidega probleeme pole siis on juba pool võitu (või rohkem) olemas.

Järgmine kord peaks siis alustama lõpuks kommentaari süsteemi loomisega. Zod'i kasutades ei peaks probleeme tekkima.