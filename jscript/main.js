
const canvas = document.getElementById("towerDefenseGame")
const c = canvas.getContext("2d")

const cellsH = 20, cellsV = 18

canvas.width = cellsH * 48 + 400
canvas.height = cellsV * 48 + 100

c.fillStyle = "#FFFFFF"
c.fillRect(0, 0, canvas.width, canvas.height)

const GameModTypes = {
    Play: "play",
    Pause: "pause",
    Build: "build",
    Upgrade: "upgrade",
    Delete: "delete",
    Over: "over"
}

const placementTilesData2D = []

for (let i = 0; i < placementTilesData2.length; i += cellsH) {
    placementTilesData2D.push(placementTilesData2.slice(i, i + cellsH))
}

const placementTiles = []
const mapOffset = {
    x: 0,
    y: 100
}

placementTilesData2D.forEach((row, rowInd) => {
    row.forEach((tile, tileInd) => {
        if (tile !== 0) {
            const newTile = new PlacementTile({
                position: {
                    x: tileInd * 48 + mapOffset.x,
                    y: rowInd * 48 + mapOffset.y
                }
            })
            placementTiles.push(newTile)

            placementTiles.forEach(nTile => {
                if (
                    (nTile.position.x === (tileInd * 48 + mapOffset.x) &&
                        nTile.position.y === ((rowInd - 1) * 48 + mapOffset.y)
                    ) ||
                    (nTile.position.x === ((tileInd - 1) * 48 + mapOffset.x) &&
                        nTile.position.y === (rowInd * 48 + mapOffset.y)
                    ) ||
                    (nTile.position.x === ((tileInd - 1) * 48 + mapOffset.x) &&
                        nTile.position.y === ((rowInd - 1) * 48) + mapOffset.y)
                    ||
                    (nTile.position.x === ((tileInd + 1) * 48 + mapOffset.x) &&
                        nTile.position.y === ((rowInd - 1) * 48) + mapOffset.y)
                ) {
                    nTile.neighbourTiles.push(newTile)
                    newTile.neighbourTiles.push(nTile)
                }
            })

        }
    })
})

console.log(placementTiles)

const image = new Image()
image.onload = () => {
    animate()
}
image.src = 'images/gameMap.png'
const topPanel = new Image()
topPanel.src = 'images/topPanel.png'
const rightPanel = new Image()
rightPanel.src = 'images/rightPanel.png'


const enemys = []
let score = 0

let gold = 100
function spawnEnemys(score = 0) {
    console.log(score)

    let totalScores = score + 150
    const EnemyTypes = [
        new Skeleton({
            position: { x: waypoints[0].x, y: waypoints[0].y },
            HP: 100,
            spead: 1,
            summonPrice: 20,
            gold: 1
        }),
        new Necromancer({
            position: { x: waypoints[0].x, y: waypoints[0].y },
            HP: 600,
            spead: 1.4,
            summonPrice: 500,
            gold: 5
        })
    ]
    const enemysQuery = []

    EnemyTypes.sort(function (a, b) {
        return b.summonPrice - a.summonPrice
    })
    while (EnemyTypes.find(enemy => enemy.summonPrice <= totalScores) !== undefined) {
        const enemy = EnemyTypes.find(enemy => enemy.summonPrice <= totalScores)
        enemysQuery.push(enemy)
        totalScores -= enemy.summonPrice
    }
    enemysQuery.sort(function (a, b) {
        return a.summonPrice - b.summonPrice
    })

    const offset = 200
    console.log(enemysQuery)

    enemysQuery.forEach((elem, ind) => {
        //console.log(elem.constructor.name)
        if (elem.constructor.name === new Necromancer({}).constructor.name)
            enemys.push(
                new Necromancer({
                    position: {
                        x: elem.position.x - (ind + 1) * offset,
                        y: elem.position.y
                    },
                    HP: elem.maxHP,
                    spead: elem.spead,
                    summonPrice: elem.summonPrice,
                    gold: elem.gold
                }))
        if (elem.constructor.name === new Skeleton({}).constructor.name)
            enemys.push(
                new Skeleton({
                    position: {
                        x: elem.position.x - (ind + 1) * offset,
                        y: elem.position.y
                    },
                    HP: elem.maxHP,
                    spead: elem.spead,
                    summonPrice: elem.summonPrice,
                    gold: elem.gold
                }))
    })

    // for (let i = 1; i < 2 + 1; i++) {
    //     const offset = i * 200;
    //     enemys.push(
    //         new Enemy({
    //             position: { x: waypoints[0].x - offset, y: waypoints[0].y }
    //         }))
    //     //console.log(offset)
    // }
    gold += 5 + Math.round(score / 100)
}
spawnEnemys(score)

