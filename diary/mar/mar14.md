# 14. märts
## Ajakulu: 4h 45m
Tegin päeva alguses kiiresti Figma postituse lehe disaini ümber. Järjekordsel tuttavatele näitamisel sain eelnevast positiivsemat tagasisidet. Pärast otsustasin, et on aeg suurem koodi ümberkirjutamine teha loetavuse ja taaskasutuse nimel. Tekitasin *TokenDTO.ts*, mis tegeleb nüüd ilusti autentimise tokenitega. Nimetasin ümber *AppResponse.ts* *BaseResponse.ts*-iks ja uus *AppResponse.ts* ongi nagu varem mainitud erinevate mallidega. Lõin *DataValidator.ts*, mille ülesandeks on väga toorel kombel kontrollida üle talle antud andmete andmetüübid JavaScripti *typeof* võtmesõna kasutades. Kogu sellega kaasnes tagatausta funktsionaalsuse ümberkirjutamine lühemaks ja (minu arust) loetavamaks. Maadlesin testide ümberkirjutamisega tükk aega, kuni avastasin, et ühe klassi vajalik eksportimine jäi tegemata, mida Visual Studio Code tähele ei pannud.

Ühe huvitava asja avastasin: *JSON.parse* funktsioon tagastab stringi "[1, 2, 3]" hoopis objektina, mitte massiivina. See tekitas andmetüüpide valideerimisega probleeme. *JSON.parse* võtab teise argumendina mingi funktsiooni, mis stringist loetud andmeid töötleb, kuid ma pole veel täiesti aru saanud, kuidas seda teha, aga mul peaks olema võimalik kohe massiiv luua. Uurin seda näiteks homme.