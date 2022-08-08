# Turborepo pilot

## Start

install:

```bash
yarn
```

Összes app elindítása:

```bash
yarn dev
```

## A projektről

Ezt a projektet azért hoztam létre, hogy bemutassam a [turborepo](https://turborepo.org/) lehetőségeit, általam gondolt helyes konfigurációt. A projekt nem csak a helyes monorepo használatát próbálja bemutatni, mellette találhatóak egyéb ajánlások is, amik remélhetőleg megkönnyítik a későbbi munkavégzést és javítják a kódminőséget. A projekt egy egyszerű todo alkalmazás, ami példakánt szolgál a gyakorlati felhasználásra.

## Turborepo

A turborepo egy monorepo projektek kezelését segítő eszköz, segítségével lehetőségünk van egyetlen nodejs projektben kezlni több alkalmazást. A turborepo [nodejs workspace](https://docs.npmjs.com/cli/v7/using-npm/workspaces)-en alapul, ami lehetővé teszi a projektben található függőségek összegyűjtését, úgy, hogy az ne okozzon redundanciát.

A turborepo a következő eszközöket biztosítja:

- több alkalmazás egyidejű futtatása több szállon
- alkalmazások gyorsítótárazása (csak azokat a kódrészleteket fordítja újra, amik valójában megváltoztak)
- buildelést segítő eszközök
- saját pipeline
- közös kódrészek megosztása több alkalmazásban
- ...stb

A projektstruktúrát tekintve két fő mappa található: `apps` és `packages`. Az `apps` mappában találhatóak külön mappákba rendezve az egyes alkalmazások projektjei, ezek mindegyike teljes értékű, különálló projektek (pld.: Nextjs, Express vagy React Native app). A `packages` mappában találhatóak azok a kódrészletek, komponensek, konfigurációk, amiket az alkalmazások közösen használhatnak, pld.: ha megvan írva egy lint konfiguráció, az bármelyik alkalmazában újra fel lehet használni, így változás esetén nem kell végigmenni az össze projekten.

> **FONTOS:**
>
> Mind az `apps`, mind a `packages` mappában külön nodejs workspace-ek találhatóak, új elem hozzáadása esetén, ennek megfelelően kell eljárni.

## Workspace

A turborepo [workspace](https://docs.npmjs.com/cli/v7/using-npm/workspaces)-ek segítségével különíti el egymástól a különböző alkalmazásokat és közösen felhhasználható konfigurációkat és kódrészleteket. A workspace-ek a projekt root-ban található `package.json`-ban vannak beállítva:

```json
"workspaces": {
    "packages": [
        "apps/*",
        "packages/*"
    ],
    "nohoist": []
},
```

Alapértelmezés szerint az `apps` és `packages` mappákban található összes node projekt automatikusan workspece-ként van értelmezve, ettől eltérő workspece hozzáadásakor, fel kell venni annak a mappáját a `workspaces/packages` array-be, ellenkező esetben nem veszi figyelembe, és nem jön létre új workspece.

Fontos a workspace nevének megadása, mivel a későbbiekben erre a névre hiatkozva lehet futtatni parancsokat. A workspace nevének beállítása, a workspace-en belül található package.json `name` mezőjében adható meg, a könnyebb azonosítás érdekében érdemes ennek a névnek a mappa nevével párhuzamban lennie:

```json
# apps/web/package.json
{
    "name": "web",
    ...
}
```

A workspace-ek egyik előnye, hogy minden függőség a projekt rootban található node_modules-ba kerül, így ha több projektnek közös függősége van, akkor abból csak egy példányt kell fenntartani (ennek oka az a jelenség, hogy a workspace-eken belül található node_modules mappa pár elem kivételével, gyakorlatilag üres).

> **FONTOS:**
>
> Ha több alkalmazásnak azonos függősége van, akkor érdemes azonos verziószámot használni mindenhol, mert a különböző verziók hajlamosak összeakadni.

Előfordulhat olyan eset, mikor egy workspace-nek a függősége megkívánja, hogy teljesen lokális legyen (pld.: többi alkalmazás által használt függőségtől eltérő verziószám), akkor fel kell venni a függőséget a projekt rootban található package.json `workspaces/nohoist` alá a függőséget. [További infó](https://classic.yarnpkg.com/blog/2018/02/15/nohoist/).

Vannak olyan projektek, amik sajnos nem támogatják a workspace-ek használatát, ilyen pld a react-native, mivel sok beállítása azt feltételezi, hogy egyes elemeket elér az alkalmazás node_modules mappájában. Ebben az esetben lehetőség van úgy kiemelni a workspace-t úgy, hogy a függőségei lokálisak legyenek, de futtatható maradjon workspace-ként is, ez úgy érhető el, hogy az adott workspace-en belül található package.json-ben felvesszük az alábbi beállítást:

```json
"workspaces": {
    "nohoist": [
        "**"
    ]
},
```

Ez a beállítás, elintézi, hogy a workspace összes dependenciája a saját node_modules mappájába kerüljön.

## Yarn parancsok

Yarn parancsokat érdemes a projekt rootban futtatni, hogy elkerüljük a hibás működést és minél optimalizáltabb futási teljesítményt érjünk el. A workspace-ek használata minimálisan több gépelést igényelnek, a parancs futtatása előtt meg kell adni, hogy melyik workspace-ben kerüljön futtatásra a parancs, a parancsok futtatásának módja a következő:

```bash
yarn workspace {workspace-neve} {yarn parancs ...}
# pld.:
yarn workspace web add react -D
```

A jobb teljesítmény érdekében, érdemes a beépített `tubo` használatával futtatni az alkalmazásokat, ez lehetővé teszi, több alkalmazás egyidejű futtatását is. A gyakrabban használt parancsokat érdemes lehet kiemelni a projekt rootban található package.json-ba, elnevezésnél törekedni kell a megkülönböztethetőségre, hogy tisztán kivehető legyen belőle a használt workspace is:

```json
{
    "scripts": {
        "dev:backend": "dev:backend": "turbo run dev --filter=backend",
        "dev:web": "turbo run dev --filter=backend --filter=web", // ha az egyik app működése függ a másik működésétől, akkor ilyen módon egyszerre is indítható
    }
}
```

ugyanez terminalban:

```bash
yarn dev:backend
# vagy
yarn dev: web
```

Oyan parancsok futtatásakor, amik nincsenek hatással a függőségekre, nyugodtan futtathatjuk az adott workspace-en belül, vagy kiválaszthatjuk a workspace-t is:

```bash
yarn workspace backend db:reset
# vagy
cd ./apps/backend
yarn db:reset
```