const buildings = []
let ActivTile = undefined

let hearts = 5
const gameMod = []
gameMod.push(GameModTypes.Play)
let selectedTower = new Archer({})

function animate() {
    const animationId = window.requestAnimationFrame(animate)
    const Play = gameMod.findIndex((gm) => {
        return gm == GameModTypes.Play
    })
    if (Play > -1) {

        //map
        c.drawImage(image, 0 + mapOffset.x, 0 + mapOffset.y)
        //enemys
        for (let i = enemys.length - 1; i >= 0; i--) {
            const enemy = enemys[i]
            enemy.update()

            if (enemy.position.x > (20 * 48 + mapOffset.x)) {
                enemys.splice(i, 1)
                hearts -= 1;
                console.log(hearts)
                if (enemys.length === 0) {
                    spawnEnemys(score)
                }
                if (hearts === 0) {
                    console.log("game over")
                    gameMod.on(GameModTypes.Over)
                }
            }
        }
        //tiles
        if (gameMode(GameModTypes.Build))
            placementTiles.forEach(Tile => {
                Tile.update(mouse, selectedTower)
            })
        //build and projectails
        buildings.forEach(building => {
            building.update()
            if (gameMode(GameModTypes.Build)) {
                building.drawRadius()
            }
            building.target = null
            const validEnemys = enemys.filter(enemy => {
                const xD = enemy.center.x - building.center.x
                const yD = enemy.center.y - building.center.y
                const dist = Math.hypot(xD, yD)
                return dist < enemy.radius + building.radius
            })
            building.target = validEnemys

            for (let i = building.projectiles.length - 1; i >= 0; i--) {
                const projectile = building.projectiles[i]
                if (projectile.update()) {
                    building.projectiles.splice(i, 1)
                }

                // const xD = projectile.enemy.center.x - projectile.position.x
                // const yD = projectile.enemy.center.y - projectile.position.y
                // const dist = Math.hypot(xD, yD)
                // if (dist < projectile.enemy.radius + projectile.radius) {
                //     //damage
                //     projectile.enemy.health -= 20
                //     if (projectile.enemy.health <= 0) {
                //         const indEnemy = enemys.findIndex((enemy) => {
                //             return projectile.enemy === enemy
                //         })
                //         if (indEnemy > -1) {
                //             score += enemys[indEnemy].summonPrice
                //             gold += enemys[indEnemy].gold
                //             enemys.splice(indEnemy, 1)
                //         }
                //     }
                //     //
                //     if (enemys.length === 0) {
                //         spawnEnemys(score)
                //     }

                //     building.projectiles.splice(i, 1)
                // }
            }
        })

    }

    //game over
    const Over = gameMod.findIndex((gm) => {
        return gm == GameModTypes.Over
    })
    if (Over > -1) {

        c.drawImage(image, 0 + mapOffset.x, 0 + mapOffset.y)
        for (let i = enemys.length - 1; i >= 0; i--) {
            const enemy = enemys[i]
            enemy.draw()
        }
        buildings.forEach(building => {
            building.draw()
            for (let i = building.projectiles.length - 1; i >= 0; i--) {
                const projectile = building.projectiles[i]
                projectile.draw()
            }
        })
        //repeat box
        const box = {
            w: 350,
            h: 200,
            x: 0,
            y: 0
        }
        box.x = 10 * 48 - box.w / 2 + mapOffset.x
        box.y = 9 * 48 - box.h / 2 + mapOffset.y
        c.fillStyle = "brown"
        c.fillRect(box.x, box.y, box.w, box.h)

        c.font = "3rem  sans-serif"
        c.fillStyle = "white"
        c.textAlign = "center"
        c.fillText("Вы проиграли.", box.x + box.w / 2, box.y + 60)
        c.fillText("Очки: " + score, box.x + box.w / 2, box.y + 60 + 3 * 16 + 10)

        const repeatBtn = {
            w: box.w - 10 * 2,
            h: 3 * 16,
            x: box.x + 10,
            y: box.y + 60 + 4 * 16 + 10 + 5
        }
        c.fillStyle = "black"
        repeat = false
        if (
            mouse.x > repeatBtn.x &&
            mouse.x < repeatBtn.x + repeatBtn.w &&
            mouse.y > repeatBtn.y &&
            mouse.y < repeatBtn.y + repeatBtn.h
        ) {
            c.fillStyle = "gray"
            repeat = true
        }
        c.fillRect(repeatBtn.x, repeatBtn.y, repeatBtn.w, repeatBtn.h)

        c.font = "3rem  sans-serif"
        c.fillStyle = "white"
        c.textAlign = "center"
        c.fillText("Повторить", repeatBtn.x + repeatBtn.w / 2, repeatBtn.y + repeatBtn.h - 10)
    }
    //top panel
    c.drawImage(topPanel, 0, 0, 20 * 48, 100)
    c.fillStyle = "black"
    c.font = "4rem  sans-serif"
    c.textAlign = "left"
    c.fillText(hearts, 80, 70)
    c.fillText(score, 16 * 48 + 5, 70, 4 * 48 - 20)
    //right panel
    c.drawImage(rightPanel, 20 * 48, 0, 400, 18 * 48 + 100)
    c.fillStyle = "black"
    c.font = "3rem  sans-serif"
    c.textAlign = "right"
    c.fillText(gold, 22 * 48 + 80, 50, 90)
    //tower models
    const archer = new Archer({})
    archer.position = {
        x: 20 * 48 + (26 + 46 / 2) * 4 - ((archer.sizeCells.x % 2) * 48 / 2),
        y: (21 + 50 / 2) * 4 - ((archer.sizeCells.y % 2) * 48 / 2)
    }
    archer.centerUpdate()
    archer.draw()

    const mortir = new Mortir({})
    mortir.position = {
        x: 20 * 48 + (26 + 46 / 2) * 4 - ((mortir.sizeCells.x % 2) * 48 / 2),
        y: (78 + 50 / 2) * 4 - ((mortir.sizeCells.y % 2) * 48 / 2)
    }
    mortir.centerUpdate()
    mortir.draw()
    const mage = new Mage({})
    mage.position = {
        x: 20 * 48 + (26 + 46 / 2) * 4 - ((mage.sizeCells.x % 2) * 48 / 2),
        y: (136 + 50 / 2) * 4 - ((mage.sizeCells.y % 2) * 48 / 2)
    }
    mage.centerUpdate()
    mage.draw()
    //hover builds in right panel

    slots.forEach(slot => {
        if (
            mouse.x > slot.x &&
            mouse.x < slot.x + slot.w &&
            mouse.y > slot.y &&
            mouse.y < slot.y + slot.h
        ) {
            c.fillStyle = "rgba(255, 255, 255, 0.5)"
            c.fillRect(slot.x, slot.y, slot.w, slot.h)
        }
    })
}
const slots = []
const firstSlot = {
    x: 26 * 4 + 20 * 48,
    y: 21 * 4,
    w: 47 * 4,
    h: 51 * 4,
    tower: new Archer({})
}
slots.push(firstSlot)
const secondSlot = {
    x: 26 * 4 + 20 * 48,
    y: 78 * 4,
    w: 47 * 4,
    h: 51 * 4,
    tower: new Mortir({})
}
slots.push(secondSlot)
const thirdSlot = {
    x: 26 * 4 + 20 * 48,
    y: 136 * 4,
    w: 47 * 4,
    h: 51 * 4,
    tower: new Mage({})
}
slots.push(thirdSlot)
const mouse = {
    x: undefined,
    y: undefined
}
let repeat = false;

canvas.addEventListener("click", (e) => {
    const Play = gameMod.findIndex((gm) => {
        return gm == GameModTypes.Play
    })
    if (Play > -1) {
        //select tower, switch build mode
        slots.forEach(slot => {
            if (
                mouse.x > slot.x &&
                mouse.x < slot.x + slot.w &&
                mouse.y > slot.y &&
                mouse.y < slot.y + slot.h
            ) {
                if (gameMode(GameModTypes.Build) && selectedTower.constructor.name === slot.tower.constructor.name) {
                    gameMod.off(GameModTypes.Build)
                }
                else {
                    selectedTower = slot.tower
                    gameMod.on(GameModTypes.Build)
                }
            }
        })
        //build mode
        // console.log(gameMode(GameModTypes.Build))
        if (gameMode(GameModTypes.Build))
            if (ActivTile !== null && ActivTile.building === undefined) {
                let newBuild
                if (selectedTower.constructor.name === new Archer({}).constructor.name) {
                    newBuild = new Archer({
                        position: {
                            x: ActivTile.position.x,
                            y: ActivTile.position.y
                        }
                    })
                }
                if (selectedTower.constructor.name === new Mortir({}).constructor.name) {
                    newBuild = new Mortir({
                        position: {
                            x: ActivTile.position.x,
                            y: ActivTile.position.y
                        }
                    })
                }
                if (selectedTower.constructor.name === new Mage({}).constructor.name) {
                    newBuild = new Mage({
                        position: {
                            x: ActivTile.position.x,
                            y: ActivTile.position.y
                        }
                    })
                }
                console.log(newBuild.constructor.name)
                if (gold - newBuild.cost >= 0) {
                    if (ActivTile.addBuild(newBuild)) {
                        buildings.push(newBuild)
                        gold -= newBuild.cost
                    }
                }

            }
        if (
            mouse.x > mapOffset.x &&
            mouse.x < mapOffset.x + cellsH * 48 &&
            mouse.y > mapOffset.y &&
            mouse.y < mapOffset.y + cellsV * 48
        ) {
            gameMod.off(GameModTypes.Build)
        }
        console.log(buildings)
    }
    const Over = gameMod.findIndex((gm) => {
        return gm == GameModTypes.Over
    })
    if (Over > -1) {
        if (repeat) {
            console.log("repeat")
            NewGame()
        }
    }
})

canvas.addEventListener("mousemove", (e) => {
    mouse.x = e.offsetX
    mouse.y = e.offsetY

    ActivTile = null
    for (let i = 0; i < placementTiles.length; i++) {
        const tile = placementTiles[i]
        if (
            mouse.x > tile.position.x &&
            mouse.x < tile.position.x + tile.size &&
            mouse.y > tile.position.y &&
            mouse.y < tile.position.y + tile.size
        ) {
            ActivTile = tile
            break
        }
    }
})

function NewGame() {
    buildings.splice(0, buildings.length)
    placementTiles.forEach(tile => {
        if (tile.building !== undefined && tile.building !== null) {
            delete tile.building
        }
    })
    enemys.splice(0, enemys.length)

    gameMod.off(GameModTypes.Over)
    gameMod.on(GameModTypes.Play)
    console.log(gameMod)
    score = 0
    hearts = 5
    gold = 100
    spawnEnemys(score)
}
function gameMode(mode) {
    const indm = gameMod.findIndex((gm) => {
        return gm == mode
    })
    if (indm > -1) {
        return true
    }
    return false
}
gameMod.on = function (mode) {
    if (!gameMode(mode)) {
        if (mode == GameModTypes.Over) {
            gameMod.splice(0, gameMod.length)
            gameMod.push(GameModTypes.Over)
            return
        }
        gameMod.push(mode)
    }
}
gameMod.off = function (mode) {
    if (gameMode(mode)) {
        const indm = gameMod.findIndex((gm) => {
            return gm == mode
        })
        gameMod.splice(indm, 1)
    }
}